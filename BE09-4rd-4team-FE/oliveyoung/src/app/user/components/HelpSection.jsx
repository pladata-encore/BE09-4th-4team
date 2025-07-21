'use client';

export default function HelpSection() {
  return (
    <div className="flex flex-col md:flex-row mt-16 mb-16 px-4 md:px-0 bg-[#f8f8f8]">
      {' '}
      {/* 좌우 여백 및 간격 조정 */}
      {/* 자주찾는 질문 섹션 */}
      <div className="flex-1 p-6 flex items-center justify-between ">
        <div className="flex-col">
          <h3 className="text-xl font-bold text-gray-800 mb-2">자주찾는 질문</h3>
          <p className="text-sm text-gray-600 mb-1">CJ ONE에 대한 궁금하신 사항을 확인하세요.</p>
          <p className="text-sm text-gray-600">질문에 빠르고 정확한 답변을 제공합니다.</p>
        </div>

        {/* 큰 아이콘 (채팅 버블 모양) */}
        <div
          className="w-[62px] h-[62px] bg-no-repeat"
          style={{
            backgroundImage: "url('https://www.cjone.com/cjmweb/images/common/bg_banner_cs.png')",
            backgroundPosition: '-62px -62px',
            backgroundSize: 'auto',
          }}
        ></div>
      </div>
      {/* 가운데: 짧은 세로선 */}
      <div className="self-center w-[1px] h-[90px] bg-gray-300"></div>
      {/* 1:1 상담 섹션 */}
      <div className="flex-1 p-6 flex items-center border-l-0 justify-between">
        <div className="flex flex-col">
          <h3 className="text-xl font-bold text-gray-800 mb-2">1:1 상담</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 평일 : 다음 날 답변 완료</li>
            <li>• 토요일 공휴일 : 휴일 이후 답변 완료</li>
          </ul>
        </div>
        {/* 큰 아이콘 (모니터 모양) */}
        <div
          className="w-[62px] h-[62px] bg-no-repeat"
          style={{
            backgroundImage: "url('https://www.cjone.com/cjmweb/images/common/bg_banner_cs.png')",
            backgroundPosition: '0px 0px', // 예시 좌표 (실제 픽셀 맞게 수정 필요)
            backgroundSize: 'auto',
          }}
        ></div>
      </div>
      {/* --- 새로 추가되는 부분 끝 --- */}
    </div>
  );
}
