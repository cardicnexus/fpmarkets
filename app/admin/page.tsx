"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type Metric = {
  label: string;
  value: string;
  change: string;
  status: "positive" | "negative" | "neutral";
};

type ActivityLog = {
  id: string;
  event: string;
  timestamp: string;
  status: "success" | "warning" | "error";
};

type AccountSnapshot = {
  name: string;
  tier: string;
  balance: string;
  kyc: "Verified" | "Pending" | "Flagged";
  status: "Active" | "Suspended" | "Review";
};

type SupportTicket = {
  id: string;
  subject: string;
  priority: "Low" | "Medium" | "High";
  assignee: string;
  updated: string;
};

const ADMIN_EMAIL = "realcardic1@gmail.com";
const ADMIN_PASSWORD = "12345678";

const metrics: Metric[] = [
  {
    label: "Active traders",
    value: "5,284",
    change: "+6.2% vs last week",
    status: "positive",
  },
  {
    label: "Assets under management",
    value: "$18.6M",
    change: "+$420K net deposits",
    status: "positive",
  },
  {
    label: "Withdrawals queued",
    value: "$216K",
    change: "4 requests pending review",
    status: "neutral",
  },
  {
    label: "Support backlog",
    value: "12 tickets",
    change: "Down 3 in 24h",
    status: "positive",
  },
];

const activityLogs: ActivityLog[] = [
  {
    id: "log-4096",
    event: "Admin session initiated for realcardic1@gmail.com",
    timestamp: "Today · 09:14 UTC",
    status: "success",
  },
  {
    id: "log-4093",
    event: "KYC escalation resolved · Account FP-8893",
    timestamp: "Yesterday · 17:40 UTC",
    status: "success",
  },
  {
    id: "log-4088",
    event: "Failed withdrawal attempt · Account FP-7710",
    timestamp: "Yesterday · 11:08 UTC",
    status: "warning",
  },
  {
    id: "log-4079",
    event: "Two-factor authentication enforced for staff",
    timestamp: "2 days ago · 20:51 UTC",
    status: "success",
  },
  {
    id: "log-4074",
    event: "Login denied · Suspicious IP from São Paulo",
    timestamp: "2 days ago · 04:12 UTC",
    status: "error",
  },
];

const accountSnapshots: AccountSnapshot[] = [
  {
    name: "London Alpha Desk",
    tier: "Institutional",
    balance: "$3.2M",
    kyc: "Verified",
    status: "Active",
  },
  {
    name: "FP Markets Copy · Asia",
    tier: "Partner",
    balance: "$860K",
    kyc: "Verified",
    status: "Active",
  },
  {
    name: "Mirabel FX",
    tier: "Professional",
    balance: "$194K",
    kyc: "Pending",
    status: "Review",
  },
  {
    name: "Retail onboarding",
    tier: "Retail",
    balance: "$72K",
    kyc: "Flagged",
    status: "Suspended",
  },
];

const supportTickets: SupportTicket[] = [
  {
    id: "FP-13452",
    subject: "IB commission audit for September",
    priority: "High",
    assignee: "Victoria Lane",
    updated: "42m ago",
  },
  {
    id: "FP-13429",
    subject: "Client onboarding automation feedback",
    priority: "Medium",
    assignee: "Daniel Obi",
    updated: "1h ago",
  },
  {
    id: "FP-13388",
    subject: "Pricing feed latency EU servers",
    priority: "High",
    assignee: "Network Ops",
    updated: "3h ago",
  },
  {
    id: "FP-13341",
    subject: "Update custodial statements for Q4",
    priority: "Low",
    assignee: "Finance Desk",
    updated: "Yesterday",
  },
];

const statusCopy: Record<ActivityLog["status"], string> = {
  success: "Success",
  warning: "Attention",
  error: "Alert",
};

const sections = [
  { id: "overview", label: "Overview" },
  { id: "accounts", label: "Accounts" },
  { id: "logs", label: "Activity" },
  { id: "support", label: "Support" },
  { id: "settings", label: "Settings" },
] as const;

type SectionId = (typeof sections)[number]["id"];

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const supabase = createClientComponentClient();

  // users fetched from profiles table
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    let mounted = true;
    const load = async () => {
      setLoadingUsers(true);
      try {
        const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
        if (error) {
          console.warn("Failed to fetch profiles:", error.message);
          setUsers([]);
        } else if (mounted) {
          setUsers((data as any) || []);
        }
      } catch (err) {
        console.warn("Profiles table may not exist:", err);
        setUsers([]);
      } finally {
        if (mounted) setLoadingUsers(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, supabase]);

  const welcomeMessage = useMemo(() => {
    if (!isAuthenticated) {
      return "Authorise access with your admin credentials.";
    }

    switch (activeSection) {
      case "overview":
        return "Real-time health of the FP Markets operations.";
      case "accounts":
        return "Curate key accounts and escalate items instantly.";
      case "logs":
        return "Security trails and privileged access history.";
      case "support":
        return "Coordinate client escalations with the support desk.";
      case "settings":
        return "Manage platform controls and continuity policies.";
      default:
        return "";
    }
  }, [activeSection, isAuthenticated]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        setIsAuthenticated(true);
        setFormError(null);
        setActiveSection("overview");
      } else {
        setFormError("Invalid admin credentials. Please verify your email and password.");
      }

      setIsSubmitting(false);
    }, 300);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
    setActiveSection("overview");
  };

  return (
    <main className={isAuthenticated ? "admin admin--dashboard" : "admin"}>
      <div className="admin__halo" aria-hidden />

      <header className="admin__top" aria-label="Admin navigation">
        <Link href="/" className="admin__brand">
          FP Markets
        </Link>
        <nav aria-label="Admin shortcuts">
          <a href="mailto:support@fpmarkets.app" className="admin__support-link">
            Contact support
          </a>
        </nav>
      </header>

      <section className="admin__panel" aria-live="polite">
        <div className="admin__panel-header">
          <div>
            <h1 className="admin__title">Administrator console</h1>
            <p className="admin__subtitle">{welcomeMessage}</p>
          </div>
          {isAuthenticated ? (
            <div className="admin__session">
              <div className="admin__session-indicator">
                <span aria-hidden />
                Connected as
                <strong>{ADMIN_EMAIL}</strong>
              </div>
              <button type="button" className="admin__signout" onClick={handleSignOut}>
                Sign out
              </button>
            </div>
          ) : null}
        </div>

        {isAuthenticated ? (
          <div className="admin__dashboard" role="region" aria-label="Administrator dashboard">
            <nav className="admin__tabs" aria-label="Admin sections">
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  className={
                    activeSection === section.id ? "admin__tab admin__tab--active" : "admin__tab"
                  }
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.label}
                </button>
              ))}
            </nav>

            {activeSection === "overview" ? (
              <div className="admin__grid">
                {metrics.map((metric) => (
                  <article key={metric.label} className="admin__card" aria-label={metric.label}>
                    <header>
                      <span className="admin__card-label">{metric.label}</span>
                      <strong className="admin__card-value">{metric.value}</strong>
                    </header>
                    <p
                      className={
                        metric.status === "positive"
                          ? "admin__chip admin__chip--positive"
                          : metric.status === "negative"
                          ? "admin__chip admin__chip--negative"
                          : "admin__chip"
                      }
                    >
                      {metric.change}
                    </p>
                  </article>
                ))}

                <article className="admin__card admin__card--wide" aria-label="Operational updates">
                  <header>
                    <span className="admin__card-label">Operational updates</span>
                    <strong className="admin__card-value">Security & continuity</strong>
                  </header>
                  <ul className="admin__list">
                    <li>
                      Multi-factor authentication enforced for all privileged roles · Active monitoring enabled.
                    </li>
                    <li>
                      Liquidity provider health checks completed · No latency breaches reported in the last 24h.
                    </li>
                    <li>
                      Weekly compliance export scheduled · Delivery confirmed to regulatory archive.
                    </li>
                  </ul>
                  <button type="button" className="admin__action">
                    Download audit package
                  </button>
                </article>
              </div>
            ) : null}

            {activeSection === "accounts" ? (
              <div className="admin__surface" role="table" aria-label="Priority accounts">
                <header className="admin__surface-header" role="row">
                  <span role="columnheader">User</span>
                  <span role="columnheader">Email</span>
                  <span role="columnheader">Balance</span>
                  <span role="columnheader">Approved</span>
                  <span role="columnheader">Actions</span>
                </header>

                {loadingUsers ? (
                  <div className="p-4 text-gray-300">Loading users…</div>
                ) : users.length === 0 ? (
                  <div className="p-4 text-gray-300">No user profiles found.</div>
                ) : (
                  users.map((u) => (
                    <article key={u.user_id || u.id || u.email} className="admin__surface-row" role="row">
                      <span role="cell">{u.fullname || u.nickname || u.email}</span>
                      <span role="cell">{u.email}</span>
                      <span role="cell">{u.balance ?? "0.00"}</span>
                      <span role="cell">
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={!!u.is_approved}
                            onChange={async (e) => {
                              const newVal = e.currentTarget.checked;
                              try {
                                await supabase.from("profiles").update({ is_approved: newVal }).eq("user_id", u.user_id);
                                setUsers((prev) => prev.map((p) => (p.user_id === u.user_id ? { ...p, is_approved: newVal } : p)));
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                          />
                        </label>
                      </span>
                      <span role="cell">
                        <div className="flex gap-2">
                          <button
                            onClick={async () => {
                              const add = Number(prompt("Amount to add (PHP):", "0") || "0");
                              if (Number.isNaN(add)) return;
                              try {
                                await supabase.from("profiles").update({ balance: (Number(u.balance || 0) + add).toString() }).eq("user_id", u.user_id);
                                setUsers((prev) => prev.map((p) => (p.user_id === u.user_id ? { ...p, balance: (Number(p.balance || 0) + add).toString() } : p)));
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                            className="admin__action"
                          >
                            Add
                          </button>

                          <button
                            onClick={async () => {
                              const sub = Number(prompt("Amount to subtract (PHP):", "0") || "0");
                              if (Number.isNaN(sub)) return;
                              try {
                                const newBal = Math.max(0, Number(u.balance || 0) - sub);
                                await supabase.from("profiles").update({ balance: newBal.toString() }).eq("user_id", u.user_id);
                                setUsers((prev) => prev.map((p) => (p.user_id === u.user_id ? { ...p, balance: newBal.toString() } : p)));
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                            className="admin__action admin__action--danger"
                          >
                            Subtract
                          </button>
                          <button
                            onClick={async () => {
                              // fetch deposit/withdraw requests for user (if table exists)
                              try {
                                const { data: txs } = await supabase.from("transactions").select("*").eq("user_id", u.user_id).order("created_at", { ascending: false }).limit(5);
                                alert(JSON.stringify(txs || [], null, 2));
                              } catch (err) {
                                alert("No transactions table or failed to fetch.");
                              }
                            }}
                            className="admin__action"
                          >
                            Tx
                          </button>
                        </div>
                      </span>
                    </article>
                  ))
                )}

                <footer className="admin__surface-footer">
                  <button type="button">Create review task</button>
                </footer>
              </div>
            ) : null}

            {activeSection === "logs" ? (
              <div className="admin__surface" role="region" aria-label="Administrator activity log">
                <header className="admin__surface-header admin__surface-header--compact">
                  <span>Recent events</span>
                  <button type="button">Export CSV</button>
                </header>
                <ul className="admin__timeline">
                  {activityLogs.map((log) => (
                    <li key={log.id} className={`admin__timeline-item admin__timeline-item--${log.status}`}>
                      <div className="admin__timeline-status" aria-hidden />
                      <div className="admin__timeline-content">
                        <p>
                          <strong>{statusCopy[log.status]}</strong> · {log.event}
                        </p>
                        <span>{log.timestamp}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {activeSection === "support" ? (
              <div className="admin__surface" role="region" aria-label="Support coordination">
                <header className="admin__surface-header admin__surface-header--compact">
                  <span>Support queue</span>
                  <button type="button">Assign to me</button>
                </header>
                <div className="admin__surface-table" role="table">
                  <div className="admin__surface-row admin__surface-row--header" role="row">
                    <span role="columnheader">Ticket</span>
                    <span role="columnheader">Subject</span>
                    <span role="columnheader">Priority</span>
                    <span role="columnheader">Owner</span>
                    <span role="columnheader">Updated</span>
                  </div>
                  {supportTickets.map((ticket) => (
                    <div key={ticket.id} className="admin__surface-row" role="row">
                      <span role="cell">{ticket.id}</span>
                      <span role="cell">{ticket.subject}</span>
                      <span role="cell" className={`admin__badge admin__badge--${ticket.priority.toLowerCase()}`}>
                        {ticket.priority}
                      </span>
                      <span role="cell">{ticket.assignee}</span>
                      <span role="cell">{ticket.updated}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {activeSection === "settings" ? (
              <div className="admin__surface" role="region" aria-label="Administrative settings">
                <header className="admin__surface-header admin__surface-header--compact">
                  <span>Security & compliance</span>
                  <button type="button">Edit policies</button>
                </header>
                <ul className="admin__list admin__list--dense">
                  <li>Privileged sessions limited to 45 minutes · idle timeout enforced.</li>
                  <li>Daily ledger backup scheduled for 02:00 UTC · status healthy.</li>
                  <li>Payment providers in good standing · next review October 21.</li>
                  <li>Disaster recovery rehearsal completed · next drill in 27 days.</li>
                  <li>Notification mirror enabled for {ADMIN_EMAIL} via secure inbox.</li>
                </ul>
                <div className="admin__action-bar">
                  <button type="button">Generate compliance pack</button>
                  <button type="button">Update risk matrix</button>
                  <button type="button">Review access controls</button>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <form className="admin__form" onSubmit={handleSubmit} noValidate>
            <label className="admin__field" htmlFor="admin-email">
              <span>Email</span>
              <input
                id="admin-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder={ADMIN_EMAIL}
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
                required
                disabled={isSubmitting}
              />
            </label>

            <label className="admin__field" htmlFor="admin-password">
              <span>Password</span>
              <input
                id="admin-password"
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
                required
                disabled={isSubmitting}
              />
            </label>

            <button type="submit" className="admin__submit" disabled={isSubmitting}>
              {isSubmitting ? "Verifying…" : "Access console"}
            </button>

            {formError ? (
              <p className="admin__message" role="status">
                {formError}
              </p>
            ) : (
              <p className="admin__message" role="status">
                Authorised administrators can sign in using the issued credentials.
              </p>
            )}
          </form>
        )}
      </section>
    </main>
  );
}
