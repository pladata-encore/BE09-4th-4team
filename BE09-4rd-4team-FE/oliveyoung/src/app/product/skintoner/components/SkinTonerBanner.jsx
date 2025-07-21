"use client";

import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getImageUrl } from "@/utils/image"; // ⭐ getImageUrl 함수 임포트 ⭐

const categories = [
  [
    {
      img: "product/skintonerbanner1.jpg", // 이 경로들을 파일 서버의 상대 경로로 가정합니다.
      title: "넘버즈인X지냐\n파우더 론칭 기획",
      desc: "1번 스킨케어링 파우더 론칭 특가",
    },
    {
      img: "product/skintonerbanner2.jpg",
      title: "세럼 강자 토리든\nNEW & BEST",
      desc: "추가 할인에 더한 풍성한 증정까지!",
    },
  ],
  [
    {
      img: "product/skintonerbanner3.jpg",
      title: "여름 피부, 남자는\n올인원으로 쿨하게",
      desc: "햇빛따위 쿨하게 이겨버리는 알파 올인원",
    },
    {
      img: "product/skintonerbanner4.jpg",
      title: "예민한 피부를 위한\n트러블 진정 솔루션",
      desc: "외부자극에 지친 피부를 위한 진정 솔루션",
    },
  ],
];

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <button
      className="absolute left-[-55px] top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-slate-50 bg-opacity-70 flex justify-center items-center text-2xl shadow"
      onClick={onClick}
      aria-label="이전"
      type="button"
    >
      &lt;
    </button>
  );
}
function NextArrow(props) {
  const { onClick } = props;
  return (
    <button
      className="absolute right-[-55px] top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-slate-50 bg-opacity-70 flex justify-center items-center text-2xl shadow"
      onClick={onClick}
      aria-label="다음"
      type="button"
    >
      &gt;
    </button>
  );
}

function SkinTonerBanner() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 1, // 1로 고정
    slidesToScroll: 1, // 1로 고정
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  return (
    <div className="relative w-full max-w-[1080px] mx-auto px-4 p-10">
      <Slider {...settings}>
        {categories.map((pair, idx) => (
          <div
            key={idx}
            className="!flex !flex-row gap-6 w-full min-h-[375px]" // ★ 강제 flex-row (중요!)
          >
            {pair.map((item, i) => (
              <div
                key={i}
                className="relative flex-1 h-[375px] rounded-md overflow-hidden shadow bg-white"
                style={{ minWidth: 0 }}
              >
                <img
                  src={getImageUrl(item.img)} // ⭐ 여기에 getImageUrl 적용 ⭐
                  alt={item.title}
                  className="object-cover w-full h-full"
                  draggable={false}
                  style={{ userSelect: "none" }}
                />
                <div className="absolute inset-0 flex flex-col justify-end pb-8 pl-8 bg-gradient-to-t from-black/40 to-transparent">
                  <h2 className="text-2xl font-bold text-center text-white whitespace-pre-line drop-shadow">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-base text-center text-white drop-shadow">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default SkinTonerBanner;