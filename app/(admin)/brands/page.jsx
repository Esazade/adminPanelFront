'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { listBrands, deleteBrand } from '@/components/brands/brandApi';
import RequirePermission from '@/components/auth/RequirePermission';
import { hasPermission } from '@/lib/auth-client';

export default function Page() {
  const [brands, setBrands] = useState([]);

  // const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000'
  const API = 'http://localhost:5000'
  const toAbs = (u) => (!u ? '' : u.startsWith('http') ? u : `${API}${u}`)

  useEffect(() => {
    (async () => {
      try {
        const data = await listBrands();
        setBrands(data);
      } catch(err) {
        console.error(err.message);
      }
    })();
  }, []);

  const onDelete = async (id) => {
    if (!confirm('حذف شود؟')) return;
    try {
      await deleteBrand(id);
      setBrands(prev => prev.filter(b => b.ID !== id));
    } catch {
      alert('خطا در حذف برند');
    }
  };

  return (
    <RequirePermission code="brand.view">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">برندها</h1>
        <Link href="/brands/new" className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm">برند جدید</Link>
      </div>

      <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-center">
            <tr>
              <th className="px-3 py-2 text-center">#</th>
              <th className="px-3 py-2 text-center">نام</th>
              <th className="px-3 py-2 text-center">توضیحات</th>
              <th className="px-3 py-2 text-center">لوگو</th>
              <th className="px-3 py-2 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {brands.map((b, i) => {
              // const logo = b.LogoUrl || b.logoUrl;
              const logo = toAbs(b.LogoUrl || b.logoUrl)
              return (
                <tr key={b.ID} className="border-t">
                  <td className="px-3 py-2">{i + 1}</td>
                  <td className="px-3 py-2">{b.Name}</td>
                  <td className="px-3 py-2">{b.Description}</td>
                  <td className="px-3 py-2">
                    {logo ? (
                      <img src={logo} alt={b.Name} className="h-8 mx-auto" />
                    ) : (
                      <span className="text-xs text-slate-400">بدون لوگو</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {hasPermission('brand.update') && (
                      <Link href={`/brands/${b.ID}`} className="px-2 py-1 border rounded hover:bg-slate-50 ml-2" >ویرایش</Link>
                    )}
                    {hasPermission('brand.delete') && (
                      <button onClick={() => onDelete(b.ID)} className="ml-2 px-2 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50">حذف</button>
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
