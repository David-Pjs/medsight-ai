// src/components/PharmacistView.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

/**
 * PharmacistView: Public prescription view for external pharmacists
 *
 * NO LOGIN REQUIRED - Token-based access
 *
 * WORKFLOW:
 * 1. Pharmacist receives QR code or token from patient
 * 2. Scans QR or navigates to /pharmacy/:token
 * 3. Sees read-only prescription details:
 *    - Patient initials (privacy)
 *    - Age, gender
 *    - Allergies (prominent warning)
 *    - Current medications with dosage
 *    - Encounter date
 * 4. Dispenses medication accordingly
 *
 * SECURITY:
 * - Tokens expire after 24-48 hours
 * - Doctors can revoke tokens
 * - No patient identifiable info (only initials)
 * - Read-only access
 */

type PrescriptionData = {
  patient: {
    initials: string;
    age: string;
    gender: string;
    allergies: string[];
  };
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  safetyWarnings: string[];
  encounterDate: string;
  prescribedBy: string;
  tokenExpiry: string;
};

const PharmacistView: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prescription, setPrescription] = useState<PrescriptionData | null>(null);
  const [tokenInput, setTokenInput] = useState('');

  useEffect(() => {
    if (token) {
      fetchPrescription(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchPrescription = async (tokenValue: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/api/pharmacy/prescription/${tokenValue}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Invalid or expired token. Please ask the patient for a new QR code.');
        } else if (response.status === 410) {
          throw new Error('This prescription token has been revoked by the doctor.');
        } else {
          throw new Error('Failed to fetch prescription. Please try again.');
        }
      }

      const data = await response.json();
      setPrescription(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setPrescription(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenInput.trim()) {
      navigate(`/pharmacy/${tokenInput.trim()}`);
    }
  };

  // Token entry screen
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
              <span className="text-3xl">💊</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">MedSight Pharmacy Portal</h1>
            <p className="text-sm text-slate-600">Enter prescription token to view patient medications</p>
          </div>

          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Prescription Token
              </label>
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value.toUpperCase())}
                placeholder="MS-RX-XXXXX"
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 text-center text-lg font-mono font-bold uppercase focus:border-teal-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={!tokenInput.trim()}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              View Prescription
            </button>
          </form>

          <div className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
            <p className="text-xs text-teal-800">
              <strong>Note:</strong> This token is provided by the patient from their doctor.
              No login required. Token expires after 24-48 hours.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent mb-4"></div>
          <p className="text-slate-600 font-semibold">Loading prescription...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Unable to Load Prescription</h2>
            <p className="text-sm text-slate-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/pharmacy')}
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              Try Another Token
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Prescription view
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Prescription Details</h1>
              <p className="text-sm text-slate-600">Token: <span className="font-mono font-bold">{token}</span></p>
            </div>
            <button
              onClick={() => navigate('/pharmacy')}
              className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
            >
              ← Back
            </button>
          </div>
        </div>

        {prescription && (
          <>
            {/* Patient Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Patient Information</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-slate-500 font-semibold mb-1">Patient</p>
                  <p className="text-xl font-bold text-slate-900">{prescription.patient.initials}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold mb-1">Age</p>
                  <p className="text-lg font-semibold text-slate-700">{prescription.patient.age} years</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold mb-1">Gender</p>
                  <p className="text-lg font-semibold text-slate-700">{prescription.patient.gender}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold mb-1">Encounter Date</p>
                  <p className="text-lg font-semibold text-slate-700">{prescription.encounterDate}</p>
                </div>
              </div>
            </div>

            {/* Allergy Warnings */}
            {prescription.patient.allergies && prescription.patient.allergies.length > 0 && (
              <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">⚠️</span>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-red-900 mb-2">ALLERGY ALERT</h2>
                    <p className="text-sm text-red-800 mb-3">
                      <strong>Patient is allergic to:</strong>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {prescription.patient.allergies.map((allergy, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-red-200 text-red-900 font-bold text-sm rounded-full border-2 border-red-400"
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Safety Warnings */}
            {prescription.safetyWarnings && prescription.safetyWarnings.length > 0 && (
              <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 mb-6">
                <h2 className="text-lg font-bold text-amber-900 mb-3">⚠️ Safety Warnings</h2>
                <ul className="list-disc ml-5 space-y-1">
                  {prescription.safetyWarnings.map((warning, idx) => (
                    <li key={idx} className="text-sm text-amber-800 font-medium">{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Diagnosis */}
            {(prescription as any).diagnosis && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
                <h2 className="text-lg font-bold text-blue-900 mb-2">📋 Diagnosis</h2>
                <p className="text-sm text-blue-800 font-medium">{(prescription as any).diagnosis}</p>
              </div>
            )}

            {/* Prescription Text / Medications */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">💊 Prescription Instructions</h2>

              {/* Show prescription text if available */}
              {(prescription as any).prescriptionText ? (
                <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-4 mb-4">
                  <pre className="text-sm text-slate-800 whitespace-pre-wrap font-sans">{(prescription as any).prescriptionText}</pre>
                </div>
              ) : null}

              {/* Show structured medications if available */}
              {prescription.medications && prescription.medications.length > 0 && (
                <div className="space-y-4">
                  {prescription.medications.map((med, idx) => (
                    <div key={idx} className="border-2 border-slate-200 rounded-xl p-4 hover:border-teal-300 transition">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold text-slate-900">{med.name}</h3>
                        <span className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-bold rounded-full">
                          #{idx + 1}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-slate-500 font-semibold mb-1">Dosage</p>
                          <p className="font-bold text-slate-700">{med.dosage}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-semibold mb-1">Frequency</p>
                          <p className="font-bold text-slate-700">{med.frequency}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-semibold mb-1">Duration</p>
                          <p className="font-bold text-slate-700">{med.duration}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Notes */}
            {(prescription as any).notes && (
              <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 mb-6">
                <h2 className="text-lg font-bold text-slate-900 mb-2">📝 Additional Notes</h2>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{(prescription as any).notes}</p>
              </div>
            )}

            {/* Footer Info */}
            <div className="bg-slate-100 rounded-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-500 font-semibold mb-1">Prescribed By</p>
                  <p className="font-bold text-slate-700">{prescription.prescribedBy}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold mb-1">Token Valid Until</p>
                  <p className="font-bold text-slate-700">{new Date(prescription.tokenExpiry).toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-300">
                <p className="text-xs text-slate-600">
                  <strong>Privacy Notice:</strong> This prescription is time-limited and read-only.
                  Patient identity is protected. Verify all medications against allergies before dispensing.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PharmacistView;
