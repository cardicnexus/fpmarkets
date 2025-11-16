'use client';'use client';

import React, { useState, useEffect } from 'react';

// === Type definition for your profile ===
type Profile = {
  full_name?: string | null;
  nickname?: string | null;
  // Add other fields your profile has here
};

// === Replace this with your actual API call / data fetching ===
async function getProfile(): Promise<Profile | null> {
  // Example placeholder
  return { full_name: 'John Doe', nickname: 'Johnny' };
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [inputValue, setInputValue] = useState('');

  // Fetch profile on mount
  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch((err) => console.error('Error fetching profile:', err));
  }, []);

  // Form submission handler with proper typing
  const handleContinue = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Example submission logic (replace with your API call)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage('Success!');
    } catch (err: any) {
      console.error('Submission error:', err);
      setMessage('Error submitting form.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', padding: 24 }}>
      {/* Profile Sidebar */}
      <div
        style={{
          flex: '0 0 260px',
          background: 'rgba(10,12,18,0.7)',
          borderRadius: 12,
          padding: 18,
          color: '#fff',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: '#1a2240',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            fontWeight: 700,
            color: '#9fb8ff',
          }}
        >
          {profile?.full_name
            ? profile.full_name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
            : 'U'}
        </div>
        <h3 style={{ marginTop: 12, marginBottom: 6, color: '#fff' }}>
          {profile?.full_name ?? 'Unknown'}
        </h3>
        <div style={{ color: '#9fb8ff', fontWeight: 700 }}>{profile?.nickname ?? ''}</div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleContinue} style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        <label style={{ fontWeight: 600, color: '#e8f0ff' }}>Example Input</label>
        <input
          type="text"
          placeholder="Type something..."
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
          style={{
            padding: '12px 14px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(0,0,0,0.12)',
            color: '#fff',
            fontSize: '16px',
            outline: 'none',
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 16px',
            borderRadius: '10px',
            background: 'linear-gradient(90deg, #28a3ff, #0a57d9)',
            color: '#fff',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(10,87,217,0.25)',
          }}
        >
          {loading ? 'Loading...' : 'Continue'}
        </button>

        {message && <div style={{ marginTop: 12, color: '#ffd7d7' }}>{message}</div>}
      </form>
    </div>
  );
}
