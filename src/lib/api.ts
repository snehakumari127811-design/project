/**
 * API Wrapper for Cloudflare Workers Backend
 */
import { auth } from './firebase';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8787';

async function getAuthHeader(): Promise<Record<string, string>> {
  // Check for System Admin Session
  if (localStorage.getItem('vr_admin_session') === 'active') {
    return { 'X-Admin-Token': 'vr_admin_secret_2024' };
  }

  const user = auth.currentUser;
  if (!user) return {};
  const token = await user.getIdToken();
  return { 'Authorization': `Bearer ${token}` };
}

export const api = {
  async get(path: string, protectedRoute = false) {
    const headers: Record<string, string> = {};
    if (protectedRoute) {
      Object.assign(headers, await getAuthHeader());
    }
    const response = await fetch(`${BASE_URL}${path}`, { headers });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },

  async post(path: string, body: any, protectedRoute = false) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (protectedRoute) {
      Object.assign(headers, await getAuthHeader());
    }
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },

  async delete(path: string) {
    const headers = await getAuthHeader();
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) throw new Error(await response.text());
    return response.ok;
  }
};
