import ProductColorImageForm from '@/components/products/colors/images/ProductColorImageForm';
import RequirePermission from '@/components/auth/RequirePermission';


export default async function Page({ params }) {
  const { id, colorId, imageId } = params;

  return (
    <RequirePermission code="productColorImage.create">
      <h1 className="text-2xl font-semibold mb-4">
        {id === 'new' ? 'تصویر محصول جدید' : `ویرایش تصویر محصول #${id}`}
      </h1>
      <ProductColorImageForm productId={id} pcId={colorId} imageId={imageId} />
    </RequirePermission>
  );
}
