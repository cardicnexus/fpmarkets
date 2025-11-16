"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient, type SupabaseClient } from "@/lib/supabase/client";
import Link from "next/link";

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
}

export default function MinePage() {
  const router = useRouter();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Initialize Supabase client
  useEffect(() => {
    let isMounted = true;

    getSupabaseBrowserClient()
      .then((client) => {
        if (!isMounted) return;
        setSupabase(client);
      })
      .catch((error) => {
        console.error("Failed to initialize Supabase:", error);
        if (isMounted) {
          router.push("/signin");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [router]);

  // Fetch user and investments
  useEffect(() => {
    if (!supabase) return;

    const fetchData = async () => {
      try {
        // Get current user session
        const { data: authData, error: authError } = await (supabase.auth as any).getSession?.() || 
          await (supabase.auth as any).getUser?.();

        if (authError || !authData) {
          router.push("/signin");
          return;
        }

        // For our custom client, we need to handle the user data differently
        // Fetch user from session or auth state
        const userEmail = (authData as any)?.user?.email || 
                         (authData as any)?.session?.user?.email ||
                         (authData as any)?.email;

        if (!userEmail) {
          router.push("/signin");
          return;
        }

        const userProfile: UserProfile = {
          id: (authData as any)?.user?.id || (authData as any)?.session?.user?.id || "unknown",
          email: userEmail,
          full_name: (authData as any)?.user?.user_metadata?.full_name || userEmail.split("@")[0],
        };

        setUser(userProfile);

        // Fetch investments from Supabase
        // Note: This assumes an investments table exists in Supabase
        // If the table doesn't exist, we'll show an empty state
        try {
          const { data: investmentsData, error: investError } = await (supabase as any)
            .from("investments")
            ?.select("*")
            ?.eq("user_id", userProfile.id)
            ?.order("created_at", { ascending: false }) || { data: [], error: null };

          if (investError) {
            console.warn("Could not fetch investments:", investError);
            setInvestments([]);
          } else {
            setInvestments(investmentsData || []);
          }
        } catch (err) {
          console.warn("Investments table may not exist:", err);
          setInvestments([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase, router]);

  const handleWithdraw = async (investmentId: string) => {
    setActionLoading(investmentId);
    try {
      // Simulate withdraw action
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // In a real app, you'd make an API call here
      console.log("Withdraw initiated for investment:", investmentId);
      
      // Update local state or refetch
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
      // Simulate reinvest action
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // In a real app, you'd make an API call here
      console.log("Reinvestment initiated for investment:", investmentId);
      router.push("/invest");
    } finally {
      setActionLoading(null);
    }
  };

  // Calculate summary stats
  const totalInvested = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const activeInvestments = investments.filter((inv) => inv.status === "active").length;

  // Render loading skeleton
  const InvestmentSkeleton = () => (
    <div className="animate-pulse bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg h-32 mb-4"></div>
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
        {/* User Greeting */}
        <section className="mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
            Welcome, {user.full_name || user.email.split("@")[0]}!
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">{user.email}</p>
        </section>

        {/* Investment Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {/* Total Invested Card */}
          <div
            className="rounded-lg p-6 sm:p-8 shadow-lg border border-blue-500/20"
            style={{ background: "rgba(15, 23, 42, 0.6)" }}
          >
            <p className="text-gray-400 text-sm uppercase tracking-wide mb-2">Total Invested</p>
            <p className="text-3xl sm:text-4xl font-bold text-blue-400">
              ${totalInvested.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="mt-4 w-full bg-slate-700/30 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>

          {/* Active Investments Card */}
          <div
            className="rounded-lg p-6 sm:p-8 shadow-lg border border-blue-500/20"
            style={{ background: "rgba(15, 23, 42, 0.6)" }}
          >
            <p className="text-gray-400 text-sm uppercase tracking-wide mb-2">Active Investments</p>
            <p className="text-3xl sm:text-4xl font-bold text-cyan-400">{activeInvestments}</p>
            <p className="text-gray-400 text-sm mt-4">
              {investments.length > 0
                ? `${investments.length} total ${investments.length === 1 ? "investment" : "investments"}`
                : "No investments yet"}
            </p>
          </div>
        </section>

        {/* New Investment Button */}
        <section className="mb-12">
          <Link
            href="/invest"
            className="inline-block px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)" }}
          >
            + New Investment
          </Link>
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
