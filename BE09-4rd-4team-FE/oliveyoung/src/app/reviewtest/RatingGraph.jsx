// 점수별 개수 세는 함수
function getRatingCounts(reviews) {
  // [5점, 4점, 3점, 2점, 1점] 순서
  const counts = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    // rating: 5.0~1.0 → 인덱스: 0~4
    const idx = 5 - Math.round(r.rating); // ex: 5점이면 idx=0, 4점이면 idx=1
    if (idx >= 0 && idx <= 4) counts[idx]++;
  });
  return counts;
}

// 퍼센트 변환 함수
function getPercentages(counts) {
  const total = counts.reduce((sum, n) => sum + n, 0);
  return counts.map(count =>
    total === 0 ? 0 : Math.round((count / total) * 100)
  );
}

export default function RatingDistribution({ reviews }) {
  // 1. 점수별 개수 구함
  const ratingCounts = getRatingCounts(reviews);

  // 2. 퍼센트로 변환
  const percentages = getPercentages(ratingCounts);

  return (
    <div className="flex gap-1 ml-auto">
      {percentages.map((percent, idx) => (
        <div
          key={idx}
          className="w-[56px] h-[155px] flex flex-col items-center gap-2"
        >
          {/* 퍼센트 텍스트 (상단) */}
          <div className="text-xs">{percent}%</div>

          {/* 그래프 바 */}
          <div className="w-[8px] h-[85px] bg-gray-100 relative flex items-end rounded overflow-hidden">
            <div
              className="bg-red-400 w-full"
              style={{ height: `${percent}%` }}
            />
          </div>

          {/* 점수 텍스트 (하단) */}
          <div className="text-xs">{5 - idx}점</div>
        </div>
      ))}
    </div>
  );
}
