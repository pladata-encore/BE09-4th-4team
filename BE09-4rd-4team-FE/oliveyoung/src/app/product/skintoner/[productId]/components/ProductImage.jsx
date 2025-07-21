"use client";

import React, { useState, useEffect } from "react";
import { getImageUrl } from "@/utils/image";

const ProductImage = ({ productData, thumbnailPaths = [] }) => {
  const initialMainImage = productData.imageUrl
    ? getImageUrl(productData.imageUrl)
    : thumbnailPaths.length > 0
    ? getImageUrl(thumbnailPaths[0])
    : null;

  const [mainImage, setMainImage] = useState(initialMainImage);

  const handleThumbnailClick = (imagePath) => {
    setMainImage(getImageUrl(imagePath));
  };

  useEffect(() => {
    setMainImage(initialMainImage);
  }, [productData]);

  return (
    <div className="flex flex-col lg:w-3/5">
      <div className="relative w-full max-w-[500px] h-[500px] mb-8">
        {mainImage ? (
          <img
            src={mainImage}
            alt={productData.productName}
            className="object-contain w-full h-full rounded-md"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-100">
            <span className="text-sm text-gray-500">이미지가 없습니다.</span>
          </div>
        )}
      </div>

      {thumbnailPaths.length > 0 && (
        <ul className="flex justify-center space-x-2">
          {thumbnailPaths.map((imagePath, index) => (
            <li
              key={index}
              className={`w-[80px] h-[80px] cursor-pointer ${
                mainImage === getImageUrl(imagePath)
                  ? "border-2 border-black"
                  : "border border-gray-300"
              } hover:border-black`}
              onClick={() => handleThumbnailClick(imagePath)}
            >
              <img
                src={getImageUrl(imagePath)}
                alt={`썸네일 이미지 ${index + 1}`}
                className="object-contain w-full h-full"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductImage;