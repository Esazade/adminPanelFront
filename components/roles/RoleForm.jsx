'use client';

import { useEffect, useState } from 'react';
import { createRole, updateRole, getRole, listRoles } from '@/components/roles/roleApi'; 
import Link from 'next/link';

export default function RoleForm({ RoleId }) {
  const isNew = RoleId === 'new';

  const [form, setForm] = useState({
    name: '',
    description: '',
  });

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) {
      setLoading(false);
      return;
    }
    (async () => {
      const Role = await getRole(RoleId);

      setForm({
        name: Role.Name ?? '',
        description: Role.Description ?? '',
      });
      setLoading(false);
    })();
  }, [isNew, RoleId]);

  const set = (k, v) => setForm(s => ({ ...s, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        Name: form.name,
        Description: form.description,
      };

      if (isNew) {
        await createRole(payload); 
      } else {
        await updateRole(RoleId, payload); 
      }

      window.location.href = '/roles';
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
          <div className="text-sm text-slate-600 pt-2">عنوان نقش</div>
        </div>
        <div className="md:col-span-9">
          <input type="text" value={form.name} onChange={(e)=>set('name', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start">
        <div className="md:col-span-3">
          <div className="text-sm text-slate-600 pt-2">توضیحات</div>
        </div>
        <div className="md:col-span-9">
          <textarea className='resize-none' rows={5} value={form.description} onChange={(e)=>set('description', e.target.value)} />
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
        <Link href="/roles" className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50">
          انصراف
        </Link>
      </div>
    </form>
  );
}
