import SliderForm from '@/components/sliders/SliderForm';
import RequirePermission from '@/components/auth/RequirePermission';

export default async function Page({ params }) {
  const { id } = await params;

  return (
    <RequirePermission code="siteSettings.manage">
      <h1 className="text-2xl font-semibold mb-4">
        {id === 'new' ? 'اسلایدر جدید' : `ویرایش اسلایدر #${id}`}
      </h1>
      <SliderForm sliderId={id} />
    </RequirePermission>
  );
}
