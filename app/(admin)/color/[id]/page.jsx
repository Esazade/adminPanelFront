import ColorForm from '@/components/colors/ColorForm';
import RequirePermission from '@/components/auth/RequirePermission';

export default async function Page({ params }) { 
  const { id } = await params; 
  return (
    <RequirePermission code="color.create">
      <h1 className="text-2xl font-semibold mb-4">
        {id=== 'new' ? 'رنگ جدید' : `ویرایش رنگ #${id}`}
      </h1>
      <ColorForm colorId={id} />
    </RequirePermission>
  );
}
