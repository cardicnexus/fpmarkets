"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import TabBar from "@/components/ui/TabBar";
import { naira } from "@/components/ui/NA";

export const DEFAULT_INVESTMENT_BALANCE = 0;
export const INVESTMENT_STORAGE_KEY = "fpmarkets:investment-state";

export type HeroStat = {
  label: string;
  value: string;
};

export type TraderProject = {
  name: string;
  code: string;
  country: string;
  roi: string;
  cycle: string;
  min: number;
  earnings: number;
  capacity: number;
  image: string;
};

export type Product = {
  title: string;
  subtitle: string;
  category: string;
  roi: string;
  cycle: string;
  min: number;
  earnings: number;
  badge?: string;
  progress: number;
  image: string;
  highlights: string[];
};

export type ProductSection = {
  key: string;
  title: string;
  eyebrow: string;
  projects: Product[];
};

export type WorkflowStep = {
  title: string;
  description: string;
};

export type SupportHighlight = {
  title: string;
  description: string;
};

export type VisionHighlight = {
  title: string;
  description: string;
  metric: string;
};

type InvestExperienceProps = {
  heroStats: HeroStat[];
  traderTicker: TraderProject[];
  productSections: ProductSection[];
  workflowSteps: WorkflowStep[];
  supportHighlights: SupportHighlight[];
  initialBalance: number;
  visionHighlights: VisionHighlight[];
};

export type ActiveInvestment = {
  project: Product;
  amount: number;
  startedAt: number;
};

type MissionBriefingItem = {
  label: string;
  value: string;
  detail: string;
};

export type StoredInvestmentState = {
  balance: number;
  activeInvestment: ActiveInvestment | null;
};

export default function InvestExperience({
  heroStats,
  traderTicker,
  productSections,
  workflowSteps,
  supportHighlights,
  initialBalance,
  visionHighlights,
}: InvestExperienceProps) {
  const [availableBalance, setAvailableBalance] = useState(initialBalance);
  const [selectedProject, setSelectedProject] = useState<Product | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [activeInvestment, setActiveInvestment] = useState<ActiveInvestment | null>(null);
  const [investmentError, setInvestmentError] = useState<string | null>(null);
  const [investmentSuccess, setInvestmentSuccess] = useState<string | null>(null);
  const [earnings, setEarnings] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || isHydrated) {
      return;
    }

    const parseState = (raw: string): StoredInvestmentState => {
      try {
        const parsed = JSON.parse(raw) as Partial<StoredInvestmentState>;
        const balance = typeof parsed.balance === "number" ? parsed.balance : initialBalance;
        const maybeActive = parsed.activeInvestment as ActiveInvestment | null | undefined;

        if (
          maybeActive &&
          typeof maybeActive.amount === "number" &&
          typeof maybeActive.startedAt === "number" &&
          maybeActive.project &&
          typeof maybeActive.project.title === "string"
        ) {
          return { balance, activeInvestment: maybeActive };
        }

        return { balance, activeInvestment: null };
      } catch (error) {
        return { balance: initialBalance, activeInvestment: null };
      }
    };

    const raw = window.localStorage.getItem(INVESTMENT_STORAGE_KEY);

    if (raw) {
      const state = parseState(raw);
      setAvailableBalance(state.balance);
      setActiveInvestment(state.activeInvestment);
      setIsHydrated(true);
      return;
    }

    const defaultState: StoredInvestmentState = {
      balance: initialBalance,
      activeInvestment: null,
    };

    window.localStorage.setItem(INVESTMENT_STORAGE_KEY, JSON.stringify(defaultState));
    setAvailableBalance(initialBalance);
    setActiveInvestment(null);
    setIsHydrated(true);
  }, [initialBalance, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") {
      return;
    }

    const payload: StoredInvestmentState = {
      balance: availableBalance,
      activeInvestment,
    };

    window.localStorage.setItem(INVESTMENT_STORAGE_KEY, JSON.stringify(payload));
  }, [availableBalance, activeInvestment, isHydrated]);

  useEffect(() => {
    if (!activeInvestment) {
      setEarnings(0);
      return;
    }

    const dayMs = 24 * 60 * 60 * 1000;

    const update = () => {
      const diff = Date.now() - activeInvestment.startedAt;
      const roiPerMs = (activeInvestment.amount * 0.69) / dayMs;
      setEarnings(diff * roiPerMs);
    };

    update();

    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [activeInvestment]);

  const roiPercent = activeInvestment?.amount
    ? Math.min((earnings / activeInvestment.amount) * 100, 69)
    : 0;

  const missionBriefing = useMemo<MissionBriefingItem[]>(() => {
    if (activeInvestment) {
      return [
        {
          label: "Active mission",
          value: activeInvestment.project.title,
          detail: activeInvestment.project.cycle,
        },
        {
          label: "ROI pacing",
          value: `+${roiPercent.toFixed(2)}% of daily target`,
          detail: "69% objective with live monitoring",
        },
        {
          label: "Desk liaison",
          value: "Manager Sophia Liam",
          detail: "Status briefings available on demand",
        },
      ];
    }

    return [
      {
        label: "Desk readiness",
        value: "Cleared for first allocation",
        detail: "All compliance checkpoints satisfied",
      },
      {
        label: "Risk posture",
        value: "Capital preservation",
        detail: "Drawdown guards staged",
      },
      {
        label: "Liaison desk",
        value: "Manager Sophia Liam",
        detail: "Tap support for immediate contact",
      },
    ];
  }, [activeInvestment, roiPercent]);

  const handleSelectProject = (project: Product) => {
    setSelectedProject(project);
    setAmount(String(project.min));
    setInvestmentError(null);
    setInvestmentSuccess(null);
  };

  const handleInvest = () => {
    if (!selectedProject) {
      return;
    }

    const numericAmount = Number(amount);

    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      setInvestmentError("Enter a valid amount to invest.");
      return;
    }

    if (numericAmount < selectedProject.min) {
      setInvestmentError(
        `Minimum allocation for this mission is ${naira(selectedProject.min)}.`
      );
      return;
    }

    if (numericAmount > availableBalance) {
      setInvestmentError("Insufficient balance. Top up your vault to continue.");
      return;
    }

    const investment: ActiveInvestment = {
      project: selectedProject,
      amount: numericAmount,
      startedAt: Date.now(),
    };

    setActiveInvestment(investment);
    setAvailableBalance((prev) => prev - numericAmount);
    setSelectedProject(null);
    setAmount("");
    setInvestmentError(null);
    setInvestmentSuccess("Investment launched! Manage it from your profile dashboard.");
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    setInvestmentError(null);
    setInvestmentSuccess(null);
  };

  return (
    <main className="page page--invest">
      <section className="invest-hero invest-hero--refined">
        <div className="invest-hero__content">
          <span className="invest-hero__eyebrow">Invest · Earn · Withdraw</span>
          <h1 className="invest-hero__title">
            A calmer command centre for 60%+ daily ROI missions.
          </h1>
          <p className="invest-hero__subtitle">
            FP Markets curates institutional-grade trader projects with
            governance-first storytelling, live oversight and concierge support.
            Review a concise brief, deploy capital deliberately and keep the
            focus on performance.
          </p>

          <div className="invest-hero__stats">
            {heroStats.map((stat) => (
              <div key={stat.label} className="invest-hero__stat">
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </div>

          <div className="invest-hero__cta">
            <Link href="#projects" className="button button--primary button--glow">
              Explore missions
            </Link>
            <a
              href="https://t.me/ManagesophiaLiam"
              target="_blank"
              rel="noreferrer"
              className="button button--support"
            >
              Hey, I need help
            </a>
          </div>
        </div>

        <div className="invest-hero__panel invest-hero__panel--briefing">
          <header className="invest-panel__head">
            <div>
              <span>Mission briefing</span>
              <strong>{activeInvestment ? "Live oversight" : "Pre-investment"}</strong>
              <p>
                {activeInvestment
                  ? "Your allocation is live. Monitor pacing here and manage depth inside your profile dashboard."
                  : "Every detail you need before committing capital. Once you invest, the dashboard unlocks in your profile."}
              </p>
            </div>
          </header>

          <div className="invest-panel__insights invest-panel__insights--briefing">
            {missionBriefing.map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="invest-panel__note">
            {activeInvestment
              ? "Detailed cash movements and statement downloads live inside your profile dashboard."
              : "When you invest, balance movements and ROI counters relocate to your dashboard for focused monitoring."}
          </div>
        </div>
      </section>

      <section id="vision" className="section invest-vision" aria-label="Executive overview">
        <div className="invest-vision__copy">
          <span className="section__eyebrow">Designed for desktop clarity</span>
          <h2 className="section__title">Every control now supports a calmer PC command view.</h2>
          <p className="section__subtitle">
            We decluttered the landing journey so you see strategy, governance and
            ROI focus without noise. Each highlight below keeps the desktop layout
            measured and professional.
          </p>
        </div>
        <div className="invest-vision__grid">
          {visionHighlights.map((item) => (
            <article key={item.title} className="invest-vision__card">
              <header>
                <span>{item.metric}</span>
                <h3>{item.title}</h3>
              </header>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ticker ticker--refined" aria-label="Live trader board">
        <div className="ticker__track">
          {[...traderTicker, ...traderTicker].map((item, index) => (
            <article key={`${item.code}-${index}`} className="ticker__item">
              <img src={item.image} alt={item.name} loading="lazy" />
              <div>
                <div className="ticker__header">
                  <span>{item.name}</span>
                  <span>{item.roi}</span>
                </div>
                <div className="ticker__meta">
                  <span>{item.country}</span>
                  <span>{item.code}</span>
                </div>
                <div className="ticker__progress">
                  <div
                    className="ticker__progress-bar"
                    style={{ width: `${item.capacity * 100}%` }}
                  />
                  <span>{Math.round(item.capacity * 100)}% slots live</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="projects" className="section section--tight">
        <div className="section__head">
          <span className="section__eyebrow">Curated catalogue</span>
          <h2 className="section__title">Pick a trader project to grow your vault.</h2>
          <p className="section__subtitle">
            Minimum ROI sits at 60% daily. Fewer missions appear here so each
            one carries the due diligence, oversight cadence and manager access
            expected by private desk investors.
          </p>
        </div>
        <div className="section__tabs">
          {productSections.map((section) => (
            <div key={section.key} className="section__tab">
              <span className="section__tab-eyebrow">{section.eyebrow}</span>
              <h3>{section.title}</h3>
              <div className="project-grid">
                {section.projects.map((project) => (
                  <ProjectCard
                    key={project.title}
                    project={project}
                    isSelected={selectedProject?.title === project.title}
                    amount={selectedProject?.title === project.title ? amount : ""}
                    onAmountChange={handleAmountChange}
                    onSelect={() => handleSelectProject(project)}
                    onConfirm={handleInvest}
                    availableBalance={availableBalance}
                    error={
                      selectedProject?.title === project.title ? investmentError : null
                    }
                    success={
                      activeInvestment?.project.title === project.title
                        ? investmentSuccess
                        : null
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__head">
          <span className="section__eyebrow">How it works</span>
          <h2 className="section__title">Three deliberate steps to deploy capital.</h2>
        </div>
        <div className="workflow">
          {workflowSteps.map((step, index) => (
            <div key={step.title} className="workflow__step">
              <div className="workflow__index">0{index + 1}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section section--accent">
        <div className="section__head">
          <span className="section__eyebrow">Support &amp; safety</span>
          <h2 className="section__title">Sleep easy while your ROI keeps rolling.</h2>
          <p className="section__subtitle">
            FP Markets runs compliance-grade monitoring, human concierge and AI
            security so your wallet stays smiling.
          </p>
        </div>
        <div className="benefit-grid">
          {supportHighlights.map((item) => (
            <div key={item.title} className="benefit-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <TabBar />
    </main>
  );
}

type ProjectCardProps = {
  project: Product;
  isSelected: boolean;
  amount: string;
  onAmountChange: (value: string) => void;
  onSelect: () => void;
  onConfirm: () => void;
  availableBalance: number;
  error: string | null;
  success: string | null;
};

function ProjectCard({
  project,
  isSelected,
  amount,
  onAmountChange,
  onSelect,
  onConfirm,
  availableBalance,
  error,
  success,
}: ProjectCardProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onConfirm();
  };

  return (
    <article className="project-card">
      <div className="project-card__media">
        <img src={project.image} alt={project.title} loading="lazy" />
        {project.badge && <span className="project-card__badge">{project.badge}</span>}
      </div>
      <div className="project-card__body">
        <div className="project-card__head">
          <span className="project-card__category">{project.category}</span>
          <h4>{project.title}</h4>
          <p>{project.subtitle}</p>
        </div>
        <div className="project-card__stats">
          <div>
            <span>ROI</span>
            <strong>{project.roi}</strong>
          </div>
          <div>
            <span>Cycle</span>
            <strong>{project.cycle}</strong>
          </div>
          <div>
            <span>Minimum</span>
            <strong>{naira(project.min)}</strong>
          </div>
          <div>
            <span>Est. earnings</span>
            <strong>{naira(project.earnings)}</strong>
          </div>
        </div>
        <div className="project-card__progress">
          <div
            className="project-card__progress-bar"
            style={{ width: `${project.progress * 100}%` }}
          />
          <span>{Math.round(project.progress * 100)}% slots secured</span>
        </div>
        <div className="project-card__highlights">
          {project.highlights.map((highlight) => (
            <span key={highlight}>{highlight}</span>
          ))}
        </div>
        <div className="project-card__actions">
          {isSelected ? (
            <form className="project-card__form" onSubmit={handleSubmit}>
              <label htmlFor={`${project.title}-amount`}>Amount to invest</label>
              <div className="project-card__form-controls">
                <input
                  id={`${project.title}-amount`}
                  type="number"
                  min={project.min}
                  step="100"
                  value={amount}
                  onChange={(event) => onAmountChange(event.target.value)}
                  placeholder={String(project.min)}
                  aria-describedby={`${project.title}-helper`}
                />
                <button type="submit" className="button button--primary">
                  Confirm invest
                </button>
              </div>
              <p id={`${project.title}-helper`} className="project-card__helper">
                Balance verification runs automatically on confirm.
              </p>
              {error && <p className="project-card__error">{error}</p>}
            </form>
          ) : (
            <button type="button" className="button button--primary" onClick={onSelect}>
              Invest
            </button>
          )}
          <p className="project-card__note">Full trade brief unlocks inside your profile dashboard.</p>
        </div>
        {success && (
          <p className="project-card__success" role="status">
            {success}
          </p>
        )}
      </div>
    </article>
  );
}
