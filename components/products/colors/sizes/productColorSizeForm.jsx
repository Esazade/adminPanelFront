'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createSize, updateSize, getSize } from '@/components/products/colors/sizes/productColorSizeApi';

export default function ProductColorSizeForm({ productId, pcId, sizeId }) {
  const isNew = sizeId === 'new';

  const [form, setForm] = useState({
    Size: '',
    Stock: '',
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) { setLoading(false); return; }
    (async () => {
      try {
        const row = await getSize(sizeId);
        setForm({
          Size: row?.Size ?? '',
          Stock: row?.Stock ?? '',
        });
      } catch {
        alert('خطا در دریافت اطلاعات');
      } finally {
        setLoading(false);
      }
    })();
  }, [isNew, sizeId]);

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        Size: form.Size === '' ? null : Number(form.Size),
        Stock: form.Stock === '' ? null : Number(form.Stock),
      };

      if (isNew) await createSize(pcId, payload);
      else await updateSize(sizeId, payload);

      window.location.href = `/products/${productId}/colors/${pcId}/sizes`;
    } catch (err) {
      alert(err?.message || 'ثبت سایز ناموفق بود');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-slate-500">در حال بارگذاری…</div>;

  return (
    <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-xl p-5 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start">
        <div className="md:col-span-3">
          <div className="text-sm text-slate-600 pt-2">سایز</div>
        </div>
        <div className="md:col-span-9">
          <input
            type="number"
            value={form.Size}
            onChange={(e) => set('Size', e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="مثلاً 42"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start">
        <div className="md:col-span-3">
          <div className="text-sm text-slate-600 pt-2">موجودی</div>
        </div>
        <div className="md:col-span-9">
          <input
            type="number"
            value={form.Stock}
            onChange={(e) => set('Stock', e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="تعداد در انبار"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-60"
        >
          {saving ? 'در حال ذخیره…' : 'ذخیره'}
        </button>
        <Link
          href={`/products/${productId}/colors/${pcId}/sizes`}
          className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
        >
          انصراف
        </Link>
      </div>
    </form>
  );
}
