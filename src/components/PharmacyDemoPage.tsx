// src/components/PharmacyDemoPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type DemoToken = {
  token: string;
  url: string;
  patient: string;
  diagnosis: string;
  expiresAt: string;
};

const PharmacyDemoPage: React.FC = () => {
  const navigate = useNavigate();
  const [demoTokens, setDemoTokens] = useState<DemoToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [customToken, setCustomToken] = useState('');

  useEffect(() => {
    fetchDemoTokens();
  }, []);

  const fetchDemoTokens = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/api/pharmacy/demo-tokens`
      );

      if (response.ok) {
        const data = await response.json();
        setDemoTokens(data.demo_tokens || []);
      }
    } catch (err) {
      console.error('Error fetching demo tokens:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPrescription = (token: string) => {
    navigate(`/pharmacy/${token}`);
  };

  const handleCustomToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (customToken.trim()) {
      navigate(`/pharmacy/${customToken.trim()}`);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Copied: ${text}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-100 rounded-full mb-4">
              <span className="text-4xl">💊</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-3">
              MedSight Pharmacy Portal - Demo
            </h1>
            <p className="text-lg text-slate-600 mb-2">
              Quick access to demo prescriptions for presentations
            </p>
            <p className="text-sm text-slate-500">
              Click any demo token below or enter a custom token to view prescriptions
            </p>
          </div>
        </div>

        {/* Custom Token Entry */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Enter Custom Token</h2>
          <form onSubmit={handleCustomToken} className="flex gap-3">
            <input
              type="text"
              value={customToken}
              onChange={(e) => setCustomToken(e.target.value.toUpperCase())}
              placeholder="e.g., MS-RX-XXXXX or DEMO-001"
              className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-lg text-lg font-mono font-bold uppercase focus:border-teal-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!customToken.trim()}
              className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              View Prescription
            </button>
          </form>
        </div>

        {/* Demo Tokens List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Pre-Loaded Demo Prescriptions
            </h2>
            <span className="px-3 py-1 bg-teal-100 text-teal-800 text-sm font-bold rounded-full">
              {demoTokens.length} Available
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent mb-4"></div>
              <p className="text-slate-600 font-semibold">Loading demo tokens...</p>
            </div>
          ) : demoTokens.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 font-semibold mb-2">No demo tokens available</p>
              <p className="text-sm text-slate-500">Backend may not be running</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {demoTokens.map((demo, idx) => (
                <div
                  key={demo.token}
                  className="border-2 border-slate-200 hover:border-teal-400 rounded-xl p-5 transition cursor-pointer group"
                  onClick={() => handleViewPrescription(demo.token)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                          #{idx + 1}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition">
                          {demo.token}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(demo.token);
                          }}
                          className="px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition"
                        >
                          Copy
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-slate-500 font-semibold mb-1">Patient</p>
                          <p className="text-sm font-bold text-slate-700">{demo.patient}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-semibold mb-1">Diagnosis</p>
                          <p className="text-sm font-bold text-slate-700">{demo.diagnosis}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>URL:</span>
                        <code className="px-2 py-1 bg-slate-100 rounded font-mono text-[10px]">
                          {demo.url}
                        </code>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(demo.url);
                          }}
                          className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded transition"
                        >
                          Copy URL
                        </button>
                      </div>
                    </div>

                    <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition opacity-0 group-hover:opacity-100">
                      View →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gradient-to-r from-teal-50 to-blue-50 border-2 border-teal-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-teal-900 mb-3">Demo Instructions</h3>
          <div className="space-y-2 text-sm text-slate-700">
            <p className="flex items-start gap-2">
              <span className="text-teal-600 font-bold">1.</span>
              <span>Click any demo prescription above to instantly view the pharmacy portal</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-teal-600 font-bold">2.</span>
              <span>Or enter a custom token (from doctor's QR code) in the field above</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-teal-600 font-bold">3.</span>
              <span>Demo tokens never expire - perfect for presentations and testing</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-teal-600 font-bold">4.</span>
              <span>Create new prescriptions from the doctor dashboard to generate fresh tokens</span>
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition"
          >
            ← Back to Doctor Dashboard
          </button>
          <button
            onClick={() => navigate('/pharmacy')}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition"
          >
            Manual Token Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDemoPage;
