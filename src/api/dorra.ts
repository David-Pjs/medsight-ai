// src/api/dorra.ts
import axios from "axios";

// Backend API URL - our Express server that proxies to DORRA
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

// Mock token for authentication with backend
const TOKEN = "mock-token-for-hackathon";

export const dorraClient = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// -------------- Types --------------

export type Patient = {
  id: number;
  unique_id?: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  gender: "Male" | "Female" | "Other" | string;
  date_of_birth?: string;
  phone_number?: string;
  address?: string;
  allergies?: string[] | any;
  age?: string;
  email?: string;
  diagnosis?: string;
  created_at?: string;
  updated_at?: string;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

// -------------- API functions --------------

export async function fetchPatients(): Promise<Patient[]> {
  const res = await dorraClient.get<PaginatedResponse<Patient>>("/api/patients");
  return res.data.results;
}

export type CreatePatientPayload = {
  first_name: string;
  last_name: string;
  gender: "Male" | "Female" | "Other";
  date_of_birth?: string; // e.g. "2000-01-01"
  phone_number?: string;
  address?: string;
  allergies?: string[];
  age?: string;
  email?: string;
};

export async function createPatient(payload: CreatePatientPayload): Promise<any> {
  const res = await dorraClient.post("/api/patients/create", payload);
  return res.data;
}

export async function updatePatient(id: number, payload: Partial<CreatePatientPayload>): Promise<any> {
  const res = await dorraClient.patch(`/api/patients/${id}`, payload);
  return res.data;
}

export async function deletePatient(id: number): Promise<void> {
  await dorraClient.delete(`/api/patients/${id}`);
}

// Encounters
export async function fetchEncounters(): Promise<any[]> {
  const res = await dorraClient.get<PaginatedResponse<any>>("/api/encounters");
  return res.data.results;
}

export async function fetchPatientEncounters(patientId: number): Promise<any[]> {
  const res = await dorraClient.get<PaginatedResponse<any>>(`/api/patients/${patientId}/encounters`);
  return res.data.results;
}

export async function fetchEncounter(id: number): Promise<any> {
  const res = await dorraClient.get(`/api/encounters/${id}`);
  return res.data;
}

// Medications
export async function fetchPatientMedications(patientId: number): Promise<any[]> {
  const res = await dorraClient.get<PaginatedResponse<any>>(`/api/patients/${patientId}/medications`);
  return res.data.results;
}

// Appointments
export async function fetchAppointments(): Promise<any[]> {
  const res = await dorraClient.get<PaginatedResponse<any>>("/api/appointments");
  return res.data.results;
}

export async function fetchPatientAppointments(patientId: number): Promise<any[]> {
  const res = await dorraClient.get<PaginatedResponse<any>>(`/api/patients/${patientId}/appointments`);
  return res.data.results;
}

export async function updateAppointment(id: number, payload: any): Promise<any> {
  const res = await dorraClient.patch(`/api/appointments/${id}`, payload);
  return res.data;
}

export async function deleteAppointment(id: number): Promise<void> {
  await dorraClient.delete(`/api/appointments/${id}`);
}

// Safety & AI
export async function checkPatientSafety(patientId: number): Promise<any> {
  const res = await dorraClient.post(`/api/safety/check/${patientId}`);
  return res.data;
}

export async function checkDrugInteractions(medications: any[]): Promise<any> {
  const res = await dorraClient.post('/api/safety/interactions', { medications });
  return res.data;
}

export async function getSafetyAlerts(): Promise<any> {
  const res = await dorraClient.get('/api/safety/alerts');
  return res.data;
}

// ADR Reports
export async function fetchADRReports(): Promise<any[]> {
  const res = await dorraClient.get('/api/adr');
  return res.data.reports || [];
}

export async function createADRReport(report: any): Promise<any> {
  const res = await dorraClient.post('/api/adr', report);
  return res.data;
}

export async function deleteADRReport(id: number): Promise<void> {
  await dorraClient.delete(`/api/adr/${id}`);
}

export async function getADRStats(): Promise<any> {
  const res = await dorraClient.get('/api/adr/stats/summary');
  return res.data.statistics;
}

// AI Copilot
export async function chatWithCopilot(message: string, patientId?: number): Promise<any> {
  const res = await dorraClient.post('/api/ai/copilot/chat', { message, patientId });
  return res.data;
}

export async function generatePatientSummary(patientId: number): Promise<any> {
  const res = await dorraClient.get(`/api/ai/summary/patient/${patientId}`);
  return res.data;
}