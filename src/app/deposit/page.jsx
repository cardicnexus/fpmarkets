"use client";
import { useState } from "react";
import QRCode from "react-qr-code";

export default function DepositPage() {
  const [proceeded, setProceeded] = useState(false);
  const [message, setMessage] = useState("");
  const btcAddress = "bc1qyec0m2eqy7dmflflqgc5amf6c60djqeu0z37m8";

  const handleProceed = () => { setProceeded(true); setMessage(""); };
  const handleCopy = () => { navigator.clipboard.writeText(btcAddress); setMessage("✅ BTC wallet address copied to clipboard!"); };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-gray-900/70 backdrop-blur-md shadow-2xl rounded-2xl p-10 border border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">FP Cash Deposit Portal</h1>
        {!proceeded ? (
          <div className="text-center">
            <p className="mb-4 text-gray-300">Before proceeding, please ensure you read and agree to our deposit terms and conditions below.</p>
            <div className="bg-gray-800 text-left p-4 rounded-xl text-sm mb-5 max-h-56 overflow-y-auto border border-gray-700">
              <p className="text-gray-400 mb-2"><strong>Terms & Conditions:</strong></p>
              <ul className="list-disc pl-6 space-y-2 text-gray-400">
                <li>Deposits are processed only to the official BTC wallet shown on this page.</li>
                <li>Crypto sent to the wrong address cannot be reversed or refunded.</li>
                <li>Confirmation usually takes between 15–45 minutes depending on the network speed.</li>
                <li>After sending your deposit, please provide the transaction ID on your dashboard or via support for confirmation.</li>
              </ul>
            </div>
            <button onClick={handleProceed} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 shadow-md">Proceed to Deposit</button>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-blue-400 mb-2">Step 1: Pay with Crypto via GCash</h2>
              <p className="text-gray-400 mb-4">Filipino users: click below to buy crypto via GCash (Coins.ph).</p>
              <a href="https://coins.ph/" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300">Pay with Crypto via GCash</a>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-blue-400 mb-2">Step 2: Send Crypto to Our BTC Wallet</h2>
              <div className="flex flex-col items-center space-y-4">
                <QRCode value={btcAddress} size={180} />
                <p className="text-gray-300 text-sm break-all">{btcAddress}</p>
                <button onClick={handleCopy} className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg text-sm">Copy Wallet Address</button>
                {message && <p className="text-green-400 text-sm mt-2">{message}</p>}
              </div>
            </div>
          </>
        )}
        <footer className="mt-10 text-xs text-gray-500 text-center border-t border-gray-700 pt-4">© 2025 FP Cash by Cardic Nexus. All Rights Reserved.</footer>
      </div>
    </main>
  );
}
