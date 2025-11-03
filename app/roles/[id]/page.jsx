import RoleForm from '@/components/roles/RoleForm';

export default function Page({ params }) { 
  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">
        {params.id === 'new' ? 'نقش جدید' : `ویرایش نقش`}
      </h1>
      <RoleForm RoleId={params.id} />
    </>
  );
}
