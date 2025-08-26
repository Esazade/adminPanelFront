'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { uploadFile } from '@/lib/upload';
import { createImage, updateImage, getImage } from '@/components/products/colors/images/productColorImageApi';

export default function ProductColorImageForm({ productId, pcId, imageId }) {
  const isNew = imageId === 'new';

  // const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
  const API = 'http://localhost:5000';
  const toAbs = (u) => (!u ? '' : u.startsWith('http') ? u : `${API}${u}`);

  const [form, setForm] = useState({
    ImageUrl: '',
    IsMain: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const previewUrl = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return toAbs(form.ImageUrl);
  }, [imageFile, form.ImageUrl]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (isNew) { setLoading(false); return; }
    (async () => {
      try {
        const row = await getImage(imageId);
        setForm({
          ImageUrl: row?.ImageUrl ?? '',
          IsMain: !!row?.IsMain,
        });
      } catch {
        alert('خطا در دریافت تصویر');
      } finally {
        setLoading(false);
      }
    })();
  }, [isNew, imageId]);

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) { alert('فقط فایل تصویری مجاز است'); return; }
    if (f.size > 2 * 1024 * 1024) { alert('حداکثر حجم 2MB'); return; }
    setImageFile(f);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = form.ImageUrl;
      if (imageFile) {
        const { url } = await uploadFile(imageFile, {
          folder: 'productColorImages',
          maxSizeMB: 2,
          acceptMimePrefix: 'image/',
        });
        imageUrl = url;
      }
      console.log("imageUrl",imageUrl);
      if (isNew && !imageUrl) {
        alert('انتخاب تصویر الزامی است');
        setSaving(false);
        return;
      }
      
      const payload = {
        ImageUrl: imageUrl,
        IsMain: !!form.IsMain,
      };

      if (isNew) await createImage(pcId, payload);
      else await updateImage(imageId, payload);

      window.location.href = `/products/${productId}/colors/${pcId}/images`;
    } catch (err) {
      alert(err?.message || 'ثبت تصویر ناموفق بود');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-slate-500">در حال بارگذاری…</div>;

  return (
    <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-xl p-5 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start">
        <div className="md:col-span-3">
          <div className="text-sm text-slate-600 pt-2">تصویر</div>
        </div>
        <div className="md:col-span-9">
          <div className="flex items-start gap-4">
            <div className="w-36 h-36 border border-slate-300 rounded-lg bg-slate-50 flex items-center justify-center overflow-hidden">
              {previewUrl ? (
                <img src={previewUrl} alt="preview" className="w-full h-full object-contain" />
              ) : (
                <span className="text-slate-400 text-xs">بدون تصویر</span>
              )}
            </div>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="block text-sm file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border file:border-slate-300 file:bg-white file:text-slate-700 file:cursor-pointer"
              />
              <div className="text-xs text-slate-500">فرمت‌های مجاز: JPG, PNG, SVG. حداکثر 2MB.</div>
              {!isNew && !imageFile && (
                <div className="text-xs text-slate-500">در صورت عدم انتخاب فایل، تصویر فعلی حفظ می‌شود.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start">
        <div className="md:col-span-3">
          <div className="text-sm text-slate-600 pt-2">اصلی</div>
        </div>
        <div className="md:col-span-9">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.IsMain}
              onChange={(e) => set('IsMain', e.target.checked)}
            />
            <span>به‌عنوان تصویر اصلی</span>
          </label>
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
          href={`/products/${productId}/colors/${pcId}/images`}
          className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
        >
          انصراف
        </Link>
      </div>
    </form>
  );
}
