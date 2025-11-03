'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { listRoles, deleteRole } from '@/components/roles/roleApi';
import PermissionsModal from '@/components/roles/PermissionsModal';

export default function Page() {
  const [Roles, setRoles] = useState([]);
  const [openRole, setOpenRole] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await listRoles();
        setRoles(data);
      } catch {
        alert('خطا در دریافت نقش ها');
      }
    })();
  }, []);

  const mapById = useMemo(() => {
    const m = new Map();
    Roles.forEach(c => m.set(c.ID, c.Name ?? c.name));
    return m;
  }, [Roles]);

  const onDelete = async (id) => {
    if (!confirm('حذف شود؟')) return;
    try {
      await deleteRole(id);
      setRoles(prev => prev.filter(c => c.ID !== id));
    } catch {
      alert('خطا در حذف نقش');
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">نقش ها</h1>
        <Link href="/roles/new" className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm">نقش جدید</Link>
      </div>

      <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-center">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">عنوان نقش</th>
              <th className="px-3 py-2">عملیات</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {Roles.map((c, i) => (
              <tr key={c.ID} className="border-t">
                <td className="px-3 py-2">{i + 1}</td>
                <td className="px-3 py-2">{c.Name}</td>
                <td className="px-3 py-2">
                  <button onClick={()=>setOpenRole(c)} className="ml-2 px-2 py-1 border rounded hover:bg-slate-50">دسترسی‌ها</button>
                  <Link href={`/roles/${c.ID}`} className="px-2 py-1 border rounded hover:bg-slate-50 ml-2">ویرایش</Link>
                  <button onClick={() => onDelete(c.ID)} className="ml-2 px-2 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50">حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {openRole && (
          <PermissionsModal
            role={openRole}
            onClose={()=>setOpenRole(null)}
          />
        )}

      </div>
    </>
  );
}
