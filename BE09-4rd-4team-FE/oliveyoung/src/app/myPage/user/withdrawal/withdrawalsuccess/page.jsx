'use client';

import { useRouter } from 'next/navigation';

export default function WithdrawalSuccessPage() {
  const router = useRouter();

  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl font-bold text-[#9bce26] mb-4">회원 탈퇴가 완료되었습니다.</h2>
      <p className="text-gray-700">그동안 올리브영 서비스를 이용해주셔서 감사합니다.</p>
      <br />
      <br />
      <button
        onClick={() => router.push('/')}
        className="w-[150px] h-[50px] px-8 py-4 bg-[#9bce26] text-white rounded-[5px] text-[18px] leading-none font-bold  hover:bg-[#899A00] transition-colors"
      >
        메인 화면
      </button>
    </div>
  );
}
