'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import axios from '@/api/axiosInstance';
import { useCart } from '@/contexts/CartContext';
import { getImageUrl } from "@/utils/image";

export default function Cart() {
  const router = useRouter();
  const imageUrl = getImageUrl("");
  const imageUrlOD = getImageUrl("/order/cart");

  const badgeColorMap = {
    세일: 'bg-[#f65c60]',
    쿠폰: 'bg-[#9bce26]',
    증정: 'bg-[#6fcff7]',
    오늘드림: 'bg-[#f374b7]',
  };

  // 상품 상태 관리
  const [cartItems, setCartItems] = useState([]);

  // 각 상품별 수량, 커스텀 모드, 커스텀 수량 상태 관리
  const [quantityStates, setQuantityStates] = useState({});

  // 수량 변경 핸들러
  const handleQuantityChange = async (cartItemId, quantity) => {
    // 1. 로컬 상태 업데이트
    setQuantityStates((prev) => ({
      ...prev,
      [cartItemId]: {
        ...prev[cartItemId],
        selectedQuantity: quantity,
        isCustomMode: quantity === '10+',
        customQuantity: quantity === '10+' ? '' : '',
      },
    }));
    if (quantity !== '10+') {
      setCartItems((prev) =>
        prev.map((p) => (p.cartItemId === cartItemId ? { ...p, quantity: parseInt(quantity) } : p)),
      );

      // 2. 서버에 수량 변경 요청
      try {
        const token = localStorage.getItem('accessToken');
        await axios.put(
          `http://localhost:8080/api/carts/items/${cartItemId}`,
          { quantity: parseInt(quantity) },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } catch (error) {
        console.error('수량 업데이트 실패:', error);
      }
      alert('수량 변경이 완료되었습니다.');
    }
  };

  // 커스텀 수량 입력 핸들러
  const handleCustomQuantityChange = (cartItemId, quantity) => {
    setQuantityStates((prev) => ({
      ...prev,
      [cartItemId]: {
        ...prev[cartItemId],
        customQuantity: quantity,
      },
    }));
  };

  // 커스텀 수량 확정 핸들러
  const handleConfirmCustomQuantity = async (cartItemId) => {
    const quantity = parseInt(quantityStates[cartItemId].customQuantity);
    if (quantity >= 1) {
      try {
        // 1. 서버에 수량 변경 요청 (PUT)
        console.log('cartItemId', cartItemId);
        await axios.put(
          `http://localhost:8080/api/carts/items/${cartItemId}`,
          {
            quantity: quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          },
        );

        // 2. 성공 시 로컬 상태 업데이트
        setCartItems((prev) =>
          prev.map((p) => (p.cartItemId === cartItemId ? { ...p, quantity: quantity } : p)),
        );

        setQuantityStates((prev) => ({
          ...prev,
          [cartItemId]: {
            selectedQuantity: quantity.toString(),
            customQuantity: quantity > 10 ? quantity.toString() : '',
            isCustomMode: quantity > 10,
          },
        }));

        if (quantity <= 10) {
          setQuantityStates((prev) => ({
            ...prev,
            [cartItemId]: {
              ...prev[cartItemId],
              isCustomMode: false,
              customQuantity: '',
              selectedQuantity: quantity.toString(),
            },
          }));
        }
        alert('수량 변경이 완료되었습니다.');
      } catch (error) {
        console.error('수량 업데이트 실패:', error);
      }
    }
  };

  // 총합 계산
  const totalPrice = cartItems.reduce((sum, p) => sum + p.originalPrice * p.quantity, 0);

  const totalDiscountPrice = cartItems.reduce((sum, p) => sum + p.discountedPrice * p.quantity, 0);

  // 아이템 개수
  const itemCount = cartItems.length;

  // 메뉴 클릭 핸들러
  const handleMenuClick = (e, href) => {
    e.preventDefault();
    setTimeout(() => {
      window.location.href = href;
    }, 1000);
  };

  const [checkedIds, setCheckedIds] = useState([]);

  const handleAllCheck = (e) => {
    if (e.target.checked) {
      setCheckedIds(cartItems.map((p) => p.cartItemId));
    } else {
      setCheckedIds([]);
    }
  };

  const handleRowCheck = (cartItemId) => (e) => {
    if (e.target.checked) {
      setCheckedIds((prev) => [...prev, cartItemId]);
    } else {
      setCheckedIds((prev) => prev.filter((id) => id !== cartItemId));
    }
  };

  const allChecked = cartItems.length > 0 && checkedIds.length === cartItems.length;

  // 선택된 상품만 합산
  const selectedcartItems = cartItems.filter((p) => checkedIds.includes(p.cartItemId));
  const selectedPrice = selectedcartItems.reduce((sum, p) => sum + p.originalPrice * p.quantity, 0);
  const selectedDiscountedPrice = selectedcartItems.reduce(
    (sum, p) => sum + p.discountedPrice * p.quantity,
    0,
  );

  // user 정보 가져오기
  const [userInfo, setUserInfo] = useState({
    userName: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const fetchUserInfo = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/mypage/info', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { userName } = res.data.data;
        setUserInfo({ userName });

        // 2. 장바구니 정보 가져오기
        const cartRes = await axios.get('http://localhost:8080/api/carts/items', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const cartItems = cartRes.data;
        setCartItems(cartItems);

        if (cartItems.length > 0) {
          // 모든 상태 체크 (초기)
          setCheckedIds(cartItems.map((item) => item.cartItemId));

          // quantityStates 초기화
          const initialQuantityStates = cartItems.reduce((acc, cartItem) => {
            acc[cartItem.cartItemId] = {
              selectedQuantity: cartItem.quantity.toString(),
              customQuantity: '',
              isCustomMode: parseInt(cartItem.quantity) > 10,
            };
            return acc;
          }, {});
          setQuantityStates(initialQuantityStates);
        }
      } catch (e) {
        console.error('사용자 정보 가져오기 실패:', e);
      }
    };

    fetchUserInfo();
  }, []);

  // 이름 마스킹 함수
  const maskUserName = (name) => {
    if (!name || name.length < 2) return name;

    if (name.length === 2) {
      return name[0] + '*';
    }

    return name[0] + '*' + name[name.length - 1];
  };

  // cartItem 삭제 핸들러
  const { setItemCount } = useCart();

  const handleDeleteCartItem = async (cartItemId) => {
    const confirmDelete = window.confirm('해당 상품을 삭제 하시겠습니까?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`http://localhost:8080/api/carts/items/${cartItemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 삭제 성공 시 프론트 상태도 업데이트
      const updatedItems = cartItems.filter((item) => item.cartItemId !== cartItemId);
      setCartItems(updatedItems);
      setItemCount(updatedItems.length);
      setCheckedIds((prev) => prev.filter((id) => id !== cartItemId));
      setQuantityStates((prev) => {
        const updated = { ...prev };
        delete updated[cartItemId];
        return updated;
      });
    } catch (error) {
      console.error('장바구니 삭제 실패:', error);
    }
  };

  const handleDeleteSelectedItems = async () => {
    if (checkedIds.length === 0) {
      alert('상품을 선택해주세요.');
      return;
    }

    const confirmDelete = window.confirm('선택된 상품을 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('accessToken');

      // 1. 서버에 개별 삭제 요청 보내기 (여러 개 반복)
      await Promise.all(
        checkedIds.map((cartItemId) =>
          axios.delete(`http://localhost:8080/api/carts/items/${cartItemId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ),
      );

      // 2. 삭제 성공 시 프론트 상태도 업데이트
      const updatedItems = cartItems.filter((item) => !checkedIds.includes(item.cartItemId));
      setCartItems(updatedItems);
      setItemCount(updatedItems.length);
      setCheckedIds((prev) => prev.filter((id) => !checkedIds.includes(id)));
      setQuantityStates((prev) => {
        const updated = { ...prev };
        checkedIds.forEach((id) => delete updated[id]);
        return updated;
      });
    } catch (error) {
      console.error('선택 상품 삭제 실패:', error);
    }

    // 새로 추가된 후 수량 재조회
    const res = await axios.get('http://localhost:8080/api/carts/items', {
      headers: { Authorization: `Bearer ${token}` },
    });

    setItemCount(res.data.length); // 장바구니 수량 바로 업데이트
  };

  // 상품 주문 페이지로 이동
  const handleOrder = (type) => {
    const selectedItems =
      type === 'selected'
        ? cartItems.filter((item) => checkedIds.includes(item.cartItemId))
        : cartItems;

    if (selectedItems.length === 0) {
      alert('주문가능한 상품이 없습니다.');
    }

    // sessionStorage에 저장
    sessionStorage.setItem('orderItems', JSON.stringify(selectedItems));

    // 주문 페이지로 이동
    router.push('/order/order');
  };

  return (
    <div className="overflow-hidden w-full min-w-[1020px]">
      <div className="w-[1020px] h-full mx-auto">
        <div className="overflow-hidden h-[140px] rounded-[5px]">
          {/* title box */}
          <div className="absolute w-full h-[140px] left-1/2 -translate-x-1/2 bg-no-repeat bg-center bg-[#ffeeda]"
          style={{ backgroundImage: `url('${imageUrlOD}/bg_order_top.png')` }} />
          <h1 className="float-left pt-[37px] pb-0 pr-0 text-[40px] text-black leading-[40px] relative font-bold">
            장바구니
            {itemCount > 0 && (
              <span className="inline-block ml-[10px] w-[36px] h-[36px] leading-[36px] text-[16px] text-white bg-[#ff2828] rounded-full text-center align-[10px]">
                {itemCount}
              </span>
            )}
          </h1>
          <ul className="float-right relative">
            <li className="text-[#000] float-left h-[120px] px-[30px] pl-[20px] leading-[120px] text-center text-[24px] whitespace-nowrap bg-[position:100%_50%] bg-no-repeat"
            style={{ backgroundImage: `url('${imageUrlOD}/bg_step_on.png')` }}>
              <span className="text-[#333] inline-block mr-[5px] text-[20px] align-top tracking-[-0.02em] font-medium">
                01
              </span>
              장바구니
            </li>
            <li className="float-left h-[120px] px-[30px] pl-[20px] leading-[120px] text-center text-[24px] text-[#8b8176] whitespace-nowrap bg-[position:100%_50%] bg-no-repeat"
            style={{ backgroundImage: `url('${imageUrlOD}/bg_step.png')` }}>
              <span className="inline-block mr-[5px] text-[20px] text-[#8b8176] align-top tracking-[-0.02em] font-medium">
                02
              </span>
              주문/결제
            </li>
            <li className="float-left h-[120px] px-[30px] pl-[20px] leading-[120px] text-center text-[24px] text-[#8b8176] whitespace-nowrap">
              <span className="inline-block mr-[5px] text-[20px] text-[#8b8176] align-top tracking-[-0.02em] font-medium">
                03
              </span>
              주문완료
            </li>
          </ul>
          <div className="absolute block w-[1020px] h-[20px] mt-[110px] bg-no-repeat bg-[length:auto] bg-[position:50%_10px] bg-white" 
          style={{ backgroundImage: `url('${imageUrlOD}/bg_line.gif')` }} />
        </div>

        {/* membership box */}
        <div className="overflow-hidden h-[103px] pt-[9px] pb-[25px] border-b border-[#e6e6e6]">
          <p className="float-left w-[338px] pt-[6px] px-[30px] text-[20px] text-[#222] leading-[28px]">
            {maskUserName(userInfo.userName)}님의 멤버십 등급은
            <span className="text-[#eb6d9a] font-medium"> PINK OLIVE</span>입니다
          </p>
          <ul className="float-left overflow-hidden ml-[50px]">
            <li className="w-[120px] float-left h-[68px] text-center text-[#222] flex flex-col items-center justify-center">
              <Image
                width={42}
                height={42}
                className="inline-block text-[12px]"
                src={`${imageUrlOD}/icon_rating_pink_on.svg`}
                alt="icon_rating_pink_on.svg"
              />
              <span className="inline-block text-[12px] pr-[13px] font-bold mt-1 bg-no-repeat bg-[position:100%_4px] cursor-pointer"
              style={{ backgroundImage: `url('${imageUrlOD}/ico_arrow6x11.png')` }}>
                등급혜택
              </span>
            </li>
            <li className="pt-[10px] border-l border-[#e6e6e6] text-[#333] text-[14px] float-left w-[170px] h-[68px] text-center cursor-pointer">
              <strong className="block mb-[8px]">
                <span className="font-bold tracking-[-0.02em]">CJ ONE </span>포인트
              </strong>
              <span className="block text-[12px]">
                <span className="mr-[2px] text-[18px] text-[#f27370] align-[-1px] tracking-[-0.02em] font-medium">
                  0
                </span>
                P
              </span>
            </li>
            <li className="pt-[10px] border-l border-[#e6e6e6] text-[#333] text-[14px] float-left w-[170px] h-[68px] text-center cursor-pointer">
              <Link href="/mypage/coupon" onClick={(e) => handleMenuClick(e, href)}>
                <strong className="block mb-[8px]">할인쿠폰</strong>
                <span className="block text-[12px]">
                  <span className="mr-[2px] text-[18px] text-[#f27370] align-[-1px] tracking-[-0.02em] font-medium">
                    0
                  </span>
                  개
                </span>
              </Link>
            </li>
            <li className="pt-[10px] border-l border-[#e6e6e6] text-[#333] text-[14px] float-left w-[170px] h-[68px] text-center cursor-pointer">
              <strong className="block mb-[8px]">예치금</strong>
              <span className="block text-[12px]">
                <span className="mr-[2px] text-[18px] text-[#f27370] align-[-1px] tracking-[-0.02em] font-medium">
                  0
                </span>
                원
              </span>
            </li>
          </ul>
        </div>

        {/* 일반 배송 탭 */}
        <ul className="overflow-hidden w-[1020px] mx-auto mt-[30px] pb-[5px]">
          <li className="relative float-left w-1/2">
            <div className="absolute bottom-[-5px] left-1/2 w-[12px] h-[5px] -ml-[6px] bg-no-repeat"
            style={{ backgroundImage: `url('${imageUrlOD}/bg_tab_arrow.png')` }} />
            <button
              type="button"
              className="text-white bg-[#555] w-full h-[50px] text-[18px] font-medium leading-[24px]"
            >
              일반 배송 ({itemCount})
            </button>
          </li>
          <li className="relative float-left w-1/2">
            <button className="w-full h-[50px] bg-[#f6f6f6] text-[#666] text-[18px] leading-[24px] font-normal text-center cursor-pointer">
              오늘 드림 & 픽업 (0)
            </button>
          </li>
        </ul>

        <h2 className="w-[1020px] mx-auto mt-[40px] mb-[12px] text-[#333] text-[20px] font-normal">
          {itemCount > 0 ? '올리브영 배송상품' : null}
        </h2>

        <table className="w-full">
          <colgroup>
            <col className="w-[40px]" />
            <col className="" />
            <col className="w-[110px]" />
            <col className="w-[100px]" />
            <col className="w-[110px]" />
            <col className="w-[120px]" />
            <col className="w-[150px]" />
          </colgroup>
          <thead>
            <tr className="text-[#666] text-[14px] leading-[20px] tracking-[-0.04em]">
              <th
                scope="col"
                className="h-[40px] border-t-[2px] border-t-[#d6d6d6] border-b border-b-[#ccc] bg-[#fafafa]"
              >
                <input
                  type="checkbox"
                  className="w-[12px] h-[12px] mx-auto cursor-pointer"
                  checked={allChecked}
                  onChange={handleAllCheck}
                />
              </th>
              <th
                scope="col"
                className="h-[40px] border-t-[2px] border-t-[#d6d6d6] border-b border-b-[#ccc] bg-[#fafafa]"
              >
                상품정보
              </th>
              <th
                scope="col"
                className="h-[40px] border-t-[2px] border-t-[#d6d6d6] border-b border-b-[#ccc] bg-[#fafafa]"
              >
                판매가
              </th>
              <th
                scope="col"
                className="h-[40px] border-t-[2px] border-t-[#d6d6d6] border-b border-b-[#ccc] bg-[#fafafa]"
              >
                수량
              </th>
              <th
                scope="col"
                className="h-[40px] border-t-[2px] border-t-[#d6d6d6] border-b border-b-[#ccc] bg-[#fafafa]"
              >
                구매가
              </th>
              <th
                scope="col"
                className="h-[40px] border-t-[2px] border-t-[#d6d6d6] border-b border-b-[#ccc] bg-[#fafafa]"
              >
                선택
              </th>
              <th
                scope="col"
                className="h-[40px] border-t-[2px] border-t-[#d6d6d6] border-b border-b-[#ccc] bg-[#fafafa]"
              >
                배송정보
              </th>
            </tr>
          </thead>
          <tbody>
            {cartItems.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="h-[295px] pt-[130px] border-b border-b-[#e6e6e6] text-center text-[#888] text-[16px] bg-[position:50%_80px] bg-no-repeat"
                  style={{ backgroundImage: `url('${imageUrl}/mypage/order/ico_nodata104x104.png')` }}>
                  장바구니에 담긴 상품이 없습니다.
                </td>
              </tr>
            ) : (
              cartItems.map((product) => (
                <tr key={product.cartItemId}>
                  <td className="border-b border-b-[#e6e6e6] text-center">
                    <input
                      type="checkbox"
                      className="w-3 h-3 cursor-pointer"
                      checked={checkedIds.includes(product.cartItemId)}
                      onChange={handleRowCheck(product.cartItemId)}
                    />
                  </td>
                  {/* 상품정보 */}
                  <td className="border-b border-b-[#e6e6e6]">
                    <div className="flex items-center w-[390px]">
                      <div className="h-[145px] pt-[30px] pr-[20px] pb-[30px] pl-[20px]">
                        <Link href={`/product/skintoner/${product.productId}`}>
                          <Image
                            width={85}
                            height={85}
                            src={`${imageUrl}${product.imageUrl}`}
                            alt={product.brandName}
                          />
                        </Link>
                      </div>
                      <div className="flex-1 pr-[30px]">
                        <Link href={`/product/skintoner/${product.productId}`} className="block">
                          <span className="block mb-1 text-[#777] font-bold text-[14px]">
                            {product.brandName}
                          </span>
                          <p className="text-sm leading-[18px] text-black">{product.productName}</p>
                        </Link>
                        <p className="pb-[5px]"></p>
                        {product.badges?.length > 0 && (
                          <div className="flex items-center mt-1 flex-wrap">
                            {product.badges.map((badgeText, index) => {
                              const bgColorClass = badgeColorMap[badgeText];
                              return (
                                <span
                                  key={index}
                                  className={`px-2 py-0.5 text-white text-xs rounded-[9px] ${bgColorClass}`}
                                >
                                  {badgeText}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  {/* 판매가 */}
                  <td className="border-b border-b-[#e6e6e6] border-l border-l-[#e6e6e6] text-center">
                    <span className="text-[14px] text-[#222] font-medium">
                      <span className="tracking-[-0.02em]">
                        {product.originalPrice.toLocaleString()}
                      </span>
                      원
                    </span>
                  </td>
                  {/* 수량 */}
                  <td className="border-b border-b-[#e6e6e6] border-l border-l-[#e6e6e6] text-center">
                    <div className="w-[60px] space-y-2 mx-auto">
                      {!quantityStates[product.cartItemId].isCustomMode ? (
                        <select
                          className="w-full h-[28px] pl-[10px] border rounded-[5px] border-[#ccc] text-[12px] bg-[#fff]"
                          value={quantityStates[product.cartItemId].selectedQuantity}
                          onChange={(e) => handleQuantityChange(product.cartItemId, e.target.value)}
                        >
                          {Array.from({ length: 10 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                          <option value="10+">10+</option>
                        </select>
                      ) : (
                        <div className="w-[60px]">
                          <input
                            type="text"
                            min="1"
                            value={quantityStates[product.cartItemId].customQuantity}
                            onChange={(e) =>
                              handleCustomQuantityChange(product.cartItemId, e.target.value)
                            }
                            className="w-full h-[28px] px-[5px] border rounded-[5px] border-[#ccc] text-[#222] tracking-[0.5px] text-[12px] bg-[#fff] text-center focus:border-[#9bce26] focus:outline-none"
                          />
                          <button
                            onClick={() => handleConfirmCustomQuantity(product.cartItemId)}
                            disabled={
                              !quantityStates[product.cartItemId].customQuantity ||
                              quantityStates[product.cartItemId].customQuantity < 1
                            }
                            className="w-full h-[28px] mt-[5px] border border-[#aaa] text-[#666] bg-white text-[12px] rounded-[5px] leading-[28px] text-center font-bold"
                          >
                            변경
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                  {/* 구매가 */}
                  <td className="border-b border-b-[#e6e6e6] border-l border-l-[#e6e6e6] text-center">
                    {totalPrice === totalDiscountPrice ? (
                      // 할인 없는 경우
                      <span className="text-[14px] text-[#222] font-medium">
                        <span className="tracking-[-0.02em]">
                          {(product.discountedPrice * product.quantity).toLocaleString()}
                        </span>
                        원
                      </span>
                    ) : (
                      // 할인 있는 경우
                      <>
                        <span className="block text-[12px] text-[#b5b5b5] line-through font-medium">
                          <span className="tracking-[-0.02em]">
                            {(product.originalPrice * product.quantity).toLocaleString()}
                          </span>
                          원
                        </span>
                        <span className="text-[14px] text-[#e02020] font-medium">
                          <span className="tracking-[-0.02em]">
                            {(product.discountedPrice * product.quantity).toLocaleString()}
                          </span>
                          원
                        </span>
                      </>
                    )}
                  </td>
                  {/* 배송정보 */}
                  <td className="border-b border-b-[#e6e6e6] border-l border-l-[#e6e6e6] text-center">
                    <p className="text-[#666] text-[12px] text-center">
                      <strong className="text-[#333] text-[14px]">
                        무료배송
                        <span className="block text-[#666] text-[12px] font-medium">
                          도서·산간 제외
                        </span>
                      </strong>
                    </p>
                  </td>
                  {/* 선택 */}
                  <td className="border-b border-b-[#e6e6e6] border-l border-l-[#e6e6e6] text-center">
                    <button className="w-[109px] h-[28px] px-[5px] mb-[5px] border border-[#9bce26] rounded-[5px] leading-[28px] text-[12px] text-[#9bce26] bg-white font-bold">
                      바로구매
                    </button>
                    <button className="w-[109px] h-[28px] px-[5px] mb-[5px] border border-[#aaa] rounded-[5px] leading-[28px] text-[12px] text-[#666] bg-white font-bold">
                      쇼핑찜
                    </button>
                    <button
                      onClick={() => handleDeleteCartItem(product.cartItemId)}
                      className="w-[109px] h-[28px] mb-[5px] border border-[#aaa] rounded-[5px] leading-[28px] text-[12px] text-[#666] bg-white font-bold"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {cartItems.length > 0 && (
          <>
            {/* 올리브영 배송상품 */}
            <div className="mt-[10px] flex justify-between items-start">
              <div className="float-left w-[300px]">
                <button
                  onClick={handleDeleteSelectedItems}
                  type="button"
                  className="px-[15px] border border-[#aaa] text-[#666] bg-white h-[28px] text-[12px] leading-[28px] rounded-[5px] text-center"
                >
                  <span className="inline-block min-w-[40px] font-bold">선택상품 삭제</span>
                </button>
                <button
                  type="button"
                  className="px-[15px] ml-[2px] border border-[#aaa] text-[#666] bg-white h-[28px] text-[12px] leading-[28px] rounded-[5px] text-center"
                >
                  <span className="inline-block min-w-[40px] font-bold">품절상품 삭제</span>
                </button>
              </div>

              <div className="font-bold text-[#666] float-right w-[700px] mt-[5px] leading-[18px] text-right tracking-[-0.04em] text-[14px]">
                총 판매가
                <span className="mr-[1px] text-[16px] font-medium">
                  {selectedPrice.toLocaleString()}
                </span>
                원
                <span className="inline-block mx-[5px] w-[10px] h-[10px] bg-[position:0_50%] bg-no-repeat text-left"
                style={{ backgroundImage: `url('${imageUrlOD}/ico_sign_cal.png')` }}></span>
                총 할인금액
                <span className="mr-[1px] text-[16px] font-medium">
                  {(selectedPrice - selectedDiscountedPrice).toLocaleString()}
                </span>
                원
                <span className="inline-block mx-[5px] w-[10px] h-[10px] bg-[position:-20px_50%] bg-no-repeat text-left"
                style={{ backgroundImage: `url('${imageUrlOD}/ico_sign_cal.png')` }}></span>
                배송비
                <span className="mr-[1px] text-[16px] font-medium">0</span>원
                <span className="inline-block mx-[5px] w-[10px] h-[10px] bg-[position:-40px_50%] bg-no-repeat text-left"
                style={{ backgroundImage: `url('${imageUrlOD}/ico_sign_cal.png')` }}></span>
                <span className="text-[14px] text-[#f27370]">
                  총 결제금액
                  <span className="ml-[9px] text-[16px] font-medium">
                    {selectedDiscountedPrice.toLocaleString()}
                  </span>
                  원
                </span>
              </div>
            </div>

            <div className="mt-[60px] border-t-[2px] border-t-[#9bce26] border-b border-b-[#e6e6e6]">
              <div className="relative overflow-hidden w-full h-[110px] text-medium">
                <p className="border-l border-l-[#efefef] float-left w-[340px] h-[110px] pt-[30px] text-center text-[16px] text-[#666] border-r border-r-[#efefef] font-bold">
                  총 판매가
                  <span className="text-[#333] block mt-[10px] text-center text-[16px] font-bold leading-[20px]">
                    <span className="text-[24px] mr-[2px] align-[-2px] tracking-[-0.02em] font-medium">
                      {selectedPrice.toLocaleString()}
                    </span>
                    원
                  </span>
                </p>
                <span className="top-1/2 left-[340px] absolute mt-[-15px] ml-[-15px] w-[30px] h-[30px] bg-[position:0_0] bg-no-repeat"
                style={{ backgroundImage: `url('${imageUrlOD}/ico_sign_cal2.png')` }}></span>
                <p className="float-left w-[340px] h-[110px] pt-[30px] text-center text-[16px] text-[#666] border-r border-r-[#efefef]">
                  총 할인금액
                  <span className="text-[#f27370] block mt-[10px] text-center text-[16px] font-bold leading-[20px]">
                    <span className="text-[24px] mr-[2px] align-[-2px] tracking-[-0.02em] font-medium">
                      {(selectedPrice - selectedDiscountedPrice).toLocaleString()}
                    </span>
                    원
                  </span>
                </p>
                <span className="top-1/2 left-[680px] absolute mt-[-15px] ml-[-15px] w-[30px] h-[30px] bg-[position:-30_0] bg-no-repeat"
                style={{ backgroundImage: `url('${imageUrlOD}/ico_sign_cal2.png')` }}></span>
                <p className="border-l border-l-[#efefef] float-left w-[340px] h-[110px] pt-[30px] text-center text-[16px] text-[#666] border-r border-r-[#efefef] font-bold">
                  배송비
                  <span className="text-[#333] block mt-[10px] text-center text-[16px] font-bold leading-[20px]">
                    <span className="text-[24px] mr-[2px] align-[-2px] tracking-[-0.02em] font-medium">
                      0
                    </span>
                    원
                  </span>
                </p>
              </div>
              <div className="text-[#333] h-[80px] pt-[30px] px-[30px] text-right bg-[#f6f6f6] border-t-[2px] border-t-[#d6d6d6] text-[22px] font-bold relative leading-[20px]">
                <span className="absolute top-1/2 left-[30px] h-[30px] -mt-[11px] text-[#888] text-[14px]">
                  <span className="inline-block w-[22px] h-[22px] mr-[7px] mb-[2px] bg-no-repeat align-middle"
                  style={{ backgroundImage: `url('${imageUrlOD}/ico_arrow_01.gif')` }}></span>
                  배송비는 쿠폰할인금액에 따라 변경될 수 있습니다.
                </span>
                총 결제예상금액
                <span className="text-[#ff2828] text-[16px]">
                  <span className="ml-[10px] text-[26px] mr-[2px] align-[-2px] tracking-[-0.02em] font-medium">
                    {selectedDiscountedPrice.toLocaleString()}
                  </span>
                  원
                </span>
              </div>
            </div>

            <div className="mt-[30px] text-center ">
              <button
                type="button"
                onClick={() => handleOrder('selected')}
                className="w-[180px] text-[16px] h-[50px] bg-white border border-[#f27370] pt-[11px] pb-[9px] leading-[28px] text-[#f27370] rounded-[5px] text-center font-bold"
              >
                선택주문 {selectedcartItems.length > 0 && `(${selectedcartItems.length})`}
              </button>
              <button
                type="button"
                onClick={() => handleOrder('all')}
                className="w-[180px] ml-[7px] text-[16px] h-[50px] bg-[#f27370] pt-[11px] pb-[9px] leading-[30px] text-white rounded-[5px] text-center font-bold"
              >
                전체주문
              </button>
            </div>

            <div className="mt-[30px] py-[20px] border-t border-t-[#ccc]">
              <p className="text-[12px] text-[#888] text-center font-bold">
                장바구니 상품은 90일동안, 판매종료 된 상품은 10일동안 보관됩니다.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
