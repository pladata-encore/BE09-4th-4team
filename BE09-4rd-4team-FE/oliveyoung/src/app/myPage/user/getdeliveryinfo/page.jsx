'use client';

import React, { useEffect, useState } from 'react';
import TabNav from '@/app/mypage/user/components/TabNav';
import { useRouter } from 'next/navigation';
import UserInfoBox from '@/app/mypage/user/components/UserInfoBox';
import axios from '@/api/axiosInstance';

export default function GetDeliveryInfoPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);

  const maskPhone = (phone) => {
    const parts = phone.split('-');
    return `${parts[0]}-${parts[1]}-****`;
  };

  const fetchAddresses = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/mypage/address');
      const originalList = res.data.data;

      // 기본 배송지를 맨 앞으로 정렬
      const sorted = [...originalList].sort((a, b) => {
        if (a.default === b.default) return 0;
        return a.default ? -1 : 1;
      });

      setAddresses(sorted);
    } catch (error) {
      console.error('배송지 목록 불러오기 실패:', error);
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const res = await axios.patch(
        `http://localhost:8080/api/mypage/address/default/${addressId}`,
      );
      alert('기본 배송지로 설정되었습니다');
      await fetchAddresses();
    } catch (error) {
      console.error('기본 배송지 설정 실패:', error);
    }
  };

  const handleDelete = async (addressId) => {
    const confirmed = window.confirm('선택한 배송지를 삭제하시겠습니까?');
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:8080/api/mypage/address/${addressId}`);
      alert('배송지가 삭제되었습니다.');

      // 삭제 후 목록 다시 불러오기
      const response = await axios.get('http://localhost:8080/api/mypage/address');
      setAddresses(response.data.data);
    } catch (error) {
      console.error('배송지 삭제 실패:', error);
      alert('배송지 삭제에 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <div className="float-left w-[850px] px-[29px]">
      {/* 유저 info 박스 */}
      <UserInfoBox />

      {/* 제목 */}
      <div>
        <h2 className="text-xl h-[30px] font-bold mt-[30px] mb-[7px]">배송지/환불계좌</h2>
      </div>

      <TabNav />

      {/* 안내 문구 */}
      <p
        className="text-sm text-gray-600 mt-[30px] pl-[10px]"
        style={{
          backgroundImage:
            "url('https://static.oliveyoung.co.kr/pc-static-root/image/comm/bar_4x4.gif')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '0 7px',
        }}
      >
        배송지는 최대 <span className="text-[#9bce26] font-bold">20개</span>까지 등록 가능합니다.
      </p>

      {/* 테이블 */}
      <table className="w-full table-fixed mt-[10px]">
        <thead className="h-[39px] text-[13px] font-bold border-b border-b-[rgb(230, 230, 230)] border-t-[2px] border-t-[rgb(214,214,214)] bg-[rgb(250,250,250)] py-2 mt-[10px]">
          <tr className="text-[14px] text-[#666666]">
            <th className="w-[10%]">배송지명</th>
            <th className="w-[10%]">받는사람</th>
            <th className="w-[40%]">주소</th>
            <th className="w-[20%]">연락처</th>
            <th className="w-[20%]">관리</th>
          </tr>
        </thead>
        <tbody>
          {addresses.length === 0 ? (
            <tr>
              <td
                colSpan={5} // 헤더에 5개 칼럼이 있으므로 5로 설정
                className="
          text-center
          text-[16px]
          text-[#888]
          leading-[20px]
          border-t
          border-[#e6e6e6]
          px-[15px]
          pt-[200px]
          pb-[80px]
          bg-no-repeat
          bg-[position:center_80px]
          bg-[url('https://static.oliveyoung.co.kr/pc-static-root/image/comm/ico_nodata104x104.png')]"
              >
                등록된 배송지가 없습니다.
              </td>
            </tr>
          ) : (
            addresses.map((item, index) => (
              <tr key={index} className="h-[232px] text-[14px] border-b border-gray-200">
                {/* 배송지명 */}
                <td className="text-center">{item.addressName}</td>

                {/* 받는사람 */}
                <td className="text-center">{item.recipientName}</td>

                {/* 주소 */}
                <td className="pl-[20px] pr-[5px] py-[30px]">
                  <div className="flex items-center gap-2 mb-1">
                    {item.default && (
                      <strong className="text-white bg-[#9bce26] text-[11px] px-2 py-1 rounded">
                        기본 배송지
                      </strong>
                    )}
                    <span className="text-[#f27370] text-[11px] flex">
                      <i className="icon_delivery mr-1" /> 오늘드림
                    </span>
                  </div>
                  <p>
                    <span className="font-semibold">도로명 :</span> {item.streetAddress}
                  </p>
                  <p className="text-gray-500 text-[12px] mt-1">
                    <span className="font-semibold">상세주소 :</span> {item.detailAddress}
                  </p>
                  <div className="mt-2 border-t-2 p-2 rounded text-[12px]">
                    <strong>공동현관 출입방법</strong>
                    <p className="mt-1 text-gray-700">자유출입가능</p>
                  </div>
                </td>

                {/* 연락처 */}
                <td className="text-center">{maskPhone(item.phone)}</td>

                {/* 관리 */}
                <td className="text-center">
                  {item.default ? (
                    <button className="border px-2 py-1 text-[12px] rounded">수정</button>
                  ) : (
                    <div className="flex flex-col items-center space-y-2">
                      <button
                        onClick={() => handleSetDefault(item.addressId)}
                        className="border border-gray-300 w-[104px] h-[26px] text-[12px] rounded hover:bg-gray-100"
                      >
                        기본 배송지 설정
                      </button>
                      <div className="flex gap-[6px]">
                        <button
                          onClick={() => handleDelete(item.addressId)}
                          className="border border-gray-300 w-[48px] h-[26.4px] px-[10px] text-[12px] rounded hover:bg-gray-100"
                        >
                          삭제
                        </button>
                        <button className="border border-gray-300 w-[48px] h-[26.4px] px-[10px] text-[12px] rounded hover:bg-gray-100">
                          수정
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 배송지 등록 버튼 */}
      <div className="text-center mt-6">
        <button
          className="w-[150px] h-[50px] px-6 py-2 bg-[#9bce26] text-white font-bold rounded-[5px] text-[18px]"
          onClick={() => router.push('/mypage/user/getdeliveryinfo/deliveryregister')}
        >
          배송지 등록
        </button>
      </div>
    </div>
  );
}
