// src/app/product/skintoner/page.jsx
"use client"; // 클라이언트 컴포넌트임을 명시

import React, { useState } from "react"; // useState 임포트
import BrandFilter from "./components/BrandFilter";
import BannerCarousel from "./components/SkinTonerBanner"; // SkinTonerBanner 임포트
import ProductCarousel from "./components/SkinTonerProduct"; // ProductCarousel (이전 SkinTonerProduct) 임포트

export default function Page() {
  // 선택된 브랜드 목록 상태를 Page 컴포넌트에서 관리
  const [selectedBrands, setSelectedBrands] = useState([]);

  // BrandFilter에서 브랜드 선택이 변경될 때 호출될 함수
  const handleBrandChange = (brands) => {
    setSelectedBrands(brands);
    // 선택된 브랜드가 변경될 때 ProductCarousel의 페이지를 1로 초기화할 수도 있습니다.
    // ProductCarousel에서 페이지 상태를 관리한다면, 이를 prop으로 전달하거나
    // ProductCarousel 내부에서 selectedBrands 변경을 감지하여 페이지를 초기화해야 합니다.
  };

  return (
    <div className="flex-row w-[1020px] mx-auto">
      {/* 1. BrandFilter 컴포넌트 */}
      <BrandFilter onBrandChange={handleBrandChange} />
      
      {/* 2. BannerCarousel (SkinTonerBanner) 컴포넌트 */}
      {/* 이 컴포넌트는 prop을 받지 않으므로, 그대로 배치합니다. */}
      <BannerCarousel />
      
      {/* 3. ProductCarousel 컴포넌트 */}
      {/* ProductCarousel에 selectedBrands prop 전달 */}
      <ProductCarousel selectedBrands={selectedBrands} />
    </div>
  );
}