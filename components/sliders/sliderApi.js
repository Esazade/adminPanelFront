const API = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:5000';
import { authHeaders } from '@/lib/auth-client';

export async function listSliders() {
  const res = await fetch(`${API}/sliders`, {
    headers: authHeaders(),
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('list sliders failed'); 
  return res.json(); 
}

export async function getSlider(id) {
  const res = await fetch(`${API}/sliders/${id}`, {
    headers: authHeaders(),
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('get slider failed');
  return res.json();
}

export async function createSlider(data) {
  const res = await fetch(`${API}/sliders`, {
    method: 'POST',
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(await res.text() || 'create slider failed');
  return res.json();
}

export async function updateSlider(id, data) {
  const res = await fetch(`${API}/sliders/${id}`, {
    method: 'PUT',
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(await res.text() || 'update slider failed');
  return res.json();
}

export async function deleteSlider(id) {
  const res = await fetch(`${API}/sliders/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error(await res.text() || 'delete slider failed');
  return true;
}
