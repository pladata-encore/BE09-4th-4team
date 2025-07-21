'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { useEffect } from 'react';
import HelpSection from '../components/HelpSection';

const LoginPage = () => {
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
    <div className="max-w-md mx-auto mt-12 p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">로그인</h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          placeholder="CJ ONE 통합회원 아이디"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
        />

        <input
          type="password"
          placeholder="비밀번호 (8~12자, 영문+숫자+특수문자)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
        />

        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="mr-2"
          />
          <label className="text-sm">아이디 저장</label>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition duration-200"
        >
          로그인
        </button>
      </form>
      <button
        onClick={() => router.push('/user/login/kakaotalklogin')}
        className="mt-2 w-full bg-[#ffe812] text-[#131518] py-2 rounded transition duration-200 flex items-center justify-center gap-2"
      >
        <img
          src="https://static.oliveyoung.co.kr/pc-static-root/image/login/icon-kakao.svg"
          alt="카카오 아이콘"
          className="w-5 h-5"
        />
        카카오로 로그인
      </button>

      <div className="mt-4 flex justify-center space-x-4 text-sm text-gray-600">
        <a href="#" className="hover:underline">
          아이디 찾기
        </a>
        <span>|</span>
        <a href="#" className="hover:underline">
          비밀번호 찾기
        </a>
      </div>

      <div className="flex justify-between items-center mt-8 p-4">
        {/* 왼쪽: 로고 + 설명 */}
        <div>
          <img
            src="https://static.oliveyoung.co.kr/pc-static-root/image/login/ico_cjone_230828.png"
            alt="CJ ONE 로고 이미지"
            className="mr-4 w-40 "
          />
          <p className="text-sm text-gray-600 leading-relaxed ">
            CJ ONE 통합회원으로 가입하고
            <br />
            올리브영에서 편안한 쇼핑하세요
          </p>
        </div>

        {/* 오른쪽: 회원가입 버튼 */}
        <button
          type="button"
          className="border border-gray-300 text-sm px-4 py-2 rounded hover:bg-gray-100 min-w-[116px] text-center mt-16"
          onClick={() => router.push('/user/signup')}
        >
          회원가입
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
