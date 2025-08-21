const API = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:5000';
import { uploadFile as coreUploadFile } from '@/lib/upload';

const jsonHeaders = { 'Content-Type': 'application/json' };

export async function listBrands(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API}/brands${qs ? `?${qs}` : ''}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('list brands failed');
  return res.json();
}

export async function getBrand(id) {
  const res = await fetch(`${API}/brands/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('get brand failed');
  return res.json();
}

export async function createBrand(data) {
  const res = await fetch(`${API}/brands`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || 'create brand failed');
  return res.json();
}

export async function updateBrand(id, data) {
  const res = await fetch(`${API}/brands/${id}`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || 'update brand failed');
  return res.json();
}

export async function deleteBrand(id) {
  const res = await fetch(`${API}/brands/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(await res.text() || 'delete brand failed');
  return true;
}

/* اختیاری: اگر آپلود جداگانه داری */
export async function uploadLogo(file) {
  return coreUploadFile(file, { folder: 'brands', maxSizeMB: 2, acceptMimePrefix: 'image/' });
}
