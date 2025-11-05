'use client';

const TOKEN_KEY = 'access_token';

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

export function authHeaders(extra = {}) {
  const token = getToken();
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

function base64UrlDecode(str) {
  try {
    const padded = str.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

export function getClaims() {
  const token = getToken();
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const payload = base64UrlDecode(parts[1]);
  if (!payload) return null;

  if (typeof payload.exp === 'number' && payload.exp * 1000 < Date.now()) {
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }

  return payload;
}

export function hasPermission(code) {
  const claims = getClaims();
  const perms = claims?.permissions || [];
  return perms.includes(code);
}
