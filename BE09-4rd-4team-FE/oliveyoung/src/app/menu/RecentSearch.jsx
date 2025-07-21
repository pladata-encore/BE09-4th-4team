import React from 'react';
import { getImageUrl } from '@/utils/image'; 

function RecentSearch({ search }) {
  // 이미지 URL을 getImageUrl로 처리하는 상수 정의
  const deleteIconUrl = getImageUrl("product/delete.svg");

  return (
    <div className="w-[100%] py-[9px] flex flex-row justify-between items-center">
      <p className="text-sm text-[#131518]">스킨/토너</p>
      <div>
        <img src={deleteIconUrl} alt="delete" /> {/* src 변경 (deleteIconUrl 변수 사용) */}
      </div>
    </div>
  );
}
export default RecentSearch;