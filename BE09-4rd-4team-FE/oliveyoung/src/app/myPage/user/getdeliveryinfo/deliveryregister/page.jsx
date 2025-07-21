'use client';

import axios from '@/api/axiosInstance';
import React from 'react';
import TabNav from '../../components/TabNav';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import UserInfoBox from '../../components/UserInfoBox';

export default function DeliveryRegisterForm() {
  const [isDefault, setIsDefault] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [addressName, setAddressName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [phonePart1, setPhonePart1] = useState('');
  const [phonePart2, setPhonePart2] = useState('');
  const [phonePart3, setPhonePart3] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [hasAnyAddress, setHasAnyAddress] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/mypage/address');
        const addresses = res.data.data;
        if (addresses.length === 0) {
          setIsDefault(true); // 첫 배송지는 기본 배송지로 자동 설정
          setHasAnyAddress(false); // 0개임
        } else {
          setIsDefault(false);
          setHasAnyAddress(true); // 하나 이상 있음
        }
      } catch (err) {
        console.error('배송지 목록 조회 실패:', err);
      }
    };

    fetchAddresses();
  }, []);

  const handleSubmit = async () => {
    if (!agreed) {
      alert('개인정보 수집·이용에 동의해 주세요.');
      return;
    }

    const phone = `${phonePart1}-${phonePart2}-${phonePart3}`;
    const payload = {
      addressName,
      recipientName,
      phone,
      streetAddress,
      detailAddress,
      isDefault: hasAnyAddress ? isDefault : true, // 여기 주목!!
    };
    try {
      await axios.post('http://localhost:8080/api/mypage/address/register', payload);
      alert('배송지가 등록되었습니다.');
      router.push('/mypage/user/getdeliveryinfo');
    } catch (error) {
      console.error(error);
      alert('등록에 실패했습니다.');
    }
  };

  return (
    <div className="float-left w-[850px] px-[29px]">
      <UserInfoBox />
      <div>
        <h2 className="text-xl h-[30px] font-bold mt-[30px] mb-[7px]">배송지/환불계좌</h2>
      </div>
      <TabNav />
      <h2 className="text-lg font-bold pt-5 mb-4">배송지 등록</h2>
      <table className="w-full table-fixed border-collapse border-t-2 border-gray-300">
        <colgroup>
          <col style={{ width: '25%' }} />
          <col style={{ width: '75%' }} />
        </colgroup>
        <tbody>
          <tr className="border-b">
            <th className="text-[14px] text-left pl-[20px] py-[16px] font-medium bg-[#f6f6f6]">
              <label htmlFor="dlvp-nm">배송지명</label>
            </th>
            <td className="py-2 pl-[36px]">
              <input
                type="text"
                id="dlvp-nm"
                maxLength={10}
                value={addressName}
                onChange={(e) => setAddressName(e.target.value)}
                className="w-[178.4px] h-[26.4px] px-[10px] border-[0.8px] border-gray-300 rounded text-sm"
              />
              <input
                type="checkbox"
                checked={hasAnyAddress ? isDefault : true}
                disabled={!hasAnyAddress} // 배송지가 없으면 비활성화
                onChange={(e) => setIsDefault(e.target.checked)}
                className="ml-[17px] mr-[6px] w-[13px] h-[13px] align-middle"
              />
              <label className="text-[12px] font-normal align-middle text-[#666]">
                기본 배송지 설정
              </label>
            </td>
          </tr>

          <tr className="border-b">
            <th className="text-[14px] text-left pl-[20px] py-[16px] font-medium bg-[#f6f6f6]">
              <label htmlFor="rmit-nm">받는 분</label>
            </th>
            <td className="py-2 pl-[36px]">
              <input
                type="text"
                id="rmit-nm"
                maxLength={10}
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-[178.4px] h-[26.4px] px-[10px] border-[0.8px] border-gray-300 rounded text-sm"
              />
            </td>
          </tr>

          <tr className="border-b">
            <th className="text-[14px] text-left pl-[20px] py-[16px] font-medium bg-[#f6f6f6]">
              <label>연락처</label>
            </th>
            <td className="py-2 pl-[36px]">
              <div className="flex items-center gap-2">
                <select
                  value={phonePart1}
                  onChange={(e) => setPhonePart1(e.target.value)}
                  className="w-[90px] h-[26.4px] px-[10px] border-[0.8px] border-gray-300 rounded text-sm"
                >
                  <option value="">선택</option>
                  {[
                    '010',
                    '011',
                    '016',
                    '017',
                    '018',
                    '019',
                    '022',
                    '031',
                    '032',
                    '033',
                    '041',
                    '042',
                    '043',
                    '044',
                    '051',
                    '052',
                    '053',
                    '054',
                    '055',
                    '061',
                    '062',
                    '063',
                    '064',
                    '070',
                    '080',
                    '0100',
                    '0502',
                    '0503',
                    '0504',
                    '0505',
                    '0506',
                    '0507',
                  ].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
                <span>-</span>
                <input
                  type="text"
                  maxLength={4}
                  value={phonePart2}
                  onChange={(e) => setPhonePart2(e.target.value)}
                  className="w-[90px] h-[26.4px] px-[10px] border border-gray-300 rounded text-sm"
                />
                <span>-</span>
                <input
                  type="text"
                  maxLength={4}
                  value={phonePart3}
                  onChange={(e) => setPhonePart3(e.target.value)}
                  className="w-[90px] h-[26.4px] px-[10px] border border-gray-300 rounded text-sm"
                />
              </div>
            </td>
          </tr>

          <tr className="border-b">
            <th className="text-[14px] text-left pl-[20px] py-[16px] font-medium bg-[#f6f6f6]">
              주소
            </th>
            <td className="py-2 pl-[36px]">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  disabled
                  value={postalCode}
                  className="w-[90px] h-[26.4px] px-[10px] border border-gray-300 rounded text-sm"
                />
                <button
                  type="button"
                  className="border border-[#9bce26] text-[#9bce26] h-[26.4px] px-[10px] rounded text-sm"
                >
                  우편번호
                </button>
              </div>
              <div className="text-gray-700 text-sm mb-2 flex items-center gap-2">
                <span className="whitespace-nowrap leading-normal">도로명 주소 :</span>
                <input
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="leading-normal w-full border border-gray-300 rounded px-2 py-1  h-[26.4px] mt-1 ml-2"
                  placeholder="도로명 주소를 입력하세요."
                  maxLength={50}
                />
              </div>
              <input
                type="text"
                placeholder="상세주소를 입력하세요."
                value={detailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 h-[26.4px] mb-1 text-[14px]"
                maxLength={30}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mt-8 text-xs text-[#888888] leading-[18px] font-normal">
        <p className="mb-2 text-xs font-bold">개인정보수집·이용 안내</p>
        <ul className="list-disc list-inside space-y-1">
          <li>개인정보 수집 목적: 상품 배송을 위한 정보 확인</li>
          <li>수집 항목: 배송지명, 수령인명, 연락처, 주소 등</li>
          <li>보유 및 이용기간: 정보 삭제 또는 회원 탈퇴 시까지</li>
          <li>확인 버튼을 누르지 않을 경우 배송지 정보가 저장되지 않습니다.</li>
        </ul>

        <div className="flex items-center mt-6 justify-center">
          <input
            type="checkbox"
            id="privacy-agree"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-[20px] h-[20px] mr-2"
          />
          <label htmlFor="privacy-agree" className="text-[13px]">
            위 개인정보 수집·이용을 확인하고 배송지를 등록합니다.
          </label>
        </div>

        <div className="flex gap-3 mt-6 justify-center">
          <button
            className={`w-[150px] h-[50px] px-8 py-4 rounded-[5px] text-[18px] font-bold transition-colors
              ${
                agreed
                  ? 'bg-[#9bce26] text-white hover:bg-[#899A00]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            onClick={handleSubmit}
          >
            확인
          </button>
          <button className="bg-[#999] text-white text-base font-semibold w-[150px] h-[50px] rounded hover:bg-[#777] transition-colors">
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
