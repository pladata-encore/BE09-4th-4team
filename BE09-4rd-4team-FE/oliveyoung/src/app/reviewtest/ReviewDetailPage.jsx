"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import ReviewSummary from "./ReviewSummary";
import ReviewStats from "./ReviewStats";
import ReviewList from "./ReviewList";

export default function ReviewDetailPage() {
  const { productId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/products/${productId}/reviews`
        );
        setReviews(res.data.data || []); // 리뷰 배열만 저장
      } catch (error) {
        console.error("리뷰 데이터 요청 실패:", error);
        setReviews([]); // 에러 시 빈 배열
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  if (loading) return <div className="text-center py-10">로딩 중...</div>;
  if (!reviews || reviews.length === 0)
    return <div className="text-center py-10">리뷰가 없습니다</div>;

  // **리뷰 배열을 컴포넌트에 바로 전달**
  return (
    <div className="max-w-[1020px] mx-auto py-10 text-sm text-gray-800">
      <hr className="border-t-2 border-gray-800" />
      <ReviewSummary reviews={reviews} />
      <hr className="border-t border-gray-200 mb-10" />
      <ReviewStats reviews={reviews} />
      <hr className="border-t border-gray-200" />
      <ReviewList reviews={reviews} />
      <hr className="border-t border-gray-300" />
    </div>
  );
}
