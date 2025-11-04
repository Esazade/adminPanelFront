import ProductColorForm from '@/components/products/colors/ProductColorForm';

export default function Page({ params }) {
  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">
        {params.colorId === 'new' ? 'افزودن رنگ' : 'ویرایش رنگ'}
      </h1>
      <ProductColorForm productId={params.id} pcId={params.colorId} />
    </>
  );
}
