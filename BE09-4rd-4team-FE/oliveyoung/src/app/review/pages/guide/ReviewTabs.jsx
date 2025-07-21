"use client";
import { useRouter, usePathname } from "next/navigation";

export default function ReviewTabs() {
  const router = useRouter();
  const pathname = usePathname();

  // guide_mine 경로일 때 나의 리뷰 탭 활성화
  const activeTab = pathname.includes("/guide_mine") ? "mine" : "write";

  return (
    <div className="w-[785.6px] mx-auto mt-4">
      <div className="flex">
        {/* 리뷰 작성 탭 */}
        <button
          className={`w-1/2 h-[50px] text-[18px] font-medium rounded-t-md transition-all duration-200 ${
            activeTab === "write"
              ? "bg-white border-t-2 border-l-2 border-r-2 border-[#9bce26] border-b-0 text-black z-10"
              : "bg-gray-100 border-b-2 border-[#9bce26] border-t-0 border-l-0 border-r-0 text-black"
          }`}
          onClick={() => router.push("/review/guide_write")}
        >
          리뷰 작성
        </button>

        {/* 나의 리뷰 탭 */}
        <button
          className={`w-1/2 h-[50px] text-[18px] font-medium rounded-t-md transition-all duration-200 ${
            activeTab === "mine"
              ? "bg-white border-t-2 border-l-2 border-r-2 border-[#9bce26] border-b-0 text-black z-10"
              : "bg-gray-100 border-b-2 border-[#9bce26] border-t-0 border-l-0 border-r-0 text-black"
          }`}
          onClick={() => router.push("/review/guide_mine")}
        >
          나의 리뷰
        </button>
      </div>
    </div>
  );
}
