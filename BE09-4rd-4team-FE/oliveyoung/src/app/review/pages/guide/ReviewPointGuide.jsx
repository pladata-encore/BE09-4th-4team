export default function ReviewPointGuide() {
  return (
    <div className="w-[790.38px] h-[88.4px] border border-gray-300 bg-white rounded-md  mt-6 flex justify-center items-center px-6">
      {/* 상세 리뷰 */}
      <div className="w-[263.46px] h-[88.4px] flex flex-col justify-center items-center text-center">
        <p className="text-[#666666] text-base mb-1">상세 리뷰</p>
        <p className="text-gray-500 text-xs mb-1">(일반작성리뷰)</p>
        <p className="text-[#666666] text-sm mb-0">100P</p>
      </div>

      {/* 세로 구분선 */}
      <div className="w-[2px] h-[51px] bg-gray-300 mx-4" />

      {/* 한달사용리뷰 */}
      <div className="w-[263.46px] h-[88.4px] flex flex-col justify-center items-center text-center">
        <p className="text-[#666666] text-base mb-1">한달사용리뷰</p>
        <p className="text-gray-500 text-xs mb-1">
          (상품의 첫 리뷰 작성 기준 30일~120일)
        </p>
        <p className="text-[#666666] text-sm mb-0">500P</p>
      </div>

      {/* 세로 구분선 */}
      <div className="w-[2px] h-[51px] bg-gray-300 mx-4" />

      {/* 얼리 리뷰 */}
      <div className="w-[263.46px] h-[88.4px] flex flex-col justify-center items-center text-center">
        <p className="text-[#666666] text-base mb-1">얼리 리뷰</p>
        <p className="text-gray-500 text-xs mb-1">(상품의 1~10번째 리뷰)</p>
        <p className="text-[#666666] text-sm mb-0">1,000P</p>
      </div>
    </div>
  );
}
