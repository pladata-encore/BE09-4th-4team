"use client";

import { usePathname, useRouter } from "next/navigation";

export default function TabNav() {
  const pathname = usePathname();
  const router = useRouter();

  const isDeliveryPage = pathname.includes("/mypage/user/getdeliveryinfo");
  const isRefundPage = pathname.includes("/mypage/user/getrfdactlist");

  const handleClick = (path) => {
    router.push(path);
  };

  return (
    <ul className="flex text-center w-full h-[51.6px] text-[18px] leading-[20px] text-[rgb(51,51,51)] tracking-[-0.04em] list-none overflow-hidden">
      <li
        onClick={() => handleClick("/mypage/user/getdeliveryinfo")}
        className={`flex items-center justify-center w-1/2 border-b-[2px] cursor-pointer 
          ${
            isDeliveryPage
              ? "border-t-[2px] border-x-[2px] border-t-[#9bce26] border-x-[#9bce26] border-b-white g-white font-normal"
              : "border-b-[#9bce26] border-b-[2px] bg-[#f6f6f6]"
          }`}
      >
        배송지
      </li>
      <li
        onClick={() => handleClick("/mypage/user/getrfdactlist")}
        className={`flex items-center justify-center w-1/2 border-b-[2px] cursor-pointer
          ${
            isRefundPage
              ? "border-t-[2px] border-x-[2px] border-t-[#9bce26] border-x-[#9bce26] border-b-white bg-white font-normal"
              : "border-b-[#9bce26] border-b-[2px] bg-[#f6f6f6]"
          }`}
      >
        환불계좌
      </li>
    </ul>
  );
}
