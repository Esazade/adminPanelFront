export default function Page() {
  return (
    <>
      <div className="text-sm text-slate-500 mb-4">
        <span className="text-slate-700">داشبورد</span>
        <span className="mx-1 text-slate-400">/</span>
        <a className="text-blue-600 hover:underline" href="#">صفحه نخست</a>
      </div>

      <h1 className="text-3xl font-bold text-slate-800 mb-6">داشبورد</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { title: 'سفارشات امروز', value: '128' },
          { title: 'کاربران جدید', value: '37' },
          { title: 'درآمد امروز', value: '8,450,000' },
          { title: 'تیکت‌های باز', value: '12' },
        ].map((c) => (
          <div key={c.title} className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-slate-500 text-sm">{c.title}</div>
            <div className="text-2xl font-semibold mt-2">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-white border border-slate-200 rounded-xl h-[500px]" />
    </>
  );
}
