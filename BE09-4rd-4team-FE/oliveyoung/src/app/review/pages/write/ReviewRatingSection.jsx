const StarIcon = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? "#EF4444" : "none"}
    stroke={filled ? "#EF4444" : "#D1D5DB"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-[30px] h-[29px] rounded-md"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
  </svg>
);

export default function ReviewRatingSection({ value, onChange }) {
  return (
    <div className="flex items-center gap-12">
      <p className="font-medium whitespace-nowrap">상품은 어떠셨나요?</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            onClick={() => onChange(i)}
            className="cursor-pointer"
          >
            <StarIcon filled={value >= i} />
          </span>
        ))}
      </div>
    </div>
  );
}
