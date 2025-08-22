const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
const jsonHeaders = { 'Content-Type': 'application/json' };

export async function listUsers(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API}/user${qs ? `?${qs}` : ''}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('list categories failed');
  return res.json();
}

export async function getUser(id) {
  const res = await fetch(`${API}/user/${id}`, { cache: 'no-store' }); 
  if (!res.ok) throw new Error('get user failed');
  return res.json();
}

export async function updateUser(id, data) {
  const res = await fetch(`${API}/user/${id}`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || 'update user failed');
  return res.json();
}

export async function deleteUser(id) {
  const res = await fetch(`${API}/user/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(await res.text() || 'delete user failed');
  return true;
}

export async function listRoles() {
  const res = await fetch(`${API}/roles`, { cache: 'no-store' });
  if (!res.ok) throw new Error('list roles failed');
  return res.json();
}

