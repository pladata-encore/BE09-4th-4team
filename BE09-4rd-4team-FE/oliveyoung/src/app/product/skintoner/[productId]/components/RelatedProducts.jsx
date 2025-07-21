"use client";

import React, { useRef, useState, useEffect } from "react";
import { IoChevronForwardOutline } from "react-icons/io5";
import axios from "axios";
import { getImageUrl } from "@/utils/image";

const RelatedProducts = () => {
  const carouselRef = useRef(null);
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);
  const gapWidth = 16;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 전체 상품 가져오고 랜덤 12개 추출함
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiUrl = "http://localhost:8080/api/products";

        const response = await axios.get(apiUrl);

        if (
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          // ✅ shuffle → 랜덤 12개
          const shuffled = [...response.data].sort(() => Math.random() - 0.5);
          const sliced = shuffled.slice(0, 12);

          const transformedProducts = sliced.map((item) => ({
            id: item.productId,
            imgUrl: item.imageUrl,
            name: item.productName,
            originalPrice: item.originalPrice,
            discountedPrice: item.discountedPrice,
            badge: item.badgeNames,
          }));
          setProducts(transformedProducts);
        } else {
          console.warn("API 응답이 비어있음");
          setProducts([]);
          setError("연관 상품이 없습니다.");
        }
      } catch (err) {
        console.error("연관 상품 로드 실패:", err);
        if (err.response) {
          setError(`연관 상품 로드 실패: ${err.response.status}`);
        } else if (err.request) {
          setError("연관 상품 로드 실패: 서버 응답 없음");
        } else {
          setError(`연관 상품 로드 실패: ${err.message}`);
        }
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, []);

  useEffect(() => {
    const calculatePageWidth = () => {
      if (carouselRef.current && carouselRef.current.children.length > 0) {
        const firstItem = carouselRef.current.children[0];
        const itemWidth = firstItem.offsetWidth;
        const calculatedPageWidth =
          itemWidth * itemsPerPage + gapWidth * (itemsPerPage - 1);
        setPageWidth(calculatedPageWidth);
      }
    };

    if (!loading && products.length > 0) {
      calculatePageWidth();
    }

    window.addEventListener("resize", calculatePageWidth);
    return () => {
      window.removeEventListener("resize", calculatePageWidth);
    };
  }, [itemsPerPage, products.length, loading]);

  const handleNextPage = () => {
    if (carouselRef.current && pageWidth > 0 && products.length > 0) {
      const totalPages = Math.ceil(products.length / itemsPerPage);
      const nextPage = (currentPage + 1) % totalPages;
      setCurrentPage(nextPage);

      const targetScrollLeft = nextPage * pageWidth;
      carouselRef.current.scrollTo({
        left: targetScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const handlePrevPage = () => {
    if (carouselRef.current && pageWidth > 0 && products.length > 0) {
      const totalPages = Math.ceil(products.length / itemsPerPage);
      const prevPage = (currentPage - 1 + totalPages) % totalPages;
      setCurrentPage(prevPage);

      const targetScrollLeft = prevPage * pageWidth;
      carouselRef.current.scrollTo({
        left: targetScrollLeft,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="relative px-4 mt-12 md:px-0">
        <div className="flex items-center justify-center h-48 text-gray-600">
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative px-4 mt-12 md:px-0">
        <div className="flex flex-col items-center justify-center h-48 text-center text-red-500">
          <p>{error}</p>
          <p className="mt-2 text-sm text-gray-600">
            백엔드 서버가 실행 중인지, API URL이 올바른지 확인하세요.
          </p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="relative px-4 mt-12 md:px-0">
        <div className="flex items-center justify-center h-48 text-gray-600">
          <p>연관 상품이 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative px-4 mt-12 md:px-0">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold">이런 스킨/토너 상품은 어때요?</h2>
        <a
          href="#"
          className="flex items-center text-sm text-gray-600 hover:underline"
        >
          더보기 <IoChevronForwardOutline className="ml-1 text-base" />
        </a>
      </div>

      <div className="relative">
        <div className="flex items-center">
          <button
            onClick={handlePrevPage}
            disabled={products.length <= itemsPerPage || currentPage === 0}
            className={`absolute z-10 p-2 -translate-y-1/2 bg-white rounded-full shadow-md -left-10 focus:outline-none ${
              products.length <= itemsPerPage || currentPage === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            <IoChevronForwardOutline className="w-5 h-5 text-gray-600 transform rotate-180" />
          </button>

          <div
            ref={carouselRef}
            className="flex w-full space-x-4 overflow-x-hidden scroll-smooth snap-x snap-mandatory"
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-none p-2 mb-6 bg-white snap-start"
                style={{
                  width: `calc((100% - ${
                    gapWidth * (itemsPerPage - 1)
                  }px) / ${itemsPerPage})`,
                }}
              >
                <div className="flex-shrink-0 w-24 h-24 mr-3">
                  <img
                    src={getImageUrl(product.imgUrl)}
                    alt={product.name}
                    className="object-contain w-full h-full rounded-md"
                  />
                </div>
                <div className="flex flex-col justify-center flex-grow">
                  <p className="mb-1 text-sm font-semibold line-clamp-2">
                    {product.name}
                  </p>
                  <div className="flex items-baseline mb-1">
                    {product.originalPrice && (
                      <span className="mr-1 text-xs text-gray-400 line-through">
                        {product.originalPrice.toLocaleString()}원
                      </span>
                    )}
                    <span className="text-base font-bold text-red-500">
                      {product.discountedPrice.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex flex-wrap">
                    {product.badge &&
                      product.badge.map((badgeText, badgeIdx) => {
                        let bgColorClass = "";
                        switch (badgeText) {
                          case "세일":
                            bgColorClass = "bg-[#f65c60]";
                            break;
                          case "쿠폰":
                            bgColorClass = "bg-[#9bce26]";
                            break;
                          case "증정":
                            bgColorClass = "bg-[#6fcff7]";
                            break;
                          case "오늘드림":
                            bgColorClass = "bg-[#f374b7]";
                            break;
                          default:
                            bgColorClass = "bg-gray-500";
                        }
                        return (
                          <span
                            key={badgeIdx}
                            className={`px-1.5 py-0.5 text-white text-xs rounded-sm mr-1 mb-1 ${bgColorClass}`}
                          >
                            {badgeText}
                          </span>
                        );
                      })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={
              products.length <= itemsPerPage ||
              currentPage === Math.ceil(products.length / itemsPerPage) - 1
            }
            className={`absolute z-10 p-2 -translate-y-1/2 bg-white rounded-full shadow-md -right-10 focus:outline-none ${
              products.length <= itemsPerPage ||
              currentPage === Math.ceil(products.length / itemsPerPage) - 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            <IoChevronForwardOutline className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
