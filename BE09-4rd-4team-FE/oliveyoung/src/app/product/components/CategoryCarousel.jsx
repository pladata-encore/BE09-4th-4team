'use client';

import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { getImageUrl } from "@/utils/image"; // getImageUrl 함수 임포트

const categories = [
  { img: 'product/category1.jpg', name: '진정솔루션' },
  { img: 'product/category2.jpg', name: '슬로우에이징' },
  { img: 'product/category3.jpg', name: '클린뷰티' },
  { img: 'product/category4.jpg', name: '크림' },
  { img: 'product/category5.jpg', name: '에센스' },
  { img: 'product/category6.jpg', name: '토너' },
];

// 커스텀 왼쪽 화살표
function PrevArrow(props) {
  const { onClick } = props;
  return (
    <div 
      className="absolute left-[-35px] top-[50%] transform -translate-y-1/2 z-50 cursor-pointer"
      onClick={onClick}
    >
      ᐸ
    </div>
  );
}

// 커스텀 오른쪽 화살표
function NextArrow(props) {
  const { onClick } = props;
  return (
    <div 
      className="absolute right-[-30px] top-[50%] transform -translate-y-1/2 z-50 cursor-pointer"
      onClick={onClick}
    >
      ᐳ
    </div>
  );
}

function CategoryCarousel() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />
  };

  return (
    <div className="relative w-full">
      <Slider {...settings}>
        {categories.map((item, index) => (
          <div key={index} className="flex flex-col items-center justify-center py-5 cursor-pointer">
            <div className="w-[150px] h-[150px] rounded-full overflow-hidden flex justify-center items-center">
              <img 
                src={getImageUrl(item.img)} // getImageUrl 적용
                alt={item.name} 
                className="object-cover w-full h-full" 
              />
            </div>
            <p className="mt-2 text-sm font-medium text-[#333] text-center">{item.name}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default CategoryCarousel;