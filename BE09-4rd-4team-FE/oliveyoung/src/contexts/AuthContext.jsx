'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/api/axiosInstance';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userNo, setUserNo] = useState('');
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [accessToken, setAccessToken] = useState('');

  const instance = axios.create({
    baseURL: 'http://localhost:8080/api/auth/refresh',
  });

  // 앱 시작 시 localStorage 값으로 초기화
  const [hydrated, setHydrated] = useState(false);

  // CSR 환경 여부 플래그
  useEffect(() => {
    setHydrated(true);
  }, []);

  // localStorage는 CSR 이후에 접근
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      const name = localStorage.getItem('userName');
      const number = localStorage.getItem('userNo');
      setIsLoggedIn(!!token);
      setAccessToken(token || '');
      setUserName(name || '');
      setUserNo(number || '');
    }
  }, []);

  const login = (accessToken, refreshToken, userName, userNo) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userName', userName);
    localStorage.setItem('userNo', userNo);
    setAccessToken(accessToken);
    setIsLoggedIn(true);
    setUserName(userName);
    setUserNo(userNo);
  };

  const logout = () => {
    setIsLoggingOut(true); // 로딩 시작

    setTimeout(() => {
      // 토큰 제거
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userName');
      localStorage.removeItem('userNo');

      // 상태 업데이트
      setIsLoggedIn(false);
      setUserName('');
      setAccessToken('');
      setUserNo('');

      setIsLoggingOut(false); // 로딩 끝

      router.push('/');
    }, 500);
  };

  const logoutSilently = () => {
    setIsLoggingOut(true); // 로딩 시작

    setTimeout(() => {
      // 토큰 제거
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userName');
      localStorage.removeItem('userNo');

      // 상태 업데이트
      setIsLoggedIn(false);
      setUserName('');
      setAccessToken('');
      setUserNo('');

      setIsLoggingOut(false); // 로딩 끝
    }, 500);
  };

  if (!hydrated) return null; // SSR에서는 아무 것도 렌더링하지 않음

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userName,
        accessToken,
        userNo,
        setIsLoggedIn,
        setUserName,
        setUserNo,
        login,
        logout,
        logoutSilently,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
