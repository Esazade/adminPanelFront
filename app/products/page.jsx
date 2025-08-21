'use client';
import Link from 'next/link';
import { useState, useMemo } from 'react';

const mock = [
  { id: 101, title: 'کیف دستی کرافت', sku: 'KRF-001', brand: 'Toorang', category: 'ساک دستی', price: 89000, active: true, stock: 34 },
  { id: 102, title: 'جعبه کیبوردی', sku: 'KBX-220', brand: 'NoBrand', category: 'جعبه', price: 129000, active: true, stock: 12 },
  { id: 103, title: 'لیبل پستی', sku: 'LBL-030', brand: 'Toorang', category: 'لیبل', price: 49000, active: false, stock: 0 },
];

export default function Page() {
  const [q, setQ] = useState('');
  const [rows, setRows] = useState(mock);

  const filtered = useMemo(() => (
    rows.filter(x =>
      [x.title, x.sku, x.brand, x.category].join(' ').toLowerCase().includes(q.toLowerCase())
    )
  ), [q, rows]);

  const onDelete = (id) => {
    if (!confirm('حذف شود؟')) return;
    // TODO: فراخوانی API حذف
    setRows(rows => rows.filter(r => r.id !== id));
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">محصولات</h1>
        <Link href="/products/new" className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm">محصول جدید</Link>
      </div>

      <div className="mb-3">
        <input
          className="w-full md:w-80 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-slate-200"
          placeholder="جستجو در عنوان/کد/برند/دسته…"
          value={q} onChange={(e)=>setQ(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-3 py-2 text-right">#</th>
              <th className="px-3 py-2 text-right">عنوان</th>
              <th className="px-3 py-2 text-right">SKU</th>
              <th className="px-3 py-2 text-right">برند</th>
              <th className="px-3 py-2 text-right">دسته</th>
              <th className="px-3 py-2 text-right">قیمت</th>
              <th className="px-3 py-2 text-right">موجودی</th>
              <th className="px-3 py-2 text-right">وضعیت</th>
              <th className="px-3 py-2 text-left">اکشن</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} className="border-t">
                <td className="px-3 py-2">{i+1}</td>
                <td className="px-3 py-2">{p.title}</td>
                <td className="px-3 py-2">{p.sku}</td>
                <td className="px-3 py-2">{p.brand}</td>
                <td className="px-3 py-2">{p.category}</td>
                <td className="px-3 py-2">{p.price.toLocaleString()}</td>
                <td className="px-3 py-2">{p.stock}</td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-0.5 rounded text-xs ${p.active ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-700'}`}>
                    {p.active ? 'فعال' : 'غیرفعال'}
                  </span>
                </td>
                <td className="px-3 py-2 text-left">
                  <div className="flex items-center gap-2 justify-end md:justify-start">
                    <Link href={`/products/${p.id}`} className="px-2 py-1 rounded border text-slate-700 hover:bg-slate-50">ویرایش</Link>
                    <button onClick={()=>onDelete(p.id)} className="px-2 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50">حذف</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length===0 && (
              <tr><td colSpan={9} className="px-3 py-8 text-center text-slate-500">محصولی یافت نشد.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
