'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { listColors, deleteColor } from '@/components/colors/colorApi';
import RequirePermission from '@/components/auth/RequirePermission';
import { hasPermission } from '@/lib/auth-client';

export default function Page() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await listColors();
        setItems(data);
      } catch(err) {
        console.error(err.message);
      }
    })();
  }, []);

  const onDelete = async (id) => {
    if (!confirm('حذف شود؟')) return;
    try {
      await deleteColor(id);
      setItems(prev => prev.filter(x => x.ID !== id));
    } catch {
      alert('خطا در حذف رنگ');
    }
  };

  return (
    <RequirePermission code="color.view">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">رنگ‌ها</h1>
        <Link href="/color/new" className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm">رنگ جدید</Link>
      </div>

      <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-center">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">نام</th>
              <th className="px-3 py-2">کد</th>
              <th className="px-3 py-2">پیش‌نمایش</th>
              <th className="px-3 py-2">عملیات</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {items.map((x, i) => {
              const name = x.Name ?? x.name;
              const code = (x.Code ?? x.code ?? '').toUpperCase();
              return (
                <tr key={x.ID} className="border-t">
                  <td className="px-3 py-2">{i + 1}</td>
                  <td className="px-3 py-2">{name}</td>
                  <td className="px-3 py-2">{code || <span className="text-xs text-slate-400">—</span>}</td>
                  <td className="px-3 py-2">
                    <div className="inline-block w-6 h-6 rounded border" style={{ backgroundColor: code || '#ffffff' }} title={code || '—'} />
                  </td>
                  <td className="px-3 py-2">
                    {hasPermission('color.update') && (
                      <Link href={`/color/${x.ID}`} className="px-2 py-1 border rounded hover:bg-slate-50 ml-2">ویرایش</Link>
                    )}
                    {hasPermission('color.delete') && (
                      <button onClick={() => onDelete(x.ID)} className="ml-2 px-2 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50">حذف</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </RequirePermission>
  );
}
