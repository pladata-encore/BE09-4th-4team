// components/AlreadySignedUp.jsx
'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { getImageUrl } from '@/utils/image';

export default function AlreadySignedUp({ userName, userId }) {
  // userName을 props로 받아 사용

  const router = useRouter();

  return (
    <>
      <div className="flex flex-col items-center justify-center p-8 border border-gray-200 rounded-lg shadow-sm bg-white mb-10">
        {/* 둥근 이미지 (웃는 얼굴) */}
        <div className="relative w-24 h-24 mb-4">
          {/* 실제 이미지 경로로 변경해주세요. 임시로 플레이스홀더 사용 */}{' '}
          <div
            style={{
              width: 88,
              height: 88,
              backgroundImage: `url(${getImageUrl('user/signup/bg_member.png')})`,
              backgroundSize: 'auto',
              backgroundPosition: '0px -350px',
              backgroundRepeat: 'no-repeat',
              borderRadius: '50%',
            }}
          />
        </div>

        <p className="text-xl font-bold text-gray-800 text-center mb-3">
          <span className="text-orange-500">{userName}님!</span> 이미 CJ ONE 회원으로 등록되어
          있습니다
        </p>
        <p className="text-sm text-gray-600 text-center mb-6">
          회원 아이디(
          <span className="font-semibold text-gray-700">{userId}</span>
          )로 로그인 하시거나, 아이디 찾기를 진행해주세요.
        </p>

        <div className="flex space-x-3">
          <button
            type="button"
            className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-opacity-50"
          >
            아이디 찾기
          </button>
          <button
            type="button"
            className="px-6 py-3 bg-black text-white rounded-md font-semibold hover:bg-gray-800 focus:outl ine-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50"
            onClick={() => router.push('/user/login')}
          >
            로그인
          </button>
        </div>
      </div>
    </>
  );
}
