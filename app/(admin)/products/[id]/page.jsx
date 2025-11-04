import ProductForm from '@/components/products/ProductForm';

export default function Page({ params }) {
  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">
        {params.id === 'new' ? 'محصول جدید' : 'ویرایش محصول'}
      </h1>
      <ProductForm productId={params.id} />
    </>
  );
}
