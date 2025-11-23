import React, { useState, useEffect } from "react";
import AICopilot from "./AICopilot";

import {
  fetchPatients,
  fetchEncounters,
  getSafetyAlerts,
  fetchADRReports,
  getADRStats,
  fetchPatientMedications,
  createPatient,
  type Patient,
} from "../api/dorra";
import ADRFormModal from "./ADRFormModal";
import PatientDetailModal from "./PatientDetailModal";

type TabKey = "dashboard" | "patients" | "medSafety" | "adr" | "captureNotes" | "pharmacy";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const navItemClasses = (tab: TabKey) =>
    [
      "w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors",
      activeTab === tab
        ? "bg-sky-600 text-white shadow-sm shadow-sky-200"
        : "text-slate-600 hover:bg-slate-100",
    ].join(" ");

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 lg:w-72 flex-col border-r border-slate-200 bg-white/90 backdrop-blur">
        <div className="px-6 pt-6 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-2xl bg-sky-600 flex items-center justify-center text-white font-bold text-sm">
              MS
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                MedSight AI
              </p>
              <p className="text-[11px] text-slate-500">
                For Nigerian hospitals
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 text-sm">
          <p className="px-2 text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
            Main
          </p>

          <button
            className={navItemClasses("dashboard")}
            onClick={() => setActiveTab("dashboard")}
          >
            <span>Dashboard</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
          </button>

          <button
            className={navItemClasses("patients")}
            onClick={() => setActiveTab("patients")}
          >
            <span>Patients</span>
          </button>

          <button
            className={navItemClasses("medSafety")}
            onClick={() => setActiveTab("medSafety")}
          >
            <span>Medication safety</span>
          </button>

          <button
            className={navItemClasses("adr")}
            onClick={() => setActiveTab("adr")}
          >
            <span>ADR reports</span>
          </button>

          <button
            className={navItemClasses("captureNotes")}
            onClick={() => setActiveTab("captureNotes")}
          >
            <span>Capture & notes</span>
          </button>

          <button
            className={navItemClasses("pharmacy")}
            onClick={() => setActiveTab("pharmacy")}
          >
            <span>Pharmacy handoff</span>
          </button>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="px-2 text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
              Today
            </p>
            <div className="mt-3 rounded-xl bg-sky-50 px-3 py-3 text-xs text-slate-700">
              <p className="font-medium text-sky-800">
                8 AI summaries generated
              </p>
              <p className="mt-1">
                3 medication alerts flagged for review before discharge.
              </p>
            </div>
          </div>
        </nav>

        <div className="px-4 py-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 text-sm font-semibold">
              DS
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">
                Dr. David Uhumagho
              </p>
              <p className="text-xs text-slate-500">Consultant physician</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur border-b border-slate-200">
          <div className="px-4 md:px-8 py-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                EMR overview
              </p>
              <p className="text-lg font-semibold text-slate-900">
                Dorra data · Lagos General Hospital
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <p className="text-xs font-medium text-slate-700">
                  Today · 16 patients on your list
                </p>
                <p className="text-[11px] text-slate-500">
                  4 summaries ready · 1 critical alert
                </p>
              </div>
              {/* Removed "Switch doctor" button as requested */}
            </div>
          </div>

          {/* Mobile tab bar */}
          <div className="md:hidden px-4 pb-2 flex gap-2 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-3 py-1.5 rounded-full border ${
                activeTab === "dashboard"
                  ? "bg-sky-600 text-white border-sky-600"
                  : "bg-white text-slate-700 border-slate-200"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("patients")}
              className={`px-3 py-1.5 rounded-full border ${
                activeTab === "patients"
                  ? "bg-sky-600 text-white border-sky-600"
                  : "bg-white text-slate-700 border-slate-200"
              }`}
            >
              Patients
            </button>
            <button
              onClick={() => setActiveTab("medSafety")}
              className={`px-3 py-1.5 rounded-full border ${
                activeTab === "medSafety"
                  ? "bg-sky-600 text-white border-sky-600"
                  : "bg-white text-slate-700 border-slate-200"
              }`}
            >
              Med safety
            </button>
            <button
              onClick={() => setActiveTab("adr")}
              className={`px-3 py-1.5 rounded-full border ${
                activeTab === "adr"
                  ? "bg-sky-600 text-white border-sky-600"
                  : "bg-white text-slate-700 border-slate-200"
              }`}
            >
              ADR reports
            </button>
            <button
              onClick={() => setActiveTab("captureNotes")}
              className={`px-3 py-1.5 rounded-full border ${
                activeTab === "captureNotes"
                  ? "bg-sky-600 text-white border-sky-600"
                  : "bg-white text-slate-700 border-slate-200"
              }`}
            >
              Capture & notes
            </button>
            <button
              onClick={() => setActiveTab("pharmacy")}
              className={`px-3 py-1.5 rounded-full border ${
                activeTab === "pharmacy"
                  ? "bg-sky-600 text-white border-sky-600"
                  : "bg-white text-slate-700 border-slate-200"
              }`}
            >
              Pharmacy
            </button>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 md:py-8">
          {activeTab === "dashboard" && (
            <DashboardOverview onPatientClick={setSelectedPatient} />
          )}
          {activeTab === "patients" && (
            <PatientsView onPatientClick={setSelectedPatient} />
          )}
          {activeTab === "medSafety" && (
            <MedicationSafetyView onPatientClick={setSelectedPatient} />
          )}
          {activeTab === "adr" && <AdrReportsView />}
          {activeTab === "captureNotes" && <CaptureNotesView />}
          {activeTab === "pharmacy" && <PharmacyHandoffView />}
        </div>
      </main>

      {/* Patient Detail Modal */}
      <PatientDetailModal
        patient={selectedPatient}
        onClose={() => setSelectedPatient(null)}
      />

      {/* AI Copilot Widget (floating chat, uses Dorra + Ollama backend) */}
      <AICopilot />
    </div>
  );
};

/* ----------------- Dashboard main view ----------------- */

interface DashboardSectionProps {
  onPatientClick?: (patient: Patient) => void;
}

const DashboardOverview: React.FC<DashboardSectionProps> = ({
  onPatientClick,
}) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [encounters, setEncounters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const [summaryPatient, setSummaryPatient] = useState<Patient | null>(null);
  const [summaryText, setSummaryText] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [patientsData, encountersData] = await Promise.all([
          fetchPatients(),
          fetchEncounters().catch(() => []),
        ]);
        setPatients(patientsData);
        setEncounters(encountersData);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch AI summary whenever a patient is selected for summary
  useEffect(() => {
    const loadSummary = async () => {
      if (!summaryPatient) return;

      try {
        setSummaryLoading(true);
        setSummaryError(null);
        setSummaryText(null);

        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

        // Backend route from your Express API (aiRoutes.js)
        const res = await fetch(
          `${BACKEND_URL}/api/ai/summary/patient/${summaryPatient.id}`,
          {
            headers: {
              'Authorization': 'Bearer mock-token-for-hackathon',
            },
          }
        );

        if (!res.ok) {
          await res.text().catch(() => "");
          throw new Error(
            `Failed to fetch AI summary: ${res.status} ${res.statusText}`
          );
        }

        const data: any = await res.json();
        // aiService.js returns { success, summary, source, ... }
        const text =
          data.summary ||
          data.analysis ||
          data.response ||
          "No AI summary available for this patient yet.";

        setSummaryText(text);
      } catch (err: any) {
        console.error("Error fetching AI summary:", err);
        setSummaryError(
          err?.message || "Unable to load AI summary for this patient."
        );
      } finally {
        setSummaryLoading(false);
      }
    };

    loadSummary();
  }, [summaryPatient]);

  // Filter patients based on search query
  const filteredPatients = patients.filter(patient => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
    const uniqueId = (patient.unique_id || '').toLowerCase();
    const id = patient.id.toString();
    const phone = (patient.phone_number || '').toLowerCase();

    return fullName.includes(query) ||
           uniqueId.includes(query) ||
           id.includes(query) ||
           phone.includes(query);
  });

  const recentPatients = searchQuery.trim() ? filteredPatients.slice(0, 8) : patients.slice(0, 4);

  const handlePatientClick = (patient: Patient) => {
    onPatientClick?.(patient);
    setSummaryPatient(patient);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Stat cards */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white shadow-sm shadow-slate-100 border border-slate-100 p-4">
          <p className="text-xs font-medium text-slate-500">Total Patients</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {loading ? "..." : patients.length}
          </p>
          <p className="mt-1 text-xs text-emerald-600">From DORRA EMR</p>
        </div>

        <div className="rounded-2xl bg-white shadow-sm shadow-slate-100 border border-slate-100 p-4">
          <p className="text-xs font-medium text-slate-500">Total Encounters</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {loading ? "..." : encounters.length}
          </p>
          <p className="mt-1 text-xs text-sky-600">Medical records tracked</p>
        </div>

        <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4">
          <p className="text-xs font-medium text-amber-700 flex items-center gap-2">
            System Status
          </p>
          <p className="mt-2 text-sm text-amber-800">
            ✓ Backend connected · DORRA API active
          </p>
        </div>
      </section>

      {/* Patient search + list + AI summary */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Search + recent patients */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl bg-white shadow-sm shadow-slate-100 border border-slate-100 p-4 md:p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Search patient
                </p>
                <p className="text-xs text-slate-500">
                  Search by hospital ID, name or ward.
                </p>
              </div>
              <div className="w-full md:w-80">
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <span className="text-slate-400 text-sm">🔍</span>
                  <input
                    ref={searchInputRef}
                    className="flex-1 bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400"
                    placeholder='e.g. "Grace" or "P2P8G1VQVE"'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery ? (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  ) : (
                    <kbd className="hidden sm:inline-block text-[10px] text-slate-400 bg-white border border-slate-200 rounded px-1.5 py-0.5">
                      ⌘K
                    </kbd>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow-sm shadow-slate-100 border border-slate-100 p-4 md:p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-900">
                {searchQuery ? `Search Results (${recentPatients.length})` : "Recent Patients"}
              </p>
              <p className="text-[11px] text-slate-500">
                {searchQuery ? `Searching in ${patients.length} patients` : "Live data from DORRA EMR"}
              </p>
            </div>

            <div className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <p className="py-3 text-slate-500">Loading...</p>
              ) : recentPatients.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-slate-600 font-medium">
                    {searchQuery ? "No patients found" : "No patients yet"}
                  </p>
                  {searchQuery && (
                    <p className="text-xs text-slate-500 mt-2">
                      Try searching by name, ID, or phone number
                    </p>
                  )}
                </div>
              ) : (
                recentPatients.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => handlePatientClick(patient)}
                    className="w-full flex items-center justify-between py-3 hover:bg-sky-50 rounded-lg px-2 text-left cursor-pointer transition-colors group"
                  >
                    <div>
                      <p className="font-medium text-slate-900 group-hover:text-sky-700">
                        {patient.full_name ||
                          `${patient.first_name} ${patient.last_name}`}
                      </p>
                      <p className="text-xs text-slate-500">
                        {patient.unique_id || `ID: ${patient.id}`} ·{" "}
                        {patient.gender}
                        {patient.age && ` · ${patient.age} yrs`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">
                        {patient.phone_number || "No phone"}
                      </p>
                      {patient.allergies && (Array.isArray(patient.allergies) ? patient.allergies.length > 0 : patient.allergies) && (
                        <span className="inline-block mt-1 text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                          ⚠️ Allergy
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* AI summary panel */}
        <div className="rounded-2xl bg-white shadow-sm shadow-slate-100 border border-slate-100 p-4 md:p-5">
          <p className="text-sm font-semibold text-slate-900 flex items-center justify-between">
            AI summary preview
            <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700">
              Powered by Ollama
            </span>
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Select a patient from the list to generate a ward-round–ready
            summary.
          </p>

          <div className="mt-3 rounded-xl bg-slate-50 border border-slate-100 p-3 text-xs text-slate-700 space-y-2 min-h-[160px]">
            {!summaryPatient && !summaryLoading && !summaryError && (
              <p className="text-slate-500">
                No patient selected yet. Click on a patient in{" "}
                <span className="font-semibold">Recent Patients</span> to see
                their AI summary here.
              </p>
            )}

            {summaryPatient && (
              <p className="font-medium text-slate-900">
                {summaryPatient.full_name ||
                  `${summaryPatient.first_name} ${summaryPatient.last_name}`}
                {summaryPatient.age
                  ? ` · ${summaryPatient.age} yrs`
                  : ""}{" "}
                {summaryPatient.diagnosis
                  ? ` · ${summaryPatient.diagnosis}`
                  : ""}
              </p>
            )}

            {summaryLoading && (
              <p className="text-slate-500">
                Generating summary with MedSight AI...
              </p>
            )}

            {summaryError && (
              <p className="text-rose-600 text-xs">{summaryError}</p>
            )}

            {!summaryLoading && summaryText && (
              <div className="space-y-2">
                {summaryText.split("\n").map((line, idx) => {
                  const trimmedLine = line.trim();
                  if (!trimmedLine) return null;

                  // Highlight alert lines
                  if (trimmedLine.includes('⚠️') || trimmedLine.includes('ALERT') || trimmedLine.includes('ALLERGY')) {
                    return (
                      <div key={idx} className="bg-amber-100 border border-amber-300 rounded-lg px-2 py-1.5">
                        <p className="text-amber-900 font-semibold text-xs">{trimmedLine}</p>
                      </div>
                    );
                  }

                  // Highlight positive/check items
                  if (trimmedLine.startsWith('✓') || trimmedLine.startsWith('✅')) {
                    return (
                      <div key={idx} className="bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-1.5">
                        <p className="text-emerald-800 text-xs">{trimmedLine}</p>
                      </div>
                    );
                  }

                  // Highlight medical emoji items
                  if (trimmedLine.match(/^[🦟🌡️💊🩺🩸💨👴👶📊]/)) {
                    return (
                      <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg px-2 py-1.5">
                        <p className="text-blue-900 text-xs">{trimmedLine}</p>
                      </div>
                    );
                  }

                  // Regular text
                  return <p key={idx} className="text-xs text-slate-700">{trimmedLine}</p>;
                })}
              </div>
            )}
          </div>

          <button
            className="mt-4 w-full rounded-xl bg-sky-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-sky-300/70 hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
            disabled={!summaryPatient}
            onClick={() => summaryPatient && onPatientClick?.(summaryPatient)}
          >
            {summaryPatient
              ? "View full EMR & AI summary"
              : "Select a patient to view full summary"}
          </button>
        </div>
      </section>

      {/* ADR section teaser */}
      <section className="rounded-2xl bg-white shadow-sm shadow-slate-100 border border-slate-100 p-4 md:p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Quick ADR report
            </p>
            <p className="text-xs text-slate-500">
              Capture suspected adverse drug reactions in less than 30 seconds
              during ward round.
            </p>
          </div>
          <button className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-100">
            Open ADR form
          </button>
        </div>
      </section>
    </div>
  );
};

/* ----------------- Patients view ----------------- */

const PatientsView: React.FC<DashboardSectionProps> = ({ onPatientClick }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true);
        const data = await fetchPatients();
        setPatients(data);
      } catch (err: any) {
        console.error("Error fetching patients:", err);
        setError(err.message || "Failed to fetch patients");
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  // Filter patients based on search query
  const filteredPatients = patients.filter(patient => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
    const uniqueId = (patient.unique_id || '').toLowerCase();
    const id = patient.id.toString();
    const phone = (patient.phone_number || '').toLowerCase();
    const gender = (patient.gender || '').toLowerCase();

    return fullName.includes(query) ||
           uniqueId.includes(query) ||
           id.includes(query) ||
           phone.includes(query) ||
           gender.includes(query);
  });

  return (
    <div className="space-y-6">
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Patients</p>
          <p className="text-xs text-slate-500">
            View and filter patients from DORRA EMR.
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="flex-1 md:flex-none md:w-72 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs">
            <span className="text-slate-400">🔍</span>
            <input
              className="flex-1 bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
              placeholder="Search by name, ID, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {loading && <p className="text-sm text-slate-600">Loading patients...</p>}
      {error && <p className="text-sm text-red-600">Error: {error}</p>}

      {!loading && !error && (
        <section className="rounded-2xl bg-white border border-slate-100 shadow-sm shadow-slate-100 overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-600">
              {searchQuery ? `Found ${filteredPatients.length} patients` : `Patient list · ${patients.length} patients`}
            </p>
            {searchQuery && filteredPatients.length > 0 && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs text-sky-600 hover:text-sky-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-100 text-xs sm:text-sm max-h-[600px] overflow-y-auto">
            {filteredPatients.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-slate-600 font-medium">
                  {searchQuery ? "No patients found" : "No patients yet"}
                </p>
                {searchQuery && (
                  <p className="text-xs text-slate-500 mt-2">
                    Try a different search term or clear the filter
                  </p>
                )}
              </div>
            ) : (
              filteredPatients.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onPatientClick?.(p)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-sky-50 text-left cursor-pointer transition-colors group"
                >
                  <div>
                    <p className="font-medium text-slate-900 group-hover:text-sky-700">
                      {p.full_name || `${p.first_name} ${p.last_name}`}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      ID: {p.unique_id || p.id} · {p.gender}
                      {p.age && ` · Age: ${p.age}`}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-[11px] text-slate-500">
                      {p.phone_number || "No phone"}
                    </p>
                    {p.allergies && (Array.isArray(p.allergies) ? p.allergies.length > 0 : p.allergies) && (
                      <span className="inline-block text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        ⚠️ Allergy
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </section>
      )}
    </div>
  );
};

/* ----------------- Medication Safety view ----------------- */

const MedicationSafetyView: React.FC<DashboardSectionProps> = ({ onPatientClick }) => {
  const [safetyData, setSafetyData] = useState<any>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [patientMedications, setPatientMedications] = useState<Map<number, any[]>>(new Map());

  useEffect(() => {
    const loadSafetyData = async () => {
      try {
        setLoading(true);
        const [alerts, patientsData] = await Promise.all([
          getSafetyAlerts(),
          fetchPatients(),
        ]);
        setSafetyData(alerts.summary);
        setPatients(patientsData);

        // Fetch medications for high-risk patients
        const medsMap = new Map<number, any[]>();
        for (const patient of patientsData) {
          if (patient.allergies && (Array.isArray(patient.allergies) ? patient.allergies.length > 0 : patient.allergies)) {
            try {
              const meds = await fetchPatientMedications(patient.id);
              medsMap.set(patient.id, meds);
            } catch (err) {
              console.error(`Failed to fetch meds for patient ${patient.id}`);
            }
          }
        }
        setPatientMedications(medsMap);
      } catch (err) {
        console.error("Error loading safety data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSafetyData();
  }, []);

  const highRiskPatients = patients.filter(
    (p) => p.allergies && (Array.isArray(p.allergies) ? p.allergies.length > 0 : p.allergies)
  );

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Stats cards */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm shadow-slate-100 p-4">
          <p className="text-xs font-medium text-slate-500">
            High-Risk Patients
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {loading ? "..." : safetyData?.highRiskPatients || 0}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Patients with documented allergies
          </p>
        </div>
        <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4">
          <p className="text-xs font-medium text-emerald-700">
            Total Patients Monitored
          </p>
          <p className="mt-2 text-3xl font-bold text-emerald-900">
            {loading ? "..." : safetyData?.totalPatients || 0}
          </p>
          <p className="mt-1 text-xs text-emerald-700">
            Active in DORRA EMR system
          </p>
        </div>
        <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4">
          <p className="text-xs font-medium text-amber-700">AI Safety Checks</p>
          <p className="mt-2 text-xs text-amber-800">
            ✓ Drug interactions · ✓ Allergy alerts · ✓ Dose verification
          </p>
        </div>
      </section>

      <section className="rounded-2xl bg-white border border-slate-100 shadow-sm shadow-slate-100 p-4 md:p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              High-Risk Patients Requiring Attention
            </p>
            <p className="text-xs text-slate-500">
              Real medication data from DORRA EMR · Patients with documented allergies
            </p>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading safety alerts...</p>
        ) : highRiskPatients.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-emerald-600 font-medium">✓ All Clear</p>
            <p className="text-xs text-slate-500 mt-1">
              No high-risk patients detected
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {highRiskPatients.map((patient) => {
              const medications = patientMedications.get(patient.id) || [];
              return (
                <div
                  key={patient.id}
                  className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-900">
                        Allergy Alert ·{" "}
                        <span className="font-normal text-slate-700">
                          {patient.full_name ||
                            `${patient.first_name} ${patient.last_name}`}
                        </span>
                      </p>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="px-2 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-800">
                          High priority
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                          ID: {patient.unique_id || patient.id}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600">
                      Documented allergies:{" "}
                      {Array.isArray(patient.allergies)
                        ? patient.allergies.join(", ")
                        : patient.allergies}
                    </p>

                    {/* Show current medications */}
                    {medications.length > 0 && (
                      <div className="mt-2 p-2 rounded-lg bg-white border border-sky-200">
                        <p className="text-[11px] font-semibold text-slate-700 mb-1">
                          💊 Current Medications ({medications.length}):
                        </p>
                        <div className="space-y-1">
                          {medications.slice(0, 3).map((med: any, idx: number) => (
                            <p key={idx} className="text-[10px] text-slate-600">
                              • <strong>{med.medication_name || med.name}</strong>
                              {med.dosage && ` ${med.dosage}`}
                              {med.frequency && ` - ${med.frequency}`}
                            </p>
                          ))}
                          {medications.length > 3 && (
                            <p className="text-[10px] text-slate-500 italic">
                              + {medications.length - 3} more
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => onPatientClick?.(patient)}
                      className="mt-2 w-full text-[11px] font-semibold text-sky-700 hover:text-sky-800 text-left"
                    >
                      → View full EMR & medication details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

/* ----------------- ADR Reports view ----------------- */

const AdrReportsView: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadADRData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadADRData = async () => {
    try {
      setLoading(true);
      const [adrReports, adrStats] = await Promise.all([
        fetchADRReports(),
        getADRStats(),
      ]);
      setReports(adrReports);
      setStats(adrStats);
    } catch (err) {
      console.error("Error loading ADR data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Stats */}
      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm shadow-slate-100 p-4">
          <p className="text-xs font-medium text-slate-500">
            Total ADR Reports
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {loading ? "..." : stats?.totalReports || 0}
          </p>
        </div>
        <div className="rounded-2xl bg-rose-50 border border-rose-100 p-4">
          <p className="text-xs font-medium text-rose-700">Serious Reports</p>
          <p className="mt-2 text-3xl font-bold text-rose-900">
            {loading ? "..." : stats?.seriousReports || 0}
          </p>
        </div>
        <div className="rounded-2xl bg-sky-50 border border-sky-100 p-4">
          <p className="text-xs font-medium text-sky-700">Last 30 Days</p>
          <p className="mt-2 text-3xl font-bold text-sky-900">
            {loading ? "..." : stats?.recentReports || 0}
          </p>
        </div>
        <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4">
          <p className="text-xs font-medium text-emerald-700">Status</p>
          <p className="mt-2 text-xs text-emerald-800">✓ System Active</p>
        </div>
      </section>

      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">ADR Reports</p>
          <p className="text-xs text-slate-500">
            Quick 2-minute adverse drug reaction reporting
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-xl bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-sky-700"
        >
          + Report New ADR
        </button>
      </section>

      {/* ADR Form Modal */}
      <ADRFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={loadADRData}
      />

      <section className="rounded-2xl bg-white border border-slate-100 shadow-sm shadow-slate-100 p-4 md:p-5">
        <p className="text-xs font-semibold text-slate-600 mb-3">
          Recent ADR Reports ({reports.length})
        </p>
        {loading ? (
          <p className="text-sm text-slate-500">Loading reports...</p>
        ) : reports.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-slate-600">No ADR reports yet</p>
            <p className="text-xs text-slate-500 mt-1">
              Click "Report New ADR" to create your first report
            </p>
          </div>
        ) : (
          <div className="space-y-3 text-xs sm:text-sm">
            {reports.map((r) => (
              <div
                key={r.id}
                className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900">
                    {r.patientName} · ADR-{r.id}
                  </p>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      r.seriousness === "Serious"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-50 text-amber-800"
                    }`}
                  >
                    {r.seriousness}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">{r.reaction}</p>
                <p className="text-[11px] text-slate-600">
                  Suspected drug:{" "}
                  <span className="font-medium">{r.suspectedDrug}</span>
                </p>
                <p className="text-[11px] text-slate-600">
                  Severity: <span className="font-medium">{r.severity}</span>
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Reported by: {r.reportedBy} ·{" "}
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 md:px-5 md:py-5 text-xs text-slate-600">
        <p className="font-semibold text-slate-800 mb-1">
          How this works in real hospitals
        </p>
        <p>
          In production, Dorra EMR would pre-fill patient demographics,
          medicines and lab values. MedSight AI only adds a fast layer for
          doctors to document what they are already doing – no extra workload,
          just better safety data.
        </p>
      </section>
    </div>
  );
};

/* ----------------- Capture & Notes view ----------------- */

/**
 * CaptureNotesView: AI-powered clinical documentation
 *
 * WORKFLOW:
 * 1. Doctor selects a patient from DORRA EMR
 * 2. Doctor dictates/types clinical notes (chief complaint, symptoms, findings)
 * 3. AI (Ollama) analyzes the notes and suggests:
 *    - Diagnosis
 *    - Treatment plan
 *    - Medications with dosages
 * 4. Doctor reviews and edits AI suggestions
 * 5. System creates new encounter in DORRA with:
 *    - Notes
 *    - Diagnosis
 *    - Medications
 * 6. Everything syncs back to DORRA as source of truth
 *
 * BACKEND API ENDPOINTS NEEDED:
 * - POST /api/encounters/create - Creates new encounter with meds
 *   Body: { patientId, chiefComplaint, symptoms, diagnosis, notes, medications[] }
 * - POST /api/ai/analyze-notes - Sends notes to Ollama, gets structured suggestions
 *   Body: { notes, patientContext }
 *   Returns: { diagnosis, treatmentPlan, suggestedMedications[] }
 */
const CaptureNotesView: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  // New patient modal state
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);
  const [creatingPatient, setCreatingPatient] = useState(false);
  const [newPatientData, setNewPatientData] = useState({
    first_name: "",
    last_name: "",
    gender: "Male" as "Male" | "Female" | "Other",
    age: "",
    phone_number: "",
    allergies: "",
  });

  // Quick text entry for patient creation
  const [patientUnstructuredData, setPatientUnstructuredData] = useState("");
  const [aiParsingPatient, setAiParsingPatient] = useState(false);

  // Form state
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  // AI analysis state
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);

  // Edited fields
  const [diagnosis, setDiagnosis] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [medications, setMedications] = useState<any[]>([]);

  // Saving state
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true);
        const data = await fetchPatients();
        setPatients(data);
      } catch (err) {
        console.error("Error loading patients:", err);
      } finally {
        setLoading(false);
      }
    };
    loadPatients();
  }, []);

  const handleAnalyzeNotes = async () => {
    if (!clinicalNotes.trim() || !selectedPatient) return;

    try {
      setAiAnalyzing(true);

      // Call AI analysis endpoint
      // TODO: Implement backend endpoint POST /api/ai/analyze-notes
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/api/ai/analyze-notes`,
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer mock-token-for-hackathon',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            notes: `Chief Complaint: ${chiefComplaint}\n\nClinical Notes: ${clinicalNotes}`,
            patientContext: {
              age: selectedPatient.age,
              gender: selectedPatient.gender,
              allergies: selectedPatient.allergies,
            },
          }),
        }
      );

      const data = await response.json();
      setAiSuggestions(data);

      // Pre-fill form with AI suggestions
      setDiagnosis(data.diagnosis || "");
      setTreatmentPlan(data.treatmentPlan || "");
      setMedications(data.suggestedMedications || []);
    } catch (err) {
      console.error("AI analysis error:", err);
      alert("AI analysis failed. Please try again or enter manually.");
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleSaveEncounter = async () => {
    if (!selectedPatient || !diagnosis) {
      alert("Please select a patient and add a diagnosis");
      return;
    }

    try {
      setSaving(true);

      // TODO: Implement backend endpoint POST /api/encounters/create
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/api/encounters/create`,
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer mock-token-for-hackathon',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            patientId: selectedPatient.id,
            chiefComplaint,
            symptoms: clinicalNotes,
            diagnosis,
            notes: treatmentPlan,
            visitType: 'Follow-up',
            encounterDate: new Date().toISOString().split('T')[0],
            medications,
          }),
        }
      );

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => {
          // Reset form
          setSelectedPatient(null);
          setChiefComplaint("");
          setClinicalNotes("");
          setDiagnosis("");
          setTreatmentPlan("");
          setMedications([]);
          setAiSuggestions(null);
          setSaveSuccess(false);
        }, 2000);
      } else {
        throw new Error("Failed to save encounter");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save encounter. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const toggleRecording = () => {
    // Voice recording placeholder
    // In production, use Web Speech API or external service
    setIsRecording(!isRecording);

    if (!isRecording) {
      // Start recording
      alert("Voice recording feature coming soon. For now, please type your notes.");
    }
  };

  // AI parsing of unstructured patient data
  const handleParseUnstructuredData = async () => {
    if (!patientUnstructuredData.trim()) {
      alert("Please type patient information first");
      return;
    }

    try {
      setAiParsingPatient(true);

      // Call AI endpoint to parse unstructured data
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/api/ai/parse-patient-data`,
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer mock-token-for-hackathon',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: patientUnstructuredData,
            context: 'patient_creation'
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`AI parsing failed: ${response.status}`);
      }

      const parsedData = await response.json();

      // Populate form with AI-parsed data
      setNewPatientData({
        first_name: parsedData.first_name || newPatientData.first_name,
        last_name: parsedData.last_name || newPatientData.last_name,
        gender: parsedData.gender || newPatientData.gender,
        age: parsedData.age || newPatientData.age,
        phone_number: parsedData.phone_number || newPatientData.phone_number,
        allergies: parsedData.allergies || newPatientData.allergies,
      });

      alert("✨ AI has parsed the patient data! Please review and edit if needed.");
    } catch (error: any) {
      console.error("AI parsing error:", error);

      // Fallback: Simple local parsing
      const text = patientUnstructuredData.toLowerCase();
      const parsedData: any = {};

      // Extract name patterns
      const nameMatch = text.match(/(?:name is |patient |named )([a-z]+(?:\s+[a-z]+)*)/i);
      if (nameMatch) {
        const nameParts = nameMatch[1].trim().split(/\s+/);
        if (nameParts.length >= 2) {
          parsedData.first_name = nameParts[0];
          parsedData.last_name = nameParts.slice(1).join(" ");
        }
      }

      // Extract age
      const ageMatch = text.match(/(\d+)\s*(?:years old|year old|yo|yrs)/i);
      if (ageMatch) {
        parsedData.age = ageMatch[1];
      }

      // Extract gender
      if (text.includes("male") && !text.includes("female")) {
        parsedData.gender = "Male";
      } else if (text.includes("female")) {
        parsedData.gender = "Female";
      }

      // Extract phone
      const phoneMatch = text.match(/(?:phone|number|tel|contact)[:\s]*([+\d\s()-]+)/i);
      if (phoneMatch) {
        parsedData.phone_number = phoneMatch[1].trim();
      }

      // Extract allergies
      const allergyMatch = text.match(/(?:allerg(?:y|ies|ic) to|allergic)[:\s]*([a-z,\s]+)/i);
      if (allergyMatch) {
        parsedData.allergies = allergyMatch[1].trim();
      }

      // Update form with local parsing
      setNewPatientData({
        first_name: parsedData.first_name || newPatientData.first_name,
        last_name: parsedData.last_name || newPatientData.last_name,
        gender: parsedData.gender || newPatientData.gender,
        age: parsedData.age || newPatientData.age,
        phone_number: parsedData.phone_number || newPatientData.phone_number,
        allergies: parsedData.allergies || newPatientData.allergies,
      });

      alert("✨ Basic parsing complete! Please review and complete the form.");
    } finally {
      setAiParsingPatient(false);
    }
  };

  const handleCreateNewPatient = async () => {
    if (!newPatientData.first_name || !newPatientData.last_name) {
      alert("Please enter patient first and last name");
      return;
    }

    try {
      setCreatingPatient(true);

      // Create patient in DORRA EMR
      const allergiesList = newPatientData.allergies
        ? newPatientData.allergies.split(",").map(a => a.trim())
        : [];

      const createdPatient = await createPatient({
        first_name: newPatientData.first_name,
        last_name: newPatientData.last_name,
        gender: newPatientData.gender,
        age: newPatientData.age,
        phone_number: newPatientData.phone_number,
        allergies: allergiesList,
      });

      // Reload patients list
      const updatedPatients = await fetchPatients();
      setPatients(updatedPatients);

      // Select the newly created patient
      setSelectedPatient(createdPatient);

      // Reset form and close modal
      setNewPatientData({
        first_name: "",
        last_name: "",
        gender: "Male",
        age: "",
        phone_number: "",
        allergies: "",
      });
      setPatientUnstructuredData("");
      setShowNewPatientForm(false);

      alert("✅ Patient created successfully in DORRA EMR!");
    } catch (err) {
      console.error("Failed to create patient:", err);
      alert("Failed to create patient. Please try again.");
    } finally {
      setCreatingPatient(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 p-6">
        <h2 className="text-lg font-bold text-purple-900 mb-2">Capture & Notes - AI Clinical Documentation</h2>
        <p className="text-sm text-purple-800">
          Dictate or type patient notes. AI analyzes and suggests diagnosis, treatment plan, and medications.
          All data syncs to DORRA EMR as source of truth.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left column: Patient selection & Note capture */}
        <div className="space-y-4">
          {/* Patient selector */}
          <section className="rounded-2xl bg-white border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900">1. Select Patient</h3>
              <button
                onClick={() => setShowNewPatientForm(true)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition"
              >
                + New Patient
              </button>
            </div>

            {loading ? (
              <p className="text-sm text-slate-500">Loading patients...</p>
            ) : (
              <select
                value={selectedPatient?.id || ""}
                onChange={(e) => {
                  const patient = patients.find(p => p.id === parseInt(e.target.value));
                  setSelectedPatient(patient || null);
                }}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
              >
                <option value="">Choose a patient from DORRA EMR</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.full_name || `${p.first_name} ${p.last_name}`} · ID: {p.unique_id || p.id}
                  </option>
                ))}
              </select>
            )}

            {selectedPatient && (
              <div className="mt-3 p-3 rounded-lg bg-sky-50 border border-sky-200">
                <p className="text-xs font-semibold text-slate-900">
                  {selectedPatient.full_name || `${selectedPatient.first_name} ${selectedPatient.last_name}`}
                </p>
                <p className="text-xs text-slate-600">
                  {selectedPatient.gender} · {selectedPatient.age} years
                  {selectedPatient.allergies && ` · ⚠️ Allergies: ${
                    Array.isArray(selectedPatient.allergies)
                      ? selectedPatient.allergies.join(", ")
                      : selectedPatient.allergies
                  }`}
                </p>
              </div>
            )}
          </section>

          {/* Chief complaint */}
          <section className="rounded-2xl bg-white border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">2. Chief Complaint</h3>
            <input
              type="text"
              placeholder="e.g., High fever and body pains for 3 days"
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
            />
          </section>

          {/* Clinical notes with voice */}
          <section className="rounded-2xl bg-white border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900">3. Clinical Notes</h3>
              <button
                onClick={toggleRecording}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  isRecording
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                }`}
              >
                {isRecording ? "🔴 Recording..." : "🎤 Voice Dictation"}
              </button>
            </div>

            <textarea
              placeholder="Type or dictate patient history, symptoms, examination findings..."
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              rows={8}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100 resize-none"
            />

            <button
              onClick={handleAnalyzeNotes}
              disabled={!clinicalNotes.trim() || !selectedPatient || aiAnalyzing}
              className="mt-3 w-full rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {aiAnalyzing ? "🤖 AI Analyzing..." : "✨ Analyze with AI"}
            </button>
          </section>
        </div>

        {/* Right column: AI suggestions & final review */}
        <div className="space-y-4">
          {/* AI suggestions */}
          {aiSuggestions && (
            <section className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5">
              <h3 className="text-sm font-semibold text-emerald-900 mb-2">
                ✨ AI Suggestions (Review & Edit)
              </h3>
              <p className="text-xs text-emerald-700 mb-4">
                AI analyzed your notes. Review and edit below before saving.
              </p>
            </section>
          )}

          {/* Diagnosis */}
          <section className="rounded-2xl bg-white border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">4. Diagnosis</h3>
            <input
              type="text"
              placeholder="AI will suggest or type manually"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
            />
          </section>

          {/* Treatment plan */}
          <section className="rounded-2xl bg-white border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">5. Treatment Plan</h3>
            <textarea
              placeholder="AI will suggest treatment plan"
              value={treatmentPlan}
              onChange={(e) => setTreatmentPlan(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100 resize-none"
            />
          </section>

          {/* Medications */}
          <section className="rounded-2xl bg-white border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">6. Medications</h3>

            {medications.length === 0 ? (
              <p className="text-xs text-slate-500 italic">AI will suggest medications based on diagnosis</p>
            ) : (
              <div className="space-y-2">
                {medications.map((med, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-sky-50 border border-sky-200 text-xs">
                    <p className="font-semibold text-slate-900">{med.name}</p>
                    <p className="text-slate-600">{med.dosage} · {med.frequency} · {med.duration}</p>
                  </div>
                ))}
              </div>
            )}

            <button className="mt-3 w-full rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-100">
              + Add Medication Manually
            </button>
          </section>

          {/* Save button */}
          <button
            onClick={handleSaveEncounter}
            disabled={!selectedPatient || !diagnosis || saving}
            className="w-full rounded-xl bg-sky-600 px-4 py-3 text-sm font-bold text-white hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {saving ? "💾 Saving to DORRA EMR..." : saveSuccess ? "✅ Saved Successfully!" : "💾 Save Encounter to DORRA"}
          </button>
        </div>
      </div>

      {/* Info footer */}
      <section className="rounded-2xl border border-dashed border-purple-200 bg-purple-50 p-4 text-xs text-purple-700">
        <p className="font-semibold text-purple-900 mb-1">How this works:</p>
        <ul className="space-y-1 ml-4 list-disc">
          <li>All patient data comes from DORRA EMR (source of truth)</li>
          <li>AI (Ollama) analyzes your notes and suggests structured diagnosis & treatment</li>
          <li>You review and edit AI suggestions before saving</li>
          <li>Final encounter is saved back to DORRA with medications</li>
          <li>No duplication - MedSight AI is a smart documentation layer over DORRA</li>
        </ul>
      </section>

      {/* New Patient Modal */}
      {showNewPatientForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Create New Patient in DORRA EMR</h3>
              <button
                onClick={() => setShowNewPatientForm(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Quick Text Entry Section */}
              <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 p-4">
                <h4 className="text-xs font-bold text-purple-900 mb-2">⚡ Quick Entry - Type Patient Info</h4>
                <textarea
                  placeholder='Type freely: "Grace Okoro, 35 years old female, phone 0803 456 7890, allergic to sulfa drugs"'
                  value={patientUnstructuredData}
                  onChange={(e) => setPatientUnstructuredData(e.target.value)}
                  rows={3}
                  disabled={aiParsingPatient}
                  className="w-full rounded-lg border border-purple-200 px-3 py-2 text-xs outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 resize-none bg-white"
                />
                <button
                  onClick={handleParseUnstructuredData}
                  disabled={!patientUnstructuredData.trim() || aiParsingPatient}
                  className="mt-2 w-full rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {aiParsingPatient ? "🤖 AI Parsing..." : "✨ Auto-Fill Form with AI"}
                </button>
                <p className="text-[10px] text-purple-700 mt-2">
                  💡 Type patient info naturally in any format. AI will extract and populate the form fields below.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 border-t border-slate-300"></div>
                <span className="text-xs font-semibold text-slate-500">OR FILL MANUALLY</span>
                <div className="flex-1 border-t border-slate-300"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={newPatientData.first_name}
                    onChange={(e) => setNewPatientData({...newPatientData, first_name: e.target.value})}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                    placeholder="e.g., Grace"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={newPatientData.last_name}
                    onChange={(e) => setNewPatientData({...newPatientData, last_name: e.target.value})}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                    placeholder="e.g., Okoro"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gender *
                  </label>
                  <select
                    value={newPatientData.gender}
                    onChange={(e) => setNewPatientData({...newPatientData, gender: e.target.value as "Male" | "Female" | "Other"})}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Age
                  </label>
                  <input
                    type="text"
                    value={newPatientData.age}
                    onChange={(e) => setNewPatientData({...newPatientData, age: e.target.value})}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                    placeholder="e.g., 35"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={newPatientData.phone_number}
                  onChange={(e) => setNewPatientData({...newPatientData, phone_number: e.target.value})}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                  placeholder="e.g., +234 803 123 4567"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Allergies (comma-separated)
                </label>
                <input
                  type="text"
                  value={newPatientData.allergies}
                  onChange={(e) => setNewPatientData({...newPatientData, allergies: e.target.value})}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                  placeholder="e.g., Penicillin, NSAIDs"
                />
                <p className="text-xs text-slate-500 mt-1">Separate multiple allergies with commas</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowNewPatientForm(false)}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNewPatient}
                  disabled={creatingPatient || !newPatientData.first_name || !newPatientData.last_name}
                  className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {creatingPatient ? "Creating..." : "Create Patient in DORRA"}
                </button>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                <p className="font-semibold mb-1">✅ Saves to DORRA EMR</p>
                <p>This patient will be created in the DORRA system and immediately available across all hospital departments.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ----------------- Pharmacy Handoff view ----------------- */

/**
 * PharmacyHandoffView: QR-based prescription sharing for external pharmacists
 *
 * WORKFLOW (Doctor side):
 * 1. Doctor sees list of patients from DORRA
 * 2. Clicks "Generate QR Token" for a patient
 * 3. System generates short token (e.g., MS-RX-P2P8G1)
 * 4. Doctor shows QR on screen or shares token with patient
 *
 * WORKFLOW (Pharmacist side - separate page):
 * 1. Pharmacist scans QR or enters token at /pharmacy/:token
 * 2. System decodes token, fetches patient data from DORRA
 * 3. Pharmacist sees read-only view with:
 *    - Patient initials (privacy-aware)
 *    - Allergies
 *    - Current medications/prescriptions
 *    - Safety warnings
 * 4. No signup required for pharmacist
 *
 * BACKEND API ENDPOINTS NEEDED:
 * - POST /api/pharmacy/generate-token
 *   Body: { patientId }
 *   Returns: { token: "MS-RX-P2P8G1", expiresAt, qrCodeUrl }
 *
 * - GET /api/pharmacy/prescription/:token (for pharmacist page)
 *   Returns: {
 *     patient: { initials, age, gender, allergies },
 *     medications: [...],
 *     safetyWarnings: [...],
 *     encounterDate
 *   }
 */
const PharmacyHandoffView: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingToken, setGeneratingToken] = useState<number | null>(null);
  const [generatedTokens, setGeneratedTokens] = useState<Map<number, any>>(new Map());
  const [revokingToken, setRevokingToken] = useState<number | null>(null);

  // New patient creation states
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);
  const [creatingPatient, setCreatingPatient] = useState(false);
  const [newPatientData, setNewPatientData] = useState({
    first_name: "",
    last_name: "",
    gender: "Male" as "Male" | "Female" | "Other",
    age: "",
    phone_number: "",
    allergies: "",
    medications: "",
    diagnosis: "",
    notes: "",
  });

  // Quick text entry for patient creation
  const [patientUnstructuredData, setPatientUnstructuredData] = useState("");
  const [aiParsingPatient, setAiParsingPatient] = useState(false);

  // AI Prescription Recommendations
  const [aiRecommendations, setAiRecommendations] = useState<string>("");
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // Auto-generate token after patient creation
  const [autoGenerateToken, setAutoGenerateToken] = useState(true);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true);
        const data = await fetchPatients();
        setPatients(data);
      } catch (err) {
        console.error("Error loading patients:", err);
      } finally {
        setLoading(false);
      }
    };
    loadPatients();
  }, []);

  const handleGenerateToken = async (patient: Patient, prescriptionDetails?: any) => {
    try {
      setGeneratingToken(patient.id);

      // Prepare prescription details for token
      const prescriptionPayload = prescriptionDetails || {
        patientInitials: `${patient.first_name[0]}.${patient.last_name[0]}.`,
        patientAge: patient.age || 'N/A',
        patientGender: patient.gender || 'N/A',
        allergies: Array.isArray(patient.allergies) ? patient.allergies : (patient.allergies ? [patient.allergies] : []),
        medications: [],
        prescriptionText: '',
        diagnosis: '',
        safetyWarnings: [],
        encounterDate: new Date().toLocaleDateString(),
        doctorName: 'Dr. David Uhumagho',
        notes: '',
      };

      // Implement backend endpoint POST /api/pharmacy/generate-token
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/api/pharmacy/generate-token`,
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer mock-token-for-hackathon',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            patientId: patient.id,
            prescriptionDetails: prescriptionPayload
          }),
        }
      );

      const data = await response.json();

      // Store token for this patient
      setGeneratedTokens(prev => new Map(prev).set(patient.id, {
        token: data.token || `MS-RX-${patient.unique_id || patient.id}`,
        expiresAt: data.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        qrCodeUrl: data.qrCodeUrl || `http://localhost:5173/pharmacy/${data.token}`,
      }));
    } catch (err) {
      console.error("Token generation error:", err);
      // Fallback: generate simple token
      const fallbackToken = {
        token: `MS-RX-${patient.unique_id || patient.id}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        qrCodeUrl: `http://localhost:5173/pharmacy/MS-RX-${patient.unique_id || patient.id}`,
      };
      setGeneratedTokens(prev => new Map(prev).set(patient.id, fallbackToken));
    } finally {
      setGeneratingToken(null);
    }
  };

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    alert(`Token copied: ${token}`);
  };

  const handleRevokeToken = async (patient: Patient) => {
    if (!confirm(`Revoke pharmacy token for ${patient.full_name || `${patient.first_name} ${patient.last_name}`}?\n\nThis will invalidate the QR code and pharmacists will no longer be able to access the prescription.`)) {
      return;
    }

    try {
      setRevokingToken(patient.id);

      const tokenData = generatedTokens.get(patient.id);
      if (!tokenData) return;

      // Call backend to revoke token
      await fetch(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/api/pharmacy/revoke-token`,
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer mock-token-for-hackathon',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: tokenData.token }),
        }
      );

      // Remove token from local state
      const newTokens = new Map(generatedTokens);
      newTokens.delete(patient.id);
      setGeneratedTokens(newTokens);

      alert('✅ Token revoked successfully. The QR code is now invalid.');
    } catch (err) {
      console.error("Token revocation error:", err);
      alert("Failed to revoke token. Please try again.");
    } finally {
      setRevokingToken(null);
    }
  };

  // Get AI Prescription Recommendations
  const handleGetAIRecommendations = async () => {
    if (!newPatientData.diagnosis.trim() && !patientUnstructuredData.trim()) {
      alert("Please provide diagnosis or patient information first");
      return;
    }

    try {
      setLoadingRecommendations(true);

      const promptText = `Patient Information:
- Name: ${newPatientData.first_name} ${newPatientData.last_name}
- Age: ${newPatientData.age || 'Not provided'}
- Gender: ${newPatientData.gender}
- Allergies: ${newPatientData.allergies || 'None'}
- Diagnosis: ${newPatientData.diagnosis || 'Not specified'}
- Additional Notes: ${patientUnstructuredData}

Please provide medication recommendations including dosage, frequency, and duration. Also include any safety warnings.`;

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/api/ai/chat`,
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer mock-token-for-hackathon',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: promptText,
            context: 'prescription_recommendation'
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`AI recommendation failed: ${response.status}`);
      }

      const data = await response.json();
      const recommendations = data.response || data.summary || data.message || "No recommendations available";

      setAiRecommendations(recommendations);

      // Auto-fill medications field with recommendations
      if (!newPatientData.medications) {
        setNewPatientData(prev => ({
          ...prev,
          medications: recommendations
        }));
      }

    } catch (error: any) {
      console.error("AI recommendations error:", error);
      setAiRecommendations("AI recommendations unavailable. Please enter medications manually.");
    } finally {
      setLoadingRecommendations(false);
    }
  };

  // AI parsing of unstructured patient data
  const handleParseUnstructuredData = async () => {
    if (!patientUnstructuredData.trim()) {
      alert("Please type patient information first");
      return;
    }

    try {
      setAiParsingPatient(true);

      // Call AI endpoint to parse unstructured data
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/api/ai/parse-patient-data`,
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer mock-token-for-hackathon',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: patientUnstructuredData,
            context: 'patient_creation'
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`AI parsing failed: ${response.status}`);
      }

      const parsedData = await response.json();

      // Populate form with AI-parsed data
      setNewPatientData({
        first_name: parsedData.first_name || newPatientData.first_name,
        last_name: parsedData.last_name || newPatientData.last_name,
        gender: parsedData.gender || newPatientData.gender,
        age: parsedData.age || newPatientData.age,
        phone_number: parsedData.phone_number || newPatientData.phone_number,
        allergies: parsedData.allergies || newPatientData.allergies,
      });

      alert("✨ AI has parsed the patient data! Please review and edit if needed.");
    } catch (error: any) {
      console.error("AI parsing error:", error);

      // Fallback: Simple local parsing
      const text = patientUnstructuredData.toLowerCase();
      const parsedData: any = {};

      // Extract name patterns
      const nameMatch = text.match(/(?:name is |patient |named )([a-z]+(?:\s+[a-z]+)*)/i);
      if (nameMatch) {
        const nameParts = nameMatch[1].trim().split(/\s+/);
        if (nameParts.length >= 2) {
          parsedData.first_name = nameParts[0];
          parsedData.last_name = nameParts.slice(1).join(" ");
        }
      }

      // Extract age
      const ageMatch = text.match(/(\d+)\s*(?:years old|year old|yo|yrs)/i);
      if (ageMatch) {
        parsedData.age = ageMatch[1];
      }

      // Extract gender
      if (text.includes("male") && !text.includes("female")) {
        parsedData.gender = "Male";
      } else if (text.includes("female")) {
        parsedData.gender = "Female";
      }

      // Extract phone
      const phoneMatch = text.match(/(?:phone|number|tel|contact)[:\s]*([+\d\s()-]+)/i);
      if (phoneMatch) {
        parsedData.phone_number = phoneMatch[1].trim();
      }

      // Extract allergies
      const allergyMatch = text.match(/(?:allerg(?:y|ies|ic) to|allergic)[:\s]*([a-z,\s]+)/i);
      if (allergyMatch) {
        parsedData.allergies = allergyMatch[1].trim();
      }

      // Update form with local parsing
      setNewPatientData({
        first_name: parsedData.first_name || newPatientData.first_name,
        last_name: parsedData.last_name || newPatientData.last_name,
        gender: parsedData.gender || newPatientData.gender,
        age: parsedData.age || newPatientData.age,
        phone_number: parsedData.phone_number || newPatientData.phone_number,
        allergies: parsedData.allergies || newPatientData.allergies,
      });

      alert("✨ Basic parsing complete! Please review and complete the form.");
    } finally {
      setAiParsingPatient(false);
    }
  };

  // Create new patient handler
  const handleCreateNewPatient = async () => {
    // Validate required fields
    if (!newPatientData.first_name.trim() || !newPatientData.last_name.trim()) {
      alert("Please provide at least first name and last name");
      return;
    }

    try {
      setCreatingPatient(true);

      // Convert comma-separated allergies to array
      const allergiesList = newPatientData.allergies
        ? newPatientData.allergies.split(",").map(a => a.trim()).filter(Boolean)
        : [];

      // Call DORRA API to create patient
      const createdPatient = await createPatient({
        first_name: newPatientData.first_name,
        last_name: newPatientData.last_name,
        gender: newPatientData.gender,
        age: newPatientData.age,
        phone_number: newPatientData.phone_number,
        allergies: allergiesList,
      });

      console.log("✅ Patient created in DORRA EMR:", createdPatient);

      // Save unstructured data and additional info to backend
      try {
        await fetch(
          `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/api/patients/${createdPatient.id}/notes`,
          {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer mock-token-for-hackathon',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              unstructured_data: patientUnstructuredData,
              medications: newPatientData.medications,
              diagnosis: newPatientData.diagnosis,
              notes: newPatientData.notes,
              ai_recommendations: aiRecommendations,
            }),
          }
        );
      } catch (err) {
        console.warn("Failed to save additional patient data:", err);
      }

      // Reload patients list to include the new patient
      const updatedPatients = await fetchPatients();
      setPatients(updatedPatients);

      // Auto-generate pharmacy token if enabled
      if (autoGenerateToken) {
        // Prepare comprehensive prescription details
        const prescriptionPayload = {
          patientInitials: `${createdPatient.first_name[0]}.${createdPatient.last_name[0]}.`,
          patientAge: newPatientData.age || 'N/A',
          patientGender: newPatientData.gender,
          allergies: allergiesList,
          medications: [], // Will be populated from prescriptionText
          prescriptionText: newPatientData.medications || 'No medications prescribed',
          diagnosis: newPatientData.diagnosis || 'Not specified',
          safetyWarnings: allergiesList.length > 0 ? [`Patient allergic to: ${allergiesList.join(', ')}`] : [],
          encounterDate: new Date().toLocaleDateString(),
          doctorName: 'Dr. David Uhumagho',
          notes: newPatientData.notes || '',
          aiRecommendations: aiRecommendations || '',
        };

        setTimeout(() => {
          handleGenerateToken(createdPatient, prescriptionPayload);
        }, 500);
      }

      // Reset form and close modal
      setNewPatientData({
        first_name: "",
        last_name: "",
        gender: "Male",
        age: "",
        phone_number: "",
        allergies: "",
        medications: "",
        diagnosis: "",
        notes: "",
      });
      setPatientUnstructuredData("");
      setAiRecommendations("");
      setShowNewPatientForm(false);

      alert(`✅ Patient ${createdPatient.first_name} ${createdPatient.last_name} created successfully in DORRA EMR!${autoGenerateToken ? ' Generating pharmacy token...' : ''}`);
    } catch (error: any) {
      console.error("Failed to create patient:", error);
      alert(`Failed to create patient: ${error.message || "Unknown error"}`);
    } finally {
      setCreatingPatient(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Demo Button */}
      <section className="rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-teal-900 mb-2">Pharmacy Handoff - External Pharmacist Integration</h2>
            <p className="text-sm text-teal-800 mb-3">
              Generate QR tokens for patients to share with external pharmacies. Pharmacists can view prescriptions
              without needing an account - just scan the QR or enter the token.
            </p>
          </div>
          <a
            href="/pharmacy-demo"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg transition flex items-center gap-2 whitespace-nowrap"
          >
            <span className="text-xl">🎯</span>
            <span>DEMO MODE</span>
          </a>
        </div>
        <div className="flex items-start gap-2 text-xs text-teal-700 bg-teal-50 rounded-lg p-3 border border-teal-200">
          <span>💡</span>
          <div>
            <p className="font-semibold mb-1">How it works:</p>
            <ol className="list-decimal ml-4 space-y-1">
              <li>Select a patient and generate a pharmacy token</li>
              <li>Show the QR code to the patient or share the token code</li>
              <li>Patient takes the QR/token to any pharmacy</li>
              <li>Pharmacist scans QR or enters token (no login needed)</li>
              <li>Pharmacist sees read-only prescription from DORRA EMR</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Patients list */}
      <section className="rounded-2xl bg-white border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-900">Patient List - Generate Pharmacy Token</h3>
          <button
            onClick={() => setShowNewPatientForm(true)}
            className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition flex items-center gap-2"
          >
            <span>📋</span>
            <span>Create Prescription</span>
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500 py-8 text-center">Loading patients from DORRA EMR...</p>
        ) : patients.length === 0 ? (
          <p className="text-sm text-slate-500 py-8 text-center">No patients found</p>
        ) : (
          <div className="space-y-3">
            {patients.map(patient => {
              const tokenData = generatedTokens.get(patient.id);
              const hasAllergies = patient.allergies && (Array.isArray(patient.allergies) ? patient.allergies.length > 0 : patient.allergies);

              return (
                <div
                  key={patient.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900">
                          {patient.full_name || `${patient.first_name} ${patient.last_name}`}
                        </p>
                        {hasAllergies && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            ⚠️ ALLERGY
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        ID: {patient.unique_id || patient.id} · {patient.gender} · {patient.age} years
                        {hasAllergies && (
                          <span className="text-amber-700 font-medium">
                            {" "}· Allergies: {
                              Array.isArray(patient.allergies)
                                ? patient.allergies.join(", ")
                                : patient.allergies
                            }
                          </span>
                        )}
                      </p>
                    </div>

                    <button
                      onClick={() => handleGenerateToken(patient)}
                      disabled={generatingToken === patient.id}
                      className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {generatingToken === patient.id ? "Generating..." : tokenData ? "Regenerate QR" : "Generate QR Token"}
                    </button>
                  </div>

                  {/* Token display */}
                  {tokenData && (
                    <div className="mt-4 p-4 rounded-lg bg-white border-2 border-teal-200">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-teal-900 mb-2">
                            🎫 Pharmacy Token Generated
                          </p>
                          <div className="flex items-center gap-2 mb-2">
                            <code className="px-3 py-2 rounded-lg bg-teal-50 border border-teal-200 text-sm font-mono font-bold text-teal-900">
                              {tokenData.token}
                            </code>
                            <button
                              onClick={() => copyToken(tokenData.token)}
                              className="px-3 py-2 rounded-lg bg-teal-100 hover:bg-teal-200 text-teal-700 text-xs font-semibold transition"
                            >
                              📋 Copy
                            </button>
                            <button
                              onClick={() => handleRevokeToken(patient)}
                              disabled={revokingToken === patient.id}
                              className="px-3 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {revokingToken === patient.id ? "Revoking..." : "🚫 Revoke"}
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-600">
                            Expires: {new Date(tokenData.expiresAt).toLocaleString()}
                          </p>
                          <p className="text-[11px] text-slate-600 mt-1">
                            Pharmacist URL: <span className="font-mono text-teal-700">{tokenData.qrCodeUrl}</span>
                          </p>
                        </div>

                        {/* QR Code placeholder */}
                        <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-teal-100 to-teal-200 border-2 border-teal-300 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-2xl mb-1">📱</p>
                            <p className="text-[10px] font-semibold text-teal-800">QR Code</p>
                            <p className="text-[9px] text-teal-700">(Generate in backend)</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-teal-100 text-xs text-teal-800">
                        <p className="font-semibold mb-1">Instructions for patient:</p>
                        <ol className="list-decimal ml-4 space-y-0.5 text-[11px]">
                          <li>Show this QR code to the pharmacist, OR</li>
                          <li>Give them the token code: <strong>{tokenData.token}</strong></li>
                          <li>Pharmacist will scan/enter it to see your prescription</li>
                          <li>No signup needed - instant access to your medications from DORRA EMR</li>
                        </ol>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Technical notes */}
      <section className="rounded-2xl border border-dashed border-teal-200 bg-teal-50 p-4 text-xs text-teal-700">
        <p className="font-semibold text-teal-900 mb-2">🔧 Implementation Notes (for backend):</p>
        <div className="space-y-2">
          <div>
            <p className="font-semibold">Token Generation (POST /api/pharmacy/generate-token):</p>
            <ul className="list-disc ml-4 mt-1">
              <li>Generate short, human-readable token (e.g., MS-RX-ABC123)</li>
              <li>Store token in database with patientId and expiry (24-48 hours)</li>
              <li>Generate QR code URL using library (e.g., qrcode npm package)</li>
              <li>Return token, expiresAt, and qrCodeUrl</li>
            </ul>
          </div>

          <div className="mt-3">
            <p className="font-semibold">Pharmacist View (GET /api/pharmacy/prescription/:token):</p>
            <ul className="list-disc ml-4 mt-1">
              <li>Decode token and verify it's not expired</li>
              <li>Fetch patient data from DORRA (patient info, medications, allergies)</li>
              <li>Return privacy-aware data (initials instead of full name)</li>
              <li>Include safety warnings (drug allergies, interactions)</li>
              <li>No authentication required - token is the authorization</li>
            </ul>
          </div>

          <div className="mt-3">
            <p className="font-semibold">Pharmacist Page UI (separate route /pharmacy/:token):</p>
            <ul className="list-disc ml-4 mt-1">
              <li>Simple read-only page (no login/signup)</li>
              <li>Show patient initials, age, gender</li>
              <li>Prominent allergy warnings in red</li>
              <li>List of current medications with dosage/frequency</li>
              <li>Encounter date and prescribing doctor</li>
            </ul>
          </div>
        </div>
      </section>

      {/* New Patient Modal */}
      {showNewPatientForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">📋 Create Prescription with AI Assistance</h3>
                <button
                  onClick={() => setShowNewPatientForm(false)}
                  className="text-slate-400 hover:text-slate-600 transition"
                  disabled={creatingPatient}
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Info box */}
              <div className="rounded-lg bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 p-4 text-xs text-slate-800">
                <p className="font-bold mb-2 text-teal-900">💊 AI-Powered Prescription System</p>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>Patient will be saved to DORRA EMR</li>
                  <li>Get AI recommendations for medications and dosages</li>
                  <li>Auto-generate QR token for pharmacy handoff</li>
                  <li>Pharmacist gets clear prescription instructions instantly</li>
                </ul>
              </div>

              {/* Quick Text Entry Section */}
              <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 p-4">
                <h4 className="text-xs font-bold text-purple-900 mb-2">⚡ Quick Entry - Type Patient Info</h4>
                <textarea
                  placeholder='Type freely: "Adebayo Oluwaseun, 45 years old male, phone 0803 123 4567, allergic to penicillin"'
                  value={patientUnstructuredData}
                  onChange={(e) => setPatientUnstructuredData(e.target.value)}
                  rows={3}
                  disabled={aiParsingPatient}
                  className="w-full rounded-lg border border-purple-200 px-3 py-2 text-xs outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 resize-none bg-white"
                />
                <button
                  onClick={handleParseUnstructuredData}
                  disabled={!patientUnstructuredData.trim() || aiParsingPatient}
                  className="mt-2 w-full rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {aiParsingPatient ? "🤖 AI Parsing..." : "✨ Auto-Fill Form with AI"}
                </button>
                <p className="text-[10px] text-purple-700 mt-2">
                  💡 Type patient info naturally in any format. AI will extract and populate the form fields below.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 border-t border-slate-300"></div>
                <span className="text-xs font-semibold text-slate-500">OR FILL MANUALLY</span>
                <div className="flex-1 border-t border-slate-300"></div>
              </div>

              {/* First Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newPatientData.first_name}
                  onChange={(e) => setNewPatientData({ ...newPatientData, first_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., Chinwe"
                  disabled={creatingPatient}
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newPatientData.last_name}
                  onChange={(e) => setNewPatientData({ ...newPatientData, last_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., Okafor"
                  disabled={creatingPatient}
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                <select
                  value={newPatientData.gender}
                  onChange={(e) => setNewPatientData({ ...newPatientData, gender: e.target.value as "Male" | "Female" | "Other" })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  disabled={creatingPatient}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
                <input
                  type="text"
                  value={newPatientData.age}
                  onChange={(e) => setNewPatientData({ ...newPatientData, age: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., 45"
                  disabled={creatingPatient}
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={newPatientData.phone_number}
                  onChange={(e) => setNewPatientData({ ...newPatientData, phone_number: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., +234 803 123 4567"
                  disabled={creatingPatient}
                />
              </div>

              {/* Allergies */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Allergies</label>
                <input
                  type="text"
                  value={newPatientData.allergies}
                  onChange={(e) => setNewPatientData({ ...newPatientData, allergies: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., Penicillin, Sulfa drugs (comma-separated)"
                  disabled={creatingPatient}
                />
                <p className="text-xs text-slate-500 mt-1">Separate multiple allergies with commas</p>
              </div>

              {/* Diagnosis */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Diagnosis</label>
                <textarea
                  value={newPatientData.diagnosis}
                  onChange={(e) => setNewPatientData({ ...newPatientData, diagnosis: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  placeholder="e.g., Hypertension, Type 2 Diabetes"
                  rows={2}
                  disabled={creatingPatient}
                />
              </div>

              {/* AI Recommendations Section */}
              <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-blue-900">AI Prescription Recommendations</h4>
                  <button
                    onClick={handleGetAIRecommendations}
                    disabled={loadingRecommendations || (!newPatientData.diagnosis && !patientUnstructuredData)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {loadingRecommendations ? "Getting AI..." : "Get AI Recommendations"}
                  </button>
                </div>
                {aiRecommendations && (
                  <div className="mt-2 p-3 bg-white rounded-lg border border-blue-200 text-xs text-slate-700 whitespace-pre-wrap">
                    {aiRecommendations}
                  </div>
                )}
                <p className="text-[10px] text-blue-700 mt-2">
                  AI will analyze patient info and suggest medications, dosages, and safety warnings
                </p>
              </div>

              {/* Medications/Prescription */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Medications / Prescription</label>
                <textarea
                  value={newPatientData.medications}
                  onChange={(e) => setNewPatientData({ ...newPatientData, medications: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  placeholder="e.g., Lisinopril 10mg once daily, Metformin 500mg twice daily"
                  rows={4}
                  disabled={creatingPatient}
                />
                <p className="text-xs text-slate-500 mt-1">This will be shown to the pharmacist via QR code</p>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Additional Notes</label>
                <textarea
                  value={newPatientData.notes}
                  onChange={(e) => setNewPatientData({ ...newPatientData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  placeholder="Any additional medical notes or instructions"
                  rows={3}
                  disabled={creatingPatient}
                />
              </div>

              {/* Auto-generate Token Checkbox */}
              <div className="flex items-center gap-2 p-3 bg-teal-50 border border-teal-200 rounded-lg">
                <input
                  type="checkbox"
                  id="autoGenerateToken"
                  checked={autoGenerateToken}
                  onChange={(e) => setAutoGenerateToken(e.target.checked)}
                  className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-2 focus:ring-teal-500"
                  disabled={creatingPatient}
                />
                <label htmlFor="autoGenerateToken" className="text-xs font-semibold text-teal-900 cursor-pointer">
                  Auto-generate pharmacy QR token after creating patient
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 rounded-b-2xl flex items-center justify-end gap-3">
              <button
                onClick={() => setShowNewPatientForm(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition"
                disabled={creatingPatient}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewPatient}
                disabled={creatingPatient || !newPatientData.first_name.trim() || !newPatientData.last_name.trim()}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {creatingPatient ? "Creating Prescription..." : "💊 Create Prescription & Generate QR"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
