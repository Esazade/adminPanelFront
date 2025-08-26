const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
const jsonHeaders = { 'Content-Type': 'application/json' };

// لیست رنگ‌های محصول
export async function listProductColors(productId) {
  const res = await fetch(`${API}/productColor/${productId}/colors`, { cache: 'no-store' });
  if (!res.ok) throw new Error('list product colors failed');
  return res.json();
}

// دریافت یک ردیف رنگ محصول
export async function getProductColor(pcId) {
  const res = await fetch(`${API}/productColor/${pcId}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('get product color failed');
  return res.json();
}

// ایجاد رنگ برای محصول
export async function createProductColor(productId, data) {
  const res = await fetch(`${API}/productColor/${productId}/colors`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || 'create product color failed');
  return res.json();
}

// ویرایش رنگ محصول
export async function updateProductColor(pcId, data) {
  const res = await fetch(`${API}/productColor/${pcId}`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || 'update product color failed');
  return res.json();
}

// حذف
export async function deleteProductColor(pcId) {
  const res = await fetch(`${API}/productColor/${pcId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(await res.text() || 'delete product color failed');
  return true;
}

