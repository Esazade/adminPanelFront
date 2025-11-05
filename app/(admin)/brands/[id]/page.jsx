import BrandForm from '@/components/brands/BrandForm';
import { redirect } from 'next/navigation';
import { checkPermission } from '@/lib/checkPermission';

export default async function Page({ params }) {
  const { id } = await params; 
  const hasAccess = await checkPermission('brand.create'); 
  if (!hasAccess) {
    redirect('/unauthorized'); // کاربر مجاز نیست
  }

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">
        {id === 'new' ? 'برند جدید' : `ویرایش برند #${id}`}
      </h1>
      <BrandForm brandId={id} />
    </>
  );
}
