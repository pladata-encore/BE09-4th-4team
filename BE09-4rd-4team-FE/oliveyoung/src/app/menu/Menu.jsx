'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/utils/image"; 

const CATEGORY_DATA = {
  스킨케어: [
    "스킨/토너",
    "에센스/세럼/앰플",
    "크림",
    "로션",
    "미스트/오일",
    "스킨케어세트",
    "스킨케어 디바이스",
  ],
  메이크업: ["립메이크업", "베이스메이크업", "아이메이크업"],
  뷰티소품: ["메이크업소품", "아이소품", "스킨케어소품"],
  "더모 코스메틱": ["스킨케어", "바디케어", "클렌징", "선케어", "마스크팩"],
  맨즈케어: ["스킨케어", "메이크업", "쉐이빙/왁싱"],
  "향수/디퓨저": ["향수", "미니/고체향수", "홈프래그런스"],
  헤어케어: [
    "샴푸/린스",
    "트리트먼트/팩",
    "두피앰플/토닉",
    "헤어에센스",
    "염색약/탈색",
    "헤어기기/브러시",
    "스타일링",
  ],
  바디케어: [
    "샤워/입욕",
    "로션/오일/미스트",
    "핸드케어",
    "풋케어",
    "제모/왁싱",
    "데오드란트",
    "선물세트",
    "베이비",
  ],
  건강식품: ["비타민", "영양제", "유산균", "슬리밍/이너뷰티"],
  푸드: [
    "식단관리/이너뷰티",
    "과자/초콜릿/디저트",
    "생수/음료/커피",
    "간편식/요리",
    "베이비푸드",
  ],
  구강용품: ["칫솔", "치약", "애프터구강케어", "휴대용세트", "구강가전"],
  위생용품: [
    "생리/위생용품",
    "Y존케어",
    "성인용품",
    "마사지젤/오일",
    "테스터킷",
    "성인용 기저귀",
    "화장지",
  ],
  패션: ["언더웨어", "홈웨어", "액티브웨어", "패션잡화"],
  "리빙/가전": [
    "가전",
    "주방",
    "세제/청소",
    "인테리어/욕실",
    "반려동물",
    "베이비",
  ],
  "취미/펜시": ["팬시/캐릭터", "문구", "디지털/기기", "음반"],
};

export default function Menu() {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const router = useRouter();

  const handleSubCategoryClick = (sub) => {
    setIsCategoryOpen(false);
    // 실제 서브 카테고리 페이지로 이동하는 로직을 여기에 추가할 수 있습니다.
    // 예: router.push(`/product?subcategory=${sub}`);
  };

  const handleCategoryClick = (category) => {
    if (category === "스킨케어") {
      router.push("/product"); // 스킨케어 클릭 시 /product 페이지로 이동
      setIsCategoryOpen(false);
    }
    // 다른 카테고리에 대한 라우팅 로직을 여기에 추가할 수 있습니다.
    // 예: else if (category === "메이크업") { router.push("/product?category=메이크업"); }
  };

  // 2. 이미지 URL을 getImageUrl로 처리하는 상수 정의
  const categoryIconUrl = getImageUrl("product/categoryIcon.png");

  return (
    <div className="relative z-50">
      <div className="h-[47px] flex justify-center border-t border-b-2 border-t-[#dddddd] border-b-black bg-white">
        <div className="w-[1020px] flex items-center">
          <button
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="w-[170px] h-[44px] border-r border-l border-gray flex items-center gap-3 pl-[27px] font-bold text-[15px] transition-colors duration-200 bg-white text-black]"
          >
            <img src={categoryIconUrl} alt="menu" /> {/* 3. src 변경 (categoryIconUrl 변수 사용) */}
            카테고리
          </button>

          <ul className="pl-[30px] flex flex-row gap-[48px] text-[15px] font-bold h-[44px] items-center">
            {[
              "오특",
              "랭킹",
              "헬스+",
              "LUXE EDIT",
              "기획전",
              "세일",
              "기프트카드",
              "멤버십/쿠폰",
              "이벤트",
            ].map((item, idx) => (
              <li
                key={idx}
                className="hover:text-[#f27370] hover:underline hover:underline-offset-[5px] decoration-2 cursor-pointer whitespace-nowrap"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isCategoryOpen && (
        <div className="absolute top-[47px] left-1/2 -translate-x-1/2 w-[1020px] z-50 bg-white border-b shadow">
          <div className="grid grid-cols-5 px-4 py-6 text-sm text-black gap-x-10 gap-y-4">
            {Object.entries(CATEGORY_DATA).map(([category, subs], idx) => (
              <div key={idx} className="pr-2 space-y-2">
                <p
                  onClick={() => handleCategoryClick(category)}
                  className="font-bold cursor-pointer tracking-wide hover:text-[#f27370]"
                >
                  {category}
                </p>
                <ul className="space-y-1">
                  {subs.map((sub, i) => (
                    <li key={i}>
                      <button
                        onClick={() => handleSubCategoryClick(sub)}
                        className="hover:text-[#f27370] hover:underline cursor-pointer tracking-wide"
                      >
                        {sub}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}