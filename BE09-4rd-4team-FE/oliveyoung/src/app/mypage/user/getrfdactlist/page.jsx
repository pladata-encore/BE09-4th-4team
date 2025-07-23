'use client';

import TabNav from '../components/TabNav';
import UserInfoBox from '../components/UserInfoBox';

export default function GetRfdActListPage() {
  return (
    <div className="float-left w-[850px] px-[29px]">
      {/* 유저 info 박스 */}
      <UserInfoBox />

      {/* 배송지 내용 */}
      <div>
        <h2 className="text-xl h-[30px] font-bold mt-[30px] mb-[7px]">배송지/환불계좌</h2>
      </div>

      <TabNav />

      {/* 환불계좌 테이블 */}
      <div className="mt-8 border-t border-[#999]">
        <table className="w-full border-collapse text-center text-[13px] text-[#333]">
          <thead className="h-[39px] text-[13px] font-bold border-b border-b-[rgb(230, 230, 230)] border-t-[2px] border-t-[rgb(214,214,214)] bg-[rgb(250,250,250)] py-2 mt-[10px]">
            <tr className="text-[14px] text-[#666666]">
              <th className="w-[15%]">은행</th>
              <th className="w-[65%]">계좌번호</th>
              <th className="w-[20%]">관리</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan="3"
                className="
                    text-center
                    text-[16px]
                    text-[#888]
                    leading-[20px]
                    border-t
                    border-[#e6e6e6]
                    px-[15px]
                    pt-[200px]
                    pb-[80px]
                    bg-no-repeat
                    bg-[position:center_80px]
                    bg-[url('https://static.oliveyoung.co.kr/pc-static-root/image/comm/ico_nodata104x104.png')]"
              >
                등록된 계좌 정보가 없습니다.
              </td>
            </tr>
          </tbody>
        </table>

        {/* 하단 버튼 */}
        <div className="mt-6 text-center">
          <button className="px-8 py-2 bg-[#9bce26] text-white font-bold text-[15px] rounded cursor-pointer hover:bg-[#89b823] transition">
            환불계좌 등록
          </button>
        </div>

        {/* 안내 문구 */}
        <ul className="mt-4 text-[12px] text-[#666] leading-[20px] list-disc list-inside">
          <li>계좌를 변경하시려면 기존 계좌를 삭제한 후 새로 등록해 주시기 바랍니다.</li>
          <li>
            결제취소에 대해 현금으로 환불 받아야 하는 경우 등록하신 계좌로 환불되오니 정확히 기입해
            주시기 바랍니다.
          </li>
          <li>본인 명의 계좌만 등록 가능합니다.</li>
          <li>환불 처리를 위해 계좌정보를 수집하며, 관련 법령에 따라 5년간 보관합니다.</li>
        </ul>
      </div>
    </div>
  );
}
