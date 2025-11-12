'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createCategory, updateCategory, getCategory,getParentCategory, listCategories } from './categoryApi';
import DialogBox from '@/components/ui/DialogBox';

export default function CategoryForm({ categoryId }) {
  const isNew = categoryId === 'new';
  const [allCats, setAllCats] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [dialog, setDialog] = useState({ type: '', message: '', onConfirm: null });
  const [form, setForm] = useState({
    name: '',
    description: '',
    parentCategoryId: null,
    isDelete: false,
  });
  

  const parents = useMemo(
    () => allCats.filter(c => c.ID !== (isNew ? 0 : Number(categoryId))),
    [allCats, isNew, categoryId]
  );

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
        isDelete: !!(c.isDelete ?? c.IsDelete),
      });
      setLoading(false);
    })();
  }, [isNew, categoryId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {  setDialog({type: 'error',message: 'نام کتگوری الزامی است',}); return; }
    setSaving(true);
    try {
      const payload = {
        Name: form.name,
        Description: form.description,
        ParentCategoryID: form.parentCategoryId ?? null,
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
