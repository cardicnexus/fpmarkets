'use client';

import Link from "next/link";
import { useMemo, useState } from "react";

type Highlight = {
  label: string;
  value: string;
  description: string;
};

type FeatureCard = {
  category: string;
  title: string;
  description: string;
};

type NavItem = {
  label: string;
  href: string;
  icon: string;
};

type LanguageOption = {
  code: string;
  label: string;
  flag: string;
};

type CurrencyOption = {
  code: string;
  name: string;
};

const heroHighlights: Highlight[] = [
  {
    label: "Global licenses",
    value: "12+",
    description: "Regulated coverage with audited partner oversight.",
  },
  {
    label: "Average ROI uplift",
    value: "64%",
    description: "Compounded partner growth with disciplined risk pacing.",
  },
  {
    label: "Support languages",
    value: "24/7 · 9",
    description: "Concierge teams covering traders and investors worldwide.",
  },
];

const featureCards: FeatureCard[] = [
  {
    category: "Leverage",
    title: "Highest leverage",
    description:
      "Grow faster with partner-grade distribution, analytics and bespoke liquidity programmes.",
  },
  {
    category: "Payouts",
    title: "Instant payouts",
    description:
      "Weekly profit cycles with automated compliance, statements and partner settlement support.",
  },
  {
    category: "Support",
    title: "24/7 multilingual support",
    description:
      "Relationship managers in nine languages keep onboarding painless for every desk.",
  },
];

const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: "🏠" },
  { label: "FAQs", href: "#faqs", icon: "❓" },
  { label: "Staff", href: "#staff", icon: "👥" },
  { label: "Plans", href: "#plans", icon: "🧭" },
  { label: "Payouts", href: "/withdraw", icon: "💳" },
  { label: "Reviews", href: "#reviews", icon: "⭐" },
  { label: "Sign In", href: "/mine", icon: "🔑" },
  { label: "Sign Up", href: "/signup", icon: "📝" },
  { label: "Contact", href: "#contact", icon: "☎️" },
  { label: "About Us", href: "#about", icon: "ℹ️" },
  { label: "Hedge Funds", href: "#hedge", icon: "📈" },
  { label: "Copy Trading", href: "#copy", icon: "🔁" },
  { label: "Cookie Policy", href: "#cookie", icon: "🍪" },
  { label: "Crypto Mining", href: "#crypto", icon: "⛏️" },
  { label: "Forex Trading", href: "#forex", icon: "💱" },
  { label: "Privacy Policy", href: "#privacy", icon: "🔒" },
  { label: "Bitcoin Mining", href: "#bitcoin", icon: "🪙" },
  { label: "Stocks Trading", href: "#stocks", icon: "📊" },
  { label: "Dogecoin Mining", href: "#doge", icon: "🐕" },
  { label: "Terms of Service", href: "#terms", icon: "📜" },
];

const languages: LanguageOption[] = [
  { code: "EN", label: "English", flag: "🇺🇸" },
  { code: "ES", label: "Español", flag: "🇪🇸" },
  { code: "DE", label: "Deutsch", flag: "🇩🇪" },
  { code: "FR", label: "Français", flag: "🇫🇷" },
  { code: "IT", label: "Italiano", flag: "🇮🇹" },
  { code: "PT", label: "Português", flag: "🇵🇹" },
  { code: "JA", label: "日本語", flag: "🇯🇵" },
  { code: "ID", label: "Bahasa", flag: "🇮🇩" },
  { code: "IN", label: "हिन्दी", flag: "🇮🇳" },
  { code: "NL", label: "Nederlands", flag: "🇳🇱" },
  { code: "RU", label: "Русский", flag: "🇷🇺" },
  { code: "TH", label: "ไทย", flag: "🇹🇭" },
  { code: "TR", label: "Türkçe", flag: "🇹🇷" },
  { code: "FA", label: "فارسی", flag: "🇮🇷" },
  { code: "VI", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "PL", label: "Polski", flag: "🇵🇱" },
  { code: "SE", label: "Svenska", flag: "🇸🇪" },
  { code: "PH", label: "Tagalog", flag: "🇵🇭" },
  { code: "AR", label: "العربية", flag: "🇦🇪" },
];

const currencies: CurrencyOption[] = [
  { code: "USD", name: "US Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "BRL", name: "Brazilian Real" },
  { code: "ZAR", name: "South African Rand" },
  { code: "PHP", name: "Philippine Peso" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);

  const defaultLanguage = useMemo(() => languages[0], []);
  const defaultCurrency = useMemo(() => currencies[0], []);

  return (
    <main className="landing">
      <div className="landing__container">
        <header className="landing__header" aria-label="Global navigation">
          <button
            type="button"
            className="landing__menu-toggle"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="landing-menu"
          >
            <span />
            <span />
            <span />
            <span className="sr-only">Open navigation</span>
          </button>

          <Link href="/" className="landing__logo">
            FP Markets
          </Link>

          <nav className="landing__nav" aria-label="Primary">
            <Link href="/invest" className="landing__nav-link">
              Products
            </Link>
            <Link href="/share" className="landing__nav-link">
              Partners
            </Link>
            <Link href="/withdraw" className="landing__nav-link">
              Payouts
            </Link>
          </nav>

          <div className="landing__utilities">
            <button
              type="button"
              className="landing__utility"
              onClick={() => setLanguageOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={languageOpen}
              aria-controls="language-sheet"
            >
              <span aria-hidden>{defaultLanguage.flag}</span>
              <span>{defaultLanguage.code}</span>
            </button>
            <button
              type="button"
              className="landing__utility"
              onClick={() => setCurrencyOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={currencyOpen}
              aria-controls="currency-sheet"
            >
              <span>{defaultCurrency.code}</span>
            </button>
          </div>

          <div className="landing__header-actions">
            <Link href="/signin" className="landing__signin" aria-label="Sign in">
              Sign in
            </Link>
            <Link href="/signup" className="landing__signup" aria-label="Sign up">
              Sign up
            </Link>
          </div>
        </header>

        <section className="landing__hero" aria-labelledby="landing-hero-title">
          <div className="landing__hero-copy">
            <span className="landing__hero-eyebrow">Partners · Products · Growth</span>
            <h1 id="landing-hero-title" className="landing__hero-title">
              Build recurring revenue with a trusted global investment leader.
            </h1>
            <p className="landing__hero-subtitle">
              Institutional-grade spreads, multilingual support and painless onboarding
              help your traders grow faster. Launch the partnership and focus on
              performance while our teams handle execution.
            </p>

            <div className="landing__hero-actions">
              <Link href="/signup" className="button button--primary">
                Sign up
              </Link>
              <Link href="/invest" className="button button--ghost">
                Explore partnership
              </Link>
            </div>

            <dl className="landing__hero-highlights">
              {heroHighlights.map((highlight) => (
                <div key={highlight.label} className="landing__hero-highlight">
                  <dt>{highlight.label}</dt>
                  <dd>
                    <strong>{highlight.value}</strong>
                    <span>{highlight.description}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <aside className="landing__hero-panel" aria-label="Partner revenue snapshot">
            <header>
              <span>Markets Hero</span>
              <h2>Partner revenue tracker</h2>
            </header>
            <p>
              Institutional accounts receive concierge onboarding, automated reporting and
              steady recurring payouts. Build trust with your investors from day one.
            </p>

            <div className="landing__hero-metric">
              <span>Recurring revenue</span>
              <strong>$128,400</strong>
              <small>Quarter-to-date partner earnings</small>
            </div>

            <ul className="landing__hero-momentum">
              <li>
                <strong>+28%</strong>
                <span>Average account growth in Q2</span>
              </li>
              <li>
                <strong>3.2h</strong>
                <span>Median onboarding time</span>
              </li>
              <li>
                <strong>99.9%</strong>
                <span>Uptime across trading desks</span>
              </li>
            </ul>
          </aside>
        </section>

        <section
          id="markets-hero"
          className="landing__features"
          aria-labelledby="landing-features-title"
        >
          <div className="landing__features-head">
            <span className="landing__features-eyebrow">Markets Hero</span>
            <h2 id="landing-features-title">Where partner growth compounds.</h2>
          </div>
          <div className="landing__features-grid">
            {featureCards.map((feature) => (
              <article key={feature.category} className="landing__feature">
                <header>
                  <span>{feature.category}</span>
                  <h3>{feature.title}</h3>
                </header>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <aside
        id="landing-menu"
        className={`landing__drawer${menuOpen ? " is-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="landing__drawer-panel">
          <div className="landing__drawer-head">
            <span className="landing__drawer-brand">AdvancedPro</span>
            <button
              type="button"
              className="landing__drawer-close"
              onClick={() => setMenuOpen(false)}
            >
              ✕
              <span className="sr-only">Close navigation</span>
            </button>
          </div>
          <nav className="landing__drawer-nav">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="landing__drawer-link"
                onClick={() => setMenuOpen(false)}
              >
                <span aria-hidden className="landing__drawer-icon">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <button
          type="button"
          className="landing__drawer-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden
        />
      </aside>

      <div
        id="language-sheet"
        role="dialog"
        aria-modal="true"
        className={`landing__sheet${languageOpen ? " is-open" : ""}`}
      >
        <div className="landing__sheet-panel">
          <header className="landing__sheet-head">
            <h2>Select language</h2>
            <button type="button" onClick={() => setLanguageOpen(false)}>
              ✕
              <span className="sr-only">Close language selector</span>
            </button>
          </header>
          <div className="landing__language-grid">
            {languages.map((language) => (
              <button
                key={language.code}
                type="button"
                className="landing__language-option"
                onClick={() => setLanguageOpen(false)}
              >
                <span aria-hidden>{language.flag}</span>
                <strong>{language.code}</strong>
                <span>{language.label}</span>
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          className="landing__sheet-backdrop"
          onClick={() => setLanguageOpen(false)}
          aria-hidden
        />
      </div>

      <div
        id="currency-sheet"
        role="dialog"
        aria-modal="true"
        className={`landing__sheet landing__sheet--currency${currencyOpen ? " is-open" : ""}`}
      >
        <div className="landing__sheet-panel">
          <header className="landing__sheet-head">
            <h2>Select currency</h2>
            <button type="button" onClick={() => setCurrencyOpen(false)}>
              ✕
              <span className="sr-only">Close currency selector</span>
            </button>
          </header>
          <div className="landing__currency-list">
            {currencies.map((currency) => (
              <button
                key={currency.code}
                type="button"
                className="landing__currency-option"
                onClick={() => setCurrencyOpen(false)}
              >
                <span className="landing__currency-radio" aria-hidden />
                <div>
                  <strong>{currency.code}</strong>
                  <span>{currency.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          className="landing__sheet-backdrop"
          onClick={() => setCurrencyOpen(false)}
          aria-hidden
        />
      </div>

      <section className={`chat${chatOpen ? " chat--open" : ""}`} aria-live="polite">
        <button
          type="button"
          className="chat__bubble"
          onClick={() => setChatOpen((prev) => !prev)}
          aria-expanded={chatOpen}
          aria-controls="chat-panel"
        >
          <span className="sr-only">Toggle support chat</span>
        </button>
        <div id="chat-panel" className="chat__panel" role="dialog" aria-modal="false">
          <header className="chat__panel-head">
            <div>
              <strong>How can we help?</strong>
              <span>We reply immediately</span>
            </div>
            <button type="button" onClick={() => setChatOpen(false)} aria-label="Close chat">
              ✕
            </button>
          </header>
          <div className="chat__panel-body">
            <div className="chat__message chat__message--bot">
              <span className="chat__avatar" aria-hidden>
                🤖
              </span>
              <p>
                Hello, we’ve noticed that it&apos;s your first time here. 👋 If you have any
                questions, feel free to reach out.
              </p>
            </div>
          </div>
          <footer className="chat__panel-footer">
            <div className="chat__panel-actions">
              <label className="chat__toggle">
                <input type="checkbox" defaultChecked />
                <span />
                <span>Play the sounds</span>
              </label>
              <button type="button">Download transcript</button>
              <button type="button">GDPR and privacy</button>
              <button type="button">Accessibility</button>
            </div>
            <div className="chat__panel-input">
              <input type="text" placeholder="Type your message" aria-label="Message" />
              <button type="button" className="chat__send">
                Let&apos;s chat
              </button>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
