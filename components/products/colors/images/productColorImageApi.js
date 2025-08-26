const API = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:5000';
import { uploadFile as coreUploadFile } from '@/lib/upload';

const jsonHeaders = { 'Content-Type': 'application/json' };

// لیست تصاویرِ یک ProductColor
export async function listImages(productColorId) {
  const res = await fetch(`${API}/productColorImage/${productColorId}/images`, { cache: 'no-store' });
  if (!res.ok) throw new Error('list images failed');
  return res.json();
}

// دریافت یک تصویر
export async function getImage(id) {
  const res = await fetch(`${API}/productColorImage/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('get image failed');
  return res.json();
}

export async function createImage(productColorId,data) {
  const res = await fetch(`${API}/productColorImage/${productColorId}/images`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || 'create image failed');
  return res.json();
}

export async function updateImage(id,data) {
  const res = await fetch(`${API}/productColorImage/${id}`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || 'update image failed');
  return res.json();
}

export async function deleteImage(id) {
  const res = await fetch(`${API}/productColorImage/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(await res.text() || 'delete image failed');
  return true;
}

export async function moveUpImage(id) {
  const res = await fetch(`${API}/productColorImage/${id}/moveUp`, { method: 'PUT' });
  if (!res.ok) throw new Error(await res.text() || 'move up failed');
  return res.json();
}

export async function moveDownImage(id) {
  const res = await fetch(`${API}/productColorImage/${id}/moveDown`, { method: 'PUT' });
  if (!res.ok) throw new Error(await res.text() || 'move down failed');
  return res.json();
}
