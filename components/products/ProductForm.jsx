'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProductForm({ productId }) {
  const isNew = productId === 'new';
  const [form, setForm] = useState({
    title: '', sku: '', brandId: '', categoryId: '', price: '', stock: 0, active: true,
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${productId}`, { cache: 'no-store' });
        const data = await res.json();
        setForm({
          title: data.title ?? '',
          sku: data.sku ?? '',
          brandId: data.brandId ?? '',
          categoryId: data.categoryId ?? '',
          price: data.price ?? '',
          stock: data.stock ?? 0,
          active: data.active ?? true,
        });
      } finally { setLoading(false); }
    })();
  }, [isNew, productId]);

  const set = (k, v) => setForm(s => ({ ...s, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = isNew ? 'POST' : 'PUT';
      const url = isNew ? '/api/products' : `/api/products/${productId}`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('save failed');
      window.location.href = '/products';
    } catch {
      alert('خطا در ذخیره');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="text-slate-500">درحال بارگذاری…</div>;

  return (
    <form onSubmit={onSubmit} className="bg-white border rounded-xl p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="عنوان"><input className="input" value={form.title} onChange={e=>set('title', e.target.value)} /></Field>
        <Field label="SKU"><input className="input" value={form.sku} onChange={e=>set('sku', e.target.value)} /></Field>
        <Field label="برندId"><input className="input" value={form.brandId} onChange={e=>set('brandId', e.target.value)} /></Field>
        <Field label="دستهId"><input className="input" value={form.categoryId} onChange={e=>set('categoryId', e.target.value)} /></Field>
        <Field label="قیمت"><input type="number" className="input" value={form.price} onChange={e=>set('price', +e.target.value)} /></Field>
        <Field label="موجودی"><input type="number" className="input" value={form.stock} onChange={e=>set('stock', +e.target.value)} /></Field>
        <div className="flex items-center gap-2">
          <input id="active" type="checkbox" checked={form.active} onChange={e=>set('active', e.target.checked)} />
          <label htmlFor="active" className="text-sm">فعال</label>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button disabled={saving} className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-60">
          {saving ? 'درحال ذخیره…' : 'ذخیره'}
        </button>
        <Link href="/products" className="px-4 py-2 rounded-lg border">انصراف</Link>
      </div>

      <style jsx global>{`
        .input { @apply w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-slate-200; }
      `}</style>
    </form>
  );
}

function Field({ label, children }) {
  return (
    <label className="block text-sm text-slate-600">
      <span>{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
