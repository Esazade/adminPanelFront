const API = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:5000';
import { uploadFile as coreUploadFile } from '@/lib/upload';
import { authHeaders } from '@/lib/auth-client';

export async function listBrands(params = {}) {
  const qs = new URLSearchParams(params).toString();

  const res = await fetch(`${API}/brands${qs ? `?${qs}` : ''}`, {
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

export async function getBrand(id) {
  const res = await fetch(`${API}/brands/${id}`, {
    method: 'GET',
    headers: authHeaders(),
    cache: 'no-store', 
  });
  if (!res.ok) throw new Error('get brand failed');
  return res.json();
}

export async function createBrand(data) {
  const res = await fetch(`${API}/brands`, {
    method: 'POST',
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || 'create brand failed');
  return res.json();
}

export async function updateBrand(id, data) {
  const res = await fetch(`${API}/brands/${id}`, {
    method: 'PUT',
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || 'update brand failed');
  return res.json();
}

export async function deleteBrand(id) {
  const res = await fetch(`${API}/brands/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await res.text() || 'delete brand failed');
  return true;
}

/* اختیاری: اگر آپلود جداگانه داری */
export async function uploadLogo(file) {
  return coreUploadFile(file, { folder: 'brands', maxSizeMB: 2, acceptMimePrefix: 'image/' });
}
