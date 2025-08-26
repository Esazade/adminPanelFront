
'use client';

import { useEffect, useState } from 'react';
import { createProduct, updateProduct, getProduct } from '@/components/products/productApi';
import { listCategories } from '@/components/categories/categoryApi';
import { listBrands } from '@/components/brands/brandApi';
import Link from 'next/link';

export default function ProductForm({ productId }) {
  const isNew = productId === 'new';

  const [form, setForm] = useState({
    Name: '',
    Slug: '',
    CategoryID: 0,
    BrandID: 0,
    BasePrice: '',
    SalePrice: '',
    Description: '',
  });

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [cats, brs] = await Promise.all([listCategories().catch(() => []), listBrands().catch(() => [])]);
        setCategories(cats || []);
        setBrands(brs || []);
      } catch {}
    })();

    if (isNew) { setLoading(false); return; }

    (async () => {
      try {
        const p = await getProduct(productId);
        setForm({
          Name: p.Name ?? '',
          Slug: p.Slug ?? '',
          CategoryID: Number(p.CategoryID ?? 0),
          BrandID: Number(p.BrandID ?? 0),
          BasePrice: p.BasePrice ?? '',
          SalePrice: p.SalePrice ?? '',
          Description: p.Description ?? '',
        });
      } catch {
        alert('خطا در دریافت محصول');
      } finally {
        setLoading(false);
      }
    })();
  }, [isNew, productId]);

  const set = (k, v) => setForm(s => ({ ...s, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        Name: form.Name,
        Slug: form.Slug || null,
        CategoryID: Number(form.CategoryID) || null,
        BrandID: Number(form.BrandID) || null,
        BasePrice: form.BasePrice === '' ? null : Number(form.BasePrice),
        SalePrice: form.SalePrice === '' ? null : Number(form.SalePrice),
        Description: form.Description || null,
      };

      if (isNew) {
        await createProduct(payload);
      } else {
        await updateProduct(productId, payload);
      }
      window.location.href = '/products';
    } catch (err) {
      alert(`خطا: ${err.message || 'ثبت محصول ناموفق بود'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-slate-500">در حال بارگذاری…</div>;

  return (
    <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-xl p-5 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start">
        <div className="md:col-span-3"><div className="text-sm text-slate-600 pt-2">نام</div></div>
        <div className="md:col-span-9">
          <input type="text" value={form.Name} onChange={(e) => set('Name', e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start">
        <div className="md:col-span-3"><div className="text-sm text-slate-600 pt-2">اسلاگ</div></div>
        <div className="md:col-span-9">
          <input type="text" value={form.Slug} onChange={(e) => set('Slug', e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start">
        <div className="md:col-span-3"><div className="text-sm text-slate-600 pt-2">دسته</div></div>
        <div className="md:col-span-9">
          <select value={Number(form.CategoryID)} onChange={(e) => set('CategoryID', Number(e.target.value))} className="w-full border rounded px-3 py-2">
            <option value={0}>انتخاب کنید</option>
            {categories.map(c => <option key={c.ID} value={Number(c.ID)}>{c.Name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start">
        <div className="md:col-span-3"><div className="text-sm text-slate-600 pt-2">برند</div></div>
        <div className="md:col-span-9">
          <select value={Number(form.BrandID)} onChange={(e) => set('BrandID', Number(e.target.value))} className="w-full border rounded px-3 py-2">
            <option value={0}>انتخاب کنید</option>
            {brands.map(b => <option key={b.ID} value={Number(b.ID)}>{b.Name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start">
        <div className="md:col-span-3"><div className="text-sm text-slate-600 pt-2">قیمت پایه</div></div>
        <div className="md:col-span-9">
          <input type="number" step="0.01" value={form.BasePrice} onChange={(e) => set('BasePrice', e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start">
        <div className="md:col-span-3"><div className="text-sm text-slate-600 pt-2">قیمت فروش</div></div>
        <div className="md:col-span-9">
          <input type="number" step="0.01" value={form.SalePrice} onChange={(e) => set('SalePrice', e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start">
        <div className="md:col-span-3"><div className="text-sm text-slate-600 pt-2">توضیحات</div></div>
        <div className="md:col-span-9">
          <textarea value={form.Description} onChange={(e) => set('Description', e.target.value)} className="w-full border rounded px-3 py-2 h-28" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button disabled={saving} className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-60">
          {saving ? 'در حال ذخیره…' : 'ذخیره'}
        </button>
        <Link href="/products" className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50">انصراف</Link>
      </div>
    </form>
  );
}
