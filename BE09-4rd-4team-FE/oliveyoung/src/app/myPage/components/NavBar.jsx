'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MyPageNavBar = () => {
  const pathname = usePathname();

  const menuSections = [
    {
      title: '마이 쇼핑',
      items: [
        { label: '주문/배송 조회', href: '/mypage/order' },
        { label: '장바구니', href: '/order/cart' },
        { label: '쿠폰', href: '/mypage/coupon' },
        { label: '리뷰', href: '/review' },
      ],
    },
    {
      title: '마이 정보',
      items: [
        { label: '회원정보 수정', href: '/mypage/user/modifyactinfo' },
        { label: '배송지/환불계좌', href: '/mypage/user/getdeliveryinfo' },
        { label: '회원탈퇴', href: '/mypage/user/withdrawal' },
      ],
    },
  ];

  // 공통 클릭 핸들러
  const handleMenuClick = (e, href) => {
    e.preventDefault();
    if (!href || href === '#') return; // 빈 메뉴는 무시
    setTimeout(() => {
      window.location.href = href;
    }, 1000);
  };

  return (
    <nav className="w-52 border-r border-gray-200">
      <div className="float-left w-[169px] pt-[10px] pb-[30px] pl-[10px]">
        <Link
          href="/mypage"
          onClick={(e) => handleMenuClick(e, '/mypage')}
          className={`text-[32px] leading-[34px] font-bold tracking-[-1.3px] text-black`}
        >
          마이페이지
        </Link>
      </div>

      {menuSections.map((section) => (
        <section key={section.title} className="mb-6 pt-[10px] pl-[10px] tracking-[-1px]">
          <h2 className="text-base font-semibold mb-2.5 text-[16px]">{section.title}</h2>
          <ul className="space-y-2">
            {section.items.map(({ label, href }) => (
              <li key={label} className="mb-2.5">
                <Link
                  href={href}
                  onClick={(e) => handleMenuClick(e, href)}
                  className={`cursor-pointer text-[13px] ${
                    pathname.startsWith(href) && href !== '#'
                      ? 'text-[#9bce26]'
                      : 'text-gray-800 hover:text-[#9bce26]'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
};

export default MyPageNavBar;
