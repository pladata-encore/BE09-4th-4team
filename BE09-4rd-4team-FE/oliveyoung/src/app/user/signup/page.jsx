// signup/page.jsx
'use client';

import axios from '@/api/axiosInstance';
import { useState } from 'react';
import RegistrationForm from '../components/Register';
import AlreadySignedUp from '../components/AlreadySignedUp';
import WelcomeMessage from '../components/WelComeMessage';
import HelpSection from '../components/HelpSection';

// SignUpHeader와 SignUpFooter도 필요하다면 임포트하여 사용하세요.
// import SignUpHeader from '../components/SignUpHeader';
// import SignUpFooter from '../components/SignUpFooter';

export default function SignUpPage() {
  const [userName, setUserName] = useState('');
  // const [birth, setBirth] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: 가입 여부 확인, 2: 회원정보 입력
  const [duplicateUserId, setDuplicateUserId] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(null);

  const maskUserName = (name) => {
    if (!name) return '';
    if (name.length === 2) {
      return name[0] + '*';
    }
    if (name.length >= 3) {
      return name[0] + '*' + name[name.length - 1];
    }
    return name;
  };

  const maskUserId = (userId) => {
    if (!userId) return '';
    const visible = userId.slice(0, 5); // 앞 5글자
    const masked = '*'.repeat(Math.max(userId.length - 5, 0));
    return visible + masked;
  };

  const formatPhoneNumber = (number) => {
    if (number.length < 4) return number;
    if (number.length < 8) return `${number.slice(0, 3)}-${number.slice(3)}`;
    return `${number.slice(0, 3)}-${number.slice(3, 7)}-${number.slice(7)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // form submit 기본 동작 방지
    setLoading(true); // 로딩 시작
    setError(''); // 에러 초기화
    setDuplicateUserId(''); // 이전 userId 초기화
    setDuplicateUserId('');
    setMessage('');
    await handleCheckDuplicate(userName, phone); // 중복 확인 요청
    setLoading(false); // 로딩 종료
  };

  const [message, setMessage] = useState('');

  const handleCheckDuplicate = async (userName, phone) => {
    try {
      const response = await axios.post('http://localhost:8080/api/user/checkduplicate', {
        userName,
        phone,
      });

      const result = response.data.data;
      const isDuplicate = result.duplicate;
      const duplicateUserId = result.userId;

      if (isDuplicate) {
        setIsDuplicate(true);
        setDuplicateUserId(duplicateUserId);
        setMessage(`이미 가입된 사용자입니다.`);
      } else {
        setIsDuplicate(false);
        setDuplicateUserId('');
        setMessage('사용 가능한 전화번호입니다.');
        setStep(2);
      }
      return { isDuplicate: isDuplicate, userId: duplicateUserId };
    } catch (error) {
      console.error('중복 확인 실패:', error);
      const backendMessage = error.response?.data?.message;
      if (backendMessage) {
        alert(backendMessage); // 백엔드에서 보낸 에러 메시지를 alert로 띄우기
      } else {
        alert('서버 오류가 발생했습니다.');
      }
      throw error; // 필요 시 다시 throw
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white">
      {/* <SignUpHeader /> // 헤더 컴포넌트가 있다면 여기에 배치 */}

      <div className="max-w-4xl w-full justify-center py-10 px-4 md:px-8">
        <h1 className="text-center text-4xl md:text-5xl font-cj mb-6 mt-8">회원가입</h1>{' '}
        {/* 폰트 크기 조정 */}
        {/* 1단계 진행 바 (이미지 참고하여 스텝 표시) */}
        <div className="flex justify-center items-center my-10 mr-5">
          <div className="flex flex-col items-center mx-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step === 1 ? 'bg-orange-400 text-white' : 'border-2 border-gray-300 text-gray-500'
              }`}
            >
              1
            </div>
            <p
              className={`mt-2 text-sm ${
                step === 1 ? 'text-orange-400 font-semibold' : 'text-gray-500'
              }`}
            >
              회원가입 여부
            </p>
          </div>
          <div className="flex-1 border-t-2 border-gray-300 mx-2"></div>
          <div className="flex flex-col items-center mx-4 text-gray-500">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step === 2 ? 'bg-orange-400 text-white' : 'border-2 border-gray-300 text-gray-500'
              }`}
            >
              2
            </div>
            <p
              className={`mt-2 text-sm ${
                step === 2 ? 'text-orange-400 font-semibold' : 'text-gray-500'
              }`}
            >
              회원정보 입력
            </p>
          </div>
          <div className="flex-1 border-t-2 border-gray-300 mx-2"></div>
          <div className="flex flex-col items-center mx-4 text-gray-500">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step === 3 ? 'bg-orange-500 text-white' : 'border-2 border-gray-300 text-gray-500'
              }`}
            >
              3
            </div>
            <p
              className={`mt-2 text-sm ${
                step === 3 ? 'text-orange-500 font-semibold' : 'text-gray-500'
              }`}
            >
              가입완료
            </p>
          </div>
        </div>
        {/* 회원 여부 확인 결과에 따른 조건부 렌더링 */}
        {step === 3 ? (
          <WelcomeMessage userName={maskUserName(userName)} />
        ) : isDuplicate === true ? (
          <AlreadySignedUp userName={maskUserName(userName)} userId={maskUserId(duplicateUserId)} />
        ) : isDuplicate === false ? (
          <RegistrationForm setStep={setStep} setUserName={setUserName} />
        ) : (
          <>
            <p className="text-center mb-11 text-gray-600">
              통합 아이디로 CJ ONE 브랜드 혜택도 받고! 포인트도 쌓고!
            </p>

            <section className="mb-8 border p-4 rounded bg-gray-50">
              {' '}
              {/* 배경색 추가 */}
              <h2 className="text-xl font-semibold mb-2">회원가입 여부 안내</h2>
              <ul className="text-sm text-gray-700 space-y-2 list-disc pl-5">
                {' '}
                {/* 리스트 스타일 추가 */}
                <li>
                  기존 회원가입 정보와 일치하는 정보를 입력해야 회원가입 여부를 정확하게 확인할 수
                  있습니다.
                </li>
                <li>
                  올리브영, CJ더마켓, CJ온스타일, CJ문화재단 등에서는 전자상거래에 의거하여 만 14세
                  미만의 어린이/학생의 회원가입을 제한합니다.
                </li>
                <li>
                  외국인 회원가입 시에는 국내에서 발급된 외국인 등록증/신분증 정보를 입력해주세요.
                </li>
              </ul>
            </section>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="이름을 입력해주세요"
                className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9bce26]"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required // 필수 입력 필드
              />

              {/* <input
                type="text"
                placeholder="법정생년월일 6자리를 입력해주세요. (예: 900101)"
                className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                value={birth}
                onChange={(e) =>
                  setBirth(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))
                } // 숫자만, 6자리 제한
                required
              />*/}
              <input
                type="text"
                placeholder="휴대전화번호를 입력해주세요"
                className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9bce26]"
                value={phone}
                onChange={(e) => {
                  const onlyNumbers = e.target.value.replace(/[^0-9]/g, '').slice(0, 11); // 숫자만
                  const formatted = formatPhoneNumber(onlyNumbers); // 하이픈 붙이기
                  setPhone(formatted); // 하이픈 포함된 값 저장
                }}
                required
              />

              <button
                type="submit"
                disabled={loading || !userName || !phone} // 모든 필드가 채워져야 버튼 활성화
                className="w-full bg-orange-500 text-white p-3 rounded-md font-semibold hover:bg-orange-600 disabled:opacity-50 transition-colors duration-200"
              >
                {loading ? '확인 중...' : '가입여부 확인'}
              </button>
            </form>
            {message === '이미 사용 중인 전화번호입니다.' ? (
              <p className="mt-4 text-red-600 text-sm text-center font-medium">{message}</p>
            ) : message === '사용 가능한 전화번호입니다.' ? (
              <p className="mt-4 text-green-600 text-sm text-center font-medium">{message}</p>
            ) : null}
          </>
        )}
        {/* 자주 묻는 질문, 1:1 상담, 마이페이지 정보 (이미지에 맞춰 하단에 배치) */}
        <HelpSection />
      </div>

      {/* <SignUpFooter /> // 푸터 컴포넌트가 있다면 여기에 배치 */}
    </div>
  );
}
