"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import UserInfoBox from "../user/components/UserInfoBox";
import { useCart } from "@/contexts/CartContext";
import axios from "@/api/axiosInstance";
import { getImageUrl } from "@/utils/image";

// 날짜 계산 함수
const getPeriod = (months) => {
  const end = dayjs();
  const start = end.subtract(months, "month");
  return {
    startYear: start.year(),
    startMonth: start.format("MM"),
    startDay: start.format("DD"),
    endYear: end.year(),
    endMonth: end.format("MM"),
    endDay: end.format("DD"),
  };
};

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default function Order() {
  const router = useRouter();
  const imageUrl = getImageUrl("/mypage");
  const imageProd = getImageUrl("");

  const searchParams = useSearchParams();

  const getParam = (key, fallback) => searchParams.get(key) || fallback;
  const periodParam = searchParams.get("period");
  const months = periodParam ? Number(periodParam) : 1;
  const defaultPeriod = getPeriod(1);

  const [selectedMonths, setSelectedMonths] = useState(months);
  const [periodState, setPeriodState] = useState(() => ({
    startYear: getParam("startYear", defaultPeriod.startYear),
    startMonth: getParam("startMonth", defaultPeriod.startMonth),
    startDay: getParam("startDay", defaultPeriod.startDay),
    endYear: getParam("endYear", defaultPeriod.endYear),
    endMonth: getParam("endMonth", defaultPeriod.endMonth),
    endDay: getParam("endDay", defaultPeriod.endDay),
  }));
  const [tempPeriodState, setTempPeriodState] = useState(periodState);
  const [loading, setLoading] = useState(false);

  // URL 파라미터가 바뀔 때 상태 동기화
  useEffect(() => {
    setPeriodState({
      startYear: getParam("startYear", defaultPeriod.startYear),
      startMonth: getParam("startMonth", defaultPeriod.startMonth),
      startDay: getParam("startDay", defaultPeriod.startDay),
      endYear: getParam("endYear", defaultPeriod.endYear),
      endMonth: getParam("endMonth", defaultPeriod.endMonth),
      endDay: getParam("endDay", defaultPeriod.endDay),
    });
  }, [searchParams, months]);

  useEffect(() => {
    setTempPeriodState(periodState);
  }, [periodState]);

  // 기간(개월) 버튼 클릭 핸들러
  const handlePeriodClick = (months) => {
    const newPeriod = getPeriod(months);

    setTimeout(() => {
      setLoading(true);
      setTimeout(() => {
        const params = new URLSearchParams();
        params.set("period", months);
        params.set("startYear", newPeriod.startYear);
        params.set("startMonth", newPeriod.startMonth);
        params.set("startDay", newPeriod.startDay);
        params.set("endYear", newPeriod.endYear);
        params.set("endMonth", newPeriod.endMonth);
        params.set("endDay", newPeriod.endDay);

        window.location.href = `/mypage/order?${params.toString()}`;
      }, 300);
    }, 1000);
  };

  // 조회 버튼 클릭 핸들러
  const handleSearch = () => {
    setTimeout(() => {
      setLoading(true);

      // URL 파라미터에 period와 기간 정보 모두 세팅
      const params = new URLSearchParams();
      params.set("period", null);
      params.set("startYear", tempPeriodState.startYear);
      params.set("startMonth", tempPeriodState.startMonth);
      params.set("startDay", tempPeriodState.startDay);
      params.set("endYear", tempPeriodState.endYear);
      params.set("endMonth", tempPeriodState.endMonth);
      params.set("endDay", tempPeriodState.endDay);

      setTimeout(() => {
        window.location.href = `/mypage/order?${params.toString()}`;
      }, 300);
    }, 1000);
  };

  const startDate = dayjs(
    `${periodState.startYear}-${periodState.startMonth}-${periodState.startDay}`
  );
  const endDate = dayjs(
    `${periodState.endYear}-${periodState.endMonth}-${periodState.endDay}`
  );

  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    // 사용자의 주문/배송 내역 조회
    const fetchUserCouponInfo = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const orderList = res.data;
        setOrderList(orderList);
      } catch (e) {
        console.error("사용자 주문/배송 내역 가져오기 실패:", e);
      }
    };

    fetchUserCouponInfo();
  }, []);

  // 기간 내 주문만 필터링
  const filteredOrders = orderList.filter((order) => {
    const orderDateStr = dayjs(order.createdAt).format("YYYY-MM-DD");
    const startStr = startDate.format("YYYY-MM-DD");
    const endStr = endDate.format("YYYY-MM-DD");
    return orderDateStr >= startStr && orderDateStr <= endStr;
  });

  // status 별 카운트
  const statusKoreanMap = {
    RECEIVED: "주문접수",
    PAID: "결제완료",
    READY: "배송준비중",
    SHIPPING: "배송중",
    COMPLETED: "배송완료",
  };

  const statusCounts = Object.keys(statusKoreanMap).reduce((acc, statusEN) => {
    const statusKR = statusKoreanMap[statusEN];
    acc[statusKR] = filteredOrders.filter(
      (order) => order.status === statusEN
    ).length;
    return acc;
  }, {});

  // 장바구니에 상품/수량 추가
  const { setItemCount } = useCart();

  const handleAddToCart = async (productId, quantity = 1) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      await axios.post(
        "http://localhost:8080/api/carts/items",
        {
          productId,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // 새로 추가된 후 수량 재조회
      const res = await axios.get("http://localhost:8080/api/carts/items", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setItemCount(res.data.length); // 장바구니 수량 바로 업데이트

      router.push("/order/cart");
    } catch (error) {
      console.error("장바구니 추가 실패:", error);
    }
  };

  return (
    <div>
      <UserInfoBox />

      {/* 주문/배송 조회 */}
      <div className="float-left w-[850px] px-[29px] pb-[40px]">
        <div className="overflow-hidden mt-[35px] relative w-full">
          <h2 className="float-left text-[#333333] text-[20px] leading-[30px] font-bold">
            주문/배송 조회
          </h2>
        </div>
        <ul className="overflow-hidden w-full mt-[10px] rounded-[10px] bg-[#f5f5f5]">
          {Object.values(statusKoreanMap).map((statusKR) => {
            const count = statusCounts[statusKR] || 0;

            return (
              <li
                key={statusKR}
                className="float-left relative w-1/5 h-[117px]"
                style={
                  statusKR !== Object.values(statusKoreanMap)[0]
                    ? {
                        backgroundImage: `url('${imageUrl}/order/ico_arrow11x21.png')`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "0% 50%",
                      }
                    : undefined
                }
              >
                <em
                  className={
                    "block absolute left-0 w-full text-center align-top top-[25px] not-italic text-[40px] leading-[50px] font-medium " +
                    (count !== 0 ? "text-[#9bce26]" : "text-[#888888]")
                  }
                >
                  {count}
                </em>
                <span className="block absolute left-0 w-full text-center align-top top-[70px] text-[#666666] text-[16px] leading-[22px]">
                  {statusKR}
                </span>
              </li>
            );
          })}
        </ul>

        <fieldset className="mt-[20px] overflow-hidden relative w-full mb-0 pt-[20px] pr-[20px] pb-[20px] pl-[20px] bg-[#fafafa] box-border rounded-[5px]">
          <div className="mb-[14px]">
            <p className="float-left mr-[20px] text-[#666666] text-[12px] font-bold leading-[30px] tracking-[-0.48px]">
              구매 유형
            </p>
            <ul className="flex">
              <li className="float-left w-auto h-[28px]">
                <button
                  type="button"
                  className="w-full h-[28px] px-[15px] border border-[#555555] rounded-[5px] bg-[#555555] text-white text-[12px] font-normal text-center shadow-none cursor-pointer"
                >
                  온라인몰 구매
                </button>
              </li>
              <li className="float-left w-auto h-[28px] ml-[4px]">
                <button
                  type="button"
                  className="w-full h-[28px] px-[15px] border border-[#e5e5e5] rounded-[5px] bg-white text-[#222222] text-[12px] font-normal text-center shadow-none cursor-pointer"
                >
                  매장 구매
                </button>
              </li>
            </ul>
          </div>

          <div className="mb-[14px] block clear-both overflow-hidden">
            <p className="float-left mr-[20px] text-[#666666] text-[12px] font-bold leading-[30px] tracking-[-0.48px]">
              구매기간
            </p>
            <ul className="overflow-hidden">
              {[1, 3, 6, 12].map((months) => (
                <li
                  key={months}
                  className={`float-left w-auto h-[28px]${
                    months !== 1 ? " ml-[4px]" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handlePeriodClick(months)}
                    className={
                      `w-full h-[28px] px-[15px] border rounded-[5px] text-[12px] font-normal text-center shadow-none cursor-pointer ` +
                      (selectedMonths === months
                        ? "border-[#555555] bg-[#555555] text-white"
                        : "border-[#e5e5e5] bg-white text-[#222222]")
                    }
                    disabled={selectedMonths === null}
                  >
                    {months}개월
                  </button>
                </li>
              ))}
            </ul>

            <div className="float-left pt-[10px] leading-[38px]">
              {/* 시작일 */}
              <select
                className="w-[76px] h-[28px] pr-0 text-[#222222] text-[12px] leading-[16px] align-middle pl-[8px] border border-[#d0d0d0] rounded-[5px]"
                value={tempPeriodState.startYear}
                onChange={(e) =>
                  setTempPeriodState((p) => ({
                    ...p,
                    startYear: e.target.value,
                  }))
                }
              >
                {Array.from({ length: 14 }, (_, i) => 2012 + i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <label className="inline-block m-0 mx-[11px] ml-[1px] text-[#222222] text-[12px] leading-[16px] cursor-pointer">
                년
              </label>

              <select
                className="w-[60px] h-[28px] pr-0 text-[#222222] text-[12px] leading-[16px] align-middle pl-[8px] border border-[#d0d0d0] rounded-[5px]"
                value={tempPeriodState.startMonth}
                onChange={(e) =>
                  setTempPeriodState((p) => ({
                    ...p,
                    startMonth: e.target.value,
                  }))
                }
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month.toString().padStart(2, "0")}>
                    {month}
                  </option>
                ))}
              </select>
              <label className="inline-block m-0 mx-[11px] ml-[1px] text-[#222222] text-[12px] leading-[16px] cursor-pointer">
                월
              </label>

              <select
                className="w-[60px] h-[28px] pr-0 text-[#222222] text-[12px] leading-[16px] align-middle pl-[8px] border border-[#d0d0d0] rounded-[5px]"
                value={tempPeriodState.startDay}
                onChange={(e) =>
                  setTempPeriodState((p) => ({
                    ...p,
                    startDay: e.target.value,
                  }))
                }
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day.toString().padStart(2, "0")}>
                    {day}
                  </option>
                ))}
              </select>
              <label className="inline-block m-0 mx-[11px] ml-[1px] text-[#222222] text-[12px] leading-[16px] cursor-pointer">
                일
              </label>

              <span className="ml-[10px] mr-[15px]">~</span>

              {/* 종료일 */}
              <select
                className="w-[76px] h-[28px] pr-0 text-[#222222] text-[12px] leading-[16px] align-middle pl-[8px] border border-[#d0d0d0] rounded-[5px]"
                value={tempPeriodState.endYear}
                onChange={(e) =>
                  setTempPeriodState((p) => ({ ...p, endYear: e.target.value }))
                }
              >
                {Array.from({ length: 14 }, (_, i) => 2012 + i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <label className="inline-block m-0 mx-[11px] ml-[1px] text-[#222222] text-[12px] leading-[16px] cursor-pointer">
                년
              </label>

              <select
                className="w-[60px] h-[28px] pr-0 text-[#222222] text-[12px] leading-[16px] align-middle pl-[8px] border border-[#d0d0d0] rounded-[5px]"
                value={tempPeriodState.endMonth}
                onChange={(e) =>
                  setTempPeriodState((p) => ({
                    ...p,
                    endMonth: e.target.value,
                  }))
                }
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month.toString().padStart(2, "0")}>
                    {month}
                  </option>
                ))}
              </select>
              <label className="inline-block m-0 mx-[11px] ml-[1px] text-[#222222] text-[12px] leading-[16px] cursor-pointer">
                월
              </label>

              <select
                className="w-[60px] h-[28px] pr-0 text-[#222222] text-[12px] leading-[16px] align-middle pl-[8px] border border-[#d0d0d0] rounded-[5px]"
                value={tempPeriodState.endDay}
                onChange={(e) =>
                  setTempPeriodState((p) => ({ ...p, endDay: e.target.value }))
                }
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day.toString().padStart(2, "0")}>
                    {day}
                  </option>
                ))}
              </select>
              <label className="inline-block m-0 mx-[11px] ml-[1px] text-[#222222] text-[12px] leading-[16px] cursor-pointer">
                일
              </label>
            </div>
          </div>

          <button
            type="button"
            className="inline-block absolute top-0 right-0 w-[85px] h-full bg-[#9bce26] rounded-tr-[5px] rounded-br-[5px] text-white text-[12px] leading-[22px]"
            onClick={handleSearch}
          >
            조회
          </button>
        </fieldset>

        <p className="pt-[10px] text-[#555555] text-[12px] leading-[18px]">
          <span
            className="relative inline-block align-middle px-[10px] text-[#555555] text-[12px] leading-[18px] bg-no-repeat bg-[position:0_7px]"
            style={{ backgroundImage: `url('${imageUrl}/coupon/bar_2x2.gif')` }}
          >
            2017년 4월 1일 이후 내역만 조회가 가능하며, 이전의 주문내역은 CJMall
            주문내역에서 확인하실 수 있습니다.
          </span>
          <span
            className="relative inline-block align-middle px-[10px] text-[#555555] text-[12px] leading-[18px] bg-no-repeat bg-[position:0_7px]"
            style={{ backgroundImage: `url('${imageUrl}/coupon/bar_2x2.gif')` }}
          >
            매장 구매는 CJ ONE 포인트 적립을 한 경우, 최근 1년 내역만 조회가
            가능합니다. (2019년 9월 27일 이후 내역만 조회 가능)
          </span>
        </p>

        {/* 주문/배송 상세 테이블 */}
        <table className="table-fixed w-full border-t-[2px] border-b border-t-[#d6d6d6] border-b-[#e6e6e6] mt-[20px]">
          <colgroup>
            <col className="w-[17%]" />
            <col className="" />
            <col className="w-[8%]" />
            <col className="w-[130px]" />
            <col className="w-[110px]" />
          </colgroup>
          <thead>
            <tr>
              <th
                scope="col"
                className="pt-[11px] pb-[10px] px-0 bg-[#fafafa] text-[#666666] text-[14px] leading-[18px]"
              >
                주문일자
              </th>
              <th
                scope="col"
                className="pt-[11px] pb-[10px] px-0 bg-[#fafafa] text-[#666666] text-[14px] leading-[18px]"
              >
                상품
              </th>
              <th
                scope="col"
                className="pt-[11px] pb-[10px] px-0 bg-[#fafafa] text-[#666666] text-[14px] leading-[18px]"
              >
                수량
              </th>
              <th
                scope="col"
                className="pt-[11px] pb-[10px] px-0 bg-[#fafafa] text-[#666666] text-[14px] leading-[18px]"
              >
                주문금액
              </th>
              <th
                scope="col"
                className="pt-[11px] pb-[10px] px-0 bg-[#fafafa] text-[#666666] text-[14px] leading-[18px]"
              >
                상태
              </th>
            </tr>
          </thead>
          {filteredOrders.length === 0 ? (
            <tbody>
              <tr>
                <td
                  colSpan={5}
                  className="!w-full !pt-[200px] !px-[15px] !pb-[80px] !text-[#888888] !text-[16px] !text-center !leading-[20px] bg-no-repeat"
                  style={{
                    backgroundImage: `url('${imageUrl}/order/ico_nodata104x104.png`,
                    backgroundPosition: "center 80px",
                  }}
                >
                  기간 내 주문내역이 없습니다
                </td>
              </tr>
            </tbody>
          ) : (
            filteredOrders
              .sort((a, b) => dayjs(b.createdAt).diff(dayjs(a.createdAt)))
              .map((order) => (
                <tbody key={order.orderId}>
                  {order.orderItems.map((item, idx) => (
                    <tr key={idx}>
                      {idx === 0 && (
                        <td
                          rowSpan={order.orderItems.length}
                          className="pt-[30px] pb-[30px] px-[5px] text-[#333] text-center border-t border-[#e6e6e6] text-[14px] leading-[18px]"
                        >
                          <ul>
                            <li className="font-medium text-[#131518] list-none">
                              {dayjs(order.createdAt).format("YYYY-MM-DD")}
                            </li>
                            <li className="mt-[2px] block font-medium text-[#9bce26] leading-[1.27] break-all align-top list-none">
                              {order.orderId}
                            </li>
                            <li className="mt-[2px] leading-[1.27] relative overflow-hidden font-bold text-[12px] tracking-[-0.45px] h-auto p-0  text-[#b2b8be] border-b-0 cursor-pointer list-none underline">
                              상세보기
                            </li>
                          </ul>
                        </td>
                      )}
                      <td className="border-t border-l border-[#e6e6e6] pl-5 pt-[30px] pb-[30px] px-[5px] text-left text-[#333333] text-[14px] leading-[18px]">
                        <div className="flex overflow-hidden relative w-full">
                          <Link
                            href={`/product/skintoner/${item.productId}`}
                            className="float-left relative w-[85px] h-[85px] mr-[20px] text-center"
                          >
                            <Image
                              src={`${imageProd}${item.imageUrl}`}
                              alt={item.productName}
                              width={85}
                              height={85}
                            />
                          </Link>
                          <div className="float-left w-[66%] text-left">
                            <Link
                              href={`/product/skintoner/${item.productId}`}
                              className="block"
                            >
                              <span className="overflow-hidden h-[20px] text-[#777777] text-ellipsis whitespace-nowrap font-bold inline-block w-full">
                                {item.brandName}
                              </span>
                              <span className="over-flow-hidden max-h-[36px] text-[#333333] inline-block w-full">
                                {item.productName}
                              </span>
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleAddToCart(item.productId)}
                              className="w-[120px] h-[32px] text-[12px] leading-[18px] text-[#555] rounded-[5px] border border-[#e5e5e5] bg-white mt-[10px] text-center cursor-pointer"
                            >
                              <span
                                className="pl-[15px] bg-[position:0%_50%] bg-no-repeat"
                                style={{
                                  backgroundImage: `url('${imageUrl}/order/icon_my_cart2.png')`,
                                }}
                              >
                                장바구니 담기
                              </span>
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="border-t border-l border-[#e6e6e6] pt-[30px] pb-[30px] px-[5px] text-center text-[#333333] text-[14px] leading-[18px]">
                        {item.quantity}
                      </td>
                      <td className="border-t border-l border-[#e6e6e6] pt-[30px] pb-[30px] px-[5px] text-center text-[#f27370] text-[14px] font-medium leading-[18px]">
                        {item.price.toLocaleString()} <strong>원</strong>
                      </td>
                      <td className="border-t border-l border-[#e6e6e6] pt-[30px] pb-[30px] px-[5px] text-center text-[#333333] text-[14px] leading-[18px]">
                        <strong>
                          {statusKoreanMap[order.status] || order.status}
                        </strong>
                        <button
                          type="button"
                          className="mt-[7px] text-[#666] text-center min-w-[75px] w-auto h-[32px] px-[5px] rounded-[5px] border border-[#aaa] bg-white text-[12px] cursor-pointer font-medium"
                        >
                          배송조회
                        </button>
                        {item.hasReview === false && <button
                          type="button"
                          className="mt-[5px] text-[#666] text-center min-w-[75px] w-auto h-[32px] px-[5px] rounded-[5px] border border-[#aaa] bg-white text-[12px] cursor-pointer font-medium"
                          onClick={() => (window.location.href = "/review")}
                        >
                          리뷰작성
                        </button>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              ))
          )}
        </table>
      </div>
    </div>
  );
}
