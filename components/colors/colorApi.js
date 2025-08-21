const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
const jsonHeaders = { 'Content-Type': 'application/json' };

export async function listColors(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API}/color${qs ? `?${qs}` : ''}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('list colors failed');
  return res.json();
}

export async function getColor(id) {
  const res = await fetch(`${API}/color/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('get color failed');
  return res.json();
}

export async function createColor(data) {
  const res = await fetch(`${API}/color`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || 'create color failed');
  return res.json();
}

export async function updateColor(id, data) {
  const res = await fetch(`${API}/color/${id}`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || 'update color failed');
  return res.json();
}

export async function deleteColor(id) {
  const res = await fetch(`${API}/color/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(await res.text() || 'delete color failed');
  return true;
}
