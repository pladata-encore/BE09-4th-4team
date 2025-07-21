'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { useEffect } from 'react';
const KaKaoTalkLoginForm = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // 첫 마운트 시 저장된 아이디 불러오기
  useEffect(() => {
    const savedId = localStorage.getItem('savedUserId');
    if (savedId) {
      setUserId(savedId);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (rememberMe) {
      localStorage.setItem('savedUserId', userId);
    } else {
      localStorage.removeItem('savedUserId');
    }

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        userId,
        password,
      });

      const { accessToken, refreshToken, userName, userNo } = response.data.data;

      // AuthContext의 login() 사용
      login(accessToken, refreshToken, userName, userNo);

      // 이제 상태가 바뀌므로 Header도 자동 반영됨
      router.push('/');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg =
          err.response?.status === 401
            ? '아이디 또는 비밀번호가 잘못되었습니다.'
            : err.response?.data?.message || '로그인 중 오류가 발생했습니다.';
        alert(msg);
      } else {
        alert('예기치 못한 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>
        <h1>
          <img
            src="https://accounts.kakaocdn.net/images/rebuilding/pc/logo_kakao.png"
            alt="kakao logo"
            className="mx-auto w-[88px] h-auto select-none pointer-events-none"
          />
        </h1>
        <div className="w-[500px] bg-white border rounded-md p-8">
          {/* 로그인 입력 */}
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="카카오메일 아이디, 이메일, 전화번호"
              className="w-full border-b border-gray-300 py-2 outline-none focus:border-black"
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-gray-300 py-2 outline-none focus:border-black"
            />

            {/* 로그인 상태 유지 */}
            <label className="flex items-center text-sm mt-2 cursor-pointer">
              <input type="checkbox" id="remember" className="peer hidden" />
              <span
                className="w-5 h-5 bg-no-repeat bg-[length:100px_100px] rounded-full border border-gray-400
               peer-checked:bg-[url('https://accounts.kakaocdn.net/images/rebuilding/pc/ico_comm.png')]
               peer-checked:bg-[length:300px_300px]
               peer-checked:bg-[left_-25px_top_0px] 
               peer-checked:border-none"
              ></span>
              <span className="ml-2">로그인 상태 유지</span>
              <span className="ml-1 text-gray-400 text-xs">ⓘ</span>
            </label>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              className="w-full bg-[#FEE500] text-black font-semibold py-2 rounded mt-4 hover:bg-yellow-300 transition"
            >
              로그인
            </button>
          </form>

          {/* 또는 */}
          <div className="my-4 text-center text-sm text-gray-400 relative">
            <span className="bg-white px-2 z-10 relative">또는</span>
            <div className="absolute left-0 top-1/2 w-full border-t border-gray-200 transform -translate-y-1/2 z-0"></div>
          </div>

          {/* QR코드 로그인 */}
          <button className="w-full bg-gray-100 text-gray-800 py-2 rounded hover:bg-gray-200">
            QR코드 로그인
          </button>

          {/* 링크 */}
          <div className="flex justify-between text-xs text-gray-600 mt-6">
            <a href="#">회원가입</a>
            <div className="flex space-x-2">
              <a href="#">계정 찾기</a>
              <span>|</span>
              <a href="#">비밀번호 찾기</a>
            </div>
          </div>

          {/* 푸터 */}
          <div className="text-xs text-gray-400 mt-6 text-center space-x-2">
            <span>한국어</span>
            <span>|</span>
            <a href="#" className="hover:underline">
              이용약관
            </a>
            <span>|</span>
            <a href="#" className="font-bold hover:underline">
              개인정보 처리방침
            </a>
            <span>|</span>
            <a href="#" className="hover:underline">
              고객센터
            </a>
            <div className="mt-2">© Kakao Corp.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KaKaoTalkLoginForm;
