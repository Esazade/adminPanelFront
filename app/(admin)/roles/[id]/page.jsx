import RoleForm from '@/components/roles/RoleForm';
import RequirePermission from '@/components/auth/RequirePermission';

export default async function Page({ params }) {
  const { id } = await params;  

  return (
    <RequirePermission code="brand.create">
      <h1 className="text-2xl font-semibold mb-4">
        {id === 'new' ? 'نقش جدید' : `ویرایش نقش #${id}`}
      </h1>
      <RoleForm RoleId={id} />
    </RequirePermission>
  );
}

