'use client';

import React, { useState } from 'react';
import axios from '@/api/axiosInstance'; // 커스텀 인스턴스 사용 시

export default function PasswordChangeSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [serverMessage, setServerMessage] = useState('');

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setPassword('');
    setConfirmPassword('');
    setServerMessage('');
  };

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      alert('비밀번호를 모두 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const token = localStorage.getItem('accessToken');
    try {
      const res = await axios.patch(
        'http://localhost:8080/api/mypage/modifyinfo',
        { password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          validateStatus: () => true,
        },
      );

      if (res.status === 200) {
        alert('비밀번호가 성공적으로 변경되었습니다.');
        setIsOpen(false);
      } else if (res.status === 401) {
        alert('인증이 만료되었거나 비밀번호가 옳지 않습니다.');
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    } catch (err) {
      alert('서버 요청 중 오류가 발생했습니다.');
      console.error(err);
    }
  };

  return (
    <div>
      {/* 비밀번호 변경 버튼 */}
      <button
        type="button"
        onClick={handleToggle}
        className="inline-flex items-center px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
      >
        변경하기 &gt;
      </button>

      {/* 펼쳐지는 영역 */}
      {isOpen && (
        <div className="mt-4 border border-gray-200 rounded p-4 bg-gray-50">
          {/* 새 비밀번호 입력 */}
          <div className="mb-4">
            <label className="font-semibold block mb-1">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력해주세요."
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {/* 안내 문구 */}
            <ul className="text-xs text-gray-600 mt-2 space-y-1 leading-5">
              <li>영문자, 숫자, 특수문자를 모두 조합하여 8~12자를 입력해주세요.</li>
              <li>{`사용 가능 특수문자: !#%$&()*+,-./:;<=>?@[\\]^_\`{|}~`}</li>
              <li>아이디와 4자 이상 동일한 비밀번호는 사용 불가합니다.</li>
              <li>동일문자를 4번 이상 연속 사용 불가합니다.</li>
              <li>4자리 이상 연속되는 숫자/문자 불가합니다.</li>
            </ul>
          </div>

          {/* 비밀번호 확인 */}
          <div className="mb-4">
            <label className="font-semibold block mb-1">비밀번호 확인</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 재입력해주세요."
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-sm text-red-600 mt-1">새 비밀번호가 서로 일치하지 않습니다.</p>
            )}
          </div>

          {/* 전송 버튼 */}
          <button
            type="button"
            onClick={handleSubmit}
            className="mt-2 px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800"
          >
            비밀번호 변경하기
          </button>
        </div>
      )}
    </div>
  );
}
