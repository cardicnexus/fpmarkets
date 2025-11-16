'use client';
import { useState } from 'react';

export default function WithdrawPage() {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('gcash');
  const [terms, setTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const paymentOptions = [
    { value: 'bank', label: '🏦 Bank Transfer' },
    { value: 'gcash', label: '📱 GCash' },
    { value: 'crypto', label: '🔗 Crypto' },
    { value: 'paymaya', label: '💳 PayMaya' },
    { value: 'card', label: '💳 Card' },
  ];

  // ✅ Add event type here
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!terms) {
      alert('Please accept Terms & Conditions');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #2e005f 0%, #1a4fbf 60%)',
      padding: '48px',
      boxSizing: 'border-box',
      color: '#fff',
      fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'
    }}>
      <div style={{
        width: '760px',
        maxWidth: '100%',
        display: 'flex',
        gap: '32px',
        alignItems: 'stretch'
      }}>
        <div style={{
          flex: 1,
          borderRadius: '14px',
          padding: '28px',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
          boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
          backdropFilter: 'blur(8px)'
        }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#fff' }}>Withdraw Funds</h2>
          <p style={{ marginTop: '8px', marginBottom: '20px', color: 'rgba(255,255,255,0.85)' }}>
            Choose how you'd like to receive funds.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
              <label style={{ fontWeight: 600, color: '#e8f0ff' }}>Amount</label>
              <input
                type='number'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder='e.g. 1000'
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(0,0,0,0.12)',
                  color: '#fff',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />

              <label style={{ fontWeight: 600, color: '#e8f0ff' }}>Payment Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(0,0,0,0.12)',
                  color: '#fff',
                  fontSize: '16px',
                  outline: 'none'
                }}
              >
                {paymentOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e8f0ff', fontSize: '14px' }}>
                <input type='checkbox' checked={terms} onChange={(e) => setTerms(e.target.checked)} style={{ transform: 'scale(1.1)' }} />
                I agree to the <a href='#' style={{ color: '#ffd966', textDecoration: 'underline' }}>Terms & Conditions</a>
              </label>

              <button type='submit' style={{
                marginTop: '8px',
                padding: '12px 16px',
                borderRadius: '10px',
                background: 'linear-gradient(90deg, #ffd700, #1a9bff)',
                color: '#071024',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(26,79,191,0.25)'
              }}>Withdraw</button>
            </form>
          ) : (
            <div style={{ padding: '18px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
              <strong style={{ color: '#ffd966' }}>Withdrawal submitted</strong>
              <div style={{ marginTop: '8px', color: 'rgba(255,255,255,0.9)' }}>Amount: {amount} • Method: {method}</div>
            </div>
          )}

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <a href='#' style={{ color: '#dbe9ff' }}>Contact Support</a>
            <a href='#' style={{ color: '#dbe9ff' }}>Report a Problem</a>
          </div>
        </div>

        <aside style={{
          width: '320px',
          borderRadius: '12px',
          padding: '20px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.04)'
        }}>
          <h4 style={{ margin: 0, color: '#fff', fontSize: '16px' }}>Notes</h4>
          <ul style={{ marginTop: '12px', paddingLeft: '18px', color: '#dbe9ff', lineHeight: '1.6' }}>
            <li>Withdrawals may take 1–3 business days for bank.</li>
            <li>GCash / PayMaya usually within 24 hours.</li>
            <li>Crypto withdrawals depend on network confirmations.</li>
          </ul>
          <div style={{ marginTop: '16px', padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.08)', color: '#fff' }}>
            Problems? <a href='#' style={{ color: '#ffd966', textDecoration: 'underline' }}>Contact Support</a>
          </div>
        </aside>
      </div>
    </div>
  );
}
