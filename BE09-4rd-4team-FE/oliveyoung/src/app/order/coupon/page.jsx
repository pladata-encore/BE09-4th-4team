'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from '@/api/axiosInstance';
import { getImageUrl } from "@/utils/image";

export default function Coupon() {
  const router = useRouter();
  const imageUrl = getImageUrl("/order");
  const imageUrlMP = getImageUrl("/mypage");

  const [userInfo, setUserInfo] = useState('');
  const [couponList, setCouponList] = useState([]);
  const [userCouponList, setUserCouponList] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    // 1. 사용자 정보 조회
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/mypage/info', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userInfo = res.data.data;
        setUserInfo(userInfo);
      } catch (e) {
        console.error('사용자 정보 가져오기 실패:', e);
      }
    };

    // 2. 전체 쿠폰 조회
    const fetchCouponInfo = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/admin/coupons', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const couponList = res.data.data;
        setCouponList(couponList);
      } catch (e) {
        console.error('전체 쿠폰 정보 가져오기 실패:', e);
      }
    };

    // 3. 사용자가 보유한 쿠폰 조회
    const fetchUserCouponInfo = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/user/coupons', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userCouponList = res.data;
        setUserCouponList(userCouponList);
      } catch (e) {
        console.error('사용자 쿠폰 정보 가져오기 실패:', e);
      }
    };

    fetchUserInfo();
    fetchCouponInfo();
    fetchUserCouponInfo();
  }, []);

  // 이름 마스킹 함수
  const maskUserName = (name) => {
    if (!name || name.length < 2) return name;

    if (name.length === 2) {
      return name[0] + '*';
    }

    return name[0] + '*' + name[name.length - 1];
  };

  // 유효 기간이 지나지 않은 쿠폰 필터 작업
  const today = new Date();
  const validCoupons = couponList.filter((coupon) => {
    return new Date(coupon.validUntil) >= today;
  });

  // 발급 여부 비교 함수
  const isCouponIssued = (couponId) => {
    return userCouponList.some((uc) => uc.couponId === couponId);
  };

  // 쿠폰 다운로드 핸들러 함수
  const handleDownloadCoupon = async (coupon) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const fetchCouponDownload = async () => {
      try {
        await axios.post(
          'http://localhost:8080/api/user/coupons',
          {
            couponId: coupon.id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        alert('쿠폰이 발급되었습니다.');
        router.push('/mypage/coupon');
      } catch (e) {
        console.error('사용자 정보 가져오기 실패:', e);
      }
    };

    fetchCouponDownload();
  };

  return (
    <div className="overflow-hidden w-full min-w-[1020px]">
      <div className="w-full h-[100px] bg-no-repeat bg-[position:50%_0] bg-[#e4f1fc]"
      style={{ backgroundImage: `url('${imageUrl}/coupon/bg_coupon_top_191024.png')` }}>
        <h1 className="w-[1020px] mx-auto pt-[30px] text-[40px] text-black leading-[40px] relative font-bold">
          올리브 멤버스 라운지{' '}
          <span className="inline-block ml-[15px] text-[#333] text-[18px] font-medium">
            쇼핑하는 재미! 올리브영만의 더 특별한 혜택
          </span>
        </h1>
      </div>

      <div>
        <ul className="overflow-hidden w-[1020px] mt-[30px] mx-auto pb-[5px]">
          <li className="relative float-left w-1/2">
            <button
              type="button"
              className="w-full h-[50px] bg-[#f6f6f6] text-[#666] text-[18px] leading-[16px] font-medium text-center cursor-pointer"
            >
              올리브 멤버스
            </button>
          </li>
          <li className="relative float-left w-1/2">
            <div className="absolute bottom-[-5px] left-1/2 w-[12px] h-[5px] -ml-[6px] bg-no-repeat" 
            style={{ backgroundImage: `url('${imageUrl}/cart/bg_tab_arrow.png')` }} />
            <button
              type="button"
              className="w-full h-[50px] bg-[#555] text-[#fff] text-[18px] leading-[16px] font-medium text-center cursor-pointer"
            >
              쿠폰/혜택
            </button>
          </li>
        </ul>

        <div className="block">
          <div className="w-[1020px] mx-auto h-[281px] pt-[50px] bg-no-repeat"
          style={{ backgroundImage: `url('${imageUrl}/coupon/bg_mem_info.png')` }}>
            <div className="relative w-[80px] h-[80px] mx-auto">
              <span className="absolute block overflow-hidden w-[80px] h-[80px]" />
              <Image
                width={80}
                height={80}
                src={`${imageUrlMP}/order/my_picture_base.jpg`}
                alt="프로필 이미지"
              />
            </div>
            <p className="pt-[25px] text-[28px] text-black leading-[40px] text-center tracking-[-1px]">
              <em className="font-bold not-italic">{maskUserName(userInfo.userName)}</em>님의 등급은
              <strong>
                <span className="text-[#eb6d9a]"> PINK OLIVE</span>
              </strong>{' '}
              입니다
            </p>
          </div>
        </div>

        <div className="block w-[1020px] h-[100px] mt-[-1px] mx-auto bg-no-repeat cursor-pointer"
        style={{ backgroundImage: `url('${imageUrl}/coupon/bg_coupon_enroll.png')` }}>
          <span className="inline-block align-middle text-[#6ab9d5] text-[24px] leading-[30px] ml-[86px] pt-[44px] pl-[40px] bg-no-repeat bg-[position:0_42px] font-bold"
          style={{ backgroundImage: `url('${imageUrl}/coupon/ico_plus30x30.png')` }}>
            쿠폰 등록{' '}
            <em className="inline-block align-middle text-[#888] text-[16px] not-italic ml-[20px] font-bold">
              발급 받으신 번호를 등록해주세요
            </em>
          </span>
        </div>

        <div className="relative w-[1020px] mx-auto">
          <h2 className="w-[1020px] mx-auto pt-[48px] pr-0 pb-[14px] pl-[50px] text-black text-[24px] font-bold bg-no-repeat leading-[30px] bg-[position:0_42px]"
          style={{ backgroundImage: `url('${imageUrl}/coupon/ico_member.png')` }}>
            올리브 멤버스 쿠폰
          </h2>
          <span className="absolute bottom-[20px] right-0 pr-[15px] text-[16px] text-[#888] font-bold bg-no-repeat bg-[position:100%_2px] cursor-pointer"
          style={{ backgroundImage: `url('${imageUrl}/coupon/ico_arrow8x14.png')` }}>
            쿠폰안내
          </span>
        </div>
        <ul className="overflow-hidden w-[1020px] mx-auto pt-[40px] border-t border-t-[#ddd]">
          {validCoupons.map((coupon) => {
            const issued = isCouponIssued(coupon.id);

            return (
              <li key={coupon.id} className="float-left w-1/2 pb-[33px] text-center min-h-[262px]">
                <div
                  className="relative w-[325px] h-[172px] mx-auto pr-[55px] bg-no-repeat"
                  style={{
                    backgroundImage: issued
                      ? `url('${imageUrl}/coupon/bg_coupon_325_off.png')`
                      : coupon.name.toLowerCase().includes('summer15')
                      ? `url('${imageUrl}/coupon/bg_coupon_today_325.png')`
                      : `url('${imageUrl}/coupon/bg_coupon_325.png')`
                  }}
                >
                  <div className="table-cell w-[270px] h-[172px] align-middle">
                    <span className="text-[15px] font-bold block text-[#292929]">
                      {coupon.name}
                    </span>
                    <span className="mt-[13px] text-[65px] leading-[48px] font-medium tracking-[-3.5px] block text-[#292929]">
                      <em className="text-[50px] align-[5px] font-bold not-italic">
                        {coupon.discount}%
                      </em>
                    </span>
                    <span className="mt-[13px] text-[13px] text-[#888] leading-[1.4] block">
                      10,000원 이상 적용 가능
                    </span>
                    {/* 오늘드림 뱃지 */}
                    {coupon.name.toLowerCase().includes('summer15') && (
                      <span className="absolute top-[15px] left-[-36px] w-[72px] h-[72px] rounded-[36px] bg-no-repeat bg-[length:42px_auto] bg-[position:50%_50%] bg-[#ff8bbc] text-transparent text-center"
                      style={{ backgroundImage: `url('${imageUrl}/coupon/txt_today.png')` }}>
                        <strong>오늘드림</strong>
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  className={
                    issued
                      ? 'bg-[#bbb] w-[182px] h-[40px] mt-[11px] rounded-[5px] text-center text-[#fff]'
                      : 'w-[182px] h-[40px] mt-[11px] border border-[#999] rounded-[5px]'
                  }
                  onClick={() => {
                    if (issued) {
                      alert('이미 지급된 쿠폰입니다.');
                    } else {
                      handleDownloadCoupon(coupon); // 쿠폰 다운로드 API 호출
                    }
                  }}
                >
                <span
                  className={
                    issued
                      ? 'text-[14px] font-bold tracking-[-0.56px]'
                      : "pr-[20px] text-[14px] font-bold text-[#292929] tracking-[-0.56px] bg-no-repeat bg-[position:100%_50%]"
                  }
                  style={
                    !issued
                      ? { backgroundImage: `url('${imageUrl}/coupon/icon_dw.png')` }
                      : undefined
                  }
                >
                  {issued ? '쿠폰 발급완료' : '쿠폰 다운로드'}
                </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
