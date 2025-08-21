'use client';

import { createBrand, updateBrand, getBrand } from '@/components/brands/brandApi';
import { uploadFile } from '@/lib/upload';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

export default function BrandForm({ brandId }) {
  const isNew = brandId === 'new';
  // const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
  const API = 'http://localhost:5000';
  const toAbs = (u) => (!u ? '' : u.startsWith('http') ? u : `${API}${u}`);

  const [form, setForm] = useState({
    name: '',
    description: '',
    logoUrl: '',
    isDelete: false,
  });
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const previewUrl = useMemo(() => {
    if (logoFile) return URL.createObjectURL(logoFile);      
    return toAbs(form.logoUrl);                               
  }, [logoFile, form.logoUrl]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (isNew) { setLoading(false); return; }
    (async () => {
      const b = await getBrand(brandId);
      setForm({
        name: b.name ?? b.Name ?? '',
        description: b.description ?? b.Description ?? '',
        logoUrl: b.logoUrl ?? b.LogoUrl ?? '',
        isDelete: !!(b.isDelete ?? b.IsDelete),
      });
      setLoading(false);
    })();
  }, [isNew, brandId]);

  const set = (k, v) => setForm(s => ({ ...s, [k]: v }));

  const onLogoChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) { alert('فقط فایل تصویری مجاز است'); return; }
    if (f.size > 2 * 1024 * 1024) { alert('حداکثر حجم 2MB'); return; }
    setLogoFile(f);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let logoUrl = form.logoUrl;
      if (logoFile) {
        const { url } = await uploadFile(logoFile, {
          folder: 'brands',
          maxSizeMB: 2,
          acceptMimePrefix: 'image/',
        });
        logoUrl = url;
      }

      const payload = {
        Name: form.name,
        Description: form.description,
        LogoUrl: logoUrl,
        IsDelete: form.isDelete ? 1 : 0,
      };

      if (isNew) await createBrand(payload);
      else await updateBrand(brandId, payload);

      window.location.href = '/brands';
    } catch (err) {
      alert(`خطا: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-slate-500">در حال بارگذاری…</div>;

  return (
    <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-xl p-5 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start">
        <div className="md:col-span-3">
          <div className="text-sm text-slate-600 pt-2">عنوان برند</div>
        </div>
        <div className="md:col-span-9">
          <input type="text" value={form.name} onChange={(e)=>set('name', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start">
        <div className="md:col-span-3">
          <div className="text-sm text-slate-600 pt-2">توضیحات</div>
        </div>
        <div className="md:col-span-9">
          <textarea className='resize-none' rows={5} value={form.description} onChange={(e)=>set('description', e.target.value)} />
        </div>
      </div>

      {/* لوگو */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start">
        <div className="md:col-span-3">
          <div className="text-sm text-slate-600 pt-2">لوگو</div>
        </div>
        <div className="md:col-span-9">
          <div className="flex items-start gap-4">
            <div className="w-36 h-36 border border-slate-300 rounded-lg bg-slate-50 flex items-center justify-center overflow-hidden">
              {previewUrl ? (
                <img src={previewUrl} alt="logo preview" className="w-full h-full object-contain" />
              ) : (
                <span className="text-slate-400 text-xs">بدون لوگو</span>
              )}
            </div>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={onLogoChange}
                className="block text-sm file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border file:border-slate-300 file:bg-white file:text-slate-700 file:cursor-pointer"
              />
              <div className="text-xs text-slate-500">فرمت‌های مجاز: JPG, PNG, SVG. حداکثر 2MB.</div>
            </div>
          </div>
        </div>
      </div>

      {/* اکشن‌ها */}
      <div className="flex items-center gap-2">
        <button
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-60"
        >
          {saving ? 'در حال ذخیره…' : 'ذخیره'}
        </button>
        <Link href="/brands" className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50">
          انصراف
        </Link>
      </div>
    </form>
  );
}
