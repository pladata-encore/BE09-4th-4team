"use client";

import Image from "next/image";
import Link from "next/link";
import ReviewWriteSection from "./pages/guide/ReviewWriteSection";
import MyPageLayout from "../mypage/layout";
import UserInfoBox from "../mypage/user/components/UserInfoBox";

export default function Main() {
  const handleMenuClick = (e, href) => {
    e.preventDefault();
    // 라우팅 처리 필요 시 여기에 추가
  };

  return (
    <MyPageLayout>
      <div className="px-3">
        <UserInfoBox />
      </div>
      {/* 리뷰 작성 섹션 */}
      <div className="max-w-4xl mx-auto">
        <ReviewWriteSection />
      </div>
    </MyPageLayout>
  );
}
