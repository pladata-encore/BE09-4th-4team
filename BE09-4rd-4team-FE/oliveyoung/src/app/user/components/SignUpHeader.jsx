'use client';

import Image from 'next/image';

export default function SignUpHeader() {
  return (
    <header className="min-h-[90px] h-[10vh] bg-[#2b2b2b] text-gray-300">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        {/* 왼쪽: CJ ONE 로고 + 텍스트 */}
        <div className="flex items-center space-x-2">
          <Image
            src="/images/mypage/signupheader/cjone_logo.png" // 로고 경로
            alt="CJ ONE Logo"
            width={110}
            height={30}
          />
          <span className="text-sm">TRUE LIFESTYLE MEMBERSHIP</span>
        </div>

        {/* 오른쪽: 올리브영 문구 + 로고 */}
        <div className="text-sm flex items-center space-x-2">
          <span>건강한 아름다움을 큐레이팅 하는 브랜드</span>
          <img
            src="https://www.cjone.com/cjmweb/upfile/20250310_1957f91ff3931.png"
            alt="oliveyoung logo"
            className="h-6"
          />
        </div>
      </div>
    </header>
  );
}
