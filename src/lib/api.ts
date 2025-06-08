const API_URL = 'http://localhost:5000/api';

export const getToken = () => localStorage.getItem('token');
export const setToken = (token: string) => localStorage.setItem('token', token);
export const clearToken = () => localStorage.removeItem('token');

const authHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function register({ name, email, password }: { name: string; email: string; password: string }) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Registration failed');
  return res.json();
}

export async function verifyEmail({ email, otp }: { email: string; otp: string }) {
  const res = await fetch(`${API_URL}/auth/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Email verification failed');
  return res.json();
}

export async function login({ email, password }: { email: string; password: string }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Login failed');
  return res.json();
}

export async function fetchCategories(page = 1) {
  const res = await fetch(`${API_URL}/categories?page=${page}`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function updatePreferences(selectedCategories: number[]) {
  const res = await fetch(`${API_URL}/categories/update-preferences`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ selectedCategories }),
  });
  if (!res.ok) throw new Error('Failed to update preferences');
  return res.json();
} 