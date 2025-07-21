'use client';

import { useState } from 'react';
import axios from '@/api/axiosInstance';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ConfirmPasswordForm() {
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { accessToken } = useAuth();
  const { logoutSilently } = useAuth();

  const handleWithdrawal = async (e) => {
    e.preventDefault();

    const confirmed = window.confirm('정말로 회원 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.');

    if (!confirmed) return;

    try {
      const response = await axios.delete('http://localhost:8080/api/mypage/withdrawal', {
        data: { password },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        logoutSilently();
        router.push('/mypage/user/withdrawal/withdrawalsuccess');
      } else {
        alert('탈퇴 실패: ' + (response.data.message || '알 수 없는 오류'));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      if (
        (error.response?.status === 401 || error.response?.status === 400) &&
        errorMessage.includes('비밀번호')
      ) {
        alert('❌ 비밀번호가 올바르지 않습니다.');
      } else {
        alert('서버 오류: ' + errorMessage);
      }
    }
  };

  return (
    <form onSubmit={handleWithdrawal} className="mt-6">
      <label className="block text-sm mb-2 font-medium text-gray-700">비밀번호 확인</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호를 입력하세요"
        className="w-full border border-gray-300 p-2 rounded-md mb-4"
        required
      />
      <div className="text-center pt-[10px] mt-[10px]">
        <button
          type="submit"
          className="w-[150px] h-[50px] px-8 py-4 bg-[#9bce26] text-white rounded-[5px] text-[18px] leading-none font-bold hover:bg-[#899A00] transition-colors"
        >
          회원 탈퇴
        </button>
      </div>
    </form>
  );
}
