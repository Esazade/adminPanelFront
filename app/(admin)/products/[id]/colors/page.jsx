'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { listProductColors, deleteProductColor } from '@/components/products/colors/productColorApi';
import RequirePermission from '@/components/auth/RequirePermission';
import DialogBox from '@/components/ui/DialogBox';
import { hasPermission } from '@/lib/auth-client';

export default function Page({ params }) { 
  const { id } = useParams();                         
  const productId = Array.isArray(id) ? id[0] : id; 
  const [dialog, setDialog] = useState({ type: '', message: '', onConfirm: null });
  const canView = hasPermission('productColor.view');

  const [rows, setRows] = useState([]);
  const [ProductName, setProductName] = useState('');

  useEffect(() => {
    if (!canView) return;
    (async () => {
      try {
        const data = await listProductColors(productId); 
        setRows(data);
        if (data && data.length > 0)
          setProductName(data[0].ProductName);
      } catch(err) {
        console.error(err.message);
      }
    })();
  }, [productId]);
  
  const onDelete = (id) => {
    setDialog({
      type: 'confirm',
      message: 'آیا از حذف این رنگ مطمئن هستید؟',
      onConfirm: async () => {
        try {
          await deleteProductColor(id);
          setRows(prev => prev.filter(r => r.ID !== id));
        } catch {
          setDialog({ type: 'error', message: 'خطا در حذف رنگ' });
        }
      }
    });
  };

  return (
    <RequirePermission code="productColor.view">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">رنگ‌های محصول {ProductName}</h1>
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
                  {hasPermission('productColorImage.view') && (
                    <Link href={`/products/${productId}/colors/${r.ID}/images`} className="px-2 py-1 border rounded hover:bg-slate-50 ml-2" >
                    تصاویر
                  </Link>
                  )}
                  {hasPermission('productColorSize.view') && (
                    <Link href={`/products/${productId}/colors/${r.ID}/sizes`} className="px-2 py-1 border rounded hover:bg-slate-50 ml-2" >
                    سایز
                  </Link>
                  )}
                  {hasPermission('productColor.update') && (
                    <Link href={`/products/${productId}/colors/${r.ID}`} className="px-2 py-1 border rounded hover:bg-slate-50 ml-2">ویرایش</Link>
                  )}
                  {hasPermission('productColor.delete') && (
                    <button onClick={() => onDelete(r.ID)} className="ml-2 px-2 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50">حذف</button>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={4} className="px-3 py-6 text-slate-500">رنگی ثبت نشده</td></tr>
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

    </RequirePermission >
  );
}
