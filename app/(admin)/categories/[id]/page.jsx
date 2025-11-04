import CategoryForm from '@/components/categories/CategoryForm';

export default function Page({ params }) { 
  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">
        {params.id === 'new' ? 'گروه جدید' : `ویرایش گروه`}
      </h1>
      <CategoryForm categoryId={params.id} />
    </>
  );
}
