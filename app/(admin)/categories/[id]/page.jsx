import CategoryForm from '@/components/categories/CategoryForm';
import RequirePermission from '@/components/auth/RequirePermission';

export default async function Page({ params }) {
   const { id } = await params;  
  return (
    <RequirePermission code="brand.create">
      <h1 className="text-2xl font-semibold mb-4">
        {id === 'new' ? 'گروه جدید' : `ویرایش گروه #${id}`}
      </h1>
      <CategoryForm categoryId={id} />
    </RequirePermission>
  );
}
