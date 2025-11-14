'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import DialogBox from '@/components/ui/DialogBox';
import { listSliderItems, deleteSliderItem } from '@/components/sliders/sliderItemApi';

export default function Page({ params }) {
  const { id } = useParams(); 
  const [items, setItems] = useState([]);
  const [dialog, setDialog] = useState({ type: '', message: '', onConfirm: null });

  // const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
  const API = 'http://localhost:5000';
  const toAbs = (u) => (!u ? '' : u.startsWith('http') ? u : `${API}${u}`);

  useEffect(() => {
    (async () => {
      const data = await listSliderItems(id);
      setItems(data);
    })();
  }, [id]);

  const onDelete = (id) => {
    setDialog({
      type: 'confirm',
      message: 'آیا از حذف این اسلایدر مطمئن هستید؟',
      onConfirm: async () => {
        try {
          await deleteSliderItem(id);
          setItems(prev => prev.filter(c => c.ID !== id));
        } catch {
          setDialog({ type: 'error', message: 'خطا در حذف اسلایدر' });
        }
      }
    });
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">آیتم‌های اسلایدر #{id}</h1>
        <div className="flex gap-2">
          <Link href={`/sliders`} className="px-3 py-2 rounded border">بازگشت</Link>
          <Link href={`/sliders/${id}/items/new`} className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm">
            آیتم جدید
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-center">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">عنوان</th>
              <th className="px-3 py-2">متن دکمه</th>
              <th className="px-3 py-2">لینک</th>
              <th className="px-3 py-2">تصویر</th>
              <th className="px-3 py-2">فعال؟</th>
              <th className="px-3 py-2">عملیات</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {items.map((it, i) => (
              
              <tr key={it.ID} className="border-t">
                <td className="px-3 py-2">{i + 1}</td>
                <td className="px-3 py-2">{it.Title}</td>
                <td className="px-3 py-2">{it.ButtonText}</td>
                <td className="px-3 py-2">
                  <a href={it.LinkUrl} target="_blank" className="text-blue-600 underline">{it.LinkUrl}</a>
                </td>
                <td className="px-3 py-2">
                  {it.ImageUrl ? <img src={toAbs(it.ImageUrl)} className="h-8 mx-auto" /> : <span className="text-slate-400">بدون تصویر</span>}
                </td>
                <td className="px-3 py-2">{it.IsActive ? '✅' : '❌'}</td>
                <td className="px-3 py-2">
                  <Link href={`/sliders/${id}/items/${it.ID}`} className="px-2 py-1 border rounded hover:bg-slate-50 ml-2">ویرایش</Link>
                  <button onClick={() => onDelete(it.ID)} className="ml-2 px-2 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50">حذف</button>
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

    </div>
  );
}
