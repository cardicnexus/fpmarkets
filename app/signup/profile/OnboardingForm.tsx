"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  countries,
  dialCodes,
  getCountryByCode,
  getCountryByDialCode,
  type Country,
} from "@/lib/country-data";
import {
  PROFILE_STORAGE_KEY,
  defaultStoredProfile,
  parseStoredProfile,
  type StoredProfile,
} from "@/lib/profile-storage";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function OnboardingForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const sortedCountries = useMemo(() => [...countries].sort((a, b) => a.name.localeCompare(b.name)), []);
  const sortedDialCodes = useMemo(
    () =>
      [...dialCodes].sort((a, b) =>
        a.dialCode.replace("+", "").localeCompare(b.dialCode.replace("+", ""), undefined, { numeric: true }),
      ),
    [],
  );
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(defaultStoredProfile.countryCode);
  const [selectedDialCode, setSelectedDialCode] = useState<string>(defaultStoredProfile.dialCode);
  const [dialCodeManuallySet, setDialCodeManuallySet] = useState(false);

  const selectedCountry: Country | undefined = useMemo(
    () => getCountryByCode(selectedCountryCode) ?? getCountryByDialCode(selectedDialCode),
    [selectedCountryCode, selectedDialCode],
  );

  useEffect(() => {
    let isActive = true;

    getSupabaseBrowserClient()
      .then((supabase) =>
        supabase.auth.getSession().then(({ data, error }) => {
          if (!isActive) {
            return;
          }

          if (error || !data?.session) {
            setAuthMessage("Your session has expired. Please sign in again to continue onboarding.");
            router.replace("/signin");
            return;
          }

          setAuthReady(true);
        }),
      )
      .catch((error) => {
        if (!isActive) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Authentication configuration is incomplete. Profile onboarding is available in demo mode only.";
        setAuthMessage(message);
        setAuthReady(true);
      });

    return () => {
      isActive = false;
    };
  }, [router]);

  useEffect(() => {
    if (selectedCountry && !dialCodeManuallySet && selectedDialCode !== selectedCountry.dialCode) {
      setSelectedDialCode(selectedCountry.dialCode);
    }
  }, [selectedCountry, selectedDialCode, dialCodeManuallySet]);

  const handleCountryChange = (code: string) => {
    setSelectedCountryCode(code);
    setDialCodeManuallySet(false);
  };

  const handleDialCodeChange = (dialCode: string) => {
    setSelectedDialCode(dialCode);
    setDialCodeManuallySet(true);
    const relatedCountry = getCountryByDialCode(dialCode);
    if (relatedCountry) {
      setSelectedCountryCode(relatedCountry.code);
    }
  };

  const persistProfile = (formData: FormData): StoredProfile => {
    const rawName = String(formData.get("name") ?? "").trim();
    const rawRegion = String(formData.get("region") ?? "").trim();
    const rawCity = String(formData.get("city") ?? "").trim();
    const rawPhone = String(formData.get("phone") ?? "").replace(/\s+/g, "").trim();
    const dialCode = String((formData.get("dial-code") ?? selectedDialCode) || "").trim();
    const countryCode = String((formData.get("country") ?? selectedCountryCode) || "").trim();
    const country = getCountryByCode(countryCode) ?? getCountryByDialCode(dialCode) ?? countries[0];

    let previousProfile: StoredProfile = defaultStoredProfile;
    let hasExistingProfile = false;

    if (typeof window !== "undefined") {
      const existing = window.localStorage.getItem(PROFILE_STORAGE_KEY);
      if (existing) {
        try {
          previousProfile = parseStoredProfile(JSON.parse(existing));
          hasExistingProfile = true;
        } catch (error) {
          previousProfile = defaultStoredProfile;
        }
      }
    }

    const ensureNickname = () => {
      if (hasExistingProfile && previousProfile.nickname.trim()) {
        return previousProfile.nickname;
      }

      const base = rawName.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (!base) {
        return defaultStoredProfile.nickname;
      }

      return base.slice(0, 12) || defaultStoredProfile.nickname;
    };

    const ensureCoopId = () => {
      if (hasExistingProfile && previousProfile.coopId.trim()) {
        return previousProfile.coopId;
      }

      const randomId = Math.floor(100000 + Math.random() * 900000);
      return String(randomId);
    };

    const profile: StoredProfile = {
      ...previousProfile,
      name: rawName || previousProfile.name,
      city: rawCity || previousProfile.city,
      region: rawRegion || previousProfile.region,
      phoneNumber: rawPhone || previousProfile.phoneNumber,
      countryCode: country.code,
      countryName: country.name,
      dialCode: dialCode || country.dialCode,
      currencyCode: country.currencyCode,
      currencySymbol: country.currencySymbol,
      nickname: ensureNickname(),
      coopId: ensureCoopId(),
    };

    if (typeof window !== "undefined") {
      window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    }

    return profile;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    persistProfile(formData);
    router.push("/mine");
  };

  const handleCompleteKyc = () => {
    if (!formRef.current) {
      router.push("/signup/profile/kyc");
      return;
    }

    if (!formRef.current.reportValidity()) {
      return;
    }

    const formData = new FormData(formRef.current);
    persistProfile(formData);
    router.push("/signup/profile/kyc");
  };

  const flagEmoji = selectedCountry ? isoToFlag(selectedCountry.code) : "🌍";
  const currencyLabel = selectedCountry
    ? `${selectedCountry.currencySymbol} ${selectedCountry.currencyCode}`
    : `${defaultStoredProfile.currencySymbol} ${defaultStoredProfile.currencyCode}`;

  const showAuthNotice = Boolean(authMessage && authReady);

  if (!authReady) {
    return (
      <div className="onboarding__placeholder" role="status">
        {authMessage ?? "Confirming your authentication…"}
      </div>
    );
  }

  return (
    <form ref={formRef} className="onboarding__form" onSubmit={handleSubmit}>
      {showAuthNotice ? (
        <p className="onboarding__message" role="status">
          {authMessage}
        </p>
      ) : null}
      <label className="onboarding__field" htmlFor="profile-name">
        <span className="onboarding__label">Full name</span>
        <input
          id="profile-name"
          name="name"
          type="text"
          placeholder="Alex Cardic"
          autoComplete="name"
          required
        />
      </label>

      <div className="onboarding__field-group">
        <label className="onboarding__field" htmlFor="profile-country">
          <span className="onboarding__label">Country</span>
          <div className="onboarding__select">
            <span className="onboarding__flag" aria-hidden>
              {flagEmoji}
            </span>
            <select
              id="profile-country"
              name="country"
              value={selectedCountryCode}
              onChange={(event) => handleCountryChange(event.target.value)}
              required
            >
              {sortedCountries.map((countryOption) => (
                <option key={countryOption.code} value={countryOption.code}>
                  {countryOption.name}
                </option>
              ))}
            </select>
          </div>
        </label>

        <label className="onboarding__field" htmlFor="profile-region">
          <span className="onboarding__label">State/Region</span>
          <input
            id="profile-region"
            name="region"
            type="text"
            placeholder="Lagos"
            autoComplete="address-level1"
            required
          />
        </label>
      </div>

      <label className="onboarding__field" htmlFor="profile-city">
        <span className="onboarding__label">City</span>
        <input
          id="profile-city"
          name="city"
          type="text"
          placeholder="Ikeja"
          autoComplete="address-level2"
          required
        />
      </label>

      <label className="onboarding__field" htmlFor="profile-phone-code">
        <span className="onboarding__label">Phone</span>
        <div className="onboarding__split onboarding__split--select">
          <select
            id="profile-phone-code"
            name="dial-code"
            value={selectedDialCode}
            onChange={(event) => handleDialCodeChange(event.target.value)}
            aria-label="Country dial code"
            autoComplete="tel-country-code"
            required
          >
            {sortedDialCodes.map((option) => (
              <option key={option.dialCode} value={option.dialCode}>
                {option.dialCode} · {option.countryName}
              </option>
            ))}
          </select>
          <input
            id="profile-phone-number"
            name="phone"
            type="tel"
            inputMode="tel"
            placeholder="701 234 5678"
            aria-label="Phone number"
            autoComplete="tel"
            required
          />
        </div>
      </label>

      <label className="onboarding__field" htmlFor="profile-currency">
        <span className="onboarding__label">Primary currency</span>
        <input
          id="profile-currency"
          name="currency"
          type="text"
          value={currencyLabel}
          readOnly
          aria-readonly="true"
        />
      </label>

      <fieldset className="onboarding__kyc">
        <legend className="onboarding__label">KYC</legend>
        <p className="onboarding__kyc-subtitle">
          Upload ID (passport, national ID, or driver&apos;s license)
        </p>
        <p className="onboarding__kyc-meta">PNG, JPG, or PDF (up to 10MB)</p>
        <label className="onboarding__upload" htmlFor="profile-kyc">
          <input id="profile-kyc" name="kyc" type="file" accept=".png,.jpg,.jpeg,.pdf" />
          <span className="onboarding__upload-icon" aria-hidden>
            <svg viewBox="0 0 24 24" role="img" aria-hidden>
              <path d="M12 3a1 1 0 0 1 1 1v9.585l1.293-1.292a1 1 0 1 1 1.414 1.414l-3.004 3.004a1.5 1.5 0 0 1-2.121 0l-3.004-3.004a1 1 0 0 1 1.414-1.414L11 13.585V4a1 1 0 0 1 1-1Z" />
              <path d="M5 15a1 1 0 0 1 2 0v3h10v-3a1 1 0 1 1 2 0v3a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-3Z" />
            </svg>
          </span>
          <span className="onboarding__upload-text">Drag & drop or click to upload</span>
        </label>
        <button type="button" className="onboarding__skip">
          Skip KYC for now
        </button>
        <button type="button" className="onboarding__complete-kyc" onClick={handleCompleteKyc}>
          Complete KYC
        </button>
      </fieldset>

      <div className="onboarding__actions">
        <button type="submit" className="onboarding__continue">
          Continue
        </button>
        <button type="button" className="onboarding__save">
          Save &amp; continue later
        </button>
      </div>
    </form>
  );
}

function isoToFlag(code: string): string {
  if (!code || code.length !== 2) {
    return "🌍";
  }

  const base = 127397;
  return String.fromCodePoint(...code.toUpperCase().split("").map((char) => base + char.charCodeAt(0)));
}
