"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GoQuestion } from "react-icons/go";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { FaRegHeart, FaGift } from "react-icons/fa";
import { useCart } from '@/contexts/CartContext';
import axios from '@/api/axiosInstance'; ;

const ProductPurchase = ({ productData }) => {
  const router = useRouter();

  // 구매수량 상태
  const [quantity, setQuantity] = useState(1);

  // 수량 감소 (최소 1)
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // 수량 증가
  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  // 직접 입력 핸들러
  const handleQuantityChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // 숫자만
    const num = parseInt(value, 10);

    if (value === "") {
      setQuantity("");
    } else if (!isNaN(num) && num >= 1) {
      setQuantity(num);
    } else {
      setQuantity(1);
    }
  };

  // 총금액
  const totalAmount =
    productData.discountedPrice * (quantity === "" ? 1 : quantity);

  // 장바구니 팝업
  const [showCartPopup, setShowCartPopup] = useState(false);

  // 장바구니에 상품/수량 추가
  const { setItemCount } = useCart();
  const productId = productData.productId;

  const handleAddToCart = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      await axios.post(
        'http://localhost:8080/api/carts/items',
        {
          productId,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // 새로 추가된 후 수량 재조회
      const res = await axios.get('http://localhost:8080/api/carts/items', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setItemCount(res.data.length); // 장바구니 수량 바로 업데이트
      setShowCartPopup(true); // 팝업 띄우기
    } catch (error) {
      console.error('장바구니 추가 실패:', error);
    }
  };

  return (
    <>
      {/* 배송 정보 */}
      <div className="py-4">
        <span className="mb-2 text-lg font-semibold">배송정보</span>
        <GoQuestion className="inline-block mb-1 ml-1 text-base text-gray-500 cursor-pointer" />
        <ul className="text-sm text-gray-700">
          <li className="flex mt-2 mb-2">
            <span className="font-semibold text-gray-700 w-25">일반배송</span>
            <span className="mx-2 text-gray-300">|</span>
            <div className="flex flex-col flex-1">
              <span>2,500원 (20,000원 이상 무료배송)</span>
              <span className="text-gray-700">
                올리브영 배송: 평균 4일 이내 배송
              </span>
            </div>
          </li>
          <li className="flex items-center mb-2">
            <span className="font-semibold text-gray-700 w-25">오늘드림</span>
            <span className="mx-2 text-gray-300">|</span>
            <div className="flex items-center flex-1">
              2,500원 또는 5,000원
              <GoQuestion className="inline-block mb-1 ml-1 text-base text-gray-500 cursor-pointer" />
            </div>
          </li>
          <li className="flex items-center pb-3 border-b border-gray-200">
            <span className="mr-6 font-semibold text-gray-700 w-25">픽업</span>
            <span className="mx-2 text-gray-300">|</span>
            <div className="flex items-center flex-1">
              배송비 조건 없음
              <GoQuestion className="inline-block ml-1 text-base text-gray-500 cursor-pointer" />
            </div>
          </li>
        </ul>
      </div>

      {/* 결제 혜택 */}
      <div className="mb-2 border-b">
        <p className="mb-2 text-lg font-semibold">결제혜택</p>
        <ul className="text-sm text-gray-700">
          <li className="flex items-center mb-1">
            THE CJ 카드 추가 10% 할인
            <GoQuestion className="inline-block ml-1 text-base text-gray-500 align-middle cursor-pointer" />
          </li>
          <li className="flex items-center mb-4">
            CJ ONE 포인트 최대 1% 적립 예상
            <GoQuestion className="inline-block ml-1 text-base text-gray-500 align-middle cursor-pointer" />
          </li>
        </ul>
      </div>

      {/* 구매수량 */}
      <div className="flex items-center justify-between py-4 mb-4 border-b border-gray-200">
        <span className="text-lg font-semibold">구매수량</span>
        <div className="flex items-center border border-gray-300 rounded-sm">
          <button
            onClick={handleDecrease}
            className="flex items-center justify-center w-8 h-8 text-lg text-gray-600 rounded-l-sm hover:bg-gray-100"
          >
            <CiCircleMinus className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={quantity}
            onChange={handleQuantityChange}
            className="w-12 h-8 text-sm text-center border-l border-r border-gray-300"
          />
          <button
            onClick={handleIncrease}
            className="flex items-center justify-center w-8 h-8 text-lg text-gray-600 rounded-r-sm hover:bg-gray-100"
          >
            <CiCirclePlus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 총금액 */}
      <div className="flex items-center justify-between py-4 mb-6 border-b-2 border-[#e02020]">
        <span className="text-lg font-bold text-[#e02020]">상품금액 합계</span>
        <span className="text-xl font-bold text-red-500">
          {totalAmount.toLocaleString()}원
        </span>
      </div>

      {/* 기타 옵션 */}
      <div className="flex items-center mb-4 text-sm">
        <input
          type="checkbox"
          id="todayDream"
          className="w-4 h-4 mr-2 accent-[#f27370]"
        />
        <label htmlFor="todayDream">
          오늘드림으로 받아 보시겠어요?
          <GoQuestion className="inline-block mb-1 ml-1 text-base text-gray-600 align-middle cursor-pointer" />
        </label>
      </div>

      {/* 구매 버튼들 */}
      <div className="flex mb-8 space-x-2">
        <button
          className="flex-1 py-3 text-lg border border-[#f27370] text-[#f27370] hover:bg-white"
          onClick={handleAddToCart}
        >
          장바구니
        </button>
        <button className="flex-1 py-3 text-lg text-white bg-[#f27370] hover:bg-[#f27370]">
          바로구매
        </button>
        <button className="flex items-center justify-center border bg-[#f27370] border-gray-300 rounded-sm w-14 hover:bg-gray-50">
          <FaGift className="w-6 h-6 text-white" />
        </button>
        <button className="flex items-center justify-center border border-gray-300 w-14 h-14 hover:bg-white">
          <FaRegHeart className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {showCartPopup && (
        <>
        <div className="fixed inset-0 z-[998] bg-black/50"></div>
        <div className="z-[999] block absolute left-1/2 -ml-[245px] top-[834px] w-[490px] bg-white rounded-[5px]">
          <div className="w-[534px] -mt-[365px] -ml-[268px] absolute z-[11] left-1/2 bg-white rounded-[5px]">
            <div className="px-[30px] pb-[30px]">
              <h1 className="pt-[30px] pb-[15px] border-b-[2px] border-b-[#000] text-[#000] text-[24px] leading-[30px] font-bold">선택완료</h1>
              <div className="pt-[35px] px-[25px] pb-[20px]">
                <span className="pt-[10px] pb-[20px]">
                  <p className="pt-[10px] pb-[20px] text-center text-[16px] text-[#999] font-bold">
                  장바구니에 추가되었습니다.
                  </p>
                </span>
              </div>
              <div className="pt-[20px] text-center">
                <button type="button" onClick={() => setShowCartPopup(false)} 
                className="mx-[2px] inline-block w-[130px] h-[40px] leading-[38px] text-[12px] text-[#9bce26] font-bold rounded-[2px] border border-[#9bce26] bg-white">
                  쇼핑계속하기
                </button>
                <button type="button" onClick={() => router.push("/order/cart")} 
                className="mx-[2px] inline-block w-[130px] h-[40px] leading-[38px] text-[12px] bg-[#9bce26] font-bold rounded-[2px] text-white">
                  장바구니 확인
                </button>
              </div>
            </div>
          </div>
        </div> 
        </> 
      )}
    </>
  );
};

export default ProductPurchase;