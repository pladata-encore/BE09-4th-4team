'use client';

import React from 'react';
import MyPageNavBar from './components/NavBar';
import { usePathname } from 'next/navigation';

const MyPageLayout = ({ children }) => {
  const pathname = usePathname();

  // 특정 경로에서 NavBar 숨기기
  const shouldHideNavBar =
    pathname.startsWith('/mypage/user/modifyactinfo/modifyactdetailed') ||
    pathname.startsWith('/mypage/user/modifyactinfo/modifypwd') ||
    pathname.startsWith('/mypage/user/modifyactinfo/minfodification') ||
    pathname.startsWith('/mypage/user/withdrawal/withdrawalsuccess');

  if (shouldHideNavBar) {
    return <>{children}</>;
  }

  // NavBar 있는 페이지들만 → Layout Box 적용
  return (
    <div className="max-w-[1020px] mx-auto flex mt-7">
      <MyPageNavBar />
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default MyPageLayout;
