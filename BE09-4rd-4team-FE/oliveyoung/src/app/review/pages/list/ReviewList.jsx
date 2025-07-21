import { useEffect, useState } from "react";
import axios from "axios";
import ReviewItem from "./ReviewItem";
import { FaExclamation } from "react-icons/fa";

const ITEMS_PER_PAGE = 10;

export default function ReviewList() {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("http://localhost:8080/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // 주문 내역 펼쳐서 '리뷰 안 쓴' orderItems만 추출
        const flatOrderItems = res.data.flatMap((order) =>
          order.orderItems
            .filter((oi) => !oi.hasReview) // hasReview 필드는 예시, 실제 구조에 맞게!
            .map((oi) => ({
              ...oi,
              orderId: order.orderId,
              createdAt: order.createdAt,
              status: order.status,
            }))
        );
        setItems(flatOrderItems);
      } catch (error) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ⭐ 리뷰 등록 성공시 목록에서 제거!
  const handleReviewSuccess = (orderItemId) => {
    setItems((prev) => prev.filter((item) => item.orderItemId !== orderItemId));
    // (선택) 페이지네이션 보정
    const newTotal = Math.ceil((items.length - 1) / ITEMS_PER_PAGE);
    if (currentPage > newTotal && newTotal > 0) setCurrentPage(newTotal);
  };

  // 페이지네이션
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (loading) return <div>로딩 중...</div>;
  if (!items.length)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 border-b">
        <div className="w-[100px] h-[100px] flex items-center justify-center border-2 border-gray-300 rounded-full mb-4">
          <FaExclamation className="text-3xl text-gray-300" />
        </div>
        <p className="text-sm">리뷰 작성 가능한 상품이 없습니다.</p>
      </div>
    );

  return (
    <div className="mt-6">
      {/* 헤더 */}
      <div className="grid grid-cols-[1fr_150px_120px] gap-4 px-1 py-3 border-y border-gray-300 text-sm text-gray-700 font-semibold bg-gray-50">
        <div className="text-center">상품</div>
        <div className="text-center">작성기한</div>
        <div className="text-center">리뷰작성</div>
      </div>
      <div className="space-y-0">
        {currentItems.map((item) => (
          <ReviewItem
            key={item.orderItemId}
            data={item}
            onReviewSuccess={handleReviewSuccess}
          />
        ))}
      </div>
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-8 h-8 border rounded text-sm transition ${
              currentPage === page
                ? "bg-black text-white"
                : "border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-black"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}
