'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import UserInfoBox from '../user/components/UserInfoBox';
import axios from '@/api/axiosInstance';
import { getImageUrl } from "@/utils/image";

export default function Coupon() {

  const imageUrl = getImageUrl("/mypage");

  const handleMenuClick = (e, href) => {
    e.preventDefault();
    setTimeout(() => {
      window.location.href = href;
    }, 1000);
  };

  const [couponList, setCouponList] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const fetchUserCouponInfo = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/user/coupons', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const couponList = res.data;
        setCouponList(couponList);
      } catch (e) {
        console.error('사용자 쿠폰 정보 가져오기 실패:', e);
      }
    };

    fetchUserCouponInfo();
  }, []);

  const formatDate = (dateTime) => {
    const date = new Date(dateTime);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd}`;
  };

  return (
    <div>
      <UserInfoBox />

      {/* 쿠폰 */}
      <div className="float-left w-[850px] min-h-[640px] px-[29px] pb-[40px] bg-[#fff]">
        <div className="pt-[25px] overflow-hidden relative w-full pb-[7px]">
          <h2 className="float-left text-[#333] text-[20px] leading-[30px] font-bold">쿠폰</h2>
        </div>
        <ul className="overflow-hidden w-full h-[80px] py-[20px] bg-white rounded-[5px] border border-[#696969]">
          <li className="overflow-hidden float-left w-1/2 px-[20px]">
            <p className="float-left text-[#3e3e3e] text-[14px] leading-[20px]">
              쿠폰존에서 다운받을 수 있는
              <br />
              쿠폰을 한눈에 확인하세요.
            </p>
            <Link
              href="/order/coupon"
              onClick={(e) => handleMenuClick(e, href)}
              className="float-right w-[130px] h-[30px] mt-[5px] pt-[6px] pl-[13px] rounded-[4px] bg-[#ebebeb] bg-no-repeat bg-[length:7px_11px] bg-[position:113px_50%] text-[#202020] text-left text-[14px] leading-[20px]"
              style={{ backgroundImage: `url('${imageUrl}/coupon/arrow_12_21_02.png')` }}
            >
              쿠폰 존 바로가기
            </Link>
          </li>
          <li className="overflow-hidden float-left w-1/2 px-[20px] border-l border-[#d6d6d6]">
            <p className="float-left text-[#3e3e3e] text-[14px] leading-[20px]">
              보유하고 계시는
              <br />
              쿠폰번호를 등록하세요.
            </p>
            <Link
              href=""
              className="float-right w-[130px] h-[30px] mt-[5px] pt-[6px] pl-[13px] rounded-[4px] bg-[#ebebeb] bg-no-repeat bg-[length:7px_11px] bg-[position:113px_50%] text-[#202020] text-left text-[14px] leading-[20px]"
              style={{ backgroundImage: `url('${imageUrl}/coupon/arrow_12_21_02.png')` }}
            >
              쿠폰 등록하기
            </Link>
          </li>
        </ul>

        <div className="block">
          <div className="overflow-hidden relative w-full">
            <button
              type="button"
              className="float-right w-auto my-[18px] mb-[6px] pr-[19px] bg-no-repeat bg-[position:99%_50%] text-[#888] text-[12px] leading-[18px] text-center font-medium cursor-pointer"
              style={{ backgroundImage: `url('${imageUrl}/coupon/ico_coupon14x14.png')` }}
            >
              쿠폰안내
            </button>
          </div>
        </div>

        <table className="table-fixed w-full border-t-[2px] border-t-[#d6d6d6] border-b border-b-[#e6e6e6]">
          <colgroup>
            <col className="w-1/4" />
            <col className="w-[45%]" />
            <col className="w-[15%]" />
            <col className="w-[15%]" />
          </colgroup>
          <thead>
            <tr>
              <th className="pt-[11px] pb-[10px] bg-[#fafafa] text-[#666] text-[14px] leading-[18px]">
                혜택
              </th>
              <th className="pt-[11px] pb-[10px] bg-[#fafafa] text-[#666] text-[14px] leading-[18px]">
                쿠폰명
              </th>
              <th className="pt-[11px] pb-[10px] bg-[#fafafa] text-[#666] text-[14px] leading-[18px]">
                쿠폰사용조건
              </th>
              <th className="pt-[11px] pb-[10px] bg-[#fafafa] text-[#666] text-[14px] leading-[18px]">
                사용기간
              </th>
            </tr>
          </thead>
          {couponList.length > 0 && (
            <tbody>
              {couponList
                .filter((coupon) => coupon.used === false)
                .map((coupon) => (
                  <tr key={coupon.userCouponId}>
                    <td className="px-[5px] py-[30px] text-[#333] text-center border-t border-t-[#e6e6e6] text-[14px] leading-[18px]">
                      <span
                        className="inline-block w-[104px] h-[55px] pr-[18px] pt-[17px] text-[#222] leading-[22px] align-top indent-0 text-[18px] font-bold"
                        style={{
                          backgroundImage: coupon.couponName.toLowerCase().includes('summer15')
                            ? `url('${imageUrl}/coupon/bg_coupon_today_208.png')`
                            : `url('${imageUrl}/coupon/bg_coupon_104.png')`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: '0 0',
                          backgroundSize: '104px auto',
                        }}
                      >
                        {coupon.discount}
                        <em className="inline-block text-[17px] not-italic align-[1px]">%</em>
                      </span>
                      <br />
                    </td>
                    <td className="pl-[20px] text-left px-[5px] py-[30px] text-[#333] text-[14px] leading-[18px] border-t border-t-[#e6e6e6] font-medium">
                      {coupon.couponName}
                    </td>
                    <td className="px-[5px] py-[30px] text-[#888] text-center border-t border-t-[#e6e6e6] text-[14px] leading-[18px]">
                      <span>10,000</span>원 이상
                    </td>
                    <td className="px-[5px] py-[30px] text-[#888] text-center border-t border-t-[#e6e6e6] text-[14px] leading-[18px]">
                      {`${formatDate(coupon.createdAt)} ~ ${formatDate(coupon.validUntil)}`}
                    </td>
                  </tr>
                ))}
            </tbody>
          )}
          {!(couponList.length > 0) && (
            <tbody>
              <tr>
                <td
                  colSpan={4}
                  className="h-[295px] pt-[130px] border-b border-b-[#e6e6e6] text-center text-[#888] text-[16px] bg-[position:50%_80px] bg-no-repeat"
                  style={{ backgroundImage: `url('${imageUrl}/order/ico_nodata104x104.png')` }}
                >
                  다운받은 쿠폰이 없습니다.
                </td>
              </tr>
            </tbody>
          )}
        </table>
        <div className="pt-[15px]">
          <h2 className="hidden pt-[25px] text-[#333] text-[14px] leading-[18px]">이용안내</h2>
          <ul className="w-full">
            <li className="mt-[6px] pl-[8px] bg-no-repeat bg-[position:0_7px] text-[#888] text-[12px] leading-[18px]"
            style={{ backgroundImage: `url('${imageUrl}/coupon/bar_2x2.gif')` }}>
              발급받으신 CJ ONE 쿠폰을 올리브영몰(온라인)에서 사용하시는 경우 다운로드 후 주문/결제
              시 적용하실 수 있습니다.
            </li>
            <li className="mt-[6px] pl-[8px] bg-no-repeat bg-[position:0_7px] text-[#888] text-[12px] leading-[18px]"
            style={{ backgroundImage: `url('${imageUrl}/coupon/bar_2x2.gif')` }}>
              사용 기간이 만료되거나 사용한 쿠폰은 보유 목록에서 자동으로 삭제됩니다.
            </li>
            <li className="mt-[6px] pl-[8px] bg-no-repeat bg-[position:0_7px] text-[#888] text-[12px] leading-[18px]"
            style={{ backgroundImage: `url('${imageUrl}/coupon/bar_2x2.gif')` }}>
              주문/취소 시 이용기간이 남아 있는 쿠폰인 경우 재발급됩니다.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
