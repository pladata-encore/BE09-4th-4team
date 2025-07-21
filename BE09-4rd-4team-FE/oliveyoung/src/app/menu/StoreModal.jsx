import React from "react";

function StoreModal({ storeHover }) {
  return (
    <div
      className={
        "w-[595px] h-[180px] bg-[#ffffff] absolute z-10 top-10 right-0 border border-[#d5d5d5] p-[20px] flex flex-col justify-center items-center" +
        (storeHover ? " visible" : " invisible")
      }
      style={{ zIndex: "20" }}
    >
      <div
        className="absolute border-solid border-white"
        style={{
          borderWidth: "0px 8px 10px 10px",
          borderColor: "#FFFFFF transparent",
          display: "block",
          width: "0",
          zIndex: "1",
          top: "-9.5px",
          right: "30px",
        }}
      ></div>
      <div
        className="absolute border-solid border-white"
        style={{
          borderWidth: "0px 8px 10px 10px",
          borderColor: "#d5d5d5 transparent",
          display: "block",
          width: "0",
          zIndex: "0",
          top: "-11px",
          right: "30px",
        }}
      ></div>
      <p className="w-[553px] font-bold text-base text-[#888] text-center leading-[22px] pb-[20px] border-b">
        <span className="text-[#9bce26]">박*준</span>님이 지금 찾는 상품,
        <span className="text-[#9bce26]"> 가까운 매장에서 재고 확인</span>
        <br />
        <span className="text-[]">올영매장에서 재고 확인하고, 빠르게 픽업 주문까지!</span>
      </p>
      <button className="w-[162px] h-[32px] px-[20px] mt-[14px] font-bold text-[#888] border border-[#ddd] text-sm">
        올영매장바로가기
      </button>
    </div>
  );
}
export default StoreModal;