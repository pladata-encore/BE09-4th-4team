"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const TAB_LIST = ["전체", "스킨/토너", "", "", "", ""];

export default function BrandFilter({ onBrandChange }) {
  const [activeTab, setActiveTab] = useState("전체");
  const [checked, setChecked] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [errorBrands, setErrorBrands] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoadingBrands(true);
      setErrorBrands(null);

      try {
        // 백엔드 API 엔드포인트: Postman에서 확인하신 정확한 URL을 사용한다.
        const response = await axios.get('http://localhost:8080/api/brands');
        const data = response.data;

        // API 응답 형태가 `Page<BrandResponseDTO>` 일 수도 있으므로, content 배열을 확인한다.
        // 또는 API가 직접 List<BrandResponseDTO>를 반환할 수도 있다.
        if (Array.isArray(data)) { // List<BrandResponseDTO> 형태일 경우
            setBrands(data.map(brandDto => brandDto.brandName));
        } else if (data && Array.isArray(data.content)) { // Page<BrandResponseDTO> 형태일 경우
            setBrands(data.content.map(brandDto => brandDto.brandName));
        } else {
            setErrorBrands("브랜드 데이터를 가져오는 데 실패했습니다: 유효하지 않은 응답 형식");
            console.error("Invalid brand API response:", data);
            setBrands([]);
        }

      } catch (error) {
        console.error("브랜드 목록을 가져오는 중 오류 발생:", error);
        if (error.response) {
            setErrorBrands(`브랜드 목록을 가져오는 데 실패했습니다: ${error.response.status} - ${error.response.statusText}`);
            console.error("오류 응답 데이터:", error.response.data);
        } else if (error.request) {
            setErrorBrands("네트워크 오류: 서버에 연결할 수 없습니다.");
        } else {
            setErrorBrands(`요청 오류: ${error.message}`);
        }
        setBrands([]);
      } finally {
        setLoadingBrands(false);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    if (onBrandChange) {
      onBrandChange(checked);
    }
  }, [checked, onBrandChange]);


  const shownBrands = showAll ? brands : brands.slice(0, 15);

  const handleCheck = (brand) => {
    setChecked((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleReset = () => {
    setChecked([]);
  };


  if (loadingBrands) {
    return (
      <div className="px-6 pt-6 pb-3 mt-8 bg-white border border-[#e2e2e2] shadow">
        <div className="text-center text-gray-500">브랜드 목록을 불러오는 중...</div>
      </div>
    );
  }

  if (errorBrands) {
    return (
      <div className="px-6 pt-6 pb-3 mt-8 bg-white border border-[#e2e2e2] shadow">
        <div className="text-center text-red-500">{errorBrands}</div>
      </div>
    );
  }

  return (
    <div className="px-6 pt-6 pb-3 mt-8 bg-white border border-[#e2e2e2] shadow">
      {/* --- 상단 경로 --- */}
      <div className="flex items-center mb-3 text-sm text-gray-400">
        <span>홈</span>
        <span className="mx-1">&gt;</span>
        <span>스킨케어</span>
        <span className="mx-1">&gt;</span>
        <span className="font-semibold text-black">스킨/토너</span>
      </div>
      {/* --- 경로 아래 구분선 --- */}
      <div className="border-b border-[#e2e2e2] mb-4" />
      {/* --- 큰 타이틀 --- */}
      <div className="mb-5 text-3xl font-semibold">스킨/토너</div>
      {/* --- 1행 6열 탭 --- */}
      <div className="mb-6">
        <div className="grid grid-cols-6 overflow-hidden rounded">
          {TAB_LIST.map((tab, idx) =>
            tab ? (
              <button
                key={tab}
                className={`
                  h-[50px] flex items-center justify-center w-full text-lg font-bold
                  border-b
                  ${
                    activeTab === tab
                      ? "text-lime-600 border-[#b6d84a] border-2 border-b-4 bg-white"
                      : "text-gray-700 border border-[#e2e2e2] bg-white"
                  }
                  ${idx === 0 ? "rounded-tl rounded-bl" : ""}
                `}
                style={{
                  borderLeft:
                    idx === 0
                      ? activeTab === tab
                        ? "1px solid #b6d84a"
                        : "1px solid #e2e2e2"
                      : activeTab === tab
                      ? "1px solid #b6d84a"
                      : "1px solid #e2e2e2",
                  borderRight:
                    activeTab === tab
                      ? "1px solid #b6d84a"
                      : "1px solid #e2e2e2",
                  borderTop:
                    activeTab === tab
                      ? "1px solid #b6d84a"
                      : "1px solid #e2e2e2",
                  borderBottom:
                    activeTab === tab
                      ? "3px solid #b6d84a"
                      : "1px solid #e2e2e2",
                }}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ) : (
              <div
                key={idx}
                className="bg-white border border-[#e2e2e2] h-[50px]"
              />
            )
          )}
        </div>
      </div>
      {/* --- 브랜드 리스트 --- */}
      <div className="border-t-2 border-[#d8e49e] pt-4 pb-1 flex bg-white">
        {/* 왼쪽 브랜드 카운트 */}
        <div className="w-[150px] flex flex-col items-start">
          <div className="mb-2 text-2xl font-semibold">브랜드</div>
          <div className="mb-1 text-base font-semibold text-lime-500">
            Total {brands.length}
          </div>
        </div>
        {/* 브랜드 체크박스 */}
        <div className="flex flex-wrap flex-1 gap-y-4">
            {shownBrands.map((brand) => (
                <label
                    key={brand}
                    className="flex items-center w-1/4 gap-2 cursor-pointer font-lightmedium" // ⭐️ w-1/5에서 w-1/4로 변경
                >
                    <input
                        type="checkbox"
                        checked={checked.includes(brand)}
                        onChange={() => handleCheck(brand)}
                        className="w-4 h-4 accent-lime-500"
                    />
                    {brand}
                </label>
            ))}
        </div>
      </div>
      {/* --- 하단 버튼/초기화 --- */}
      <div className="flex items-center justify-between pt-2 mt-2 border-t">
        <button
          onClick={() => setShowAll((v) => !v)}
          className="px-4 py-1 border rounded text-md bg-gray-50 hover:bg-gray-100"
        >
          {showAll ? "접기 ▲" : "더보기 ▼"}
        </button>
        <button
          onClick={handleReset}
          className="ml-auto text-base text-gray-400 hover:text-black"
        >
          선택 초기화
        </button>
      </div>
    </div>
  );
}