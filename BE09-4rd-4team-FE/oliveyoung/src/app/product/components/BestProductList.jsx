'use client'; // 이 줄이 없으면 추가해주세요.

import React from "react";
import { getImageUrl } from "@/utils/image"; // getImageUrl 함수 임포트

export default function BestProductList() {
  const bestProducts = [
    {
      src: 'product/product1.jpg', // 이 경로들을 파일 서버의 상대 경로로 가정합니다.
      name: '[대용량150ml] 웰라쥬 리얼 히알루로닉 블루 100 앰플 75ml 1+1 기획',
      price: '29,900원',
      origin: '46,000원',
    },
    {
      src: 'product/product2.jpg',
      name: '[6월 올영픽/단독기획] 토리든 다이브인 저분자 히알루론산 세럼 50ml 리필기획(+리필팩 50ml)',
      price: '24,100원',
      origin: '36,000원',
    },
    {
      src: 'product/product3.jpg',
      name: '[1+1/모공 수분천재크림] 에스네이처 아쿠아 스쿠알란 수분크림 60ml 더블기획(60ml+60ml)',
      price: '21,150원',
      origin: '40,000원',
    },
    {
      src: 'product/product4.jpg',
      name: '라로슈포제 시카플라스트 밤 B5+ 100ml 기획 (+히알루 B5 세럼 1.5ml*2개 증정)',
      price: '32,400원',
      origin: '46,000원',
    },
    {
      src: 'product/product5.jpg',
      name: '[6월 올영픽/1+1+증정] 메디힐 마데카소사이드 흔적 리페어 세럼 40+40+10mL',
      price: '22,500원',
      origin: '36,900원',
    },
  ];

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-2xl font-bold text-center">스킨케어의 BEST만 모아봤어요</h2>
      <div className="grid grid-cols-5 gap-6">
        {bestProducts.map((item, idx) => (
          <div className="flex flex-col items-center text-sm font-semibold cursor-pointer" key={idx}>
            <img 
              src={getImageUrl(item.src)} // getImageUrl 적용
              alt={`product${idx + 1}`} 
              className="w-full mb-2 rounded-md" 
            />
            <p className="font-semibold text-left line-clamp-2">{item.name}</p>
            <p className="text-sm text-[#a9a9a9] line-through">{item.origin}</p>
            <p className="text-[#e02020] font-semibold text-lg">{item.price}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <button className="px-6 py-2 bg-gray-200 rounded-md">스킨케어 베스트상품 더보기</button>
      </div>
      <hr className="border-t border-[#ddd] my-8" />
    </div>
  );
}