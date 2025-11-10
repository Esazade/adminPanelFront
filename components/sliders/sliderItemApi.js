const API = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:5000';
import { authHeaders } from '@/lib/auth-client';

export async function listSliderItems(sliderId) { 
  const res = await fetch(`${API}/sliders/${sliderId}/items`, {
    headers: authHeaders(),
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('list items failed');
  return res.json();
}

export async function getSliderItem(id) {
  const res = await fetch(`${API}/sliders/items/${id}`, {   
    headers: authHeaders(),
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('get item failed');
  return res.json();
}

export async function createSliderItem(data) {
  const res = await fetch(`${API}/sliders/items`, {         
    method: 'POST',
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(await res.text() || 'create item failed');
  return res.json();
}

export async function updateSliderItem(id, data) {
  const res = await fetch(`${API}/sliders/items/${id}`, {  
    method: 'PUT',
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(await res.text() || 'update item failed');
  return res.json();
}

export async function deleteSliderItem(id) {
  const res = await fetch(`${API}/sliders/items/${id}`, {  
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error(await res.text() || 'delete item failed');
  return true;
}
