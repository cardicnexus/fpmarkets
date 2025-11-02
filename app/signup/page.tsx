import Link from "next/link";
import SignupForm from "./SignupForm";

export const metadata = {
  title: "Sign up • FP Markets",
  description: "Create a demo FP Markets partner account.",
};

export default function SignUpPage() {
  return (
    <main className="auth">
      <div className="auth__halo auth__halo--left" aria-hidden />
      <div className="auth__halo auth__halo--right" aria-hidden />

      <div className="auth__shell">
        <header className="auth__top" aria-label="Account navigation">
          <Link href="/" className="auth__logo">
            FP Markets
          </Link>
          <Link href="/signin" className="auth__top-link">
            Sign in
          </Link>
        </header>

        <section className="auth__card" aria-labelledby="auth-title">
          <header className="auth__header">
            <h1 id="auth-title">Sign up</h1>
            <p>Demo mode — no real accounts created</p>
          </header>

          <SignupForm />

          <div className="auth__links">
            <a
              href="mailto:support@fpmarkets.app?subject=Password%20reset"
              className="auth__link"
            >
              Forgot password
            </a>
            <a href="mailto:support@fpmarkets.app" className="auth__link">
              Contact support
            </a>
          </div>

          <footer className="auth__footer">
            <span>Already have an account?</span>
            <Link href="/signin">Sign in</Link>
          </footer>
        </section>
      </div>
    </main>
  );
}
