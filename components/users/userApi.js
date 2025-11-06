import { authHeaders } from '@/lib/auth-client';

const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
const jsonHeaders = { 'Content-Type': 'application/json' };

export async function listUsers(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API}/user${qs ? `?${qs}` : ''}`, {
    method: 'GET',
    headers: authHeaders(),
    cache: 'no-store', 
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'list brands failed');
  }
  return res.json();
}

export async function getUser(id) {
  const res = await fetch(`${API}/user/${id}`, {
    method: 'GET',
    headers: authHeaders(),
    cache: 'no-store', 
  });
  if (!res.ok) throw new Error('get user failed');
  return res.json();
}

export async function updateUser(id, data) {
  const res = await fetch(`${API}/user/${id}`, {
    method: 'PUT',
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || 'update user failed');
  return res.json();
}

export async function deleteUser(id) {
  const res = await fetch(`${API}/user/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await res.text() || 'delete user failed');
  return true;
}

export async function listRoles() {
  const res = await fetch(`${API}/roles`, {
    method: 'GET',
    headers: authHeaders(),
    cache: 'no-store', 
  });
  if (!res.ok) throw new Error('list roles failed');
  return res.json();
}

export async function registerUser(data) {
  const res = await fetch(`${API}/user/register`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'register failed');
  }

  return res.json();
}

export async function loginUser(data) {
  const res = await fetch(`${API}/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data), 
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'login failed');
  }

  return res.json();
}


export async function logout(data) {
  const res = await fetch(`${API}/user/logout`, {
    method: 'POST',
    credentials: 'include', 
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'logout failed');
  }

  return res.json();
}





