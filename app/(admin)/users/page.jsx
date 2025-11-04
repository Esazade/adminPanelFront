'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { listUsers, deleteUser } from '@/components/users/userApi';

export default function Page() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await listUsers();
        setUsers(data);
      } catch {
        alert('خطا در دریافت کاربران');
      }
    })();
  }, []);

  const mapById = useMemo(() => {
    const m = new Map();
    users.forEach(c => m.set(c.ID, c.Name ?? c.name));
    return m;
  }, [users]);

  const onDelete = async (id) => {
    if (!confirm('حذف شود؟')) return;
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(c => c.ID !== id));
    } catch {
      alert('خطا در حذف کاربر');
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">کاربران</h1>
      </div>

      <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-center">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">نام و نام خانوادگی</th>
              <th className="px-3 py-2">نام کاربری</th>
              <th className="px-3 py-2">شماره تلفن</th>
              <th className="px-3 py-2">نقش‌ها</th>
              <th className="px-3 py-2">عملیات</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {users.map((c, i) => (
              <tr key={c.ID} className="border-t">
                <td className="px-3 py-2">{i + 1}</td>
                <td className="px-3 py-2">{c.FirstName} {c.LastName}</td>
                <td className="px-3 py-2">{c.UserName}</td>
                <td className="px-3 py-2">{c.PhoneNumber}</td>
                <td className="px-3 py-2">
                  {c.Roles && c.Roles.length > 0
                    ? c.Roles.map(r => r.Name).join('، ')
                    : '---'}
                </td>
                <td className="px-3 py-2">
                  <Link href={`/users/${c.ID}`} className="px-2 py-1 border rounded hover:bg-slate-50 ml-2">ویرایش</Link>
                  <button onClick={() => onDelete(c.ID)} className="ml-2 px-2 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50">حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
