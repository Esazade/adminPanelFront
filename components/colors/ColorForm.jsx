'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createColor, updateColor, getColor } from './colorApi';
import DialogBox from '@/components/ui/DialogBox';
import { HexColorPicker } from 'react-colorful';

function normalizeHex(v) {
  if (!v) return '';
  let s = v.trim().toUpperCase();
  if (s.startsWith('#')) s = s.slice(1);
  s = s.replace(/[^0-9A-F]/g, '').slice(0, 6);
  if (s.length === 3) s = s.split('').map(ch => ch + ch).join('');
  return s ? `#${s}` : '';
}

export default function ColorForm({ colorId }) {
  const isNew = colorId === 'new';
  const [dialog, setDialog] = useState({ type: '', message: '', onConfirm: null });

  const [form, setForm] = useState({
    name: '',
    code: ''
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(s => ({ ...s, [k]: v }));

  useEffect(() => {
    if (isNew) { setLoading(false); return; }
    (async () => {
      const c = await getColor(colorId);
      setForm({
        name: c.name ?? c.Name ?? '',
        code: normalizeHex(c.code ?? c.Code ?? '')
      });
      setLoading(false);
    })();
  }, [isNew, colorId]);

  const preview = useMemo(
    () => (form.code ? form.code : '#ffffff'),
    [form.code]
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setDialog({type: 'error',message: 'نام الزامی است',}); return; }

    const payload = {
      Name: form.name,
      Code: form.code // مانند #RRGGBB
    };

    setSaving(true);
    try {
      if (isNew) await createColor(payload);
      else await updateColor(colorId, payload);
      window.location.href = '/color';
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
        <div className="md:col-span-3"><div className="text-sm text-slate-600 pt-2">نام</div></div>
        <div className="md:col-span-9">
          <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} className="w-full p-2 border rounded" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start">
        <div className="md:col-span-3"><div className="text-sm text-slate-600 pt-2">کد رنگ</div></div>
        <div className="md:col-span-9">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded border" style={{ backgroundColor: preview }} title={form.code || '—'} />
            <input
              type="text"
              placeholder="#RRGGBB"
              value={form.code}
              onChange={(e) => set('code', normalizeHex(e.target.value))}
              className="w-[160px] p-2 border rounded"
            />
            <input
              type="color"
              value={form.code || '#ffffff'}
              onChange={(e) => set('code', e.target.value.toUpperCase())}
              className="w-10 h-10 p-0 border rounded cursor-pointer"
              title="انتخاب از پیکر رنگ"
            />
            {form.code && (
              <button type="button" onClick={() => set('code', '')} className="px-3 py-2 rounded-lg border hover:bg-slate-50">
                پاک کردن
              </button>
            )}
          </div>

          <div className="max-w-sm">
            <HexColorPicker
              color={form.code || '#FFFFFF'}
              onChange={(c) => set('code', c.toUpperCase())}
            />
          </div>
          <div className="text-xs text-slate-500 mt-2">
            می‌توانید کد را دستی وارد کنید (مثلاً <code>#FFAA00</code>) یا از پیکر رنگ انتخاب کنید.
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button disabled={saving} className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-60">
          {saving ? 'در حال ذخیره…' : 'ذخیره'}
        </button>
        <Link href="/colors" className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50">انصراف</Link>
      </div>

      <DialogBox
        type={dialog.type}
        message={dialog.message}
        onClose={() => setDialog({ type: '', message: '' })}
        onConfirm={dialog.onConfirm}
      />

    </form>
  );
}
