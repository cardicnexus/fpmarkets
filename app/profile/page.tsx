'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) {
        router.push('/signin');
        return;
      }
      const { data, error } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
      if (error) {
        console.error(error);
      } else if (mounted) {
        setProfile(data);
      }
      setLoading(false);
    };
    load();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>Loading…</div>;

  if (!profile) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'#0b1020', padding:24, borderRadius:12, color:'#fff', maxWidth:720 }}>
        <p>No profile found. <a href='/complete-profile' style={{ color:'#28a3ff' }}>Complete profile</a></p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24, background: '#07030a' }}>
      <div style={{ width:'100%', maxWidth:900, display:'flex', gap:20 }}>
        <div style={{ flex:'0 0 260px', background:'rgba(10,12,18,0.7)', borderRadius:12, padding:18, color:'#fff', boxShadow:'0 20px 60px rgba(0,0,0,0.6)' }}>
          <div style={{ width:72, height:72, borderRadius:999, background:'#1a2240', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:700, color:'#9fb8ff' }}>
            {profile.full_name ? profile.full_name.split(' ').map(n => n[0]).slice(0,2).join('') : 'U'}
          </div>
          <h3 style={{ marginTop:12, marginBottom:6, color:'#fff' }}>{profile.full_name}</h3>
          <div style={{ color:'#9fb8ff', fontWeight:700 }}>{profile.nickname}</div>
          <div style={{ marginTop:12, color:'#9fb8ff' }}>{profile.country} • {profile.currency}</div>
        </div>

        <div style={{ flex:1, background:'rgba(255,255,255,0.02)', borderRadius:12, padding:18, color:'#e6eefc' }}>
          <h2 style={{ marginTop:0, color:'#9fb8ff' }}>{profile.full_name}</h2>
          <p style={{ color:'#bfcbe9' }}>{profile.nickname} • {profile.country} • {profile.currency}</p>

          <div style={{ marginTop:16, color:'#e6eefc' }}>
            <div><strong>Phone:</strong> {profile.phone}</div>
            <div style={{ marginTop:8 }}><strong>Timezone:</strong> {profile.timezone}</div>
            <div style={{ marginTop:8 }}><strong>Profile completed:</strong> {profile.completed ? 'Yes' : 'No'}</div>
          </div>

          <div style={{ marginTop:20, display:'flex', gap:12 }}>
            <a href='/complete-profile' style={{ padding:'10px 14px', background:'#0b2a66', color:'#fff', borderRadius:8, textDecoration:'none' }}>Edit Profile</a>
            <button onClick={async ()=>{ await supabase.auth.signOut(); router.push('/signin'); }} style={{ padding:'10px 14px', background:'#ffd700', borderRadius:8, border:'none', cursor:'pointer' }}>Sign out</button>
          </div>
        </div>
      </div>
    </div>
  );
}
