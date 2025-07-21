'use client';

import React from 'react';
import { useRouter } from 'next/navigation'; // Next 13+
import ConfirmPasswordForm from '../components/ConfirmWithdrawal';
import UserInfoBox from '../components/UserInfoBox';
import { useState } from 'react';

export default function AccountWithdrawalPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  return (
    <div className="float-left w-[850px] px-[29px]">
      {/* 유저 info 박스 */}
      <UserInfoBox />

      {/* 회원탈퇴 안내 */}
      <div>
        <h2 className="text-xl h-[30px] font-bold mt-[30px] mb-[7px]">회원탈퇴</h2>
      </div>
      <div className="border-t border-t-black">
        <p className="text-sm font-bold text-[rgb(102,102,102)] mb-2 mt-6">
          회원 탈퇴(이용약관 동의 철회) 시 아래 내용을 확인해주세요.
        </p>
      </div>
      <ul className="list-disc marker:text-[7px] border border-[rgb(102, 102, 102)] rounded-[5px] pt-[15px] pb-[15px] px-[20px] text-[13px] text-[rgb(102,102,102)] leading-[20px] tracking-[-0.04em]">
        <li>올리브영 이용약관 철회 시 개인정보, 쿠폰 등은 복원 불가하게 삭제됩니다.</li>
        <li>다른 CJ ONE 제휴 브랜드는 계속 이용 가능합니다.</li>
        <li>재동의 시 서비스 재이용 가능하지만, 일부 정보는 복구되지 않습니다.</li>
        <li>진행 중인 거래가 있을 경우 탈퇴할 수 없습니다.</li>
        <li>올리브영 현대카드 리워드는 탈퇴 시 소멸되며 복구되지 않습니다.</li>
        <li>
          카드 보유자의 경우 탈퇴 후 재가입 시 카드 재발급이 필요하며 연회비가 청구될 수 있습니다.
        </li>
      </ul>

      <p className="text-center font-normal pt-[30px]">
        올리브영 회원 탈퇴(이용약관 동의 철회)를 하시겠습니까?
      </p>

      {step === 1 && (
        <div className="text-center pt-[10px] mt-[10px]">
          <button
            onClick={() => setStep(2)}
            className="w-[150px] h-[50px] px-8 py-4 bg-[#9bce26] text-white rounded-[5px] text-[18px] leading-none font-bold  hover:bg-[#899A00] transition-colors"
          >
            회원 탈퇴
          </button>
        </div>
      )}
      {step === 2 && <ConfirmPasswordForm onSuccess={() => setStep(3)} />}
    </div>
  );
}
