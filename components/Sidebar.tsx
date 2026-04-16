'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PlusCircle, Settings, Stethoscope } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'New Clinic Site', icon: PlusCircle },
    { href: '/dashboard', label: 'My Clinics', icon: LayoutDashboard },
  ];

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 text-gray-300 shrink-0 hidden md:flex flex-col h-full sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-800 font-bold tracking-tight text-white gap-2 shrink-0">
        <Stethoscope className="w-5 h-5 text-blue-500" />
        ClinicGen
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 mt-2 px-2">Menu</div>
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'hover:bg-gray-800 hover:text-white'
              }`}
            >
              <link.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors text-gray-400 hover:text-white">
          <Settings className="w-5 h-5" />
          Settings
        </button>
      </div>
    </aside>
  );
}
