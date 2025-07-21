"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getImageUrl } from "@/utils/image";

function SkinTonerProduct({ selectedBrands }) {
  const router = useRouter();

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const PER_PAGE_OPTIONS = [24, 36, 48];
  const [itemsPerPage, setItemsPerPage] = useState(PER_PAGE_OPTIONS[0]);
  const [page, setPage] = useState(1);

  const FILTERS = [
    { label: "전체보기", value: "all" },
    { label: "인기순", value: "popular" },
    { label: "신상품순", value: "new" },
    { label: "판매순", value: "sold" },
    { label: "낮은 가격순", value: "lowPrice" },
    { label: "할인율순", value: "discount" },
  ];
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const categoryName = "Skin/Toner";
        const apiUrl = `http://localhost:8080/api/products?categoryName=${categoryName}`;

        const response = await axios.get(apiUrl);
        const data = response.data;

        const mappedProducts = data.map((item) => ({
          id: item.productId,
          imageUrl: item.imageUrl, // 상대경로가 온다고 가정
          productName: item.productName,
          brandName: item.brandName,
          originalPrice: item.originalPrice,
          discountedPrice: item.discountedPrice,
          badgeNames: item.badgeNames || [],
          createdAt: item.createdAt ? new Date(item.createdAt) : null,
          salesCount: item.salesCount || 0,
        }));

        setAllProducts(mappedProducts);
      } catch (error) {
        console.error("상품 데이터를 가져오는 중 오류:", error);
        setError("상품 데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let currentProducts = [...allProducts];

    if (selectedBrands && selectedBrands.length > 0) {
      currentProducts = currentProducts.filter((p) =>
        selectedBrands.includes(p.brandName)
      );
    }

    currentProducts.sort((a, b) => {
      switch (activeFilter) {
        case "popular":
        case "sold":
          return b.salesCount - a.salesCount;
        case "new":
          return b.createdAt.getTime() - a.createdAt.getTime();
        case "lowPrice":
          return a.discountedPrice - b.discountedPrice;
        case "discount":
          const discountRateA =
            (a.originalPrice - a.discountedPrice) / a.originalPrice;
          const discountRateB =
            (b.originalPrice - b.discountedPrice) / b.originalPrice;
          return discountRateB - discountRateA;
        default:
          return 0;
      }
    });

    return currentProducts;
  }, [allProducts, selectedBrands, activeFilter]);

  const totalElements = filteredAndSortedProducts.length;
  const totalPages = Math.ceil(totalElements / itemsPerPage);

  const pagedProducts = filteredAndSortedProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  useEffect(() => {
    setPage(1);
  }, [selectedBrands, activeFilter, itemsPerPage]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // ✅ prefix 포함해서 넘겨야 함
  const handleCardClick = (id) => {
    router.push(`/product/skintoner/${id}`);
  };

  if (loading) {
    return (
      <div className="container py-6 mx-auto">
        <p className="text-xl text-center">상품 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-6 mx-auto">
        <p className="text-xl text-center text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container py-6 mx-auto">
      {/* --- 상단 상품수/필터/뷰개수 --- */}
      <div className="flex items-center justify-between px-2 mb-4">
        <div className="w-full text-2xl font-semibold text-center md:text-2xl">
          <span>스킨/토너 카테고리에 </span>
          <span className="text-[#ff8882] font-bold">{totalElements}</span>{" "}
          <span>개의 상품이 등록되어 있습니다.</span>
        </div>
      </div>

      <hr className="border-t-4 border-[#e6e6e6] my-4" />

      <div className="flex flex-row items-center justify-between px-2 pb-4 flex-nowrap">
        {" "}
        {/* 필터 버튼 */}
        <div className="flex gap-0 whitespace-nowrap">
          {FILTERS.map((f, idx) => (
            <React.Fragment key={f.value}>
              <button
                className={`text-lg px-2 py-1 transition ${
                  activeFilter === f.value
                    ? "text-black font-bold underline underline-offset-[8px]"
                    : "text-[#888] hover:text-black"
                }`}
                onClick={() => setActiveFilter(f.value)}
              >
                {f.label}
              </button>
              {idx < FILTERS.length - 1 && (
                <span className="h-8 mx-2 border-l border-gray-300"></span>
              )}
            </React.Fragment>
          ))}
        </div>
        {/* 보기개수 버튼 */}
        <div className="flex-shrink-0 flex-nowrap flex items-center gap-1 border-l border-[#e6e6e6] pl-4">
          <span className="mr-1 text-xl font-semibold">VIEW</span>
          {PER_PAGE_OPTIONS.map((num) => (
            <button
              key={num}
              className={`text-lg font-semibold px-1 underline-offset-4 transition ${
                itemsPerPage === num
                  ? "text-black underline"
                  : "text-[#aaa] hover:text-black"
              }`}
              onClick={() => setItemsPerPage(num)}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* --- 상품 그리드 --- */}
      <div className="grid grid-cols-4 gap-6">
        {pagedProducts.map((product, index) => (
          <React.Fragment key={product.id}>
            <div
              className="flex flex-col items-center transition bg-white rounded-lg cursor-pointer"
              onClick={() => handleCardClick(product.id)}
            >
              {/* ✅ 상품 이미지 풀 URL 변환 */}
              <img
                src={getImageUrl(product.imageUrl)}
                alt={product.productName}
                className="w-full h-auto mb-4 rounded-md"
              />

              <p className="mb-2 text-sm font-semibold text-center text-[#777777]">
                {product.brandName}
              </p>

              <p className="mb-1 text-lg font-semibold text-center line-clamp-2">
                {product.productName}
              </p>

              <div className="mb-1 w-[215px] flex flex-row items-center justify-center gap-x-2">
                <p className="text-md line-through font-semibold text-[#a9a9a9]">
                  {product.originalPrice.toLocaleString("ko-KR")}원
                </p>
                <p className="text-xl text-[#e02020] font-semibold">
                  {product.discountedPrice.toLocaleString("ko-KR")}원
                </p>
              </div>

              <div className="w-[215px] flex flex-row justify-center mt-[5px] flex-wrap">
                {Array.isArray(product.badgeNames) &&
                  product.badgeNames.map((badge, badgeIdx) => {
                    let badgeWidth = "auto";
                    if (badge === "세일") badgeWidth = "35px";
                    if (badge === "쿠폰") badgeWidth = "35px";
                    if (badge === "증정") badgeWidth = "35px";
                    if (badge === "오늘드림") badgeWidth = "55px";
                    return (
                      <div
                        key={badgeIdx}
                        className={`h-[20px] rounded-[9px] text-[#fff] text-xs justify-center leading-[7px] flex items-center ${
                          badge === "세일"
                            ? "bg-[#f65c60]"
                            : badge === "쿠폰"
                            ? "bg-[#9bce26]"
                            : badge === "증정"
                            ? "bg-[#6fcff7]"
                            : badge === "오늘드림"
                            ? "bg-[#f374b7]"
                            : ""
                        }`}
                        style={{ width: badgeWidth }}
                      >
                        {badge}
                      </div>
                    );
                  })}
              </div>
            </div>

            {(index + 1) % 4 === 0 && (
              <div className="col-span-4">
                <hr className="border-t border-[#e6e6e6] my-4" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* --- 페이지네이션 --- */}
      <div className="flex justify-center mt-8 space-x-2 select-none">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="w-8 h-8 text-xl border rounded border-[#e1e1e1] text-[#aaa] bg-white flex items-center justify-center"
          style={{ minWidth: "40px", minHeight: "40px" }}
        >
          &laquo;
        </button>

        {Array.from({ length: totalPages }).map((_, i) => {
          const pageNum = i + 1;
          return (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`w-8 h-8 text-xl border rounded font-bold transition ${
                pageNum === page
                  ? "border-black text-black"
                  : "border-[#e1e1e1] text-[#888]"
              }`}
              style={{ minWidth: "40px", minHeight: "40px" }}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage((prev) => prev + 1)}
          className="w-8 h-8 text-xl border rounded border-[#e1e1e1] text-[#aaa] bg-white flex items-center justify-center"
          style={{ minWidth: "40px", minHeight: "40px" }}
        >
          &raquo;
        </button>
      </div>
    </div>
  );
}

export default SkinTonerProduct;
