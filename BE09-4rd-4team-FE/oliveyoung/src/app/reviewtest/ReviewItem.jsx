"use client";

import { useState } from "react";
import Image from "next/image";
import { FaRegThumbsUp } from "react-icons/fa";

// 별점 컴포넌트
function RatingStars({ rating }) {
  const maxStars = 5;
  const roundedRating = Math.round(rating * 2) / 2;

  return (
    <div className="flex gap-[2px]">
      {Array.from({ length: maxStars }).map((_, i) => {
        if (roundedRating >= i + 1) {
          // 꽉 찬 별
          return (
            <svg
              key={i}
              className="w-[20px] h-[20px] text-red-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87L8.91 8.26z" />
            </svg>
          );
        } else if (roundedRating >= i + 0.5) {
          // 반 별
          return (
            <svg key={i} className="w-[20px] h-[20px]" viewBox="0 0 24 24">
              <defs>
                <linearGradient id={`halfGrad${i}`}>
                  <stop offset="50%" stopColor="#f87171" />
                  <stop offset="50%" stopColor="#e5e7eb" />
                </linearGradient>
              </defs>
              <path
                fill={`url(#halfGrad${i})`}
                d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87L8.91 8.26z"
              />
            </svg>
          );
        } else {
          // 빈 별
          return (
            <svg
              key={i}
              className="w-[20px] h-[20px] text-gray-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87L8.91 8.26z" />
            </svg>
          );
        }
      })}
    </div>
  );
}

export default function ReviewItem({ review }) {
  const [helpfulCount, setHelpfulCount] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);

  const handleHelpfulClick = () => {
    if (hasClicked) {
      setHelpfulCount((prev) => prev - 1);
    } else {
      setHelpfulCount((prev) => prev + 1);
    }
    setHasClicked(!hasClicked);
  };

  return (
    <div className="flex border-b border-gray-200 py-6 text-sm text-gray-800 w-full">
      {/* 좌측: 사용자 정보 */}
      <div className="w-[200px] flex flex-col items-center text-center text-xs text-gray-500 px-4">
        <div className="w-[60px] h-[60px] bg-gray-200 rounded-full mb-2" />
        <div className="text-black font-bold text-sm">
          {review.userName
            ? review.userName.replace(
                /^(.)(.*)(.)$/,
                (_, a, b, c) => a + "*" + c
              )
            : ""}
        </div>

        <div className="mt-1 flex flex-col gap-2 items-center">
          {[review.skinType, review.skinConcern, review.texture].map(
            (item, idx) => (
              <div
                key={idx}
                className="bg-lime-100 text-black px-3 py-1 rounded-full font-semibold text-[12px] w-fit"
              >
                {item}
              </div>
            )
          )}
        </div>
      </div>

      {/* 우측: 리뷰 본문 */}
      <div className="flex-1 flex flex-col pr-6">
        {/* 별점 + 날짜 */}
        <div className="flex items-center text-red-500 mb-1 text-sm">
          <RatingStars rating={review.rating || 0} />
          <span className="text-gray-500 ml-2">{review.date}</span>
        </div>

        {/* 키워드 태그 */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[14px] font-semibold text-[#00b2b2] mb-2">
          <span className="text-[#00aa88]">피부타입</span>
          <span className="text-black">{review.skinType}</span>
          <span className="text-[#00aa88]">피부고민</span>
          <span className="text-black">{review.skinConcern}</span>
          <span className="text-[#00aa88]">자극도</span>
          <span className="text-black">{review.texture}</span>
        </div>

        {/* 리뷰 본문 */}
        <div className="text-gray-800 mt-5 mb-5 text-left">
          {review.content}
        </div>

        {/* 이미지 */}
        {review.images?.length > 0 && (
          <div className="flex gap-4 mb-3">
            {review.images.map((img, idx) => (
              <div
                key={idx}
                className="relative w-[140px] h-[140px] rounded overflow-hidden"
              >
                <Image
                  src={img}
                  alt={`review-${review.id}-img-${idx}`}
                  layout="fill"
                  objectFit="cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        )}

        {/* 도움돼요 + 신고 */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-auto">
          <span className="font-semibold">이 리뷰가 도움이 돼요!</span>
          <button
            onClick={handleHelpfulClick}
            className={`flex items-center gap-1 px-3 py-1 border rounded-full text-xs transition ${
              hasClicked
                ? "border-[#00b2b2] bg-[#e0f7f5] text-[#00b2b2]"
                : "border-gray-300 text-gray-500"
            }`}
          >
            <FaRegThumbsUp />
            <span>{helpfulCount}</span>
          </button>
          <button className="ml-auto text-xs text-gray-400 underline">
            신고하기
          </button>
        </div>
      </div>
    </div>
  );
}
