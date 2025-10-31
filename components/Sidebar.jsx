'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Squares2X2Icon, ChevronDownIcon, ChartBarIcon, Cog8ToothIcon,
  CubeIcon, RectangleGroupIcon, XMarkIcon
} from '@heroicons/react/24/outline';
import { UserIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

function MenuSection({ title, icon: Icon, children, defaultOpen=false, badge }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-slate-200 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-700/60 transition"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5" />
          <span className="font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {badge ? <span className="text-[11px] bg-rose-500 text-white px-2 py-0.5 rounded-full">{badge}</span> : null}
          <ChevronDownIcon className={`w-4 h-4 transition ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>
      {open ? <div className="mt-1 space-y-1">{children}</div> : null}
    </div>
  );
}

function MenuItem({ href = '#', active = false, children, dot = false }) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm
      ${active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'}`}
    >
      <span className="truncate">{children}</span>
      {dot ? <span className={`w-3 h-3 rounded-full border ${active ? 'border-white' : 'border-slate-400'}`} /> : null}
    </Link>
  );
}

function MenuLink({ href, icon: Icon, active=false, children }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm
      ${active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'}`}
    >
      {Icon ? <Icon className="w-5 h-5" /> : null}
      <span className="font-medium truncate">{children}</span>
    </Link>
  );
}


export default function Sidebar({ isOpen = false, onClose }) {
  const pathname = usePathname();

  const menu = [
    { type: 'link', label: 'خانه', href: '/', icon: Squares2X2Icon, defaultOpen: true },

    { type: 'section', title: 'کاتالوگ', icon: CubeIcon, items: [
      { label: 'محصولات', href: '/products' },
      { label: 'دسته‌بندی‌ها', href: '/categories' },
      { label: 'برندها', href: '/brands' },
      { label: 'رنگ‌ها', href: '/color' },
    ]},

    { type: 'section', title: 'مشتریان', icon: RectangleGroupIcon, items: [
      { label: 'کاربران', href: '/users' },
    ]},
  ];


  const isActive = (href) =>
    pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      {isOpen && (
        <button onClick={onClose} className="fixed inset-0 z-40 bg-black/40 md:hidden" aria-label="Close sidebar backdrop" />
      )}

      <aside className={`fixed inset-y-0 right-0 z-50 w-72 bg-slate-800 text-slate-100
        transform transition-transform duration-200 ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        md:sticky md:top-0 md:translate-x-0 md:z-auto md:flex-shrink-0 h-full md:h-screen overflow-y-auto`}>
        <div className="h-16 flex items-center px-4 border-b border-slate-700 justify-between">
          <Link href="\"><div className="font-semibold">پنل ادمین</div></Link>
          <button onClick={onClose} className="md:hidden p-1" aria-label="Close sidebar">
            <XMarkIcon className="w-6 h-6 text-slate-300" />
          </button>
        </div>

        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-700">
          <UserIcon className="w-10 h-10 rounded-full bg-slate-600 p-2 text-white" />
          <div className="text-sm">
            <div className="font-medium">امین ارجمند</div>
          </div>
        </div>

        <nav className="px-3 pb-6">
          {menu.map((sec) =>
            sec.type === 'link' ? (
              <div key={sec.href} className="mt-2">
                <MenuLink href={sec.href} icon={sec.icon} active={isActive(sec.href)}>
                  {sec.label}
                </MenuLink>
              </div>
            ) : (
              <MenuSection
                key={sec.title}
                title={sec.title}
                icon={sec.icon}
                defaultOpen={sec.defaultOpen}
                badge={sec.badge}
              >
                {sec.items.map(it => (
                  <MenuItem key={it.href} href={it.href} active={isActive(it.href)}>
                    {it.label}
                  </MenuItem>
                ))}
              </MenuSection>
            )
          )}
        </nav>

      </aside>
    </>
  );
}
