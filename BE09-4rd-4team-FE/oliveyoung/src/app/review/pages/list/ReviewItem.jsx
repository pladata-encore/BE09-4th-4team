import { useState } from "react";
import { getImageUrl } from "@/utils/image";
import ReviewWriteLayout from "../write/ReviewWriteMain";

export default function ReviewItem({ data, onReviewSuccess }) {
  const [showModal, setShowModal] = useState(false);

  if (!data) return null;

  const {
    imageUrl,
    brandName,
    productName,
    quantity,
    price,
    orderId,
    createdAt,
    orderItemId,
  } = data;

  const fullImageUrl = getImageUrl(imageUrl);

  return (
    <>
      <div className="grid grid-cols-[1fr_150px_120px] gap-4 border-b py-4 items-center">
        {/* 상품 정보 */}
        <div className="flex gap-4 items-start">
          <img
            src={fullImageUrl}
            alt={brandName}
            className="w-[80px] h-[80px] object-cover rounded"
          />
          <div className="text-sm text-gray-700">
            <div className="text-xs text-gray-500">
              주문번호: {orderId} <br />
              주문일: {createdAt ? createdAt.split("T")[0] : "-"}
              <br />
            </div>
            <div className="font-semibold mt-1">{brandName}</div>
            <div className="text-gray-600 text-sm">{productName}</div>
            <div className="text-xs text-gray-500 mt-1">
              수량: {quantity}개 / 결제금액: {price?.toLocaleString()}원
            </div>
          </div>
        </div>
        {/* 작성기한 */}
        <div className="text-sm text-gray-600 text-center">
          {createdAt
            ? (() => {
                const date = new Date(createdAt);
                date.setMonth(date.getMonth() + 3);
                return `~ ${date.toISOString().split("T")[0]}`;
              })()
            : "-"}
        </div>
        {/* 리뷰 작성 버튼 */}
        <div className="flex justify-end mr-6">
          <button
            onClick={() => setShowModal(true)}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition text-[12px]"
          >
            리뷰 작성
          </button>
        </div>
      </div>
      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded p-6 max-w-[560px] w-full max-h-[80vh] overflow-y-auto overflow-x-hidden relative">
            {/* X 닫기 버튼 */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-11 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              aria-label="Close modal"
            >
              ✖️
            </button>
            {/* 리뷰 작성 폼: onReviewSuccess 반드시 전달! */}
            <ReviewWriteLayout
              orderItemId={orderItemId}
              onClose={() => setShowModal(false)}
              onReviewSuccess={() => {
                setShowModal(false);
                if (onReviewSuccess) onReviewSuccess(orderItemId);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
