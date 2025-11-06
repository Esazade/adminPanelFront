const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
const jsonHeaders = { 'Content-Type': 'application/json' };
import { authHeaders } from '@/lib/auth-client';

export async function listProductColors(productId) {
  const res = await fetch(`${API}/productColor/${productId}/colors`, {
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

export async function getProductColor(pcId) {
  const res = await fetch(`${API}/productColor/${pcId}`, {
    method: 'GET',
    headers: authHeaders(),
    cache: 'no-store', 
  });
  if (!res.ok) throw new Error('get product color failed');
  return res.json();
}

export async function createProductColor(productId, data) {
  const res = await fetch(`${API}/productColor/${productId}/colors`, {
    method: 'POST',
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || 'create product color failed');
  return res.json();
}

export async function updateProductColor(pcId, data) {
  const res = await fetch(`${API}/productColor/${pcId}`, {
    method: 'PUT',
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || 'update product color failed');
  return res.json();
}

// حذف
export async function deleteProductColor(pcId) {
  const res = await fetch(`${API}/productColor/${pcId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await res.text() || 'delete product color failed');
  return true;
}

