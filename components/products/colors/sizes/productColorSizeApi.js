const API = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:5000';

const jsonHeaders = { 'Content-Type': 'application/json' };

export async function listSizes(productColorId) {
  const res = await fetch(`${API}/productColorSize/${productColorId}/sizes`, { cache: 'no-store' });
  if (!res.ok) throw new Error('list sizes failed');
  return res.json();
}

export async function getSize(id) {
  const res = await fetch(`${API}/productColorSize/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('get size failed');
  return res.json();
}

export async function createSize(productColorId, data) {
  const res = await fetch(`${API}/productColorSize/${productColorId}/sizes`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || 'create size failed');
  return res.json();
}

export async function updateSize(id, data) {
  const res = await fetch(`${API}/productColorSize/${id}`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || 'update size failed');
  return res.json();
}

export async function deleteSize(id) {
  const res = await fetch(`${API}/productColorSize/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(await res.text() || 'delete size failed');
  return true;
}
