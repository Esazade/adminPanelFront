'use client';
import { useEffect, useMemo, useState } from 'react';
import { createSliderItem, updateSliderItem, getSliderItem } from '@/components/sliders/sliderItemApi';
import { uploadFile } from '@/lib/upload';
import Link from 'next/link';

export default function SliderItemForm({ sliderId, itemId }) { 
  const isNew = itemId === 'new';  
   // const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
  const API = 'http://localhost:5000';
  const toAbs = (u) => (!u ? '' : u.startsWith('http') ? u : `${API}${u}`);

  const [form, setForm] = useState({
    title: '',
    subTitle: '',
    buttonText: '',
    linkUrl: '',
    openInNewTab: false,
    imageUrl: '',
    mobileImageUrl: '',
    isActive: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [mobileImageFile, setMobileImageFile] = useState(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const previewImg = useMemo(() => imageFile ? URL.createObjectURL(imageFile) : toAbs(form.imageUrl), [imageFile, form.imageUrl]);
  const previewMob = useMemo(() => mobileImageFile ? URL.createObjectURL(mobileImageFile) : toAbs(form.mobileImageUrl), [mobileImageFile, form.mobileImageUrl]);

  useEffect(() => {
    if (isNew) { setLoading(false); return; }
    (async () => {
      const it = await getSliderItem(sliderId,itemId);
      setForm({
        title: it.Title ?? '',
        subTitle: it.SubTitle ?? '',
        buttonText: it.ButtonText ?? '',
        linkUrl: it.LinkUrl ?? '',
        openInNewTab: !!it.OpenInNewTab,
        imageUrl: it.ImageUrl ?? '',
        mobileImageUrl: it.MobileImageUrl ?? '',
        isActive: !!it.IsActive,
      });
      setLoading(false);
    })();
  }, [isNew, itemId]);

  const onSubmit = async (e) => { 
    e.preventDefault();
    setSaving(true);

    try {
      let imageUrl = form.imageUrl;
      let mobileImageUrl = form.mobileImageUrl;

      if (imageFile) {
        const { url } = await uploadFile(imageFile, { folder: 'sliders', maxSizeMB: 3, acceptMimePrefix: 'image/' });
        imageUrl = url;
      }
      if (mobileImageFile) {
        const { url } = await uploadFile(mobileImageFile, { folder: 'sliders', maxSizeMB: 3, acceptMimePrefix: 'image/' });
        mobileImageUrl = url;
      }

      const payload = {
        SliderID: sliderId,
        Title: form.title,
        SubTitle: form.subTitle,
        ButtonText: form.buttonText,
        LinkUrl: form.linkUrl,
        OpenInNewTab: form.openInNewTab,
        ImageUrl: imageUrl,
        MobileImageUrl: mobileImageUrl,
        IsActive: form.isActive,
      };

      if (isNew) await createSliderItem(sliderId,payload);
      else await updateSliderItem(itemId, payload);
      window.location.href = `/sliders/${sliderId}/items`;
    } catch (err) {
      alert(`خطا: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-slate-500">در حال بارگذاری…</div>;

  return (
    <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-xl p-5 space-y-6">
      <div className="grid grid-cols-12 gap-3 items-center">
        <label className="col-span-3 text-sm">عنوان</label>
        <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)} className="col-span-9 border rounded p-2" />
      </div>

      <div className="grid grid-cols-12 gap-3 items-center">
        <label className="col-span-3 text-sm">زیرعنوان</label>
        <input type="text" value={form.subTitle} onChange={(e) => set('subTitle', e.target.value)} className="col-span-9 border rounded p-2" />
      </div>

      <div className="grid grid-cols-12 gap-3 items-center">
        <label className="col-span-3 text-sm">متن دکمه</label>
        <input type="text" value={form.buttonText} onChange={(e) => set('buttonText', e.target.value)} className="col-span-9 border rounded p-2" />
      </div>

      <div className="grid grid-cols-12 gap-3 items-center">
        <label className="col-span-3 text-sm">لینک</label>
        <input type="text" value={form.linkUrl} onChange={(e) => set('linkUrl', e.target.value)} className="col-span-9 border rounded p-2" />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" checked={form.openInNewTab} onChange={(e) => set('openInNewTab', e.target.checked)} />
        <span className="text-sm">باز شدن در تب جدید</span>
      </div>

      {/* تصاویر */}
      <div className="flex gap-10">
        <div>
          <label className="text-sm block mb-2">تصویر دسکتاپ</label>
          {previewImg && <img src={previewImg} className="h-32 border mb-2" />}
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
        </div>
        <div>
          <label className="text-sm block mb-2">تصویر موبایل</label>
          {previewMob && <img src={previewMob} className="h-32 border mb-2" />}
          <input type="file" accept="image/*" onChange={(e) => setMobileImageFile(e.target.files[0])} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} />
        <span className="text-sm">فعال</span>
      </div>

      <div className="flex items-center gap-2">
        <button disabled={saving} className="px-4 py-2 rounded-lg bg-blue-600 text-white">
          {saving ? 'در حال ذخیره…' : 'ذخیره'}
        </button>
        <Link href={`/sliders/${sliderId}/items`} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50">
          انصراف
        </Link>
      </div>
    </form>
  );
}
