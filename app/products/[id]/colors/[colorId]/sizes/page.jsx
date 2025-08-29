'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { listSizes, deleteSize } from '@/components/products/colors/sizes/productColorSizeApi';

export default function Page() {
  const { id, colorId } = useParams();
  const productId = Array.isArray(id) ? id[0] : id;
  const pcId = Array.isArray(colorId) ? colorId[0] : colorId;

  const [rows, setRows] = useState([]);
  const [ProductName, setProductName] = useState('');

  const load = async () => {
    try {
      const data = await listSizes(pcId); console.log("data",data);
      setRows(data);
      if (data && data.length > 0)
        setProductName(data[0].ProductName + " " + data[0].ColorName);
    } catch {
      alert('خطا در دریافت سایزها');
    }
  };

  useEffect(() => {
    if (!pcId) return;
    load();
  }, [pcId]);

  const onDelete = async (sizeId) => {
    if (!confirm('حذف شود؟')) return;
    try {
      await deleteSize(sizeId);
      setRows((prev) => prev.filter((x) => x.ID !== sizeId));
    } catch {
      alert('خطا در حذف سایز');
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">سایزهای محصول{ProductName}</h1>
        <div className="flex gap-2">
          <Link href={`/products/${productId}/colors`} className="px-3 py-2 rounded border">بازگشت</Link>
          <Link href={`/products/${productId}/colors/${pcId}/sizes/new`} className="px-3 py-2 rounded bg-blue-600 text-white">افزودن سایز</Link>
        </div>
      </div>

      <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-center">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">سایز</th>
              <th className="px-3 py-2">موجودی</th>
              <th className="px-3 py-2">عملیات</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {rows.map((r, i) => (
              <tr key={r.ID} className="border-t">
                <td className="px-3 py-2">{i + 1}</td>
                <td className="px-3 py-2">{r.Size ?? '—'}</td>
                <td className="px-3 py-2">{r.Stock ?? '—'}</td>
                <td className="px-3 py-2">
                  <Link
                    href={`/products/${productId}/colors/${pcId}/sizes/${r.ID}`}
                    className="px-2 py-1 border rounded hover:bg-slate-50 ml-2"
                  >
                    ویرایش
                  </Link>
                  <button
                    onClick={() => onDelete(r.ID)}
                    className="ml-2 px-2 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-slate-500">سایزی ثبت نشده</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
