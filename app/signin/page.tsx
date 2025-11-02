import Link from "next/link";
import SignInForm from "./SignInForm";

export const metadata = {
  title: "Sign in • FP Markets",
  description: "Access your FP Markets dashboard.",
};

export default function SignInPage() {
  return (
    <main className="auth">
      <div className="auth__halo auth__halo--left" aria-hidden />
      <div className="auth__halo auth__halo--right" aria-hidden />

      <div className="auth__shell">
        <header className="auth__top" aria-label="Account navigation">
          <Link href="/" className="auth__logo">
            FP Markets
          </Link>
          <Link href="/signup" className="auth__top-link">
            Sign up
          </Link>
        </header>

        <section className="auth__card" aria-labelledby="signin-title">
          <header className="auth__header">
            <h1 id="signin-title">Sign in</h1>
            <p>Verify your access before viewing the dashboard.</p>
          </header>

          <SignInForm />

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
            <span>New to FP Markets?</span>
            <Link href="/signup">Create an account</Link>
          </footer>
        </section>
      </div>
    </main>
  );
}
