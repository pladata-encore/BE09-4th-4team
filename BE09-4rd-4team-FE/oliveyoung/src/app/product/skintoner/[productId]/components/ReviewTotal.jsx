import { FaStar } from "react-icons/fa";

export default function ReviewTotal({ reviews }) {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return (
      <div className="flex items-center">
        <span className="mr-2 text-lg font-bold">고객 리뷰</span>
        <span className="text-gray-400">리뷰가 없습니다.</span>
      </div>
    );
  }

  // 평균 평점 계산
  const avgRating =
    reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;
  const totalReviews = reviews.length;

  // 별점 아이콘 5개
  const renderStars = () => {
    const stars = [];
    const ratingFloor = Math.floor(avgRating);
    const hasHalf = avgRating - ratingFloor >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (i < ratingFloor) {
        stars.push(
          <FaStar key={i} className="text-[#f27370] text-2xl inline-block" />
        );
      } else if (i === ratingFloor && hasHalf) {
        stars.push(
          <FaStar key={i} className="text-[#f27370] text-2xl opacity-50 inline-block" />
        );
      } else {
        stars.push(
          <FaStar key={i} className="inline-block text-2xl text-gray-300" />
        );
      }
    }
    return stars;
  };

  return (
    <div className="flex items-center">
      <span className="mt-2 mr-2 text-xl font-bold">고객 리뷰</span>
      <span className="flex items-center mr-2">{renderStars()}</span>
      <span className="mt-4 mb-2 text-2xl font-bold">{avgRating.toFixed(1)}</span>
      <span className="mt-2 ml-1 text-xl text-gray-500">
        ({totalReviews.toLocaleString()}건)
      </span>
    </div>
  );
}
