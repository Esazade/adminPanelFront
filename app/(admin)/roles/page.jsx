'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { listRoles, deleteRole } from '@/components/roles/roleApi';
import PermissionsModal from '@/components/roles/PermissionsModal';
import RequirePermission from '@/components/auth/RequirePermission';
import DialogBox from '@/components/ui/DialogBox';
import { hasPermission } from '@/lib/auth-client';

export default function Page() {
  const [Roles, setRoles] = useState([]);
  const [openRole, setOpenRole] = useState(null);
  const [dialog, setDialog] = useState({ type: '', message: '', onConfirm: null });
  const canView = hasPermission('role.view');

  useEffect(() => {
    if (!canView) return;
    (async () => {
      try {
        const data = await listRoles();
        setRoles(data);
      } catch(err) {
        console.error(err.message);
      }
    })();
  }, []);

  const mapById = useMemo(() => {
    const m = new Map();
    Roles.forEach(c => m.set(c.ID, c.Name ?? c.name));
    return m;
  }, [Roles]);

  const onDelete = (id) => {
    setDialog({
      type: 'confirm',
      message: 'آیا از حذف این نقش مطمئن هستید؟',
      onConfirm: async () => {
        try {
          await deleteRole(id);
          setRoles(prev => prev.filter(c => c.ID !== id));
        } catch {
          setDialog({ type: 'error', message: 'خطا در حذف نقش' });
        }
      }
    });
  };

  return (
    <RequirePermission code="user.view">
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
                  {hasPermission('role.update') && (
                    <>
                    <button onClick={()=>setOpenRole(c)} className="ml-2 px-2 py-1 border rounded hover:bg-slate-50">دسترسی‌ها</button>
                    <Link href={`/roles/${c.ID}`} className="px-2 py-1 border rounded hover:bg-slate-50 ml-2">ویرایش</Link>
                    </>
                  )}
                  {hasPermission('role.delete') && (
                    <button onClick={() => onDelete(c.ID)} className="ml-2 px-2 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50">حذف</button>
                  )}
                  
                  
                  
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

      <DialogBox
        type={dialog.type}
        message={dialog.message}
        onClose={() => setDialog({ type: '', message: '', onConfirm: null })}
        onConfirm={dialog.onConfirm}
      />

    </RequirePermission>
  );
}
