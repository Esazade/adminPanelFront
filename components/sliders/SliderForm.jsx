'use client';
import { useEffect, useState , useMemo } from 'react';
import { uploadFile } from '@/lib/upload';
import { createSlider, updateSlider, getSlider } from '@/components/sliders/sliderApi';
import DialogBox from '@/components/ui/DialogBox';
import Link from 'next/link';

export default function SliderForm({ sliderId }) {
  const isNew = sliderId === 'new';
  const [dialog, setDialog] = useState({ type: '', message: '', onConfirm: null });

  // const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
  const API = 'http://localhost:5000';
  const toAbs = (u) => (!u ? '' : u.startsWith('http') ? u : `${API}${u}`);

  const [form, setForm] = useState({
    title: '',
    linkUrl: '',
    ImageUrl: '',
    description: '',
    isDelete: false,
  });
  const [ImageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const previewUrl = useMemo(() => {
      if (ImageFile) return URL.createObjectURL(ImageFile);      
      return toAbs(form.ImageUrl);                               
  }, [ImageFile, form.ImageUrl]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  useEffect(() => {
    if (isNew) { setLoading(false); return; }
    (async () => {
      const s = await getSlider(sliderId);
      setForm({
        title: s.Title ?? '',
        linkUrl: s.LinkUrl ?? '',
        ImageUrl: s.ImageUrl ?? '',
        description: s.Description ?? '',
      });
      setLoading(false);
    })();
  }, [sliderId, isNew]);

  const onImageChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) { setDialog({type: 'error',message: 'فقط فایل تصویری مجاز است',}); return; }
    if (f.size > 2 * 1024 * 1024) { setDialog({type: 'error',message: 'حداکثر حجم 2MB',}); return; }
    setImageFile(f);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = form.ImageUrl;
      if (ImageFile) {
        const { url } = await uploadFile(ImageFile, {
          folder: 'sliders',
          maxSizeMB: 2,
          acceptMimePrefix: 'image/',
        });
        imageUrl = url;
      }

      const payload = {
        Title: form.title,
        LinkUrl: form.linkUrl,
        ImageUrl: imageUrl,
        Description: form.description,
      };
      if (isNew) await createSlider(payload);
      else await updateSlider(sliderId, payload);
      window.location.href = '/sliders';
    } catch (err) {
      setDialog({type: 'error',message: `خطا: ${err.message}`,});
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-slate-500">در حال بارگذاری…</div>;

  return (
    <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-xl p-5 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start">
        <div className="md:col-span-3">
          <div className="text-sm text-slate-600 pt-2">عنوان اسلایدر</div>
        </div>
        <div className="md:col-span-9">
          <input type="text" value={form.title} onChange={(e)=>set('title', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start">
        <div className="md:col-span-3">
          <div className="text-sm text-slate-600 pt-2"> لینک</div>
        </div>
        <div className="md:col-span-9">
          <input type="text" value={form.linkUrl} onChange={(e)=>set('linkUrl', e.target.value)} placeholder="https://example.com" />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3 items-start">
        <label className="col-span-3 text-sm">توضیحات</label>
        <textarea
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          className="col-span-9 border rounded p-2"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start">
        <div className="md:col-span-3">
          <div className="text-sm text-slate-600 pt-2">تصویر</div>
        </div>
        <div className="md:col-span-9">
          <div className="flex items-start gap-4">
            <div className="w-36 h-36 border border-slate-300 rounded-lg bg-slate-50 flex items-center justify-center overflow-hidden">
              {previewUrl ? (
                <img src={previewUrl} alt="logo preview" className="w-full h-full object-contain" />
              ) : (
                <span className="text-slate-400 text-xs">بدون تصویر</span>
              )}
            </div>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className="block text-sm file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border file:border-slate-300 file:bg-white file:text-slate-700 file:cursor-pointer"
              />
              <div className="text-xs text-slate-500">فرمت‌های مجاز: JPG, PNG, SVG. حداکثر 2MB.</div>
              <div className="text-xs text-slate-500">سایز تصویر :  عرض = 1400 ، ارتفاع = 550</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button disabled={saving} className="px-4 py-2 rounded-lg bg-blue-600 text-white">
          {saving ? 'در حال ذخیره…' : 'ذخیره'}
        </button>
        <Link href="/sliders" className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50">
          انصراف
        </Link>
      </div>

      <DialogBox
        type={dialog.type}
        message={dialog.message}
        onClose={() => setDialog({ type: '', message: '' })}
        onConfirm={dialog.onConfirm}
      />

    </form>
  );
}