"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import Image from "next/image";

interface Investment {
  id: string;
  name: string;
  amount: number;
  status: "active" | "pending" | "closed";
  created_at: string;
}

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

interface DropdownState {
  isOpen: boolean;
  position: { top: number; right: number };
}

export default function MinePage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<DropdownState>({
    isOpen: false,
    position: { top: 0, right: 0 },
  });
  const [logoutLoading, setLogoutLoading] = useState(false);

  // Fetch user and investments
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const currentUser = (data as any)?.user ?? null;
        if (!currentUser) {
          router.push("/signin");
          return;
        }

        const userProfile: UserProfile = {
          id: currentUser.id,
          email: currentUser.email,
          full_name: currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || currentUser.email?.split("@")[0],
          avatar_url: currentUser.user_metadata?.avatar_url || undefined,
        };

        if (!mounted) return;
        setUser(userProfile);

        // Fetch investments for logged-in user
        try {
          const { data: investmentsData, error: investError } = await supabase
            .from("investments")
            .select("*")
            .eq("user_id", userProfile.id)
            .order("created_at", { ascending: false });

          if (investError) {
            console.warn("Could not fetch investments:", investError);
            setInvestments([]);
          } else {
            setInvestments((investmentsData as any) || []);
          }
        } catch (err) {
          console.warn("Investments table may not exist:", err);
          setInvestments([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        router.push("/signin");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [supabase, router]);

  const handleWithdraw = async (investmentId: string) => {
    setActionLoading(investmentId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("Withdraw initiated for investment:", investmentId);
      setInvestments((prev) =>
        prev.map((inv) =>
          inv.id === investmentId ? { ...inv, status: "closed" as const } : inv
        )
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleReinvest = async (investmentId: string) => {
    setActionLoading(investmentId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("Reinvestment initiated for investment:", investmentId);
      router.push("/invest");
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await supabase.auth.signOut();
      router.push("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
      setLogoutLoading(false);
    }
  };

  const toggleDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    setShowDropdown((prev) => ({
      isOpen: !prev.isOpen,
      position: { top: rect.bottom + 8, right: window.innerWidth - rect.right },
    }));
  };

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (!showDropdown.isOpen) return;
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown((s) => ({ ...s, isOpen: false }));
      }
    }

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setShowDropdown((s) => ({ ...s, isOpen: false }));
    }

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [showDropdown.isOpen]);

  const handleDeposit = () => {
    console.log("Deposit action");
    // Placeholder modal or route
    router.push("/deposit");
  };

  const handleSettings = () => {
    console.log("Settings action");
    router.push("/profile");
  };

  // Calculate summary stats
  const totalInvested = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const activeInvestments = investments.filter((inv) => inv.status === "active").length;
  const pendingWithdrawals = investments.filter((inv) => inv.status === "pending").length;

  // Render loading skeleton
  const InvestmentSkeleton = () => (
    <div className="animate-pulse bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg h-40 mb-4" />
  );

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}>
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 md:py-16">
          <div className="animate-pulse mb-12">
            <div className="h-8 bg-slate-700 rounded w-48 mb-4"></div>
            <div className="h-4 bg-slate-700 rounded w-96"></div>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <InvestmentSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}>
        <div className="text-center">
          <p className="text-gray-300 mb-4">Unable to load your profile.</p>
          <Link href="/signin" className="text-blue-400 hover:text-blue-300 underline">
            Return to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}>
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 md:py-16">
        {/* User Header */}
        <section className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <button
              onClick={toggleDropdown}
              className="relative w-14 h-14 rounded-full overflow-hidden ring-1 ring-white/10"
              aria-label="Open profile menu"
              aria-haspopup="true"
              aria-expanded={showDropdown.isOpen}
            >
              {user.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatar_url} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                // use dicebear avatar as fallback
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`https://avatars.dicebear.com/api/identicon/${encodeURIComponent(user.email)}.svg`}
                  alt="avatar"
                  className="w-full h-full object-cover bg-slate-800"
                />
              )}
              </button>

              {showDropdown.isOpen && (
                <div
                  ref={dropdownRef}
                  role="menu"
                  aria-label="Profile menu"
                  style={{ top: showDropdown.position.top, right: showDropdown.position.right }}
                  className="fixed z-50 w-48 bg-[#0b1220] rounded-lg shadow-lg ring-1 ring-white/5 overflow-hidden"
                >
                  <button
                    onClick={() => {
                      setShowDropdown((s) => ({ ...s, isOpen: false }));
                      handleSettings();
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-white/5 text-white"
                    role="menuitem"
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      setShowDropdown((s) => ({ ...s, isOpen: false }));
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-white/5 text-white"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              )}

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Welcome, {user.full_name || user.email.split("@")[0]}!</h1>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
          </div>

          {/* Stats cards and actions */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex gap-3 overflow-x-auto">
              <div className="min-w-[160px] rounded-lg p-4 shadow-md border border-sky-500/20 bg-[rgba(15,23,42,0.6)]">
                <p className="text-gray-400 text-xs uppercase tracking-wide">Total Invested</p>
                <p className="text-lg font-bold text-sky-400">${totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>

              <div className="min-w-[140px] rounded-lg p-4 shadow-md border border-sky-500/20 bg-[rgba(15,23,42,0.6)]">
                <p className="text-gray-400 text-xs uppercase tracking-wide">Active</p>
                <p className="text-lg font-bold text-cyan-300">{activeInvestments}</p>
              </div>

              <div className="min-w-[140px] rounded-lg p-4 shadow-md border border-sky-500/20 bg-[rgba(15,23,42,0.6)]">
                <p className="text-gray-400 text-xs uppercase tracking-wide">Pending</p>
                <p className="text-lg font-bold text-yellow-300">{pendingWithdrawals}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="mb-6">
          <div className="flex gap-3 overflow-x-auto pb-2">
            <Link
              href="/invest"
              className="flex-shrink-0 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-semibold shadow-md"
            >
              + New Investment
            </Link>

            <button onClick={handleDeposit} className="flex-shrink-0 px-4 py-2 rounded-lg bg-sky-600 text-white font-semibold shadow-md">
              Deposit
            </button>

            <button onClick={() => alert('Open withdraw flow')} className="flex-shrink-0 px-4 py-2 rounded-lg bg-sky-600 text-white font-semibold shadow-md">
              Withdraw
            </button>

            <button onClick={handleSettings} className="flex-shrink-0 px-4 py-2 rounded-lg bg-sky-600 text-white font-semibold shadow-md">
              Settings
            </button>

            <button onClick={handleLogout} className="flex-shrink-0 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold shadow-md">
              {logoutLoading ? 'Signing out...' : 'Logout'}
            </button>
          </div>
        </section>

        {/* Investment List */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Your Investments</h2>

          {investments.length === 0 ? (
            <div
              className="rounded-lg p-8 sm:p-12 text-center border-2 border-dashed border-blue-500/30"
              style={{ background: "rgba(15, 23, 42, 0.4)" }}
            >
              <p className="text-gray-300 text-lg mb-4">You have no investments yet.</p>
              <p className="text-gray-400 mb-6">Start your investment journey today!</p>
              <Link
                href="/invest"
                className="inline-block px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
              >
                Start Now
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {investments.map((investment) => (
                <div
                  key={investment.id}
                  className="rounded-lg p-6 shadow-lg border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300"
                  style={{ background: "rgba(15, 23, 42, 0.7)" }}
                >
                  {/* Investment Header */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white truncate">{investment.name}</h3>
                    <p className="text-2xl font-bold text-blue-400 mt-2">
                      ${investment.amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                        investment.status === "active"
                          ? "bg-green-500/20 text-green-300 border border-green-500/40"
                          : investment.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40"
                          : "bg-red-500/20 text-red-300 border border-red-500/40"
                      }`}
                    >
                      {investment.status}
                    </span>
                  </div>

                  {/* Created Date */}
                  <p className="text-gray-400 text-sm mb-4">
                    {new Date(investment.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={() => handleWithdraw(investment.id)}
                      disabled={actionLoading === investment.id || investment.status === "closed"}
                      className="flex-1 px-4 py-2 sm:py-3 text-sm sm:text-base font-semibold rounded-lg border border-red-500/40 text-red-300 hover:bg-red-500/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading === investment.id ? (
                        <span className="inline-block">
                          <span className="animate-spin inline-block mr-1">⟳</span>
                          Withdrawing...
                        </span>
                      ) : (
                        "Withdraw"
                      )}
                    </button>

                    <button
                      onClick={() => handleReinvest(investment.id)}
                      disabled={actionLoading === investment.id}
                      className="flex-1 px-4 py-2 sm:py-3 text-sm sm:text-base font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading === investment.id ? (
                        <span className="inline-block">
                          <span className="animate-spin inline-block mr-1">⟳</span>
                          Processing...
                        </span>
                      ) : (
                        "Reinvest"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
