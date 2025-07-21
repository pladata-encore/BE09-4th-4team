import RatingStars from "./RatingStars";
import RatingDistribution from "./RatingGraph";

// 평점에 따른 이모지 반환
const getEmoji = (rating) => {
  if (rating >= 4.5) return "😊";
  if (rating >= 3.5) return "😐";
  return "😞";
};

// 평점에 따른 텍스트 반환
const getText = (rating) => {
  if (rating >= 4.5) return "최고";
  if (rating >= 3.5) return "보통이에요";
  return "별로예요";
};

export default function ReviewSummary({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return <div className="w-full text-center py-10">리뷰가 없습니다</div>;
  }

  // 평균 평점 계산
  const avgRating =
    reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;

  // 리뷰 개수
  const totalReviews = reviews.length;

  // 평점 분포 예시 (5~1점 카운트)
  const ratingsDistribution = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    const idx = 5 - Math.round(r.rating); // 5~1점 → 0~4 index
    if (ratingsDistribution[idx] !== undefined) ratingsDistribution[idx]++;
  });

  return (
    <div className="w-[1020px] h-[231px] flex items-center gap-6">
      {/* 이모지 영역 */}
      <div className="w-[280px] h-[231px] flex flex-col items-center justify-center">
        <div className="text-[100px] w-[100px] h-[100px] flex items-center justify-center">
          {getEmoji(avgRating)}
        </div>
        <div className="text-md font-semibold mt-2 text-center w-full">
          {getText(avgRating)}
        </div>
      </div>

      {/* 점수 영역 */}
      <div className="w-[361px] h-[231px] flex flex-col items-center justify-center text-center border-l border-gray-300 pl-6">
        <div className="text-gray-500 mb-[30px]">
          총 {totalReviews.toLocaleString()}건
        </div>
        <div className="flex items-end gap-2">
          <div
            className="font-bold"
            style={{
              width: "64px",
              height: "54px",
              fontSize: "48px",
              lineHeight: "54px",
            }}
          >
            {avgRating.toFixed(1)}
          </div>
          <div
            style={{
              width: "29px",
              height: "32px",
              fontSize: "24px",
              lineHeight: "32px",
            }}
          >
            점
          </div>
        </div>
        <RatingStars rating={avgRating} />
      </div>

      {/* 그래프 영역 */}
      <div className="pt-[38px]">
        <RatingDistribution reviews={reviews} />
      </div>
    </div>
  );
}
