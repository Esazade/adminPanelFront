import UserForm from '@/components/users/UserForm';

export default function Page({ params }) { 
  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">
        {params.id === 'new' ? 'کاربر جدید' : `ویرایش کاربر`}
      </h1>
      <UserForm userId={params.id} />
    </>
  );
}
