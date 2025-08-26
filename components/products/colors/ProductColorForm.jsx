'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createProductColor, updateProductColor, getProductColor } from '@/components/products/colors/productColorApi';
import { listColors } from '@/components/colors/colorApi';

export default function ProductColorForm({ productId, pcId }) {
  const isNew = pcId === 'new';

  const [form, setForm] = useState({
    ColorID: 0,
    SKU: '',
  });

  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const cs = await listColors();
        setColors(cs || []);
      } catch {}
    })();

    if (isNew) { setLoading(false); return; }

    (async () => {
      try {
        const row = await getProductColor(pcId);
        setForm({
          ColorID: Number(row.ColorID ?? 0),
          SKU: row.SKU ?? '',
        });
      } catch {
        alert('خطا در دریافت رنگ');
      } finally {
        setLoading(false);
      }
    })();
  }, [isNew, pcId]);

  const set = (k, v) => setForm(s => ({ ...s, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ColorID: Number(form.ColorID) || null,
        SKU: form.SKU || null,
      };
      if (isNew) {
        await createProductColor(productId, payload);
      } else {
        await updateProductColor(pcId, payload);
      }
      window.location.href = `/products/${productId}/colors`;
    } catch (err) {
      alert(`خطا: ${err.message || 'ثبت رنگ ناموفق بود'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-slate-500">در حال بارگذاری…</div>;

  return (
    <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-xl p-5 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start">
        <div className="md:col-span-3"><div className="text-sm text-slate-600 pt-2">رنگ</div></div>
        <div className="md:col-span-9">
          <select
            value={Number(form.ColorID)}
            onChange={(e) => set('ColorID', Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
          >
            <option value={0}>انتخاب کنید</option>
            {colors.map(c => <option key={c.ID} value={Number(c.ID)}>{c.Name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start">
        <div className="md:col-span-3"><div className="text-sm text-slate-600 pt-2">SKU</div></div>
        <div className="md:col-span-9">
          <input type="text" value={form.SKU} onChange={(e) => set('SKU', e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button disabled={saving} className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-60">
          {saving ? 'در حال ذخیره…' : 'ذخیره'}
        </button>
        <Link href={`/products/${productId}/colors`} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50">انصراف</Link>
      </div>
    </form>
  );
}
