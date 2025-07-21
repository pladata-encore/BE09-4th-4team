import React from 'react';
import { BellIcon, UserIcon, MenuIcon, LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");

    router.push("/admin/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex md:hidden">
          <button className="text-gray-500 hover:text-gray-700">
            <MenuIcon size={24} />
          </button>
        </div>

        <div className="flex-1 ml-4 md:ml-0">
          <div className="relative w-full max-w-md">
            <input
              type="search"
              className="block w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9BCC47] focus:border-transparent"
              placeholder="검색..."
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative text-gray-500 hover:text-gray-700">
            <BellIcon size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="h-6 mx-2 border-l border-gray-300"></div>

          <div className="flex items-center">
            <span className="mr-2 text-sm font-medium text-gray-700">관리자</span>
            <button
              className="p-1 bg-gray-200 rounded-full"
              onClick={handleLogout}
              title="로그아웃"
            >
              <LogOutIcon size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
