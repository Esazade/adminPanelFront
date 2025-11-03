const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
const jsonHeaders = { 'Content-Type': 'application/json' };

export async function listRoles(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API}/roles${qs ? `?${qs}` : ''}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('list roles failed');
  return res.json();
}

export async function getRole(id) {
  const res = await fetch(`${API}/roles/${id}`, { cache: 'no-store' }); 
  if (!res.ok) throw new Error('get Role failed');
  return res.json();
}

export async function createRole(data) {
  const res = await fetch(`${API}/roles`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || 'create role failed');
  return res.json();
}

export async function updateRole(id, data) {
  const res = await fetch(`${API}/roles/${id}`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || 'update Role failed');
  return res.json();
}

export async function deleteRole(id) {
  const res = await fetch(`${API}/roles/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(await res.text() || 'delete Role failed');
  return true;
}

export async function getRolePermissions(id) {
  const r = await fetch(`${API}/roles/${id}/permissions`, { cache: 'no-store' });
  if (!r.ok) throw new Error('get role perms failed');
  return r.json(); // [{ ID, Code, Title, Assigned }]
}

export async function setRolePermissions(id, permissionIds) {
  const r = await fetch(`${API}/roles/${id}/permissions`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify({ permissionIds })
  });
  if (!r.ok) throw new Error('set role perms failed');
  return r.json();
}

