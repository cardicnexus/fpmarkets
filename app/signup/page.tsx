'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

/**
 * Sign-up flow:
 * - Call supabase.auth.signUp()
 * - If a session is returned (user is signed in immediately) -> upsert profile now.
 * - If session is null (email confirmation required) -> save pending profile to localStorage and prompt user to verify.
 * - The complete-profile page already auto-applies pending profile after sign-in.
 */

export default function SignUpPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('Philippines');
  const [currency, setCurrency] = useState('PHP');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // ✅ Add type for event here
  const handleContinue = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        setMessage(error.message || 'Signup failed');
        setLoading(false);
        return;
      }

      const payload = {
        full_name: fullName,
        nickname,
        phone,
        country: location,
        currency,
        timezone: 'Asia/Manila',
        completed: false
      };

      if (data?.session) {
        const userId = data.session.user.id;
        const { error: upsertErr } = await supabase.from('profiles').upsert({
          user_id: userId,
          ...payload,
          completed: true
        });

        if (upsertErr) {
          setMessage('Signup succeeded but saving profile failed: ' + upsertErr.message);
          setLoading(false);
          return;
        }

        router.push('/profile');
        return;
      }

      // Email confirmation flow
      try {
        const pending = { email, payload };
        localStorage.setItem('fp_pending_profile', JSON.stringify(pending));
        setMessage(
          'Signup initiated. Check your email to verify. After verification, sign in and we will finish your profile automatically.'
        );
        router.push('/complete-profile');
      } catch (e) {
        setMessage(
          'Signup created but could not save pending profile locally. Please save your details and return after verifying email.'
        );
      } finally {
        setLoading(false);
      }
    } catch (ex: any) {
      console.error('Unexpected signup error', ex);
      setMessage('Unexpected error: ' + (ex?.message || String(ex)));
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg,#12001f,#2b0054)',
        padding: '24px'
      }}
    >
      <form
        onSubmit={handleContinue}
        style={{
          width: '100%',
          maxWidth: 720,
          background: '#0b0d12',
          padding: 28,
          borderRadius: 12,
          color: '#fff',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
        }}
      >
        <h2 style={{ margin: 0, marginBottom: 12, fontSize: 20, fontWeight: 700, color: '#9fb8ff' }}>
          Create account & profile
        </h2>

        <div style={{ marginBottom: 10 }}>
          <label style={{ color: '#cfe1ff', fontSize: 13 }}>Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@gmail.com"
            style={{
              width: '100%',
              padding: 10,
              marginTop: 6,
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.04)',
              background: '#0e1014',
              color: '#fff'
            }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={{ color: '#cfe1ff', fontSize: 13 }}>Password</label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choose a secure password"
            style={{
              width: '100%',
              padding: 10,
              marginTop: 6,
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.04)',
              background: '#0e1014',
              color: '#fff'
            }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={{ color: '#cfe1ff', fontSize: 13 }}>Full name</label>
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Sola Gbadamosi"
            style={{
              width: '100%',
              padding: 10,
              marginTop: 6,
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.04)',
              background: '#0e1014',
              color: '#fff'
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ color: '#cfe1ff', fontSize: 13 }}>Nickname</label>
            <input
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="solagbada"
              style={{
                width: '100%',
                padding: 10,
                marginTop: 6,
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.04)',
                background: '#0e1014',
                color: '#fff'
              }}
            />
          </div>

          <div>
            <label style={{ color: '#cfe1ff', fontSize: 13 }}>Phone</label>
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+63 9XXXXXXXXX"
              style={{
                width: '100%',
                padding: 10,
                marginTop: 6,
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.04)',
                background: '#0e1014',
                color: '#fff'
              }}
            />
          </div>
        </div>

        <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ color: '#cfe1ff', fontSize: 13 }}>Location</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{
                width: '100%',
                padding: 10,
                marginTop: 6,
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.04)',
                background: '#0e1014',
                color: '#fff'
              }}
            />
          </div>

          <div>
            <label style={{ color: '#cfe1ff', fontSize: 13 }}>Currency</label>
            <input
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{
                width: '100%',
                padding: 10,
                marginTop: 6,
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.04)',
                background: '#0e1014',
                color: '#fff'
              }}
            />
          </div>
        </div>

        <div style={{ marginTop: 18, display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 18px',
              borderRadius: 10,
              border: 'none',
              fontWeight: 800,
              cursor: 'pointer',
              background: 'linear-gradient(90deg,#28a3ff 0%, #0a57d9 100%)',
              color: '#041025',
              boxShadow: '0 10px 30px rgba(10,87,217,0.25)'
            }}
          >
            {loading ? 'Creating account...' : 'Create account & continue'}
          </button>
          <a href="/signin" style={{ marginLeft: 'auto', color: '#9fb8ff', textDecoration: 'underline' }}>
            Already have an account? Sign in
          </a>
        </div>

        {message && <div style={{ marginTop: 12, color: '#ffd7d7' }}>{message}</div>}
      </form>
    </div>
  );
}
