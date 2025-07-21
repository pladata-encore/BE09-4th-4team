"use client";
import { useState } from "react";
import Image from "next/image";

// 상품 카드
const ProductCard = ({ product }) => (
  <div className="w-[220px] text-sm">
    <div className="relative w-[220px] h-[220px] mb-2">
      <Image
        src={product.image}
        alt={product.title || "상품 이미지"}
        fill
        className="object-cover rounded"
        sizes="220px"
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
    {/* 라벨(뱃지) 가운데 정렬 */}
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
              : label === "증정"
              ? "bg-sky-400"
              : "bg-gray-400"
          }`}
        >
          {label}
        </span>
      ))}
    </div>
  </div>
);

// 캐러셀(슬라이더)
export default function ProductCarouselSlider({ title, products }) {
  const [page, setPage] = useState(1);
  const productsPerPage = 4;
  const totalPages = Math.ceil(products.length / productsPerPage);

  const currentProducts = products.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  const handlePrev = () => {
    setPage((prev) => (prev <= 1 ? totalPages : prev - 1));
  };

  const handleNext = () => {
    setPage((prev) => (prev >= totalPages ? 1 : prev + 1));
  };

  return (
    <div className="w-full px-4 py-6">
      <h2 className="text-center text-2xl font-bold mb-6">{title}</h2>
      <div className="relative">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handlePrev}
            className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full text-2xl font-bold"
            aria-label="이전 상품"
          >
            ‹
          </button>
          <div className="flex gap-4">
            {currentProducts.map((product, i) => (
              <ProductCard key={product.id || i} product={product} />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full text-2xl font-bold"
            aria-label="다음 상품"
          >
            ›
          </button>
        </div>
        {/* 페이지네이션 */}
        <div className="flex justify-center items-center mt-4 gap-1 text-sm">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <span
              key={idx}
              className={`px-1 ${
                page === idx + 1 ? "text-black font-semibold" : "text-gray-400"
              }`}
            >
              {idx + 1}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
