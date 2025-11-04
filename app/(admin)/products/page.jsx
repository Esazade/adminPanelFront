'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { listProducts, deleteProduct } from '@/components/products/productApi';

export default function Page() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await listProducts();
        setProducts(data);
      } catch {
        alert('خطا در دریافت محصولات');
      }
    })();
  }, []);

  const onDelete = async (id) => {
    if (!confirm('حذف شود؟')) return;
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.ID !== id));
    } catch {
      alert('خطا در حذف محصول');
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">محصولات</h1>
        <Link href="/products/new" className="px-3 py-2 rounded bg-blue-600 text-white">محصول جدید</Link>
      </div>

      <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-center">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">نام</th>
              <th className="px-3 py-2">اسلاگ</th>
              <th className="px-3 py-2">قیمت پایه</th>
              <th className="px-3 py-2">قیمت فروش</th>
              <th className="px-3 py-2">دسته</th>
              <th className="px-3 py-2">برند</th>
              <th className="px-3 py-2">عملیات</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {products.map((p, i) => (
              <tr key={p.ID} className="border-t">
                <td className="px-3 py-2">{i + 1}</td>
                <td className="px-3 py-2">{p.Name}</td>
                <td className="px-3 py-2">{p.Slug ?? '—'}</td>
                <td className="px-3 py-2">{p.BasePrice ?? '—'}</td>
                <td className="px-3 py-2">{p.SalePrice ?? '—'}</td>
                <td className="px-3 py-2">{p.CategoryName ?? p.CategoryID ?? '—'}</td>
                <td className="px-3 py-2">{p.BrandName ?? p.BrandID ?? '—'}</td>
                <td className="px-3 py-2">
                  <Link href={`/products/${p.ID}`} className="px-2 py-1 border rounded hover:bg-slate-50 ml-2">ویرایش</Link>
                  <Link href={`/products/${p.ID}/colors`} className="px-2 py-1 border rounded hover:bg-slate-50 ml-2">رنگ های محصول</Link>
                  <button onClick={() => onDelete(p.ID)} className="ml-2 px-2 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50">حذف</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-slate-500">محصولی یافت نشد</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
