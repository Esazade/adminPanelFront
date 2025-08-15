import { MagnifyingGlassIcon, BellIcon, ChatBubbleLeftRightIcon, Squares2X2Icon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';

export default function Topbar() {
  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4">
      <nav className="flex items-center gap-6 text-slate-600 text-sm">
        <a className="hover:text-slate-900" href="#">صفحه نخست</a>
        <a className="hover:text-slate-900" href="#">تماس با ما</a>
        <a className="hover:text-slate-900" href="#">صفحه نخست</a>
      </nav>
      <div className="flex items-center gap-4">
        <Squares2X2Icon className="w-5 h-5 text-slate-600" />
        <ArrowsPointingOutIcon className="w-5 h-5 text-slate-600" />
        <div className="relative">
          <BellIcon className="w-5 h-5 text-slate-600" />
          <span className="absolute -top-2 -left-2 bg-amber-400 text-xs rounded-full px-1">15</span>
        </div>
        <div className="relative">
          <ChatBubbleLeftRightIcon className="w-5 h-5 text-slate-600" />
          <span className="absolute -top-2 -left-2 bg-rose-500 text-white text-xs rounded-full px-1">3</span>
        </div>
        <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-2 py-1">
          <MagnifyingGlassIcon className="w-5 h-5 text-slate-500" />
          <input className="bg-transparent outline-none pr-2 text-sm" placeholder="جستجو" />
        </div>
      </div>
    </header>
  );
}
