const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
const jsonHeaders = { 'Content-Type': 'application/json' };
import { authHeaders } from '@/lib/auth-client';

export async function listCategories(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API}/category${qs ? `?${qs}` : ''}`, {
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

export async function FilteredCategory(id) {
  const res = await fetch(`${API}/category/filter`, {
      method: 'GET',
      headers: authHeaders(),
      cache: 'no-store', 
  });
  if (!res.ok) throw new Error('get category failed');
  return res.json();
}

export async function getParentCategory(id) {
  const res = await fetch(`${API}/category/parents`, {
      method: 'GET',
      headers: authHeaders(),
      cache: 'no-store', 
  });
  if (!res.ok) throw new Error('get category failed');
  return res.json();
}

export async function getCategory(id) {
  const res = await fetch(`${API}/category/${id}`, {
      method: 'GET',
      headers: authHeaders(),
      cache: 'no-store', 
  });
  if (!res.ok) throw new Error('get category failed');
  return res.json();
}

export async function createCategory(data) {
  const res = await fetch(`${API}/category`, {
    method: 'POST',
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || 'create category failed');
  return res.json();
}

export async function updateCategory(id, data) {
  const res = await fetch(`${API}/category/${id}`, {
    method: 'PUT',
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || 'update category failed');
  return res.json();
}

export async function deleteCategory(id) {
  const res = await fetch(`${API}/category/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await res.text() || 'delete category failed');
  return true;
}

export async function importCategoryExcel(id, file) {
  const form = new FormData();
  form.append('file', file);

  const headers = { ...(authHeaders() || {}) };
  delete headers['Content-Type'];

  const res = await fetch(`${API}/category/${id}/import-excel`, {
    method: 'POST',
    headers,
    body: form,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return data;
}