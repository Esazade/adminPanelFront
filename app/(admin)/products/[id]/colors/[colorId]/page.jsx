import ProductColorForm from '@/components/products/colors/ProductColorForm';
import RequirePermission from '@/components/auth/RequirePermission';

export default async function Page({ params }) {
  const { id,colorId } = await params; 
  

  return (
    <RequirePermission code="productColor.create">
      <h1 className="text-2xl font-semibold mb-4">
        {id === 'new' ? 'رنگ محصول جدید' : `ویرایش رنگ محصول #${id}`}
      </h1>
      <ProductColorForm productId={id} pcId={colorId} />
    </RequirePermission>
  );
}

