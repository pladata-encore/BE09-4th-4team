'use client';

import UserInfoBox from '../components/UserInfoBox';
import React, { useState } from 'react';

export default function ModifyAccountInfo() {
  const [agreed, setAgreed] = useState(false);
  const [channels, setChannels] = useState({ sms: true, app: false, email: false });

  const toggleChannel = (channel) => {
    setChannels({ ...channels, [channel]: !channels[channel] });
  };
  return (
    <div className="float-left w-[850px] px-[29px]">
      {/* 유저 info 박스 */}
      <UserInfoBox />
      <div className="border-b-[0.8px] border-b-black">
        <h2 className="text-xl h-[30px] font-bold mt-[30px] mb-[7px]">회원정보 수정</h2>
      </div>
      <h3 className="h-[18px] mt-[30px] font-bold text-[16px]">기본정보 수정</h3>
      <div className="flex items-center mt-[11px]">
        <p className="text-[13px] text-[#555555] flex-grow leading-[20px] tracking-[-0.04em]">
          회원 정보 및 비밀번호는 CJ ONE 사이트를 통해 수정 가능합니다.
          <br />
          (카카오 간편회원은 CJ ONE에서 통합회원 전환하여 비밀번호 설정/수정 가능)
        </p>
        <ul className="flex space-x-2 ml-4">
          <li>
            <a
              href="/mypage/user/modifyactinfo/modifyactdetailed"
              className="block
                        w-[152.6px]
                        h-[37.6px]
                        relative
                        text-[14px]
                        leading-[36px]
                        tracking-[-0.04em]
                        text-[#666]
                        pl-[15px]
                        pr-[56px]
                        border
                        border-[#888]
                        rounded-[5px]"
            >
              {/* 링크 안에 내용 넣어야 함 */}
              회원정보 수정
            </a>
          </li>
          <li>
            <a
              href="/mypage/user/modifyactinfo/modifypwd"
              className="block
                        w-[152.6px]
                        h-[37.6px]
                        relative
                        text-[14px]
                        leading-[36px]
                        tracking-[-0.04em]
                        text-[#666]
                        pl-[15px]
                        pr-[56px]
                        border
                        border-[#888]
                        rounded-[5px]"
            >
              비밀번호 수정
            </a>
          </li>
        </ul>
      </div>
      {/* 여기부터 */}
      <div className="borderp-4 text-sm text-black mt-[40px]">
        <hr />
        <br />
        <div className="flex justify-between items-start">
          <div className="font-semibold">마케팅 활용 및 광고성 정보 수신 동의(선택)</div>
          <label className="flex items-center font-medium">
            <input
              type="checkbox"
              className="mr-1 accent-black"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            동의합니다
          </label>
        </div>

        <div className="mt-4" style={{ backgroundColor: 'rgb(250, 250, 250)' }}>
          <dl className="font-semibold mb-2">
            <dt>알림 수신 채널 선택</dt>
            <dd>
              <ul className="flex gap-4 mt-2">
                <li>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-1 accent-black"
                      checked={channels.sms}
                      onChange={() => toggleChannel('sms')}
                    />
                    문자(SMS/LMS)
                  </label>
                </li>
                <li>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-1 accent-black"
                      checked={channels.app}
                      onChange={() => toggleChannel('app')}
                    />
                    APP PUSH
                  </label>
                </li>
                <li>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-1 accent-black"
                      checked={channels.email}
                      onChange={() => toggleChannel('email')}
                    />
                    이메일
                  </label>
                </li>
              </ul>
            </dd>
          </dl>
          <p className="text-xs text-gray-500 mt-1">
            * 구매정보 및 주요 서비스 정책변경 건은 수신 동의 여부와 관계없이 발송됩니다.
          </p>
        </div>

        <div className="border border-gray-200 mt-4 text-xs">
          <div className="grid grid-cols-3 bg-gray-50 font-medium text-center">
            <div className="p-2 border-r border-gray-200">수집·이용 목적</div>
            <div className="p-2 border-r border-gray-200">수집 항목</div>
            <div className="p-2">보유 및 이용 기간</div>
          </div>
          <div className="grid grid-cols-3 text-center">
            <div className="p-2 border-t border-gray-200">
              각종 이벤트, 회원 혜택, 할인 행사 등의 사전 안내 및 이용 기반의 마케팅 활동
            </div>
            <div className="p-2 border-t border-gray-200">
              이름, 휴대전화, 배송주소, 생년월일, 성별, 상품 구매정보, 서비스 이용 내역,
              <br />
              광고성 정보 수신 채널 (문자, APP PUSH, 이메일)
            </div>
            <div className="p-2 border-t border-gray-200">
              회원 탈퇴 후 30일까지 또는 해당 서비스 동의 철회 시까지
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          ※ 회원은 본 서비스 이용 동의에 대한 거부를 할 수 있으며, 미동의 시 본 서비스에 대한 혜택을
          받으실 수 없습니다.
        </p>
      </div>{' '}
      {/* 여기까지 */}
      <div className="mt-[30px] flex justify-center">
        <a
          href="#"
          className="text-center w-[150px] h-[50px] px-[30px] py-[10px] bg-black text-[16px] text-white font-bold rounded leading-[32px]"
          onClick={() => alert('저장되었습니다.')}
        >
          저장
        </a>
      </div>
    </div>
  );
}
