const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
const jsonHeaders = { 'Content-Type': 'application/json' };

export async function listCategories(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API}/category${qs ? `?${qs}` : ''}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('list categories failed');
  return res.json();
}

export async function getCategory(id) {
  const res = await fetch(`${API}/category/${id}`, { cache: 'no-store' }); 
  if (!res.ok) throw new Error('get category failed');
  return res.json();
}

export async function createCategory(data) {
  const res = await fetch(`${API}/category`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || 'create category failed');
  return res.json();
}

export async function updateCategory(id, data) {
  const res = await fetch(`${API}/category/${id}`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || 'update category failed');
  return res.json();
}

export async function deleteCategory(id) {
  const res = await fetch(`${API}/category/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(await res.text() || 'delete category failed');
  return true;
}
