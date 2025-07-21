"use client";

import { useState } from "react";
import Image from "next/image";

const ProductCard = ({ product }) => {
  return (
    <div className="w-[200px] text-sm">
      <div className="relative w-[200px] h-[200px] mb-2">
        <Image
          src={product.image}
          alt={product.title || "상품 이미지"}
          fill
          className="object-cover rounded"
          sizes="200px"
        />
      </div>
      <p className="text-[13px] leading-tight line-clamp-2 text-center">{product.title}</p>
      <div className="mt-1 text-[15px] font-semibold text-[#f63] text-center">
        {product.discountPrice}원
        {product.originalPrice && (
          <span className="text-gray-400 line-through text-xs ml-2">
            {product.originalPrice}원
          </span>
        )}
      </div>
      {/* 라벨을 flex로 감싸고 justify-center로 정렬 */}
      <div className="flex flex-wrap gap-1 mt-1 justify-center">
        {product.labels?.map((label, i) => (
          <span
            key={i}
            className={`px-1.5 py-0.5 text-xs rounded text-white ${
              label === "오늘드림"
                ? "bg-pink-400"
                : label === "세일"
                ? "bg-red-500"
                : label === "쿠폰"
                ? "bg-green-500"
                : "bg-gray-400"
            }`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default function ProductRecommendationSection({
  leftTitle,
  rightTitle,
  leftProducts,
  rightProducts,
}) {
  const [leftIndex, setLeftIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(0);
  const [leftPage, setLeftPage] = useState(1);
  const [rightPage, setRightPage] = useState(1);

  const totalLeftPages = Math.ceil(leftProducts.length / 2);
  const totalRightPages = Math.ceil(rightProducts.length / 2);

  const handleLeftNext = () => {
    const next = leftIndex + 2 >= leftProducts.length ? 0 : leftIndex + 2;
    setLeftIndex(next);
    setLeftPage((prev) => (prev + 1 > totalLeftPages ? 1 : prev + 1));
  };

  const handleRightNext = () => {
    const next = rightIndex + 2 >= rightProducts.length ? 0 : rightIndex + 2;
    setRightIndex(next);
    setRightPage((prev) => (prev + 1 > totalRightPages ? 1 : prev + 1));
  };

  const leftSlice = leftProducts.slice(leftIndex, leftIndex + 2);
  const rightSlice = rightProducts.slice(rightIndex, rightIndex + 2);

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-6">
      <div className="flex gap-10">
        {/* 왼쪽 섹션 */}
        <div className="w-[450px]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{leftTitle}</h2>
          </div>
          <div className="flex gap-4">
            {leftSlice.map((product, i) => (
              <ProductCard key={i} product={product} />
            ))}
          </div>
          <div className="w-full flex justify-center mt-4">
            <button
              onClick={handleLeftNext}
              className="flex items-center justify-center w-[260px] h-[40px] border border-gray-300 rounded text-sm text-gray-800 hover:bg-gray-50"
            >
              <span className="mr-2">다른상품 추천해드릴게요</span>
              <span className="text-gray-400">{leftPage}</span>
              <span className="text-gray-300 mx-1">|</span>
              <span className="text-gray-400">{totalLeftPages}</span>
            </button>
          </div>
        </div>

        {/* 오른쪽 섹션 */}
        <div className="w-[450px]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{rightTitle}</h2>
          </div>
          <div className="flex gap-4">
            {rightSlice.map((product, i) => (
              <ProductCard key={i} product={product} />
            ))}
          </div>
          <div className="w-full flex justify-center mt-4">
            <button
              onClick={handleRightNext}
              className="flex items-center justify-center w-[260px] h-[40px] border border-gray-300 rounded text-sm text-gray-800 hover:bg-gray-50"
            >
              <span className="mr-2">다른상품 추천해드릴게요</span>
              <span className="text-gray-400">{rightPage}</span>
              <span className="text-gray-300 mx-1">|</span>
              <span className="text-gray-400">{totalRightPages}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
