'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { listImages, deleteImage, moveUpImage, moveDownImage } from '@/components/products/colors/images/productColorImageApi';

export default function Page() {
  const { id, colorId } = useParams();
  const productId = Array.isArray(id) ? id[0] : id;
  const pcId = Array.isArray(colorId) ? colorId[0] : colorId;

  const [rows, setRows] = useState([]);

  // const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
  const API = 'http://localhost:5000';
  const toAbs = (u) => (!u ? '' : u.startsWith('http') ? u : `${API}${u}`);

  const loadData = async () => {
    try {
      const data = await listImages(pcId);
      setRows(data);
    } catch {
      alert('خطا در دریافت تصاویر');
    }
  };

  useEffect(() => {
    if (!pcId) return;
    loadData();
  }, [pcId]);

  const onDelete = async (imageId) => {
    if (!confirm('حذف شود؟')) return;
    try {
      await deleteImage(imageId);
      setRows(prev => prev.filter(x => x.ID !== imageId));
    } catch {
      alert('خطا در حذف تصویر');
    }
  };

  const onMoveUp = async (id) => {
    try {
      await moveUpImage(id);
      await loadData();
    } catch {
      alert('خطا در تغییر ترتیب');
    }
  };

  const onMoveDown = async (id) => {
    try {
      await moveDownImage(id);
      await loadData();
    } catch {
      alert('خطا در تغییر ترتیب');
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">تصاویر محصول </h1>
        <div className="flex gap-2">
          <Link href={`/products/${productId}/colors`} className="px-3 py-2 rounded border">بازگشت</Link>
          <Link href={`/products/${productId}/colors/${pcId}/images/new`} className="px-3 py-2 rounded bg-blue-600 text-white">افزودن تصویر</Link>
        </div>
      </div>

      <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-center">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">تصویر</th>
              <th className="px-3 py-2">اصلی</th>
              <th className="px-3 py-2">جابه‌جایی</th>
              <th className="px-3 py-2">عملیات</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {rows.map((r, i) => {
              const img = toAbs(r.ImageUrl || r.imageUrl);
              return (
                <tr key={r.ID} className="border-t">
                  <td className="px-3 py-2">{i + 1}</td>
                  <td className="px-3 py-2">
                    {img ? (
                      <img src={img} alt={`Image-${r.ID}`} className="h-12 mx-auto rounded border" />
                    ) : (
                      <span className="text-xs text-slate-400">بدون تصویر</span>
                    )}
                  </td>
                  <td className="px-3 py-2">{r.IsMain ? 'بله' : 'خیر'}</td>
                  <td className="px-3 py-2">
                    <button onClick={() => onMoveUp(r.ID)} className="px-2 py-1 border rounded hover:bg-slate-50">↑</button>
                    <button onClick={() => onMoveDown(r.ID)} className="ml-1 px-2 py-1 border rounded hover:bg-slate-50">↓</button>
                  </td>
                  <td className="px-3 py-2">
                    <Link href={`/products/${productId}/colors/${pcId}/images/${r.ID}`} className="px-2 py-1 border rounded hover:bg-slate-50 ml-2">ویرایش</Link>
                    <button
                      onClick={() => onDelete(r.ID)}
                      className="ml-2 px-2 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-slate-500">تصویری ثبت نشده</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
