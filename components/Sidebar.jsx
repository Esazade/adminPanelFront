'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Squares2X2Icon, ChevronDownIcon, ChartBarIcon, Cog8ToothIcon,
  CubeIcon, RectangleGroupIcon
} from '@heroicons/react/24/outline';

function MenuSection({ title, icon: Icon, children, defaultOpen=false, badge }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mt-2">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-slate-200 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-700/60 transition">
        <div className="flex items-center gap-2"><Icon className="w-5 h-5" /><span className="font-medium">{title}</span></div>
        <div className="flex items-center gap-2">
          {badge ? <span className="text-[11px] bg-rose-500 text-white px-2 py-0.5 rounded-full">{badge}</span> : null}
          <ChevronDownIcon className={`w-4 h-4 transition ${open ? 'rotate-180':''}`} />
        </div>
      </button>
      {open ? <div className="mt-1 space-y-1">{children}</div> : null}
    </div>
  );
}
function MenuItem({ href='#', active=false, children, dot=false }) {
  return (
    <Link href={href}
      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm
      ${active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'}`}>
      <span className="truncate">{children}</span>
      {dot ? <span className={`w-3 h-3 rounded-full border ${active ? 'border-white':'border-slate-400'}`} /> : null}
    </Link>
  );
}

export default function Sidebar() {
  return (
    <aside className="w-72 bg-slate-800 text-slate-100 h-screen sticky top-0 overflow-y-auto">
      <div className="h-16 flex items-center px-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-700 grid place-items-center font-bold">A</div>
          <div className="text-sm">
            <div className="font-semibold">راستچین AdminLTE 3</div>
            <div className="text-slate-400 text-xs">امین ارجمند</div>
          </div>
        </div>
      </div>

      <div className="p-3">
        <input className="w-full bg-slate-700/60 text-slate-100 placeholder:text-slate-300 text-sm rounded-lg px-3 py-2 outline-none" placeholder="Search" />
      </div>

      <nav className="px-3 pb-6">
        <MenuSection title="داشبورد" icon={Squares2X2Icon} defaultOpen>
          <MenuItem href="/" active dot>داشبورد 1</MenuItem>
          <MenuItem href="/dashboard-2" dot>داشبورد 2</MenuItem>
          <MenuItem href="/dashboard-3" dot>داشبورد 3</MenuItem>
        </MenuSection>
        <MenuSection title="ابزارک‌ها" icon={RectangleGroupIcon} badge="جدید">
          <MenuItem href="#">ابزارک‌ها</MenuItem>
        </MenuSection>
        <MenuSection title="تنظیمات طرح‌بندی" icon={Cog8ToothIcon}>
          <MenuItem href="#">گزینه 1</MenuItem>
          <MenuItem href="#">گزینه 2</MenuItem>
        </MenuSection>
        <MenuSection title="نمودارها" icon={ChartBarIcon}>
          <MenuItem href="#">Chart.js</MenuItem>
        </MenuSection>
        <MenuSection title="المنت‌های طراحی" icon={CubeIcon}>
          <MenuItem href="#">دکمه‌ها</MenuItem>
          <MenuItem href="#">فرم‌ها</MenuItem>
        </MenuSection>
      </nav>
    </aside>
  );
}
