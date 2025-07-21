import React, { useState } from 'react';
import axios from '@/api/axiosInstance';
import { useEffect } from 'react';
import * as axiosRaw from 'axios';

const RegistrationForm = ({ setStep, setUserName }) => {
  // 폼 데이터를 담을 상태 (state)
  const [formData, setFormData] = useState({
    userName: '', // 이름
    userId: '', // 아이디
    password: '', // 비밀번호
    passwordCheck: '', // 비밀번호 확인
    // birthYear: '', // 생년 (연도)
    // birthMonth: '', // 생월 (월)
    // birthDay: '', // 생일 (일)
    phonePart1: '010', // 휴대폰 번호 앞자리 (기본값 010)
    phonePart2: '', // 휴대폰 번호 중간자리
    phonePart3: '', // 휴대폰 번호 뒷자리
    emailLocal: '', // 이메일 로컬 부분 (예: user)
    emailDomain: '', // 이메일 도메인 부분 (예: example.com)
    // receiveMarketingEmail: false, // 마케팅 이메일 수신 동의 여부
    // receiveMarketingSMS: false, // 마케팅 SMS 수신 동의 여부
  });

  // 유효성 검사 오류를 담을 상태 (state)
  const [errors, setErrors] = useState({});
  const [idCheckMessage, setIdCheckMessage] = useState('');
  const [isIdAvailable, setIsIdAvailable] = useState(null); // true / false / null
  const [isIdValid, setIsIdValid] = useState(false);
  const [idValidationMessage, setIdValidationMessage] = useState('');
  const [passwordValidationMessage, setPasswordValidationMessage] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);

  const handleUserIdChange = (e) => {
    const id = e.target.value;
    setFormData((prev) => ({ ...prev, userId: id }));

    // 1. 영문 소문자 또는 숫자 이외의 문자가 있으면
    if (!/^[a-z0-9]*$/.test(id)) {
      setIdValidationMessage('영문 소문자, 숫자만 입력 가능합니다.');
      setIsIdValid(false);
    }
    // 2. 길이가 6~12 자리가 아니면
    else if (id.length < 6 || id.length > 12) {
      setIdValidationMessage('아이디는 6~12자리여야 합니다.');
      setIsIdValid(false);
    }
    // 3. 숫자만 또는 영문만 있는 경우 → 두 가지 모두 있어야 함
    else if (/^[0-9]+$/.test(id) || /^[a-z]+$/.test(id)) {
      setIdValidationMessage('영문 소문자와 숫자를 조합하여 입력해주세요.');
      setIsIdValid(false);
    }
    // 4. 형식 통과
    else {
      setIdValidationMessage('사용 가능한 형식입니다.');
      setIsIdValid(true);
    }

    // 중복확인 메시지 초기화
    setIdCheckMessage('');
    setIsIdAvailable(null);
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData((prev) => ({ ...prev, password }));

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const repeatedChar = /(.)\1\1\1/.test(password); // 동일문자 4회 이상 반복

    if (password.length < 8 || password.length > 12) {
      setPasswordValidationMessage('비밀번호는 8~12자여야 합니다.');
      setIsPasswordValid(false);
    } else if (!(hasLetter && hasNumber && hasSpecial)) {
      setPasswordValidationMessage('영문자, 숫자, 특수문자를 모두 포함해야 합니다.');
      setIsPasswordValid(false);
    } else if (repeatedChar) {
      setPasswordValidationMessage('동일 문자를 4번 이상 사용할 수 없습니다.');
      setIsPasswordValid(false);
    } else {
      setPasswordValidationMessage('사용 가능한 비밀번호입니다.');
      setIsPasswordValid(true);
    }
  };

  useEffect(() => {
    setIsPasswordMatch(formData.password === formData.passwordCheck);
  }, [formData.password, formData.passwordCheck]);

  const handleCheckUserId = async () => {
    if (!formData.userId.trim()) {
      setIdCheckMessage('아이디를 입력해주세요.');
      setIsIdAvailable(null);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/user/signup/checkid', {
        userId: formData.userId,
      });

      const isDuplicate = response.data.duplicate;

      if (isDuplicate) {
        setIdCheckMessage('이미 사용 중인 아이디입니다.');
        setIsIdAvailable(false);
      } else {
        setIdCheckMessage('사용 가능한 아이디입니다.');
        setIsIdAvailable(true);
      }
    } catch (error) {
      console.error('아이디 중복 확인 실패:', error);
      setIdCheckMessage('서버 오류로 확인할 수 없습니다.');
      setIsIdAvailable(null);
    }
  };

  // 입력 필드 값 변경 핸들러
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value, // 체크박스는 checked 값, 그 외는 value 값 사용
    }));
  };

  // 기본적인 클라이언트 측 유효성 검사
  const validateForm = () => {
    const newErrors = {};
    if (!formData.userName.trim()) newErrors.userName = '이름을 입력해주세요.';
    if (!formData.userId.trim()) newErrors.userId = '아이디를 입력해주세요.';
    if (!formData.password) newErrors.password = '비밀번호를 입력해주세요.';
    if (formData.password !== formData.passwordCheck)
      newErrors.passwordCheck = '비밀번호가 일치하지 않습니다.';
    // if (!formData.birthYear || !formData.birthMonth || !formData.birthDay) newErrors.birthDate = '생년월일을 선택해주세요.';
    if (!formData.phonePart2.trim() || !formData.phonePart3.trim())
      newErrors.phone = '휴대폰 번호를 입력해주세요.';
    if (!formData.emailLocal.trim() || !formData.emailDomain.trim())
      newErrors.email = '이메일을 입력해주세요.';

    setErrors(newErrors); // 새로운 오류 객체로 상태 업데이트
    return Object.keys(newErrors).length === 0; // 오류가 없으면 true 반환
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼의 기본 제출 동작 방지

    if (validateForm()) {
      // 유효성 검사 통과 시
      // 데이터베이스 저장을 위해 휴대폰 번호와 이메일 주소를 합침
      const fullPhoneNumber = `${formData.phonePart1}-${formData.phonePart2}-${formData.phonePart3}`;
      const fullEmail = `${formData.emailLocal}@${formData.emailDomain}`;

      const dataToSend = {
        userName: formData.userName,
        userId: formData.userId,
        password: formData.password, // 비밀번호는 백엔드에서 해싱될 예정
        // birthDate: `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`, // YYYY-MM-DD 형식
        phone: fullPhoneNumber,
        email: fullEmail,
        // receiveMarketingEmail: formData.receiveMarketingEmail,
        // receiveMarketingSMS: formData.receiveMarketingSMS,
      };

      // --- 이 부분에서 백엔드 API ---
      try {
        const response = await axios.post('http://localhost:8080/api/user/signup', dataToSend);

        if (response.status === 201) {
          alert('회원가입이 완료되었습니다!');
          setUserName(formData.userName);
          setStep(3); // 가입 완료 화면으로 전환
        } else {
          alert(`회원가입 실패: ${response.data.message || '알 수 없는 오류'}`);
        }
      } catch (error) {
        // 빨간 콘솔 에러 없애고, 사용자 alert만
        if (axiosRaw.isAxiosError(error)) {
          const message = error.response?.data?.message || '알 수 없는 오류입니다.';
          alert(`회원가입 실패: ${message}`);
        } else {
          alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
        }
      }
    }
  };

  // // 연도 옵션 생성을 위한 헬퍼 함수
  // const getYears = () => {
  //     const currentYear = new Date().getFullYear(); // 현재 연도
  //     const years = [];
  //     for (let i = currentYear; i >= currentYear - 100; i--) { // 지난 100년간의 연도
  //         years.push(i);
  //     }
  //     return years;
  // };

  // // 월/일 옵션 생성을 위한 헬퍼 함수
  // const getNumbers = (start, end) => {
  //     const numbers = [];
  //     for (let i = start; i <= end; i++) {
  //         numbers.push(String(i).padStart(2, '0')); // 한 자리 숫자는 앞에 0을 붙여 두 자리로 만듦 (예: 1 -> 01)
  //     }
  //     return numbers;
  // };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      {/* 메인 콘텐츠 영역 */}
      <div className="bg-white p-3 rounded-lg w-full max-w-4xl my-8 justify-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center justify-center">
          회원가입
        </h1>

        {/* 진행 단계 */}
        <p className="text-sm text-gray-600 mb-6 text-center mx-auto">
          라이프스타일 멤버십 CJ ONE! 영화, 쇼핑, 외식 등 다양한 서비스를 즐겁게 카드로 즐기세요~
        </p>

        <form onSubmit={handleSubmit} className="justify-center mx-auto">
          {/* 기본 정보 섹션 */}
          <div className="mb-8 border-t pt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              기본정보
              <span className="text-red-500 text-xs ml-2">*</span>
              <span className="text-sm text-gray-500 ml-auto">
                <span className="text-red-500 text-xs">*</span>
                표시는 필수 입력 항목입니다.
              </span>
            </h2>

            {/* 이름 입력 필드 */}
            <div className="grid grid-cols-3 gap-4 mb-4 items-center">
              <label htmlFor="userName" className="text-gray-700 font-medium flex items-center">
                <span className="text-red-500 text-xs mr-1">*</span> 이름
              </label>
              <div className="col-span-2">
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-[#ADFF2F]"
                  placeholder="이름을 입력해주세요."
                />
                {errors.userName && <p className="text-red-500 text-xs mt-1">{errors.userName}</p>}
              </div>
            </div>

            {/* 아이디 입력 필드 */}
            <div className="grid grid-cols-3 gap-4 mb-4 items-center">
              <label htmlFor="userId" className="text-gray-700 font-medium flex items-center">
                <span className="text-red-500 text-xs mr-1">*</span> 아이디
              </label>
              <div className="col-span-2 flex space-x-2">
                <input
                  type="text"
                  id="userId"
                  name="userId"
                  value={formData.userId}
                  onChange={handleUserIdChange}
                  className="border border-gray-300 p-2 rounded-md flex-grow focus:outline-none focus:ring-1 focus:ring-[#ADFF2F]"
                  placeholder="아이디를 입력해주세요."
                />
                <p className={`text-xs mt-1 ${isIdValid ? 'text-green-600' : 'text-red-500'}`}>
                  {idValidationMessage}
                </p>
                <button
                  type="button"
                  onClick={handleCheckUserId}
                  disabled={!isIdValid}
                  className={`px-4 py-2 rounded-md text-xs whitespace-nowrap transition-colors
                        ${
                          isIdValid
                            ? 'bg-gray-700 text-white hover:bg-gray-800'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }
                      `}
                >
                  중복확인
                </button>
              </div>
              {errors.userId && (
                <p className="text-red-500 text-xs col-start-2 col-span-2 mt-1">{errors.userId}</p>
              )}
              {idCheckMessage && (
                <p
                  className={`text-xs col-start-2 col-span-2 mt-1 ${
                    isIdAvailable ? 'text-green-600' : 'text-red-500'
                  }`}
                >
                  {idCheckMessage}
                </p>
              )}
              <div className="col-start-2 col-span-2 text-sm text-gray-600 mt-1">
                <p>
                  CJ ONE 아이디는 6~12자 이내 영문 소문자, 숫자 조합으로 입력해주세요. (특수문자 및
                  공백 제외)
                </p>
                <p>
                  CJ ONE 통합 아이디로 가입하시면 CJ ONE 홈페이지, 앱, 제휴 브랜드에서 편리하게
                  이용하실 수 있습니다.
                </p>
              </div>
            </div>

            {/* 비밀번호 입력 필드 */}
            <div className="grid grid-cols-3 gap-4 mb-4 items-center">
              <label htmlFor="password" className="text-gray-700 font-medium flex items-center">
                <span className="text-red-500 text-xs mr-1">*</span> 비밀번호
              </label>
              <div className="col-span-2">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-[#ADFF2F]"
                  placeholder="비밀번호를 입력해주세요."
                />
                {passwordValidationMessage && (
                  <p
                    className={`text-xs mt-1 ${
                      isPasswordValid ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {passwordValidationMessage}
                  </p>
                )}
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                <div className="text-[12px] text-gray-600 mt-1">
                  <ul>
                    <li>영문자, 숫자, 특수문자를 모두 조합하여 8~12자리를 입력해주세요.</li>
                    <li>동일문자를 4번 이상 사용할 수 없습니다.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 비밀번호 확인 입력 필드 */}
            <div className="grid grid-cols-3 gap-4 mb-4 items-center">
              <label
                htmlFor="passwordCheck"
                className="text-gray-700 font-medium flex items-center"
              >
                <span className="text-red-500 text-xs mr-1">*</span> 비밀번호 확인
              </label>
              <div className="col-span-2">
                <input
                  type="password"
                  id="passwordCheck"
                  name="passwordCheck"
                  value={formData.passwordCheck}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-[#ADFF2F]"
                  placeholder="비밀번호를 다시 한번 입력해주세요."
                />
                {formData.password && formData.passwordCheck && (
                  <p
                    className={`text-xs mt-1 ${
                      isPasswordMatch ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {isPasswordMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
                  </p>
                )}
                {errors.passwordCheck && (
                  <p className="text-red-500 text-xs mt-1">{errors.passwordCheck}</p>
                )}
              </div>
            </div>

            {/* 생년월일 선택 필드 
                        <div className="grid grid-cols-3 gap-4 mb-4 items-center">
                            <label className="text-gray-700 font-medium flex items-center">
                                <span className="text-red-500 text-xs mr-1">*</span> 생년월일
                            </label>
                            <div className="col-span-2 flex space-x-2">
                                <select
                                    name="birthYear"
                                    value={formData.birthYear}
                                    onChange={handleChange}
                                    className="border border-gray-300 p-2 rounded-md flex-1 focus:outline-none focus:ring-1 focus:ring-[#ADFF2F]"
                                >
                                    <option value="">년</option>
                                    {getYears().map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                                <select
                                    name="birthMonth"
                                    value={formData.birthMonth}
                                    onChange={handleChange}
                                    className="border border-gray-300 p-2 rounded-md flex-1 focus:outline-none focus:ring-1 focus:ring-[#ADFF2F]"
                                >
                                    <option value="">월</option>
                                    {getNumbers(1, 12).map(month => (
                                        <option key={month} value={month}>{month}</option>
                                    ))}
                                </select>
                                <select
                                    name="birthDay"
                                    value={formData.birthDay}
                                    onChange={handleChange}
                                    className="border border-gray-300 p-2 rounded-md flex-1 focus:outline-none focus:ring-1 focus:ring-[#ADFF2F]"
                                >
                                    <option value="">일</option>
                                    {getNumbers(1, 31).map(day => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                            </div>
                            {errors.birthDate && <p className="text-red-500 text-xs col-start-2 col-span-2 mt-1">{errors.birthDate}</p>}
                            <div className="col-start-2 col-span-2 text-sm text-gray-600 mt-1">
                                <p>만 14세 미만의 어린이는 법정대리인 동의가 필요합니다.</p>
                            </div>
                        </div> */}

            {/* 휴대폰 번호 입력 필드 */}
            <div className="grid grid-cols-3 gap-4 mb-4 items-center">
              <label htmlFor="phone" className="text-gray-700 font-medium flex items-center">
                <span className="text-red-500 text-xs mr-1">*</span> 휴대폰번호
              </label>
              <div className="col-span-2 flex space-x-2">
                <select
                  name="phonePart1"
                  value={formData.phonePart1}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md w-20 focus:outline-none focus:ring-1 focus:ring-[#ADFF2F]"
                >
                  <option value="010">010</option>
                  <option value="011">011</option>
                  <option value="016">016</option>
                  <option value="017">017</option>
                  <option value="018">018</option>
                  <option value="019">019</option>
                  <option value="022">022</option>
                  <option value="031">031</option>
                  <option value="032">032</option>
                  <option value="033">033</option>
                  <option value="041">041</option>
                  <option value="042">042</option>
                  <option value="043">043</option>
                  <option value="044">044</option>
                  <option value="051">051</option>
                  <option value="052">052</option>
                  <option value="053">053</option>
                  <option value="054">054</option>
                  <option value="055">055</option>
                  <option value="061">061</option>
                  <option value="062">062</option>
                  <option value="063">063</option>
                  <option value="064">064</option>
                  <option value="070">070</option>
                  <option value="080">080</option>
                  <option value="0100">0100</option>
                  <option value="0502">0502</option>
                  <option value="0503">0503</option>
                  <option value="0504">0504</option>
                  <option value="0505">0505</option>
                  <option value="0506">0506</option>
                  <option value="0507">0507</option>
                </select>
                <span className="self-center">-</span>
                <input
                  type="text"
                  name="phonePart2"
                  value={formData.phonePart2}
                  onChange={handleChange}
                  maxLength="4"
                  className="border border-gray-300 p-2 w-[35px] rounded-md flex-1 focus:outline-none focus:ring-1 focus:ring-[#ADFF2F]"
                />
                <span className="self-center">-</span>
                <input
                  type="text"
                  name="phonePart3"
                  value={formData.phonePart3}
                  onChange={handleChange}
                  maxLength="4"
                  className="border border-gray-300 p-2 w-[35px] rounded-md flex-1 focus:outline-none focus:ring-1 focus:ring-[#ADFF2F]"
                />
              </div>
              <div className="col-start-2 col-span-2 text-sm text-gray-600 mt-1">
                <p>CJ ONE 포인트 사용, 이벤트 참여 및 경품 배송 등에 활용됩니다.</p>
              </div>
            </div>

            {/* 이메일 입력 필드 */}
            <div className="grid grid-cols-3 gap-4 mb-4 items-center">
              <label className="text-gray-700 font-medium flex items-center">
                <span className="text-red-500 text-xs mr-1">*</span> 이메일
              </label>
              <div className="col-span-2 flex space-x-2 items-center">
                <input
                  type="text"
                  name="emailLocal"
                  value={formData.emailLocal}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-[35px] rounded-md flex-1 focus:outline-none focus:ring-1 focus:ring-[#ADFF2F]"
                />
                <span className="self-center">@</span>
                <input
                  type="text"
                  name="emailDomain"
                  value={formData.emailDomain}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-[35px] rounded-md flex-1 focus:outline-none focus:ring-1 focus:ring-[#ADFF2F]"
                />
                <select
                  name="emailDomainSelect"
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, emailDomain: e.target.value }))
                  }
                  className="border border-gray-300 p-2 rounded-md w-32 focus:outline-none focus:ring-1 focus:ring-[#ADFF2F]"
                >
                  <option value="">직접입력</option>
                  <option value="naver.com">naver.com</option>
                  <option value="daum.net">daum.net</option>
                  <option value="gmail.com">gmail.com</option>
                  <option value="nate.com">nate.com</option>
                </select>
              </div>
            </div>
          </div>
          {/* 선택 정보 섹션 */}
          <div className="mb-8  pt-6"></div> {/* border-t */}
          {/* 제출 버튼 */}
          <div className="flex justify-center space-x-4 mt-8">
            <button
              type="button"
              onClick={() => window.history.back()} // 기본적인 뒤로가기 기능
              className="bg-gray-300 text-gray-800 px-8 py-3 rounded-md font-semibold hover:bg-gray-400 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={
                !isIdValid || // 아이디 형식이 유효해야 함
                isIdAvailable !== true || // 중복확인 결과가 true여야 함
                !formData.userName ||
                !formData.password ||
                !formData.passwordCheck ||
                formData.password !== formData.passwordCheck
              }
              className={`px-8 py-3 rounded-md font-semibold transition-colors
                   ${
                     !isIdValid ||
                     isIdAvailable !== true ||
                     !formData.userName ||
                     !formData.password ||
                     !formData.passwordCheck ||
                     formData.password !== formData.passwordCheck
                       ? 'bg-[#8ec324] text-white opacity-50 cursor-not-allowed'
                       : 'bg-[#8ec324] text-white hover:bg-[#899A00]'
                   }`}
            >
              가입
            </button>
          </div>
        </form>

        {/* 이용 안내 / 푸터 링크 */}
        <div className="mt-12 text-gray-600 text-sm border-t pt-6">
          <h3 className="font-bold mb-2">이용안내</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>
              CJ ONE 회원이 되시면 CJ ONE 웹사이트에서 풍부한 정보와 서비스를 이용하실 수 있습니다.
            </li>
            <li>
              개인정보 수집 및 활용 동의에 자세한 내용은{' '}
              <a href="#" className="text-blue-600 hover:underline">
                개인정보처리방침
              </a>
              을 확인하실 수 있습니다.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
