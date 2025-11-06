import ProductColorSizeForm from '@/components/products/colors/sizes/productColorSizeForm';
import RequirePermission from '@/components/auth/RequirePermission';

export default async function Page({ params }) {
  const { id, colorId, sizeId } = params;

  return (
    <RequirePermission code="productColorSize.create">
      <h1 className="text-2xl font-semibold mb-4">
        {id === 'new' ? 'سایز جدید' : `ویرایش سایز #${id}`}
      </h1>
      <ProductColorSizeForm productId={id} pcId={colorId} sizeId={sizeId} />
    </RequirePermission>
  );
}
