'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { listSliders, deleteSlider } from '@/components/sliders/sliderApi';
import RequirePermission from '@/components/auth/RequirePermission';
import DialogBox from '@/components/ui/DialogBox';
import { hasPermission } from '@/lib/auth-client';

export default function Page() {
  const [sliders, setSliders] = useState([]);
  const [dialog, setDialog] = useState({ type: '', message: '', onConfirm: null });
  const canView = hasPermission('siteSettings.view');

  useEffect(() => {
    if (!canView) return;
    (async () => {
      const data = await listSliders();
      setSliders(data);
    })();
  }, []);

  const onDelete = (id) => {
    setDialog({
      type: 'confirm',
      message: 'آیا از حذف این اسلایدر مطمئن هستید؟',
      onConfirm: async () => {
        try {
          await deleteSlider(id);
          setSliders(prev => prev.filter(c => c.ID !== id));
        } catch {
          setDialog({ type: 'error', message: 'خطا در حذف اسلایدر' });
        }
      }
    });
  };

  return (
    <RequirePermission code="siteSettings.view">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">اسلایدرها</h1>
        <Link href="/sliders/new" className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm">
          اسلایدر جدید
        </Link>
      </div>

      <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-center">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">نام</th>
              <th className="px-3 py-2">محل نمایش</th>
              <th className="px-3 py-2">نوع</th>
              <th className="px-3 py-2">فعال؟</th>
              <th className="px-3 py-2">عملیات</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {sliders.map((s, i) => (
              <tr key={s.ID} className="border-t">
                <td className="px-3 py-2">{i + 1}</td>
                <td className="px-3 py-2">{s.Name}</td>
                <td className="px-3 py-2">{s.Placement}</td>
                <td className="px-3 py-2">{s.Type}</td>
                <td className="px-3 py-2">{s.IsActive ? '✅' : '❌'}</td>
                <td className="px-3 py-2">
                  <Link href={`/sliders/${s.ID}/items`} className="ml-2 px-2 py-1 border rounded hover:bg-slate-50">آیتم‌ها</Link>
                  {hasPermission('siteSettings.manage') && (
                    <Link href={`/sliders/${s.ID}`} className="ml-2 px-2 py-1 border rounded hover:bg-slate-50">ویرایش</Link>
                  )}
                  {hasPermission('siteSettings.manage') && (
                    <button onClick={() => onDelete(s.ID)} className="ml-2 px-2 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50">حذف</button>
                  )}
                </td>
              </tr>
            ))}
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
