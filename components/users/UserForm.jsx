'use client';

import { useEffect, useState } from 'react';
import { updateUser, getUser, listRoles } from '@/components/users/userApi'; 
import Link from 'next/link';

export default function UserForm({ userId }) {
  const isNew = userId === 'new';

  const [form, setForm] = useState({
    UserName: '',
    Email: '',
    FirstName: '',
    LastName: '',
    PhoneNumber: '',
    role: 0,
  });

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const roleData = await listRoles();
        setRoles(roleData);
      } catch (err) {
        alert('خطا در دریافت نقش‌ها');
      }
    })();

    if (isNew) {
      setLoading(false);
      return;
    }
    (async () => {
      const user = await getUser(userId);

      const roleId =
        (user.RoleID ?? user.role ?? (Array.isArray(user.Roles) && user.Roles[0]?.ID) ?? 0);

      setForm({
        UserName: user.UserName ?? '',
        Email: user.Email ?? '',
        FirstName: user.FirstName ?? '',
        LastName: user.LastName ?? '',
        PhoneNumber: user.PhoneNumber ?? '',
        role: Number(roleId),
      });
      setLoading(false);
    })();
  }, [isNew, userId]);

  const set = (k, v) => setForm(s => ({ ...s, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        UserName: form.UserName,
        Email: form.Email,
        FirstName: form.FirstName,
        LastName: form.LastName,
        PhoneNumber: form.PhoneNumber,
        Role: Number(form.role),
      };

      await updateUser(userId, payload); 

      // if (isNew) {
      //   await createUser(payload); 
      // } else {
      //   await updateUser(userId, payload); 
      // }

      window.location.href = '/users';
    } catch (err) {
      alert(`خطا: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-slate-500">در حال بارگذاری…</div>;

  return (
    <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-xl p-5 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start">
        <div className="md:col-span-3">
          <div className="text-sm text-slate-600 pt-2">نام کاربری</div>
        </div>
        <div className="md:col-span-9">
          <input type="text" value={form.UserName} onChange={(e) => set('UserName', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start">
        <div className="md:col-span-3">
          <div className="text-sm text-slate-600 pt-2">ایمیل</div>
        </div>
        <div className="md:col-span-9">
          <input type="email" value={form.Email} onChange={(e) => set('Email', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start">
        <div className="md:col-span-3">
          <div className="text-sm text-slate-600 pt-2">نام</div>
        </div>
        <div className="md:col-span-9">
          <input type="text" value={form.FirstName} onChange={(e) => set('FirstName', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start">
        <div className="md:col-span-3">
          <div className="text-sm text-slate-600 pt-2">نام خانوادگی</div>
        </div>
        <div className="md:col-span-9">
          <input type="text" value={form.LastName} onChange={(e) => set('LastName', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start">
        <div className="md:col-span-3">
          <div className="text-sm text-slate-600 pt-2">شماره تلفن</div>
        </div>
        <div className="md:col-span-9">
          <input type="text" value={form.PhoneNumber} onChange={(e) => set('PhoneNumber', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start">
        <div className="md:col-span-3">
          <div className="text-sm text-slate-600 pt-2">نقش</div>
        </div>
        <div className="md:col-span-9">
          <select
            value={Number(form.role)}               
            onChange={(e) => set('role', Number(e.target.value))} 
            className="w-full border rounded px-3 py-2"
          >
            <option value={0} disabled>انتخاب کنید</option>
            {roles.map(r => (
              <option key={r.ID} value={Number(r.ID)}>{r.Name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* اکشن‌ها */}
      <div className="flex items-center gap-2">
        <button
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-60"
        >
          {saving ? 'در حال ذخیره…' : 'ذخیره'}
        </button>
        <Link href="/users" className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50">
          انصراف
        </Link>
      </div>
    </form>
  );
}
