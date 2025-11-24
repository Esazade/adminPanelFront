'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { listCategories, deleteCategory, importCategoryExcel } from '@/components/categories/categoryApi';
import RequirePermission from '@/components/auth/RequirePermission';
import DialogBox from '@/components/ui/DialogBox';
import { hasPermission } from '@/lib/auth-client';

export default function Page() {
  const [cats, setCats] = useState([]);
  const [parentFilter, setParentFilter] = useState('all');
  const [targetCat, setTargetCat] = useState(null);  
  const [uploadingId, setUploadingId] = useState(null);
  const [dialog, setDialog] = useState({ type: '', message: '', onConfirm: null });
  const fileInputRef = useRef(null);

  const canView = hasPermission('category.view');

  useEffect(() => {
    if (!canView) return;
    (async () => {
      try {
        const data = await listCategories();
        setCats(data || []);
      } catch (err) {
        console.error(err?.message || err);
      }
    })();
  }, [canView]);

  const mapById = useMemo(() => {
    const m = new Map();
    cats.forEach(c => m.set(c.ID, c.Name ?? c.name));
    return m;
  }, [cats]);

  const parentOptions = useMemo(() => cats.filter(c => !c.ParentCategoryID), [cats]);

  const filteredCats =
    parentFilter === 'all' ? cats : cats.filter(c => c.ParentCategoryID === Number(parentFilter));

  const triggerPick = (cat) => {
    setTargetCat(cat);
    fileInputRef.current?.click();
  };

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !targetCat) return;

    setUploadingId(targetCat.ID);
    try {
      const resp = await importCategoryExcel(targetCat.ID, file);
      const newCount = resp.productCount ?? resp.summary?.productCount ?? 0;

      setCats(prev =>
        prev.map(c =>
          c.ID === targetCat.ID ? { ...c, ProductCount: newCount } : c
        )
      );
      
      setDialog({ type: 'info', message: 'فایل ارسال شد و پردازش انجام شد.' });
    } catch (err) {
      console.error(err);
      setDialog({ type: 'error', message: 'ارسال فایل ناموفق بود.' });
    } finally {
      setUploadingId(null);
      setTargetCat(null);
    }
  };

  const onDelete = (id) => {
    setDialog({
      type: 'confirm',
      message: 'آیا از حذف این کتگوری مطمئن هستید؟',
      onConfirm: async () => {
        try {
          await deleteCategory(id);
          setCats(prev => prev.filter(c => c.ID !== id));
        } catch {
          setDialog({ type: 'error', message: 'خطا در حذف دسته' });
        }
      }
    });
  };

  return (
    <RequirePermission code="category.view">
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/categories/new" className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm">
            گروه جدید
          </Link>
          <h1 className="text-2xl font-semibold">گروه ها</h1>
        </div>

        <div className="mt-3 flex gap-3 items-center ">
          <label className="text-sm text-slate-600">فیلتر بر اساس والد:</label>
          <select
            value={parentFilter}
            onChange={(e) => setParentFilter(e.target.value)}
            className="border rounded px-2 py-1 text-sm w-64"
          >
            <option value="all">همه</option>
            {parentOptions.map((p) => (
              <option key={p.ID} value={p.ID}>
                {p.Name ?? p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* input فایل مخفیِ مشترک برای همهٔ ردیف‌ها */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={onFileChange}
        className="hidden"
      />

      <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-center">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">نام</th>
              <th className="px-3 py-2">توضیحات</th>
              <th className="px-3 py-2">والد</th>
              <th className="px-3 py-2">تعداد محصول</th>
              <th className="px-3 py-2">عملیات</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {filteredCats.map((c, i) => (
              <tr key={c.ID} className="border-t">
                <td className="px-3 py-2">{i + 1}</td>
                <td className="px-3 py-2">{c.Name ?? c.name}</td>
                <td className="px-3 py-2">{c.Description ?? c.description}</td>
                <td className="px-3 py-2">
                  {c.ParentCategoryID
                    ? (mapById.get(c.ParentCategoryID) || c.ParentCategoryID)
                    : <span className="text-xs text-slate-400">—</span>}
                </td>
                <td className="px-3 py-2">{c.ProductCount ?? 0}</td>
                <td className="px-3 py-2">
                  {hasPermission('category.update') && (
                    <>
                      <button
                        onClick={() => triggerPick(c)}
                        className="ml-2 px-2 py-1 border border-emerald-300 text-emerald-700 rounded hover:bg-emerald-50 disabled:opacity-50"
                        disabled={uploadingId === c.ID}
                      >
                        {uploadingId === c.ID ? 'در حال ارسال…' : 'ورود از اکسل'}
                      </button>
                      <Link href={`/categories/${c.ID}`} className="px-2 py-1 border rounded hover:bg-slate-50 ml-2">
                        ویرایش
                      </Link>
                    </>
                  )}
                  {hasPermission('category.delete') && c.ParentCategoryID !== null && (
                      <button
                        onClick={() => onDelete(c.ID)}
                        className="ml-2 px-2 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50"
                      >
                        حذف
                      </button>
                    )}

                </td>
              </tr>
            ))}
            {filteredCats.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-slate-400 text-sm">موردی یافت نشد.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DialogBox
        type={dialog.type}
        message={dialog.message}
        onClose={() => setDialog({ type: '', message: '', onConfirm: null })}
        onConfirm={dialog.onConfirm}
      />

    </RequirePermission>
  );
}
