'use client';

import { useEffect, useMemo, useState } from 'react';
import { uploadFile } from '@/lib/upload';
import Link from 'next/link';
import { createCategory, updateCategory, getCategory,getParentCategory, listCategories } from './categoryApi';
import DialogBox from '@/components/ui/DialogBox';

export default function CategoryForm({ categoryId }) {
  const isNew = categoryId === 'new';
  const [allCats, setAllCats] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [dialog, setDialog] = useState({ type: '', message: '', onConfirm: null });
  const [ImageFile, setImageFile] = useState(null);

  // const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
  const API = 'http://localhost:5000';
  const toAbs = (u) => (!u ? '' : u.startsWith('http') ? u : `${API}${u}`);

  const [form, setForm] = useState({
    name: '',
    description: '',
    parentCategoryId: null,
    ImageUrl: '',
    isDelete: false,
  });
  
  const previewUrl = useMemo(() => {
    if (ImageFile) return URL.createObjectURL(ImageFile);      
    return toAbs(form.ImageUrl);                               
  }, [ImageFile, form.ImageUrl]);

  const parents = useMemo(
    () => allCats.filter(c => c.ID !== (isNew ? 0 : Number(categoryId))),
    [allCats, isNew, categoryId]
  );

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const set = (k, v) => setForm(s => ({ ...s, [k]: v }));

  useEffect(() => {
    (async () => {
      const list = await getParentCategory(); 
      setAllCats(list);
    })();
  }, []);

  useEffect(() => {
    if (isNew) { setLoading(false); return; }
    (async () => {
      const c = await getCategory(categoryId);
      setForm({
        name: c.name ?? c.Name ?? '',
        description: c.description ?? c.Description ?? '',
        parentCategoryId: c.parentCategoryId ?? c.ParentCategoryID ?? null,
        ImageUrl: c.ImageUrl ?? c.ImageUrl ?? '',
        isDelete: !!(c.isDelete ?? c.IsDelete),
      });
      setLoading(false);
    })();
  }, [isNew, categoryId]);

  const onImageChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) { setDialog({type: 'error',message: 'فقط فایل تصویری مجاز است',}); return; }
    if (f.size > 2 * 1024 * 1024) { setDialog({type: 'error',message: 'حداکثر حجم 2MB',}); return; }
    setImageFile(f);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {  setDialog({type: 'error',message: 'نام کتگوری الزامی است',}); return; }
    setSaving(true);
    try {
      let ImageUrl = form.ImageUrl;
      if (ImageFile) {
        const { url } = await uploadFile(ImageFile, {
          folder: 'category',
          maxSizeMB: 2,
          acceptMimePrefix: 'image/',
        });
        ImageUrl = url;
      }

      const payload = {
        Name: form.name,
        Description: form.description,
        ParentCategoryID: form.parentCategoryId ?? null,
        ImageUrl: ImageUrl,
        IsDelete: form.isDelete ? 1 : 0,
      };

      if (isNew) await createCategory(payload);
      else await updateCategory(categoryId, payload);
      window.location.href = '/categories';
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
        <div className="md:col-span-3"><div className="text-sm text-slate-600 pt-2">نام</div></div>
        <div className="md:col-span-9">
          <input type="text" value={form.name} onChange={(e)=>set('name', e.target.value)} className="w-full border rounded px-3 py-2"/>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start">
        <div className="md:col-span-3"><div className="text-sm text-slate-600 pt-2">توضیحات</div></div>
        <div className="md:col-span-9">
          <textarea rows={4} value={form.description} onChange={(e)=>set('description', e.target.value)} className="w-full border rounded px-3 py-2 resize-none"/>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start">
        <div className="md:col-span-3"><div className="text-sm text-slate-600 pt-2">والد</div></div>
        <div className="md:col-span-9">
          <select
            value={form.parentCategoryId ?? ''}
            onChange={(e)=>set('parentCategoryId', e.target.value ? Number(e.target.value) : null)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">بدون والد</option>
            {parents.map(p => <option key={p.ID} value={p.ID}>{p.Name ?? p.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start">
        <div className="md:col-span-3">
          <div className="text-sm text-slate-600 pt-2">تصویر</div>
        </div>
        <div className="md:col-span-9">
          <div className="flex items-start gap-4">
            <div className="w-36 h-36 border border-slate-300 rounded-lg bg-slate-50 flex items-center justify-center overflow-hidden">
              {previewUrl ? (
                <img src={previewUrl} alt="Image preview" className="w-full h-full object-contain" />
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
            </div>
          </div>
        </div>
      </div>


      <div className="flex items-center gap-2">
        <button disabled={saving} className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-60">
          {saving ? 'در حال ذخیره…' : 'ذخیره'}
        </button>
        <Link href="/categories" className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50">انصراف</Link>
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
