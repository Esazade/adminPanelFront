import ColorForm from '@/components/colors/ColorForm';

export default function Page({ params }) { 
  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">
        {params.id === 'new' ? 'رنگ جدید' : `ویرایش رنگ `}
      </h1>
      <ColorForm colorId={params.id} />
    </>
  );
}
