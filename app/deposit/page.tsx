'use client';

export default function DepositPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'linear-gradient(135deg, #1b0033 0%, #2b0054 40%, #12001f 100%)'
      }}
    >
      {/* Center Card */}
      <div style={{
        width: '100%',
        maxWidth: '760px',
        background: '#ffffff',
        borderRadius: '20px',
        padding: '28px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        border: '1px solid rgba(26,79,191,0.08)'
      }}>
        <h1 style={{ textAlign: 'center', color: '#1a4fbf', fontSize: '28px', margin: 0, fontWeight: 700 }}>
          Deposit Funds
        </h1>
        <p style={{ textAlign: 'center', color: '#475569', marginTop: '10px', marginBottom: '20px' }}>
          Select a payment option to fund your trading account.
        </p>

        <div style={{ display: 'grid', gap: '14px' }}>
          <div style={{ padding: '14px', background: '#f8fbff', borderRadius: '10px', border: '1px solid #e6f0ff', cursor: 'pointer' }}>
            <h3 style={{ margin: 0, color: '#0957d7', fontSize: '16px', fontWeight: 700 }}>Bank Transfer</h3>
            <p style={{ margin: '6px 0 0', color: '#6b7280', fontSize: '13px' }}>Secure direct deposit via bank transfer.</p>
          </div>

          <div style={{ padding: '14px', background: '#f8fbff', borderRadius: '10px', border: '1px solid #e6f0ff', cursor: 'pointer' }}>
            <h3 style={{ margin: 0, color: '#0957d7', fontSize: '16px', fontWeight: 700 }}>GCash</h3>
            <p style={{ margin: '6px 0 0', color: '#6b7280', fontSize: '13px' }}>Instant mobile deposit using GCash.</p>
          </div>

          <div style={{ padding: '14px', background: '#f8fbff', borderRadius: '10px', border: '1px solid #e6f0ff', cursor: 'pointer' }}>
            <h3 style={{ margin: 0, color: '#0957d7', fontSize: '16px', fontWeight: 700 }}>PayMaya</h3>
            <p style={{ margin: '6px 0 0', color: '#6b7280', fontSize: '13px' }}>Fast deposits via PayMaya wallet.</p>
          </div>

          <div style={{ padding: '14px', background: '#f8fbff', borderRadius: '10px', border: '1px solid #e6f0ff', cursor: 'pointer' }}>
            <h3 style={{ margin: 0, color: '#0957d7', fontSize: '16px', fontWeight: 700 }}>Crypto</h3>
            <p style={{ margin: '6px 0 0', color: '#6b7280', fontSize: '13px' }}>BTC, USDT, ETH deposits supported.</p>
          </div>

          <div style={{ padding: '14px', background: '#f8fbff', borderRadius: '10px', border: '1px solid #e6f0ff', cursor: 'pointer' }}>
            <h3 style={{ margin: 0, color: '#0957d7', fontSize: '16px', fontWeight: 700 }}>Debit / Credit Card</h3>
            <p style={{ margin: '6px 0 0', color: '#6b7280', fontSize: '13px' }}>Visa • Mastercard • Amex</p>
          </div>
        </div>

        <div style={{ marginTop: '22px', textAlign: 'center' }}>
          <a href="/support" style={{ color: '#0b61ff', fontWeight: 600, textDecoration: 'none', marginRight: '12px' }}>Contact Support</a>
          <a href="/report" style={{ color: '#0b61ff', fontWeight: 600, textDecoration: 'none', marginRight: '12px' }}>Report a Problem</a>
          <a href="/terms" style={{ color: '#6b7280', fontSize: '13px', textDecoration: 'none' }}>Terms &amp; Conditions</a>
        </div>
      </div>
    </div>
  );
}
