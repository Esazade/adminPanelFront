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

  // const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000'
  const API = 'http://localhost:5000'
  const toAbs = (u) => (!u ? '' : u.startsWith('http') ? u : `${API}${u}`)

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
              <th className="px-3 py-2">عنوان</th>
              <th className="px-3 py-2">لینک</th>
              <th className="px-3 py-2 text-center">تصویر</th>
              <th className="px-3 py-2">عملیات</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {sliders.map((s, i) => {
              const ImageUrl = toAbs(s.ImageUrl || s.ImageUrl)
              return (
              <tr key={s.ID} className="border-t">
                <td className="px-3 py-2">{i + 1}</td>
                <td className="px-3 py-2">{s.Title}</td>
                <td className="px-3 py-2">{s.LinkUrl}</td>
                <td className="px-3 py-2">
                  {ImageUrl ? (
                    <img src={ImageUrl} alt={s.Title} className="h-8 mx-auto" />
                  ) : (
                    <span className="text-xs text-slate-400">بدون لوگو</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  {hasPermission('siteSettings.manage') && (
                    <Link href={`/sliders/${s.ID}`} className="ml-2 px-2 py-1 border rounded hover:bg-slate-50">ویرایش</Link>
                  )}
                  {hasPermission('siteSettings.manage') && (
                    <button onClick={() => onDelete(s.ID)} className="ml-2 px-2 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50">حذف</button>
                  )}
                </td>
              </tr>
              );
            })}
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
