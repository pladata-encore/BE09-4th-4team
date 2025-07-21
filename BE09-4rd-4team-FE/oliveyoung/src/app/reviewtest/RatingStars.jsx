export default function RatingStars({ rating }) {
  const maxStars = 5;
  // 0.5 단위로 round (예: 4.5, 3.5 ...)
  const roundedRating = Math.round(rating * 2) / 2;

  return (
    <div className="flex gap-1">
      {Array.from({ length: maxStars }).map((_, i) => {
        // 각 별의 채워진 정도 계산
        if (roundedRating >= i + 1) {
          // 꽉 찬 별
          return (
            <svg key={i} className="w-[26px] h-[26px] text-red-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87L8.91 8.26z" />
            </svg>
          );
        } else if (roundedRating >= i + 0.5) {
          // 반 별
          return (
            <svg key={i} className="w-[26px] h-[26px]" viewBox="0 0 24 24">
              <defs>
                <linearGradient id={`halfGrad${i}`}>
                  <stop offset="50%" stopColor="#f87171" />
                  <stop offset="50%" stopColor="#e5e7eb" />
                </linearGradient>
              </defs>
              <path
                fill={`url(#halfGrad${i})`}
                d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87L8.91 8.26z"
              />
            </svg>
          );
        } else {
          // 빈 별
          return (
            <svg key={i} className="w-[26px] h-[26px] text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87L8.91 8.26z" />
            </svg>
          );
        }
      })}
    </div>
  );
}
