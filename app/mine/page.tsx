"use client";

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function MinePage() {
  const supabase = createClientComponentClient();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.log('Error fetching profile:', error.message);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) return <p className='text-white text-center mt-10'>Loading...</p>;
  if (!profile) return <p className='text-red-500 text-center mt-10'>Profile not found</p>;

  return (
    <div className="min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #1b0033 0%, #2b0054 40%, #12001f 100%)' }}>
      <div className="max-w-4xl mx-auto bg-[#1c1c2a]/90 p-10 rounded-xl text-white shadow-xl">
        <h2 className="text-sm text-gray-300 mb-2">MY ACCOUNT</h2>
        <h1 className="text-3xl font-bold mb-4">{profile.fullname}</h1>
        <p><span className="text-gray-400 uppercase">Nickname</span> {profile.nickname}</p>
        <p><span className="text-gray-400 uppercase">Coop ID</span> {profile.coop_id || '---'}</p>
        <p><span className="text-gray-400 uppercase">Location</span> {profile.location || profile.country}</p>
        <p><span className="text-gray-400 uppercase">Currency</span> {profile.currency || '₦ NGN'}</p>
        <p><span className="text-gray-400 uppercase">Phone</span> {profile.phone || '---'}</p>

        <div className="mt-6 text-3xl font-bold">Current balance: {profile.balance || '0.00'}</div>

        <div className="mt-8 flex space-x-4">
          <button className="px-6 py-3 bg-blue-500 rounded text-white font-bold hover:opacity-90">Deposit</button>
          <button className="px-6 py-3 bg-purple-600 rounded text-white font-bold hover:opacity-90">Invest</button>
          <button className="px-6 py-3 bg-indigo-500 rounded text-white font-bold hover:opacity-90">Team</button>
        </div>
      </div>
    </div>
  );
}
