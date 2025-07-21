'use client';

import React, { useState, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { getImageUrl } from "@/utils/image"; // ⭐ getImageUrl 함수 임포트 ⭐

function BannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const sliderRef = useRef(null);

  // 이미지 경로 상대경로로 선언 (getImageUrl이 처리할 수 있는 형태)
  const banners = [
    'product/banner1.jpg',
    'product/banner2.jpg',
    'product/banner3.jpg',
    'product/banner4.jpg',
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: autoplay,
    autoplaySpeed: 3000,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
  };

  return (
    <div className="relative my-[30px] w-full">
      <Slider ref={sliderRef} {...settings}>
        {banners.map((banner, index) => (
          <div key={index} className="relative">
            <img
              src={getImageUrl(banner)} // getImageUrl 적용
              alt={`banner${index + 1}`}
              className="object-cover w-full h-auto rounded-lg"
            />
            {index === 0 && (
              <div className="absolute top-[50%] left-[10%] transform -translate-y-1/2">
                <h2 className="mb-2 text-3xl font-bold leading-snug text-black">
                  넘버즈인x지냐<br />
                  스킨케어링<br />
                  파우더 론칭
                </h2>
                <p className="text-lg text-black">지나 공동개발! 1번 파우더 리뉴얼</p>
              </div>
            )}
            {index === 1 && (
              <div className="absolute top-[50%] left-[10%] transform -translate-y-1/2">
                <h2 className="mb-2 text-3xl font-bold leading-snug text-black">
                  세럼강자<br />
                  토리든<br />
                  NEW&BEST
                </h2>
                <p className="text-lg text-black">베스트 세럼 2종 특가&앰플증정</p>
              </div>
            )}
            {index === 2 && (
              <div className="absolute top-[50%] left-[10%] transform -translate-y-1/2">
                <h2 className="mb-2 text-3xl font-bold leading-snug text-black">
                  성분에디터<br />
                  BEST 앰플로<br />
                  피부고민 해결!
                </h2>
                <p className="text-lg text-black">피부 진정 & 수분케어</p>
              </div>
            )}
            {index === 3 && (
              <div className="absolute top-[50%] left-[10%] transform -translate-y-1/2">
                <h2 className="mb-2 text-3xl font-bold leading-snug text-white">
                  햄랑이의<br />
                  순한 진정 루틴
                </h2>
                <p className="text-lg text-white">선착순 햄랑이 키트 증정</p>
              </div>
            )}
          </div>
        ))}
      </Slider>

      {/* 화살표 & 페이지 */}
      <div className="absolute flex items-center px-3 py-1 bg-black rounded bottom-4 right-10 bg-opacity-40">
        <button
          onClick={() => sliderRef.current.slickPrev()}
          className="w-[10px] h-[14px] text-white text-xl flex justify-center items-center mr-2"
        >
          &lt;
        </button>
        <div className="w-[30px] h-[24px] text-white text-sm flex justify-center items-center">
          {currentSlide + 1} / {banners.length}
        </div>
        <button
          onClick={() => sliderRef.current.slickNext()}
          className="w-[10px] h-[14px] text-white text-xl flex justify-center items-center ml-2"
        >
          &gt;
        </button>
      </div>

      {/* 재생/멈춤 버튼 */}
      <div className="absolute px-3 py-1 bg-black rounded bottom-4 right-2 bg-opacity-40">
        <button
          onClick={() => setAutoplay(!autoplay)}
          className="w-[4px] h-[24px] text-white text-xl flex justify-center items-center"
        >
          {autoplay ? '⏸︎' : '▶︎'}
        </button>
      </div>
    </div>
  );
}

export default BannerCarousel;