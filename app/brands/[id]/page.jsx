import BrandForm from '@/components/brands/BrandForm';

export default function Page({ params }) { 
  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">
        {params.id === 'new' ? 'برند جدید' : `ویرایش برند #${params.Name}`}
      </h1>
      <BrandForm brandId={params.id} />
    </>
  );
}
