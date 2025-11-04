import ProductColorSizeForm from '@/components/products/colors/sizes/productColorSizeForm';

export default function Page({ params }) {
  const { id, colorId, sizeId } = params;
  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">
        {sizeId === 'new' ? 'افزودن سایز' : 'ویرایش سایز'}
      </h1>
      <ProductColorSizeForm productId={id} pcId={colorId} sizeId={sizeId} />
    </>
  );
}
