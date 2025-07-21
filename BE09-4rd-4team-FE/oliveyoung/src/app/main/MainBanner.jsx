"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { getImageUrl } from "@/utils/image";

const imageUrl = getImageUrl("mainpage/mainbanner.jpg");
const CATEGORY_DATA = {
  스킨케어: ["스킨케어", "마스크팩", "클렌징", "선케어"],
  "메이크업/세일": ["메이크업", "네일"],
  뷰티소품: [],
  "더모 코스메틱": [],
  맨즈케어: [],
  "향수/디퓨저": [],
  헤어케어: [],
  바디케어: [],
  건강식품: [],
  푸드: [],
  "구강/건강용품": [],
  위생용품: [],
  "라이프/케이팝": [],
};

export default function MainBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const router = useRouter();

  const handleSubCategoryClick = (subCategory) => {
    router.push(`/product`);
  };

  return (
    <div className="relative w-full h-[450px]">
      {/* 왼쪽 고정 카테고리 메뉴 */}
      <div
        className="absolute text-left left-[238px] z-20 w-[170px] h-[450px] bg-[#3b3d3f] text-white py-4 px-5 space-y-3.5 font-semibold text-sm"
        onMouseLeave={() => setHoveredCategory(null)} // 마우스가 떠나면 메뉴 숨김
      >
        {Object.keys(CATEGORY_DATA).map((category, i) => (
          <div
            key={i}
            className={`cursor-pointer hover:text-[#9bce26] ${
              hoveredCategory === category ? "text-[#9bce26]" : ""
            }`}
            onMouseEnter={() => setHoveredCategory(category)}
          >
            {category}
          </div>
        ))}
      </div>

      {/* 오른쪽 서브카테고리 메뉴 (hover한 경우만 표시) */}
      {hoveredCategory &&
        CATEGORY_DATA[hoveredCategory] &&
        CATEGORY_DATA[hoveredCategory].length > 0 && (
          <div
            className="absolute left-[408px] top-0 z-30 w-[170px] h-[450px] bg-white text-black py-5 px-4 space-y-3 text-sm shadow-md"
            onMouseLeave={() => setHoveredCategory(null)} // 마우스가 서브 메뉴에서 떠나면 숨김
            onMouseEnter={() => setHoveredCategory(hoveredCategory)} // 다시 들어오면 유지
          >
            {CATEGORY_DATA[hoveredCategory].map((sub, i) => (
              <div
                key={i}
                className="cursor-pointer hover:text-[#9bce26]"
                onClick={() => handleSubCategoryClick(sub)}
              >
                {sub}
              </div>
            ))}
          </div>
        )}

      {/* 오른쪽 배너 */}
      <div
        className="flex-1 w-[1920px] h-full bg-cover bg-center relative -mt-5 right-[215px]"
        style={{
          backgroundImage: `url(${imageUrl})`
        }}
      >
        {/* 텍스트 오버레이 */}
        <div className="absolute right-[935px] top-[100px] text-white drop-shadow-xl ">
          <p className="text-left text-[18px]">뷰센</p>
          <p className="text-left text-[48px] font-bold leading-tight">
            든든하게 만나는
            <br />
            프리미엄
            <br />
            미백 치약
          </p>
          <p className="text-lg font-semibold text-left ">
            대용량 기획 할인 & 증정
          </p>
        </div>
      </div>
    </div>
  );
}
