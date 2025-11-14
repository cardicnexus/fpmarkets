"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function CompleteProfilePage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [userData, setUserData] = useState({
    fullname: "",
    nickname: "",
    phone: "",
    country: "Philippines",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkPendingProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profile) {
        router.push("/");
      } else {
        const pending = localStorage.getItem("pendingProfile");
        if (pending) setUserData(JSON.parse(pending));
      }
    };

    checkPendingProfile();
  }, [supabase, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    const { error: upsertError } = await supabase.from("profiles").upsert({
      user_id: user.id,
      fullname: userData.fullname,
      nickname: userData.nickname,
      phone: userData.phone,
      country: userData.country,
    });

    if (upsertError) {
      setError(upsertError.message);
      setLoading(false);
      return;
    }

    localStorage.removeItem("pendingProfile");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{
      background: "linear-gradient(135deg, #1b0033 0%, #2b0054 40%, #12001f 100%)",
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{
        position: "absolute",
        width: 300,
        height: 300,
        background: "radial-gradient(circle, rgba(0,200,255,0.3), transparent)",
        borderRadius: "50%",
        top: -50,
        left: -50,
        filter: "blur(100px)"
      }} />
      <div style={{
        position: "absolute",
        width: 400,
        height: 400,
        background: "radial-gradient(circle, rgba(255,0,255,0.25), transparent)",
        borderRadius: "50%",
        bottom: -100,
        right: -100,
        filter: "blur(150px)"
      }} />

      <div className="bg-[#1c1c2a]/90 p-10 rounded-xl w-full max-w-md z-10 shadow-xl">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Complete Your Profile</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={userData.fullname}
            onChange={handleChange}
            className="w-full p-3 rounded bg-[#2c2c3c] text-white placeholder-gray-400 focus:outline-none"
            required
          />
          <input
            type="text"
            name="nickname"
            placeholder="Nickname"
            value={userData.nickname}
            onChange={handleChange}
            className="w-full p-3 rounded bg-[#2c2c3c] text-white placeholder-gray-400 focus:outline-none"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={userData.phone}
            onChange={handleChange}
            className="w-full p-3 rounded bg-[#2c2c3c] text-white placeholder-gray-400 focus:outline-none"
          />
          <select
            name="country"
            value={userData.country}
            onChange={handleChange}
            className="w-full p-3 rounded bg-[#2c2c3c] text-white focus:outline-none"
          >
            <option value="Philippines">Philippines</option>
            <option value="Nigeria">Nigeria</option>
            <option value="USA">USA</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 rounded bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold hover:opacity-90 transition"
          >
            {loading ? "Saving..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
