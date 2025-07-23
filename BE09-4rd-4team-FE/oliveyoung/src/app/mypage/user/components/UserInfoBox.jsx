'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import axios from '@/api/axiosInstance';
import { getImageUrl } from "@/utils/image";

export default function UserInfoBox() {

  const imageUrl = getImageUrl("/mypage/order");

  const [userInfo, setUserInfo] = useState({
    userName: '',
  });

  const [userCouponList, setUserCouponList] = useState([]);

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
      } catch (e) {
        console.error('유저 정보 가져오기 실패:', e);
      }
    };

    // 사용자가 보유한 쿠폰 조회
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

    fetchUserCouponInfo();
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

  return (
    <>
      {/* 유저 info 박스 */}
      <div className="relative h-[51px] pt-2 pl-[30px] bg-[#eb6d9a]">
        <div className="relative float-left w-[34px] h-[34px] rounded-full overflow-hidden">
          <span className="absolute top-0 left-0 block overflow-hidden w-[34px] h-[34px] bg-no-repeat"
          style={{ backgroundImage: `url('${imageUrl}/bg_grd_01.png')` }}></span>
          <Image
            width={34}
            height={34}
            src={`${imageUrl}/my_picture_base.jpg`}
            alt="my_picture_base.jpg"
          />
        </div>
        <p className="float-left ml-[10px] text-[18px] leading-[34px] font-bold text-white tracking-[-1px]">
          PINK OLIVE
          <strong className="inline-block ml-[3px]">{maskUserName(userInfo.userName)}</strong>님
          반갑습니다.
        </p>
        <ul className="absolute top-1/2 right-[30px] -mt-[10px]">
          <li className="inline-block pr-[15px] text-[13px] text-white font-bold bg-no-repeat bg-[length:5px_10px] bg-[position:100%_50%] cursor-pointer"
            style={{ backgroundImage: `url('${imageUrl}/ico_arrow7x10_2.png')` }}>
            올리브 멤버스 라운지
          </li>
          <li className="inline-block pr-[15px] ml-[30px] text-[13px] text-white font-bold bg-no-repeat bg-[length:5px_10px] bg-[position:100%_50%] cursor-pointer"
            style={{ backgroundImage: `url('${imageUrl}/ico_arrow7x10_2.png')` }}>
            나의 프로필
          </li>
        </ul>
      </div>

      <div className="py-[19px] border border-t-0 border-[#cccccc]">
        <ul className="flex">
          <li className="float-left w-1/3 text-center">
            <span className="text-[13px] font-bold text-[#555]">CJ ONE 포인트</span>
            <p className="inline-block pl-[15px] text-[18px] text-[#f27370] tracking-[-1.16px] font-medium cursor-pointer">
              0
              <em className="inline-block pl-[5px] text-[13px] font-bold text-[#555555] not-italic">
                P
              </em>
            </p>
          </li>
          <li className="float-left w-1/3 text-center">
            <span className="text-[13px] font-bold text-[#555]">쿠폰</span>
            <p className="inline-block pl-[15px] text-[18px] text-[#f27370] tracking-[-1.16px] font-medium cursor-pointer">
              {userCouponList.filter((coupon) => coupon.used === false).length}
              <em className="inline-block pl-[5px] text-[13px] font-bold text-[#555555] not-italic">
                개
              </em>
            </p>
          </li>
          <li className="float-left w-1/3 text-center">
            <span className="text-[13px] font-bold text-[#555]">예치금</span>
            <p className="inline-block pl-[15px] text-[18px] text-[#f27370] tracking-[-1.16px] font-medium cursor-pointer">
              0
              <em className="inline-block pl-[5px] text-[13px] font-bold text-[#555555] not-italic">
                원
              </em>
            </p>
          </li>
        </ul>
      </div>
    </>
  );
}
