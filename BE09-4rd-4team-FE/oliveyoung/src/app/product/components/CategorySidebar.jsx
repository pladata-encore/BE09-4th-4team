'use client';

import { useRouter } from 'next/navigation';

export default function CategorySidebar() {
  const router = useRouter();

  return (
    <div className="w-[180px] mr-[40px] p-8">
      <h2 className="mb-4 text-3xl font-bold whitespace-nowrap">스킨케어</h2>
      <hr className="border-t border-[#ddd] mb-4" />
      <ul className="space-y-3 text-[#333]">
        <li
          className="cursor-pointer hover:text-[#f27370] whitespace-nowrap"
          onClick={() => router.push('/product/skintoner')}
        >
          스킨/토너
        </li>
        <li className="cursor-pointer hover:text-[#f27370] whitespace-nowrap">에센스/세럼/앰플</li>
        <li className="cursor-pointer hover:text-[#f27370] whitespace-nowrap">크림</li>
        <li className="cursor-pointer hover:text-[#f27370] whitespace-nowrap">로션</li>
        <li className="cursor-pointer hover:text-[#f27370] whitespace-nowrap">미스트/오일</li>
        <li className="cursor-pointer hover:text-[#f27370] whitespace-nowrap">스킨케어세트</li>
        <li className="cursor-pointer hover:text-[#f27370] whitespace-nowrap">스킨케어 디바이스</li>
      </ul>
    </div>
  );
}