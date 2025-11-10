import React from 'react';

const Deposit = () => {
  const copyWallet = () => {
    const wallet = document.getElementById("walletAddress").innerText;
    navigator.clipboard.writeText(wallet).then(() => alert("Wallet address copied!"));
  };

  return (
    <div style={{
      maxWidth: '700px',
      margin: '40px auto',
      background: 'linear-gradient(145deg, #2b0f4a, #30185e)',
      padding: '30px',
      borderRadius: '15px',
      boxShadow: '0 5px 20px rgba(0,0,0,0.5)',
      color: '#fff',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{textAlign: 'center', color: '#6c63ff', marginBottom: '30px'}}>FP Market</h1>
      <p style={{textAlign:'center', color:'#ccc', marginBottom:'40px'}}>Pay with Crypto via GCash</p>

      <div style={{marginBottom:'30px', background:'rgba(255,255,255,0.05)', padding:'20px', borderRadius:'10px'}}>
        <h2 style={{color:'#9fa8ff', marginBottom:'10px'}}>Step 1: Pay with Crypto via GCash</h2>
        <p>Filipino users: click the button below to go to Coins.ph and buy crypto using GCash.</p>
        <a href="https://coins.ph/" target="_blank" rel="noreferrer" 
           style={{
             padding:'12px 20px', borderRadius:'8px', background:'#6c63ff', color:'#fff',
             fontWeight:'bold', textDecoration:'none', display:'inline-block', marginTop:'10px'
           }}>Pay with Crypto via GCash</a>
      </div>

      <div style={{marginBottom:'30px', background:'rgba(255,255,255,0.05)', padding:'20px', borderRadius:'10px'}}>
        <h2 style={{color:'#9fa8ff', marginBottom:'10px'}}>Step 2: Send Crypto to Our Wallet</h2>
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=TRC20:TXxAMPLEADDRESS12345" 
             alt="Wallet QR" style={{display:'block', margin:'15px auto', width:'250px', height:'250px'}} />
        <p id="walletAddress" style={{textAlign:'center', fontWeight:'bold', marginTop:'10px', color:'#9fa8ff'}}>
          TXxAMPLEADDRESS12345
        </p>
        <button onClick={copyWallet} style={{
          padding:'12px 20px', borderRadius:'8px', background:'#6c63ff', color:'#fff',
          fontWeight:'bold', cursor:'pointer', display:'inline-block', marginTop:'10px'
        }}>Copy Wallet Address</button>
      </div>
    </div>
  );
};

export default Deposit;
