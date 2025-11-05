export default function Unauthorized() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2 text-red-600">دسترسی غیرمجاز</h1>
        <p>شما اجازه مشاهده این صفحه را ندارید.</p>
      </div>
    </div>
  );
}
