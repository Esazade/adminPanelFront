import ProductColorImageForm from '@/components/products/colors/images/ProductColorImageForm';

export default function Page({ params }) {
  const { id, colorId, imageId } = params;
  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">
        {imageId === 'new' ? 'افزودن تصویر' : 'ویرایش تصویر'}
      </h1>
      <ProductColorImageForm productId={id} pcId={colorId} imageId={imageId} />
    </>
  );
}
