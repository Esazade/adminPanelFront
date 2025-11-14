'use client';
import { useEffect, useState } from 'react';
import { createSlider, updateSlider, getSlider } from '@/components/sliders/sliderApi';
import DialogBox from '@/components/ui/DialogBox';
import Link from 'next/link';

export default function SliderForm({ sliderId }) {
  const isNew = sliderId === 'new';
  const [dialog, setDialog] = useState({ type: '', message: '', onConfirm: null });
  const [form, setForm] = useState({
    name: '',
    placement: '',
    type: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  useEffect(() => {
    if (isNew) { setLoading(false); return; }
    (async () => {
      const s = await getSlider(sliderId);
      setForm({
        name: s.Name ?? '',
        placement: s.Placement ?? '',
        type: s.Type ?? '',
        isActive: !!s.IsActive,
      });
      setLoading(false);
    })();
  }, [sliderId, isNew]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        Name: form.name,
        Placement: form.placement,
        Type: form.type,
        IsActive: form.isActive,
      };
      if (isNew) await createSlider(payload);
      else await updateSlider(sliderId, payload);
      window.location.href = '/sliders';
    } catch (err) {
      setDialog({type: 'error',message: `خطا: ${err.message}`,});
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-slate-500">در حال بارگذاری…</div>;

  return (
    <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-xl p-5 space-y-6">
      <div className="grid grid-cols-12 gap-3 items-center">
        <label className="col-span-3 text-sm">نام اسلایدر</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          className="col-span-9 border rounded p-2"
        />
      </div>

      <div className="grid grid-cols-12 gap-3 items-center">
        <label className="col-span-3 text-sm">محل نمایش</label>
        <input
          type="text"
          value={form.placement}
          onChange={(e) => set('placement', e.target.value)}
          className="col-span-9 border rounded p-2"
        />
      </div>

      <div className="grid grid-cols-12 gap-3 items-center">
        <label className="col-span-3 text-sm">نوع</label>
        <input
          type="text"
          value={form.type}
          onChange={(e) => set('type', e.target.value)}
          className="col-span-9 border rounded p-2"
        />
      </div>

      <div className="grid grid-cols-12 gap-3 items-center">
        <label className="col-span-3 text-sm">فعال</label>
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => set('isActive', e.target.checked)}
        />
      </div>

      <div className="flex items-center gap-2">
        <button disabled={saving} className="px-4 py-2 rounded-lg bg-blue-600 text-white">
          {saving ? 'در حال ذخیره…' : 'ذخیره'}
        </button>
        <Link href="/sliders" className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50">
          انصراف
        </Link>
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
