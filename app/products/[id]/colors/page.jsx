'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { listProductColors, deleteProductColor } from '@/components/products/colors/productColorApi';

export default function Page({ params }) { 
  const { id } = useParams();                         
  const productId = Array.isArray(id) ? id[0] : id; 

  const [rows, setRows] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await listProductColors(productId);
        setRows(data);
      } catch {
        alert('خطا در دریافت رنگ‌های محصول');
      }
    })();
  }, [productId]);

  const onDelete = async (id) => {
    if (!confirm('حذف شود؟')) return;
    try {
      await deleteProductColor(id);
      setRows(prev => prev.filter(r => r.ID !== id));
    } catch {
      alert('خطا در حذف رنگ');
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">رنگ‌های محصول </h1>
        <div className="flex gap-2">
          <Link href={`/products`} className="px-3 py-2 rounded border">بازگشت</Link>
          <Link href={`/products/${productId}/colors/new`} className="px-3 py-2 rounded bg-blue-600 text-white">افزودن رنگ</Link>
        </div>
      </div>

      <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-center">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">رنگ</th>
              <th className="px-3 py-2">SKU</th>
              <th className="px-3 py-2">عملیات</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {rows.map((r, i) => (
              <tr key={r.ID} className="border-t">
                <td className="px-3 py-2">{i + 1}</td>
                <td className="px-3 py-2">{r.ColorName ?? r.ColorID ?? '—'}</td>
                <td className="px-3 py-2">{r.SKU ?? '—'}</td>
                <td className="px-3 py-2">
                  <Link href={`/products/${productId}/colors/${r.ID}`} className="px-2 py-1 border rounded hover:bg-slate-50 ml-2">ویرایش</Link>
                  <Link href={`/products/${productId}/colors/${r.ID}/images`} className="px-2 py-1 border rounded hover:bg-slate-50 ml-2" >
                    تصاویر
                  </Link>
                  <Link href={`/products/${productId}/sizes/${r.ID}/sizes`} className="px-2 py-1 border rounded hover:bg-slate-50 ml-2" >
                    سایز
                  </Link>
                  <button onClick={() => onDelete(r.ID)} className="ml-2 px-2 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50">حذف</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={4} className="px-3 py-6 text-slate-500">رنگی ثبت نشده</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
