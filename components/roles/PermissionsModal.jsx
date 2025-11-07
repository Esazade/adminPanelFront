// components/roles/PermissionsModal.jsx
'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getRolePermissions, setRolePermissions } from '@/components/roles/roleApi';

const actionOrder = ['view', 'create', 'update', 'delete']; // ترتیب نمایش اکشن‌ها
const faGroupTitles = {
  brand: 'برند',
  color: 'رنگ',
  product: 'محصول',
  user: 'کاربران',
  productColor: 'رنگ محصول',
  productColorImage: 'تصویر رنگ محصول',
  productColorSize: 'سایز محصول',
  role: 'نقش‌ها'
};

function getGroupKey(code = '') {
  // هر چیزی قبل از اولین نقطه، کلید گروه است
  // مثال: "brand.update" -> "brand"
  //       "productColorImage.view" -> "productColorImage"
  return code.split('.')[0] || 'misc';
}

function getActionKey(code = '') {
  // قسمت بعد از نقطه: view/create/update/delete/...
  return code.split('.')[1] || '';
}

export default function PermissionsModal({ role, onClose, onSaved }) {
  const [items, setItems] = useState([]);
  const [sel, setSel]   = useState([]); // لیست IDهای انتخاب‌شده
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getRolePermissions(role.ID); // [{ID, Code, Title, Assigned}]
      setItems(data);
      setSel(data.filter(x => x.Assigned).map(x => x.ID));
    })().catch(() => alert('خطا در دریافت دسترسی‌ها'));
  }, [role.ID]);

  // گروه‌بندی بر اساس prefix کُد
  const groups = useMemo(() => {
    const g = {};
    for (const p of items) {
      const gk = getGroupKey(p.Code);
      (g[gk] ||= []).push(p);
    }
    // هر گروه را داخل خودش بر اساس ترتیب اکشن‌ها مرتب کن
    for (const k of Object.keys(g)) {
      g[k].sort((a, b) => {
        const aa = actionOrder.indexOf(getActionKey(a.Code));
        const bb = actionOrder.indexOf(getActionKey(b.Code));
        return (aa === -1 ? 99 : aa) - (bb === -1 ? 99 : bb);
      });
    }
    return g;
  }, [items]);

  const toggleOne = (id) =>
    setSel(s => (s.includes(id) ? s.filter(x => x !== id) : [...s, id]));

  const toggleGroup = (ids, checked) =>
    setSel(s => {
      const set = new Set(s);
      if (checked) ids.forEach(id => set.add(id));
      else ids.forEach(id => set.delete(id));
      return Array.from(set);
    });

  const save = async () => {
    try {
      setSaving(true);
      await setRolePermissions(role.ID, sel.map(Number));
      onSaved?.();
      onClose();
    } catch {
      alert('خطا در ذخیره دسترسی‌ها');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="bg-white w-full max-w-4xl rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">دسترسی‌های نقش: {role.Name}</h3>
          <button onClick={onClose} className="px-2 py-1">✕</button>
        </div>

        {/* گرید باکس‌های گروه‌ها */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[65vh] overflow-auto pr-1">
          {Object.entries(groups).map(([gk, perms]) => (
            <GroupCard
              key={gk}
              title={faGroupTitles[gk] || gk}
              perms={perms}
              sel={sel}
              onToggleOne={toggleOne}
              onToggleGroup={toggleGroup}
            />
          ))}
        </div>

        <div className="mt-5 flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 border rounded">انصراف</button>
          <button
            disabled={saving}
            onClick={save}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
          >
            {saving ? 'در حال ذخیره…' : 'ذخیره'}
          </button>
        </div>
      </div>
    </div>
  );
}

/** کارت یک گروه با چک‌باکس والد (انتخاب همه/بخشی) + آیتم‌های زیرهم */
function GroupCard({ title, perms, sel, onToggleOne, onToggleGroup }) {
  const ids = perms.map(p => p.ID);
  const selectedCount = ids.filter(id => sel.includes(id)).length;
  const allChecked = selectedCount === ids.length && ids.length > 0;
  const someChecked = selectedCount > 0 && !allChecked;

  const parentRef = useRef(null);
  useEffect(() => {
    if (parentRef.current) parentRef.current.indeterminate = someChecked;
  }, [someChecked]);

  return (
    <div className="border rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center gap-2 font-medium">
          <input
            ref={parentRef}
            type="checkbox"
            checked={allChecked}
            onChange={(e) => onToggleGroup(ids, e.target.checked)}
          />
          <span>{title}</span>
        </label>
        <span className="text-xs text-gray-500">
          {selectedCount}/{ids.length}
        </span>
      </div>

      <div className="space-y-2">
        {perms.map(p => (
          <label key={p.ID} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={sel.includes(p.ID)}
              onChange={() => onToggleOne(p.ID)}
            />
            <span>{p.Title}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
