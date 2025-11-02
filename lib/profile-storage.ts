export const PROFILE_STORAGE_KEY = "fpmarkets:profile-state";

export type StoredProfile = {
  name: string;
  nickname: string;
  coopId: string;
  photo: string | null;
  countryCode: string;
  countryName: string;
  dialCode: string;
  currencyCode: string;
  currencySymbol: string;
  city: string;
  region: string;
  phoneNumber: string;
};

export const defaultStoredProfile: StoredProfile = {
  name: "Sola Gbadamosi",
  nickname: "solagbada",
  coopId: "303659",
  photo: null,
  countryCode: "NG",
  countryName: "Nigeria",
  dialCode: "+234",
  currencyCode: "NGN",
  currencySymbol: "₦",
  city: "Ikeja",
  region: "Lagos",
  phoneNumber: "7012345678",
};

export function parseStoredProfile(value: unknown): StoredProfile {
  if (!value || typeof value !== "object") {
    return defaultStoredProfile;
  }

  const data = value as Partial<StoredProfile>;

  const name = typeof data.name === "string" && data.name.trim() ? data.name.trim() : defaultStoredProfile.name;
  const nickname =
    typeof data.nickname === "string" && data.nickname.trim() ? data.nickname.trim() : defaultStoredProfile.nickname;
  const coopId = typeof data.coopId === "string" && data.coopId.trim() ? data.coopId.trim() : defaultStoredProfile.coopId;
  const photo = typeof data.photo === "string" && data.photo.trim() ? data.photo.trim() : null;
  const countryCode =
    typeof data.countryCode === "string" && data.countryCode.trim() ? data.countryCode.trim() : defaultStoredProfile.countryCode;
  const countryName =
    typeof data.countryName === "string" && data.countryName.trim() ? data.countryName.trim() : defaultStoredProfile.countryName;
  const dialCode = typeof data.dialCode === "string" && data.dialCode.trim() ? data.dialCode.trim() : defaultStoredProfile.dialCode;
  const currencyCode =
    typeof data.currencyCode === "string" && data.currencyCode.trim()
      ? data.currencyCode.trim()
      : defaultStoredProfile.currencyCode;
  const currencySymbol =
    typeof data.currencySymbol === "string" && data.currencySymbol.trim()
      ? data.currencySymbol.trim()
      : defaultStoredProfile.currencySymbol;
  const city = typeof data.city === "string" && data.city.trim() ? data.city.trim() : defaultStoredProfile.city;
  const region = typeof data.region === "string" && data.region.trim() ? data.region.trim() : defaultStoredProfile.region;
  const phoneNumber =
    typeof data.phoneNumber === "string" && data.phoneNumber.trim()
      ? data.phoneNumber.trim()
      : defaultStoredProfile.phoneNumber;

  return {
    name,
    nickname,
    coopId,
    photo,
    countryCode,
    countryName,
    dialCode,
    currencyCode,
    currencySymbol,
    city,
    region,
    phoneNumber,
  };
}
