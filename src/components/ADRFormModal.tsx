import React, { useState, useEffect } from 'react';
import { fetchPatients, createADRReport, type Patient } from '../api/dorra';

interface ADRFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ADRFormModal: React.FC<ADRFormModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    suspectedDrug: '',
    reaction: '',
    onset: '',
    severity: 'Mild',
    outcome: 'Unknown',
    seriousness: 'Non-serious',
    notes: '',
    reportedBy: 'Dr. Sola Adeyemi'
  });

  useEffect(() => {
    if (isOpen) {
      loadPatients();
    }
  }, [isOpen]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await fetchPatients();
      setPatients(data);
    } catch (err) {
      console.error('Error loading patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const patientId = e.target.value;
    const patient = patients.find(p => p.id.toString() === patientId);

    setFormData({
      ...formData,
      patientId,
      patientName: patient ? `${patient.first_name} ${patient.last_name}` : ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.patientId || !formData.suspectedDrug || !formData.reaction) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      await createADRReport({
        patientId: parseInt(formData.patientId),
        patientName: formData.patientName,
        suspectedDrug: formData.suspectedDrug,
        reaction: formData.reaction,
        onset: formData.onset,
        severity: formData.severity,
        outcome: formData.outcome,
        seriousness: formData.seriousness,
        notes: formData.notes,
        reportedBy: formData.reportedBy
      });

      // Reset form
      setFormData({
        patientId: '',
        patientName: '',
        suspectedDrug: '',
        reaction: '',
        onset: '',
        severity: 'Mild',
        outcome: 'Unknown',
        seriousness: 'Non-serious',
        notes: '',
        reportedBy: 'Dr. Sola Adeyemi'
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit ADR report');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Report Adverse Drug Reaction</h2>
            <p className="text-xs text-slate-500">Quick 2-minute ADR reporting for pharmacovigilance</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Patient Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1">
              Patient <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.patientId}
              onChange={handlePatientChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            >
              <option value="">Select patient...</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.full_name || `${p.first_name} ${p.last_name}`} - {p.unique_id || `ID: ${p.id}`}
                </option>
              ))}
            </select>
          </div>

          {/* Suspected Drug */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1">
              Suspected Drug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.suspectedDrug}
              onChange={(e) => setFormData({ ...formData, suspectedDrug: e.target.value })}
              placeholder="e.g., Amoxicillin, Metformin"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          {/* Reaction */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1">
              Adverse Reaction <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.reaction}
              onChange={(e) => setFormData({ ...formData, reaction: e.target.value })}
              placeholder="Describe the adverse reaction..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          {/* Date of Onset */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1">
              Date of Onset
            </label>
            <input
              type="date"
              value={formData.onset}
              onChange={(e) => setFormData({ ...formData, onset: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Row: Severity & Seriousness */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">
                Severity
              </label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">
                Seriousness
              </label>
              <select
                value={formData.seriousness}
                onChange={(e) => setFormData({ ...formData, seriousness: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="Non-serious">Non-serious</option>
                <option value="Serious">Serious</option>
              </select>
            </div>
          </div>

          {/* Outcome */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1">
              Outcome
            </label>
            <select
              value={formData.outcome}
              onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="Unknown">Unknown</option>
              <option value="Recovered">Recovered</option>
              <option value="Recovering">Recovering</option>
              <option value="Continuing">Continuing</option>
              <option value="Fatal">Fatal</option>
            </select>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1">
              Clinical Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional clinical information, treatment given, etc."
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Reported By */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1">
              Reported By
            </label>
            <input
              type="text"
              value={formData.reportedBy}
              onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || loading}
              className="flex-1 px-4 py-2.5 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit ADR Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ADRFormModal;
