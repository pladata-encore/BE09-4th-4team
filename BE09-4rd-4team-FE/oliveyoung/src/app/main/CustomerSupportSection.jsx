"use client";

import Image from "next/image";
import { getImageUrl } from "@/utils/image";

const imageUrl = getImageUrl("mainpage/QRcode.png");
export default function CustomerSupportSection() {
  return (
    <div className="w-[1020px] h-[246px] mx-auto flex justify-between items-start border-t border-gray-300 ">
      {/* 왼쪽: 공지사항 및 고객센터 */}
      <div className="flex flex-col gap-6 w-[640px]">
        {/* 공지사항 */}
        <div>
          <div className="flex justify-between h-[60px] items-center border-b ">
            <div className="text-semibold text-[18px] font-bold ">공지사항</div>
            <div className="text-left text-[14px] text-gray-500 -ml-[360px]">
              새로운 소식이 없어요
            </div>
            <div className="text-[14px] font-semibold text-gray-500 cursor-pointer">
              더보기 &gt;
            </div>
          </div>
        </div>

        {/* 고객센터 */}
        <div className="text-left">
          <div className="font-bold mb-1 text-[18px]">
            고객센터 <span className="text-xl ml-[24px]">1577-4887</span>
          </div>
          <p className="text-[14px] text-gray-500 ml-[90px]">
            고객센터 운영시간은 평일 09:00 - 18:00 입니다.
            <br />
            주말 및 공휴일은 1:1 문의하기를 이용해주세요. 업무가 시작되면 바로
            처리해드립니다.
          </p>
          <div className="flex justify-center gap-2 mt-2">
            <button className="border px-4 py-1 text-sm">1:1 문의하기</button>
            <button className="border px-4 py-1 text-sm">
              자주하는 질문 &gt;
            </button>
          </div>
        </div>
      </div>

      {/* 오른쪽: QR코드 */}
      {/* 오른쪽: QR코드 */}
      <div className="w-[340px] h-full flex items-center justify-center">
        <div className="text-center">
          <Image
            src={imageUrl} // ← 여기 수정됨
            alt="모바일 앱 QR"
            width={340}
            height={235.5}
          />
        </div>
      </div>
    </div>
  );
}
