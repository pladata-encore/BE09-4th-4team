"use client";


export default function ReviewWriteButtons({ onClose, onSubmit }) {
  return (
    <div className="flex justify-end gap-4 mt-5 px-11">
      <button
        onClick={onClose} // ← 여기서 닫기 버튼 클릭 시 실행
        className="w-[170px] h-[50px] px-5 py-2 border border-[#999999] rounded text-gray-700 hover:bg-gray-100"
      >
        닫기
      </button>
      <button
        onClick={onSubmit}
        className="w-[170px] h-[50px] px-5 py-2 bg-[#999999] text-white rounded hover:bg-gray-800"
      >
        리뷰 등록하기
      </button>
    </div>
  );
}

