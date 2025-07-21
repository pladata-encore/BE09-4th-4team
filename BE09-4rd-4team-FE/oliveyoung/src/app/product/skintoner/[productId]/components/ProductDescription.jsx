"use client";

import React, { useState } from "react";
import { IoChevronForwardOutline } from "react-icons/io5";
import { getImageUrl } from "@/utils/image";

const ProductDescription = ({ descriptionImages = [] }) => {
  const parsedImages = Array.isArray(descriptionImages)
    ? descriptionImages
    : [];

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const initialImageCount = 2;

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const visibleImages = isDescriptionExpanded
    ? parsedImages
    : parsedImages.slice(0, initialImageCount);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {visibleImages.map((imagePath, index) => (
        <img
          key={index}
          src={getImageUrl(imagePath)}
          alt={`상품 상세 설명 ${index + 1}`}
          className="w-full max-w-[800px] h-auto object-contain mb-2"
        />
      ))}

      {parsedImages.length > initialImageCount && !isDescriptionExpanded && (
        <button
          className="px-4 py-2 mt-4 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          onClick={toggleDescription}
        >
          상품설명 더보기{" "}
          <IoChevronForwardOutline className="inline-block ml-1 align-middle" />
        </button>
      )}

      {isDescriptionExpanded && (
        <div className="flex flex-col items-center mt-6">
          <div className="px-6 py-3 mb-6 text-xs text-black bg-gray-100 border rounded">
            본 상품 정보(상품 상세, 상품 설명 등)의 내용은 해당 협력사가 직접 등록한 것입니다.
          </div>
          <button
            className="px-4 py-2 text-sm text-black border border-black rounded hover:bg-blue-50"
            onClick={toggleDescription}
          >
            상품설명 접기{" "}
            <IoChevronForwardOutline className="inline-block ml-1 text-black align-middle transform rotate-180" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDescription;