'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/api/axiosInstance';
import { useAuth } from '@/contexts/AuthContext';

export default function ModifyPasswordPage() {
  const { accessToken } = useAuth();
  const router = useRouter();

  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [newPwdCheck, setNewPwdCheck] = useState('');
  const [passwordValidationMessage, setPasswordValidationMessage] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [serverMessage, setServerMessage] = useState('');

  const PASSWORD_MESSAGES = {
    length: '비밀번호는 8~12자여야 합니다.',
    rule: '영문자, 숫자, 특수문자를 모두 포함해야 합니다.',
    repeat: '동일 문자를 4번 이상 사용할 수 없습니다.',
    valid: '사용 가능한 비밀번호입니다.',
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setNewPwd(password);

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const repeatedChar = /(.)\1\1\1/.test(password);

    if (password.length < 8 || password.length > 12) {
      setPasswordValidationMessage(PASSWORD_MESSAGES.length);
      setIsPasswordValid(false);
    } else if (!(hasLetter && hasNumber && hasSpecial)) {
      setPasswordValidationMessage(PASSWORD_MESSAGES.rule);
      setIsPasswordValid(false);
    } else if (repeatedChar) {
      setPasswordValidationMessage(PASSWORD_MESSAGES.repeat);
      setIsPasswordValid(false);
    } else {
      setPasswordValidationMessage(PASSWORD_MESSAGES.valid);
      setIsPasswordValid(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      setServerMessage('비밀번호 형식이 유효하지 않습니다.');
      return;
    }

    if (newPwd !== newPwdCheck) {
      setServerMessage('새 비밀번호가 서로 일치하지 않습니다.');
      return;
    }

    try {
      const response = await axios.patch(
        'http://localhost:8080/api/mypage/modifypwd',
        {
          password: currentPwd,
          newPassword: newPwd,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.status === 200) {
        alert('비밀번호가 성공적으로 변경되었습니다.');
        router.push('/');
      } else {
        // 서버에서 실패 메시지가 왔을 경우
        setServerMessage(response.data.message || '비밀번호 변경에 실패했습니다.');
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setServerMessage(err.response.data.message);
      } else {
        setServerMessage('비밀번호 변경에 실패했습니다.');
      }
    }
  };

  return (
    <div className="max-w-[600px] mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-2">비밀번호 변경</h1>
      <p className="text-center text-gray-500 mb-6">
        고객님의 소중한 정보를 보호하기 위해 새로운 비밀번호로 변경 후 서비스를 이용해 주세요.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 현재 비밀번호 */}
        <div>
          <label className="block font-semibold mb-1">현재 비밀번호</label>
          <input
            type="password"
            value={currentPwd}
            onChange={(e) => setCurrentPwd(e.target.value)}
            placeholder="비밀번호를 입력해주세요."
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        {/* 새 비밀번호 */}
        <div>
          <label className="block font-semibold mb-1">새 비밀번호</label>
          <input
            type="password"
            value={newPwd}
            onChange={handlePasswordChange}
            placeholder="새 비밀번호를 입력해주세요."
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {newPwd && (
            <p className={`text-sm mt-1 ${isPasswordValid ? 'text-green-600' : 'text-red-600'}`}>
              {passwordValidationMessage}
            </p>
          )}
        </div>
        {/* 새 비밀번호 확인 */}
        <div>
          <label className="block font-semibold mb-1">새 비밀번호 확인</label>
          <input
            type="password"
            value={newPwdCheck}
            onChange={(e) => setNewPwdCheck(e.target.value)}
            placeholder="새 비밀번호를 재입력해주세요."
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {newPwdCheck && newPwd !== newPwdCheck && (
            <p className="text-sm text-red-600 mt-1">새 비밀번호가 서로 일치하지 않습니다.</p>
          )}
        </div>
        {/* 유의사항 */}
        <div className="bg-gray-50 p-4 text-sm text-gray-600 leading-relaxed">
          <p className="font-bold mb-2">비밀번호 변경 시 유의사항</p>
          <ul className="list-disc list-inside space-y-1">
            <li>영문자, 숫자, 특수문자를 모두 조합하여 8~12자리를 입력해주세요.</li>
            <li>동일문자를 4번 이상 사용할 수 없습니다.</li>
          </ul>
        </div>
        {/* 메시지 */}
        {serverMessage && <p className="text-center text-sm text-red-500">{serverMessage}</p>}
        {/* 버튼 */}
        <div className="flex justify-center space-x-4 mt-6">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-2 border border-gray-400 rounded text-gray-700"
          >
            나중에
          </button>
          <button type="submit" className="px-6 py-2 bg-black text-white rounded font-bold">
            비밀번호 변경
          </button>
        </div>
      </form>
    </div>
  );
}
