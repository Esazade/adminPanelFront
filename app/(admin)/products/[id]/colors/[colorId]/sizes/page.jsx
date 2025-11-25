'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { listSizes, createSize, updateSize, deleteSize } from '@/components/products/colors/sizes/productColorSizeApi';
import DialogBox from '@/components/ui/DialogBox';

export default function ProductColorSizeTable() {
  const { id, colorId } = useParams();
  const productId = Array.isArray(id) ? id[0] : id;
  const pcId = Array.isArray(colorId) ? colorId[0] : colorId;
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState({ type: '', message: '', onConfirm: null });
  const [newStock, setNewStock] = useState('');
  const [ProductName, setProductName] = useState('');
  const standardSizes = [36,37,38,39,40,41];

  useEffect(() => {
    fetchSizes();
  }, []);

  const fetchSizes = async () => {
    try {
      const data = await listSizes(pcId); 
      setSizes(data);
      if (data && data.length > 0)
        setProductName(data[0].ProductName + " " + data[0].ColorName);
    } catch {
      setDialog({ type: 'error', message: 'خطا در بارگذاری سایزها' });
    } finally {
      setLoading(false);
    }
  };

  const handleStockChange = (id, value) => {
    setSizes(prev => prev.map(s => s.ID === id ? { ...s, Stock: value } : s));
  };

  const saveStock = async (size) => {
    try {
      await updateSize(size.ID, { Size: size.Size, Stock: Number(size.Stock) });
      setDialog({ type: 'success', message: 'موجودی بروزرسانی شد' });
    } catch {
      setDialog({ type: 'error', message: 'بروزرسانی ناموفق بود' });
    }
  };

  

  const onDelete = (id) => {
    setDialog({
      type: 'confirm',
      message: 'آیا از حذف این سایز مطمئن هستید؟',
      onConfirm: async () => {
        try {
          await deleteSize(id);
          setSizes(prev => prev.filter(c => c.ID !== id));
        } catch {
          setDialog({ type: 'error', message: 'خطا در حذف سایز' });
        }
      }
    });
  };


  const addNewSizes = async () => {
    const sizesToAdd = standardSizes.filter(sz => !sizes.find(s => s.Size === sz));
    if(newStock === '' || Number(newStock) < 0) {
      setDialog({ type: 'error', message: 'موجودی نامعتبر است' });
      return;
    }
    try {
      for(let sz of sizesToAdd) {
        await createSize(pcId, { Size: sz, Stock: Number(newStock) });
      }
      fetchSizes();
      setNewStock('');
    } catch {
      setDialog({ type: 'error', message: 'ثبت سایزهای جدید ناموفق بود' });
    }
  };

  if(loading) return <div>در حال بارگذاری…</div>;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">سایزهای محصول {ProductName}</h1>
        <div className="flex gap-2">
          <Link href={`/products/${productId}/colors`} className="px-3 py-2 rounded border">بازگشت</Link>
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="px-3 py-2">سایز</th>
            <th className="px-3 py-2">موجودی</th>
            <th className="px-3 py-2">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {sizes.map(s => (
            <tr key={s.ID} className="border-b">
              <td className="px-3 py-2">{s.Size}</td>
              <td className="px-3 py-2">
                <input
                  type="number"
                  value={s.Stock}
                  onChange={e => handleStockChange(s.ID, e.target.value)}
                  className="w-20 border rounded px-2 py-1"
                />
              </td>
              <td className="px-3 py-2">
                <button onClick={() => saveStock(s)} className="px-2 py-1 border rounded hover:bg-slate-50 ml-2">ویرایش موجودی</button>
                <button onClick={() => onDelete(s.ID)} className="ml-2 px-2 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50">حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center gap-2 mt-4">
        <input
          type="number"
          placeholder="موجودی برای سایزهای جدید"
          value={newStock}
          onChange={e => setNewStock(e.target.value)}
          className="w-32 border rounded px-2 py-1"
        />
        <button onClick={addNewSizes} className="px-4 py-2 bg-blue-600 text-white rounded">اضافه کردن سایزهای باقی‌مانده</button>
      </div>

      <DialogBox
        type={dialog.type}
        message={dialog.message}
        onClose={() => setDialog({ type: '', message: '' })}
        onConfirm={dialog.onConfirm}
      />
    </div>
  );
}
