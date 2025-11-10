import SliderItemForm from '@/components/sliders/SliderItemForm';
import RequirePermission from '@/components/auth/RequirePermission';

export default async function Page({ params }) { 
  const { id,sliderItem } = await params; 

  return (
    <RequirePermission code="siteSettings.manage">
      <h1 className="text-2xl font-semibold mb-4">
        {id === 'new' ? 'اسلایدر جدید' : `ویرایش اسلایدر #${id}`}
      </h1>
      <SliderItemForm sliderId={id} itemId={sliderItem} />
    </RequirePermission>
  );
}
