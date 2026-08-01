const API_BASE = import.meta.env.VITE_API_URL || 'https://student-ai-project.onrender.com/api';

let accessToken = localStorage.getItem('admin_access_token') || '';
let refreshToken = localStorage.getItem('admin_refresh_token') || '';

let unauthorizedListener: (() => void) | null = null;

export function setUnauthorizedListener(listener: (() => void) | null) {
  unauthorizedListener = listener;
}

export function isLoggedIn() {
  return !!accessToken;
}

export function logout() {
  accessToken = '';
  refreshToken = '';
  localStorage.removeItem('admin_access_token');
  localStorage.removeItem('admin_refresh_token');
  localStorage.removeItem('admin_last_activity');
  if (unauthorizedListener) {
    unauthorizedListener();
  }
}

async function refreshAccess(): Promise<boolean> {
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data.access) {
      accessToken = data.access;
      localStorage.setItem('admin_access_token', accessToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

async function apiFetch(path: string): Promise<any> {
  if (!accessToken) {
    const refreshed = await refreshAccess();
    if (!refreshed) {
      logout();
      throw new Error('Session expired');
    }
  }

  let res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status === 401) {
    const refreshed = await refreshAccess();
    if (!refreshed) { 
      logout(); 
      throw new Error('Session expired'); 
    }
    res = await fetch(`${API_BASE}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.error || `API error ${res.status}`);
  }
  return res.json();
}

export async function adminLogin(username: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Login failed');
  accessToken = data.access;
  refreshToken = data.refresh;
  localStorage.setItem('admin_access_token', accessToken);
  localStorage.setItem('admin_refresh_token', refreshToken);
  localStorage.setItem('admin_last_activity', Date.now().toString());
  return data;
}

export async function getAdminStats() {
  return apiFetch('/admin/stats/');
}

export async function resetAdminPassword(email: string) {
  const res = await fetch(`${API_BASE}/auth/reset-password/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send reset email');
  return data;
}
