// src/api/ai.ts

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export interface CopilotApiResponse {
  status: 'success' | 'error';
  success?: boolean;
  response?: string;
  error?: string;
  source?: string;
  timestamp?: string;
}

export async function chatWithCopilot(
  message: string,
  patientId?: string
): Promise<CopilotApiResponse> {
  const res = await fetch(`${BACKEND_URL}/api/ai/copilot/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer mock-token-for-hackathon',
    },
    body: JSON.stringify({ message, patientId }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`AI chat failed: ${res.status} ${text}`);
  }

  return res.json() as Promise<CopilotApiResponse>;
}
