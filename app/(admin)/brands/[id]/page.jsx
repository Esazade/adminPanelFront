import BrandForm from '@/components/brands/BrandForm';
import RequirePermission from '@/components/auth/RequirePermission';

export default async function Page({ params }) {
  const { id } = await params; 
  

  return (
    <RequirePermission code="brand.create">
      <h1 className="text-2xl font-semibold mb-4">
        {id === 'new' ? 'برند جدید' : `ویرایش برند #${id}`}
      </h1>
      <BrandForm brandId={id} />
    </RequirePermission>
  );
}
