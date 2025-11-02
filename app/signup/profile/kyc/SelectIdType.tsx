"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PROFILE_STORAGE_KEY,
  defaultStoredProfile,
  parseStoredProfile,
  type StoredProfile,
} from "@/lib/profile-storage";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const idOptions = [
  {
    value: "passport",
    title: "International passport",
    description: "Global travel document accepted for expedited approvals.",
  },
  {
    value: "national-id",
    title: "National identity card",
    description: "Government-issued ID with MRZ or chip for fast verification.",
  },
  {
    value: "drivers-license",
    title: "Driver's licence",
    description: "Photocard licence with clear expiration date and security features.",
  },
];

export default function SelectIdType() {
  const router = useRouter();
  const [profile, setProfile] = useState<StoredProfile>(defaultStoredProfile);
  const [selectedId, setSelectedId] = useState<string>("");
  const [hydrated, setHydrated] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const showAuthNotice = Boolean(authMessage && authReady);

  useEffect(() => {
    let isActive = true;

    getSupabaseBrowserClient()
      .then((supabase) =>
        supabase.auth.getSession().then(({ data, error }) => {
          if (!isActive) {
            return;
          }

          if (error || !data?.session) {
            setAuthMessage("Your session has expired. Please sign in again to finish verification.");
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
            : "Authentication configuration is incomplete. Verification remains in demo mode.";
        setAuthMessage(message);
        setAuthReady(true);
      });

    return () => {
      isActive = false;
    };
  }, [router]);

  useEffect(() => {
    if (hydrated || typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem(PROFILE_STORAGE_KEY);

    if (!stored) {
      setHydrated(true);
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setProfile(parseStoredProfile(parsed));
      setHydrated(true);
    } catch (error) {
      setHydrated(true);
    }
  }, [hydrated]);

  const locationSummary = useMemo(() => {
    return `${profile.city}, ${profile.region}, ${profile.countryName}`;
  }, [profile.city, profile.countryName, profile.region]);

  const phoneSummary = useMemo(() => {
    return profile.phoneNumber ? `${profile.dialCode} ${profile.phoneNumber}` : profile.dialCode;
  }, [profile.dialCode, profile.phoneNumber]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedId) {
      return;
    }

    router.push("/mine");
  };

  if (!authReady) {
    return (
      <div className="onboarding__placeholder" role="status">
        {authMessage ?? "Confirming your authentication…"}
      </div>
    );
  }

  return (
    <form className="onboarding__form onboarding__form--kyc" onSubmit={handleSubmit}>
      {showAuthNotice ? (
        <p className="onboarding__message" role="status">
          {authMessage}
        </p>
      ) : null}
      <fieldset className="onboarding__kyc" aria-labelledby="kyc-select-title">
        <legend id="kyc-select-title" className="onboarding__label">
          Select ID type
        </legend>
        <p className="onboarding__kyc-subtitle">Choose the document you&apos;ll upload for verification.</p>
        <div className="onboarding__radio-group">
          {idOptions.map((option) => (
            <label key={option.value} className="onboarding__radio">
              <input
                type="radio"
                name="id-type"
                value={option.value}
                checked={selectedId === option.value}
                onChange={(event) => setSelectedId(event.target.value)}
                required
              />
              <div>
                <div className="onboarding__radio-title">{option.title}</div>
                <p className="onboarding__radio-description">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </fieldset>

      <section className="onboarding__summary" aria-live="polite">
        <h2>Profile summary</h2>
        <dl>
          <dt>Full name</dt>
          <dd>{profile.name}</dd>

          <dt>Location</dt>
          <dd>{locationSummary}</dd>

          <dt>Phone</dt>
          <dd>{phoneSummary}</dd>

          <dt>Primary currency</dt>
          <dd>
            {profile.currencySymbol} {profile.currencyCode}
          </dd>
        </dl>
      </section>

      <div className="onboarding__actions onboarding__actions--stack">
        <button type="submit" className="onboarding__continue">
          Start verification
        </button>
        <button
          type="button"
          className="onboarding__save"
          onClick={() => router.push("/mine")}
        >
          I&apos;ll do this later
        </button>
      </div>
    </form>
  );
}
