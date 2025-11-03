// components/roles/PermissionsModal.jsx
'use client';
import { useEffect, useState } from 'react';
import { getRolePermissions, setRolePermissions } from '@/components/roles/roleApi';

export default function PermissionsModal({ role, onClose, onSaved }) {
    const [items, setItems] = useState([]);
    const [sel, setSel]   = useState([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        (async () => {
            const data = await getRolePermissions(role.ID); // [{ID, Code, Title, Assigned}]
            setItems(data);
            setSel(data.filter(x => x.Assigned).map(x => x.ID));
        })().catch(()=>alert('خطا در دریافت دسترسی‌ها'));
    }, [role.ID]);

    const toggle = id => setSel(s => s.includes(id) ? s.filter(x=>x!==id) : [...s, id]);

    const save = async () => {
        try {
        setSaving(true);
        await setRolePermissions(role.ID, sel.map(Number));
        onSaved?.(); onClose();
        } catch { alert('خطا در ذخیره دسترسی‌ها'); }
        finally { setSaving(false); }
    };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">دسترسی‌های نقش: {role.Name}</h3>
          <button onClick={onClose} className="px-2 py-1">✕</button>
        </div>

        <div className="grid grid-cols-2 gap-2">
        {items.map(p => (
            <label key={p.ID} className="flex items-center gap-2">
            <input type="checkbox" checked={sel.includes(p.ID)} onChange={() => toggle(p.ID)} />
            <span>{p.Title}</span>
            </label>
        ))}
        </div>

        <div className="mt-4 flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 border rounded">انصراف</button>
          <button disabled={saving} onClick={save}
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60">
            {saving ? 'در حال ذخیره…' : 'ذخیره'}
          </button>
        </div>
      </div>
    </div>
  );
}
