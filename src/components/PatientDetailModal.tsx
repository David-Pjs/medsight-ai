import React, { useState, useEffect } from 'react';

import {
  fetchPatientEncounters,
  fetchPatientMedications,
  checkPatientSafety,
  generatePatientSummary,
  type Patient
} from '../api/dorra';

interface PatientDetailModalProps {
  patient: Patient | null;
  onClose: () => void;
}

const PatientDetailModal: React.FC<PatientDetailModalProps> = ({ patient, onClose }) => {
  const [encounters, setEncounters] = useState<any[]>([]);
  const [medications, setMedications] = useState<any[]>([]);
  const [safetyAnalysis, setSafetyAnalysis] = useState<any>(null);
  const [aiSummary, setAiSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'medications' | 'encounters' | 'safety'>('overview');

  useEffect(() => {
    if (patient) {
      loadPatientData();
    }
  }, [patient]);

  const loadPatientData = async () => {
    if (!patient) return;

    try {
      setLoading(true);
      const [encountersData, medsData] = await Promise.all([
        fetchPatientEncounters(patient.id).catch(() => []),
        fetchPatientMedications(patient.id).catch(() => []),
      ]);

      setEncounters(encountersData);
      setMedications(medsData);

      // Load safety analysis
      try {
        const safety = await checkPatientSafety(patient.id);
        setSafetyAnalysis(safety);
      } catch (err) {
        console.error('Safety check failed:', err);
      }

      // Load AI summary
      try {
        const summary = await generatePatientSummary(patient.id);
        setAiSummary(summary);
      } catch (err) {
        console.error('AI summary failed:', err);
      }

    } catch (err) {
      console.error('Error loading patient data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!patient) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-sky-600 to-sky-700 px-6 py-5 flex items-center justify-between">
          <div className="text-white">
            <h2 className="text-xl font-bold">
              {patient.full_name || `${patient.first_name} ${patient.last_name}`}
            </h2>
            <p className="text-sky-100 text-sm mt-1">
              {patient.unique_id || `ID: ${patient.id}`} · {patient.age && `${patient.age} yrs ·`} {patient.gender}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 px-6">
          <div className="flex gap-1">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'medications', label: `Medications (${medications.length})` },
              { key: 'encounters', label: `Encounters (${encounters.length})` },
              { key: 'safety', label: 'Safety Analysis' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-3 text-sm font-semibold border-b-2 transition ${
                  activeTab === tab.key
                    ? 'border-sky-600 text-sky-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-sky-600 border-t-transparent"></div>
              <p className="text-sm text-slate-600 mt-4">Loading patient data...</p>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* AI Summary */}
                  {aiSummary?.success && (
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">🤖</span>
                        <h3 className="text-sm font-bold text-slate-900">AI-Powered Clinical Summary</h3>
                        <span className="ml-auto text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">
                          {aiSummary.source === 'ollama' ? 'Ollama AI' : 'MedSight AI'}
                        </span>
                      </div>
                      <div className="text-sm text-slate-700 whitespace-pre-wrap">
                        {aiSummary.summary}
                      </div>
                      {aiSummary.source === 'rule-based' && (
                        <div className="mt-3 text-xs text-purple-600 italic">
                          💡 Intelligent clinical analysis based on Nigerian medical guidelines
                        </div>
                      )}
                    </div>
                  )}

                  {/* Patient Info Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4">
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Demographics</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Age:</span>
                          <span className="font-semibold">{patient.age || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Gender:</span>
                          <span className="font-semibold">{patient.gender}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Phone:</span>
                          <span className="font-semibold">{patient.phone_number || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Email:</span>
                          <span className="font-semibold text-xs">{patient.email || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                      <h4 className="text-xs font-bold text-amber-800 uppercase mb-3">⚠️ Allergies</h4>
                      {patient.allergies && (Array.isArray(patient.allergies) ? patient.allergies.length > 0 : patient.allergies) ? (
                        <div className="space-y-1">
                          {(Array.isArray(patient.allergies) ? patient.allergies : [patient.allergies]).map((allergy, idx) => (
                            <div key={idx} className="bg-white px-3 py-2 rounded-lg text-sm font-semibold text-amber-900">
                              {allergy}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-amber-700">No known allergies documented</p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  {patient.address && (
                    <div className="bg-slate-50 rounded-xl p-4">
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Address</h4>
                      <p className="text-sm text-slate-700">{patient.address}</p>
                    </div>
                  )}

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                      <p className="text-2xl font-bold text-blue-600">{medications.length}</p>
                      <p className="text-xs text-slate-600">Active Medications</p>
                    </div>
                    <div className="text-center p-4 bg-emerald-50 rounded-xl">
                      <p className="text-2xl font-bold text-emerald-600">{encounters.length}</p>
                      <p className="text-xs text-slate-600">Encounters</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-xl">
                      <p className="text-2xl font-bold text-purple-600">
                        {safetyAnalysis?.riskScore || 'N/A'}
                      </p>
                      <p className="text-xs text-slate-600">Risk Score</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Medications Tab */}
              {activeTab === 'medications' && (
                <div className="space-y-3">
                  {medications.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      No medications on record
                    </div>
                  ) : (
                    medications.map((med, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-slate-900">{med.name}</h4>
                            <p className="text-sm text-slate-600 mt-1">
                              {med.dosage && `${med.dosage} · `}
                              {med.frequency && med.frequency}
                            </p>
                            {med.duration && (
                              <p className="text-xs text-slate-500 mt-1">Duration: {med.duration}</p>
                            )}
                          </div>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                            Active
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Encounters Tab */}
              {activeTab === 'encounters' && (
                <div className="space-y-3">
                  {encounters.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      No encounters on record
                    </div>
                  ) : (
                    encounters.map((enc, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-slate-900">
                            Encounter {enc.unique_id || enc.id}
                          </h4>
                          <span className="text-xs text-slate-500">
                            {new Date(enc.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {enc.diagnosis && (
                          <p className="text-sm text-slate-700"><strong>Diagnosis:</strong> {enc.diagnosis}</p>
                        )}
                        {enc.symptoms && (
                          <p className="text-sm text-slate-600 mt-1"><strong>Symptoms:</strong> {JSON.stringify(enc.symptoms)}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Safety Tab */}
              {activeTab === 'safety' && (
                <div className="space-y-4">
                  {safetyAnalysis ? (
                    <>
                      <div className={`p-5 rounded-xl border-2 ${
                        safetyAnalysis.riskScore === 'High' ? 'bg-red-50 border-red-200' :
                        safetyAnalysis.riskScore === 'Medium' ? 'bg-amber-50 border-amber-200' :
                        'bg-emerald-50 border-emerald-200'
                      }`}>
                        <h3 className="text-lg font-bold mb-2">
                          Risk Level: {safetyAnalysis.riskScore}
                        </h3>
                        <div className="text-sm whitespace-pre-wrap">
                          {safetyAnalysis.analysis}
                        </div>
                      </div>

                      {safetyAnalysis.recommendations && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                          <h4 className="font-bold text-blue-900 mb-2">Recommendations</h4>
                          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                            {safetyAnalysis.recommendations.map((rec: string, idx: number) => (
                              <li key={idx}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      Safety analysis not available
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetailModal;
