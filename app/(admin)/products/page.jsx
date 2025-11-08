'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { listProducts, deleteProduct } from '@/components/products/productApi';
import { FilteredCategory } from '@/components/categories/categoryApi';
import RequirePermission from '@/components/auth/RequirePermission';
import { hasPermission } from '@/lib/auth-client';

export default function Page() {
  const [products, setProducts] = useState([]);
  const [categoris, setCategoris] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [total, setTotal] = useState(0);

  const canView = hasPermission('product.view');

  const load = async (p = page, cat = selectedCategory) => {
    const { items, total } = await listProducts({
      page: p,
      pageSize,
      ...(cat ? { categoryId: cat } : {}),
    });
    setProducts(items || []);
    setTotal(total || 0);
    setPage(p);
  };

  const loadCategories = async () => {
    const all = await FilteredCategory();
    const opts = all.map(c => ({
      id: String(c.ID),
      name: c.ParentName ? `${c.ParentName} ${c.Name}` : c.Name,
    }));
    setCategoris([{ id: '', name: 'همه دسته‌ها' }, ...opts]);
  };

  useEffect(() => {
    if (canView) {
      load(1);
      loadCategories();
    }
  }, [canView]);

  useEffect(() => { if (canView) load(1, selectedCategory); }, [selectedCategory]);

  const onDelete = async (id) => {
    if (!confirm('حذف شود؟')) return;
    try {
      await deleteProduct(id);
      // اگر آخرین آیتم صفحه حذف شد ممکن است خالی شود؛ ساده: دوباره لود کن
      load(page);
    } catch {
      alert('خطا در حذف محصول');
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <RequirePermission code="product.view">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">محصولات</h1>
        <Link href="/products/new" className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm">
          محصول جدید
        </Link>
      </div>

      <div className="mb-3 flex gap-3 items-center">
        <label className="text-sm text-slate-600">فیلتر بر اساس دسته بندی:</label>
        <select
          className="px-3 py-2 border rounded-lg bg-white text-sm"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categoris.map(c => (
            <option key={c.id || 'all'} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-center">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">نام</th>
              <th className="px-3 py-2">اسلاگ</th>
              <th className="px-3 py-2">قیمت پایه</th>
              <th className="px-3 py-2">قیمت فروش</th>
              <th className="px-3 py-2">دسته</th>
              <th className="px-3 py-2">برند</th>
              <th className="px-3 py-2">عملیات</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {products.map((p, i) => (
              <tr key={p.ID} className="border-t">
                <td className="px-3 py-2">{(page - 1) * pageSize + i + 1}</td>
                <td className="px-3 py-2">{p.Name}</td>
                <td className="px-3 py-2">{p.Slug ?? '—'}</td>
                <td className="px-3 py-2">{p.BasePrice ?? '—'}</td>
                <td className="px-3 py-2">{p.SalePrice ?? '—'}</td>
                <td className="px-3 py-2">{p.CategoryName ?? p.CategoryID ?? '—'}</td>
                <td className="px-3 py-2">{p.BrandName ?? p.BrandID ?? '—'}</td>
                <td className="px-3 py-2">
                  {hasPermission('productColor.view') && (
                    <Link href={`/products/${p.ID}/colors`} className="px-2 py-1 border rounded hover:bg-slate-50 ml-2">
                      رنگ های محصول
                    </Link>
                  )}
                  {hasPermission('product.update') && (
                    <Link href={`/products/${p.ID}`} className="px-2 py-1 border rounded hover:bg-slate-50 ml-2">
                      ویرایش
                    </Link>
                  )}
                  {hasPermission('product.delete') && (
                    <button onClick={() => onDelete(p.ID)} className="ml-2 px-2 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50">
                      حذف
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-slate-500">محصولی یافت نشد</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-slate-600">
          نمایش {(products.length ? (page - 1) * pageSize + 1 : 0)}–
          {(page - 1) * pageSize + products.length} از {total}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => load(page - 1)}
          >
            قبلی
          </button>
          <span className="text-sm text-slate-600">صفحه {page} از {totalPages}</span>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={page >= totalPages}
            onClick={() => load(page + 1)}
          >
            بعدی
          </button>
        </div>
      </div>
    </RequirePermission>
  );
}
