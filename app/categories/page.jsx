'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { listCategories, deleteCategory } from '@/components/categories/categoryApi';

export default function Page() {
  const [cats, setCats] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await listCategories();
        setCats(data);
      } catch {
        alert('خطا در دریافت دسته‌ها');
      }
    })();
  }, []);

  const mapById = useMemo(() => {
    const m = new Map();
    cats.forEach(c => m.set(c.ID, c.Name ?? c.name));
    return m;
  }, [cats]);

  const onDelete = async (id) => {
    if (!confirm('حذف شود؟')) return;
    try {
      await deleteCategory(id);
      setCats(prev => prev.filter(c => c.ID !== id));
    } catch {
      alert('خطا در حذف دسته');
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">گروه ها</h1>
        <Link href="/categories/new" className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm">گروه جدید</Link>
      </div>

      <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-center">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">نام</th>
              <th className="px-3 py-2">توضیحات</th>
              <th className="px-3 py-2">والد</th>
              <th className="px-3 py-2">عملیات</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {cats.map((c, i) => (
              <tr key={c.ID} className="border-t">
                <td className="px-3 py-2">{i + 1}</td>
                <td className="px-3 py-2">{c.Name ?? c.name}</td>
                <td className="px-3 py-2">{c.Description ?? c.description}</td>
                <td className="px-3 py-2">
                  {c.ParentCategoryID
                    ? (mapById.get(c.ParentCategoryID) || c.ParentCategoryID)
                    : <span className="text-xs text-slate-400">—</span>}
                </td>
                <td className="px-3 py-2">
                  <Link href={`/categories/${c.ID}`} className="px-2 py-1 border rounded hover:bg-slate-50 ml-2">ویرایش</Link>
                  <button onClick={() => onDelete(c.ID)} className="ml-2 px-2 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50">حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
