import UserForm from '@/components/users/UserForm';
import RequirePermission from '@/components/auth/RequirePermission';

export default async function Page({ params }) {
  const { id } = await params; 

  return (
    <RequirePermission code="brand.create">
      <h1 className="text-2xl font-semibold mb-4">
        {id === 'new' ? 'کاربر جدید' : `ویرایش کاربر #${id}`}
      </h1>
      <UserForm userId={params.id} />
    </RequirePermission>
  );
}
