'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboardIcon,
  PackageIcon,
  ShoppingCartIcon,
  UsersIcon,
  TicketIcon,
  SettingsIcon,
  LogOutIcon,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
  { to: '/admin/dashboard', label: '대시보드', icon: <LayoutDashboardIcon size={20} /> },
  { to: '/admin/products', label: '상품 관리', icon: <PackageIcon size={20} /> },
  { to: '/admin/orders', label: '주문 관리', icon: <ShoppingCartIcon size={20} /> },
  { to: '/admin/coupons', label: '쿠폰 관리', icon: <TicketIcon size={20} /> },
  { to: '/admin/users', label: '관리자 관리', icon: <UsersIcon size={20} /> },
  { to: '/admin/settings', label: '설정', icon: <SettingsIcon size={20} /> },
];
  return (
    <div className="w-64 bg-[#9BCC47] text-white hidden md:flex flex-col">
      <div className="p-4 border-b border-[#8ab93f]">
        <h1 className="text-xl font-bold">올리브영 어드민</h1>
      </div>
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.to}>
              <Link
                href={item.to}
                className={`flex items-center w-full px-4 py-3 text-left ${
                  pathname === item.to ? 'bg-[#8ab93f] font-medium' : 'hover:bg-[#8ab93f]'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-[#8ab93f]">
        <button className="flex items-center w-full px-4 py-2 text-left hover:bg-[#8ab93f] rounded">
          <LogOutIcon size={20} className="mr-3" />
          로그아웃
        </button>
      </div>
    </div>
  );
}
