import Link from "next/link";
import SelectIdType from "./SelectIdType";

export const metadata = {
  title: "Verify your identity • FP Markets",
  description: "Choose an identity document to complete verification.",
};

export default function KycPage() {
  return (
    <main className="onboarding" aria-labelledby="kyc-title">
      <div className="onboarding__halo onboarding__halo--left" aria-hidden />
      <div className="onboarding__halo onboarding__halo--right" aria-hidden />

      <div className="onboarding__shell">
        <header className="onboarding__top" aria-label="Onboarding navigation">
          <div className="onboarding__stepper">
            <span className="onboarding__step-count">Step 3 of 3</span>
            <h1 id="kyc-title" className="onboarding__title">
              Verify your identity
            </h1>
          </div>
          <Link
            href="/"
            className="onboarding__brand"
            aria-label="Return to the FP Markets landing page"
          >
            <span className="sr-only">Return to the FP Markets landing page</span>
            <svg className="onboarding__brand-icon" viewBox="0 0 24 24" role="img" aria-hidden>
              <path d="M12.53 5.47a.75.75 0 0 1 1.06 1.06L9.56 10.56H19a.75.75 0 0 1 0 1.5H9.56l4.03 4.03a.75.75 0 0 1-1.06 1.06l-5.5-5.5a.75.75 0 0 1 0-1.06Z" />
            </svg>
          </Link>
        </header>

        <section className="onboarding__card" aria-label="Identity verification options">
          <SelectIdType />
        </section>
      </div>
    </main>
  );
}
