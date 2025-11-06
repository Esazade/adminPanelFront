
const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
const jsonHeaders = { 'Content-Type': 'application/json' };
import { authHeaders } from '@/lib/auth-client';

export async function listProducts(params = {}) {
  const qs = new URLSearchParams(params).toString();

  const res = await fetch(`${API}/product${qs ? `?${qs}` : ''}`, {
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

export async function getProduct(id) {
  const res = await fetch(`${API}/product/${id}`, {
    method: 'GET',
    headers: authHeaders(),
    cache: 'no-store', 
  });
  if (!res.ok) throw new Error('get product failed');
  return res.json();
}

export async function createProduct(data) {
  const res = await fetch(`${API}/product`, {
    method: 'POST',
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || 'create product failed');
  return res.json();
}

export async function updateProduct(id, data) {
  const res = await fetch(`${API}/product/${id}`, {
    method: 'PUT',
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || 'update product failed');
  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${API}/product/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
  if (!res.ok) throw new Error(await res.text() || 'delete product failed');
  return true;
}

