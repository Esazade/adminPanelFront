import ProductForm from '@/components/products/ProductForm';
import RequirePermission from '@/components/auth/RequirePermission';

export default async function Page({ params }) {
  const { id } = await params; 

  return (
    <RequirePermission code="product.create">
      <h1 className="text-2xl font-semibold mb-4">
        {id === 'new' ? 'محصول جدید' : 'ویرایش محصول'}
      </h1>
      <ProductForm productId={id} />
    </RequirePermission>
  );
}
