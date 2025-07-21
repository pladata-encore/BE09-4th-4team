'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PasswordChangeSection from '../../components/PasswordChangeSection';
import { useAuth } from '@/contexts/AuthContext';
import axios from '@/api/axiosInstance';

export default function UserModificationPage() {
  const { accessToken } = useAuth();

  const router = useRouter();

  const [userInfo, setUserInfo] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/mypage/info', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const { userId, userName, email, phone } = res.data.data;
        setUserInfo({
          id: userId,
          name: userName,
          email,
          phone,
        });
      } catch (error) {
        console.error('회원 정보 조회 실패:', error);
        alert('회원 정보를 불러오지 못했습니다.');
      }
    };

    fetchUserInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.patch(
        'http://localhost:8080/api/mypage/modifyinfo',
        {
          userName: userInfo.name,
          email: userInfo.email,
          phone: userInfo.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.status === 200) {
        alert('회원정보가 성공적으로 수정되었습니다.');
        router.push('/');
      } else {
        alert(res.data.message || '회원정보 수정에 실패했습니다.');
      }
    } catch (err) {
      console.error(err);
      alert('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div className="max-w-[700px] mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-2">회원정보 수정</h1>
      <p className="text-center text-gray-500 mb-6">회원님의 소중한 정보를 안전하게 관리하세요.</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section>
          <h2 className="text-xl font-bold border-b pb-2 mb-4">기본 정보</h2>

          <table className="w-full border border-gray-300">
            <tbody>
              {/* 아이디 */}
              <tr className="border-b">
                <th className="text-left px-4 py-2 bg-gray-50 w-32">아이디</th>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={userInfo.id}
                    readOnly
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                  />
                </td>
              </tr>

              {/* 이름 */}
              <tr className="border-b">
                <th className="text-left px-4 py-2 bg-gray-50">이름</th>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                  />
                </td>
              </tr>

              {/* 이메일 */}
              <tr className="border-b">
                <th className="text-left px-4 py-2 bg-gray-50">이메일</th>
                <td className="px-4 py-2">
                  <input
                    type="email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                  />
                </td>
              </tr>

              {/* 휴대전화 */}
              <tr className="border-b">
                <th className="text-left px-4 py-2 bg-gray-50">휴대전화</th>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={userInfo.phone}
                    onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                  />
                </td>
              </tr>

              {/* 비밀번호 변경 */}
              <tr>
                <th className="text-left px-4 py-2 bg-gray-50">비밀번호</th>
                <td className="px-4 py-2">
                  <PasswordChangeSection />
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 버튼 */}
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-2 border border-gray-400 rounded text-gray-700"
          >
            취소
          </button>
          <button type="submit" className="px-6 py-2 bg-black text-white rounded font-bold">
            저장
          </button>
        </div>
      </form>
    </div>
  );
}
