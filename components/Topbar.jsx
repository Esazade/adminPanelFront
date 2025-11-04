'use client';

import { Bars3Icon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';


export default function Topbar({ onMenu, onLogout }) {

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4">
      <nav className="hidden sm:flex items-center gap-6 text-slate-600 text-sm">
        <a className="hover:text-slate-900" href="/dashboard">خانه </a>
      </nav>

      <div className="flex items-center gap-4">
        <button
          onClick={onLogout}
          className="p-2"
          aria-label="Logout"
        >
          <ArrowRightOnRectangleIcon className="w-7 h-7 text-slate-700 hover:text-red-600" />
        </button>

        {/* دکمه همبرگری فقط موبایل */}
        <button onClick={onMenu} className="md:hidden p-2 -mr-2" aria-label="Open sidebar">
          <Bars3Icon className="w-7 h-7 text-slate-700" />
        </button>

        <Link href="/login" className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm">ورود</Link>

      </div>
    </header>
  );
}
