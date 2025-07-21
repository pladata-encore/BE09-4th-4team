// ReviewCleansingSection.jsx
export default function ReviewCleansingSection({ value, onChange }) {
  const options = ["아주 만족해요", "보통이에요", "다소 아쉬워요"];

  return (
    <div>
      <p className="mb-2 font-medium">상품의 세정력이 마음에 드세요?</p>
      <div className="flex gap-4">
        {options.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <input
              type="radio"
              name="cleansing"
              checked={value === opt}
              onChange={() => onChange(opt)}
              className="hidden"
            />
            {/* 커스텀 라디오 */}
            <span
              className={`relative w-8 h-8 flex items-center justify-center rounded-full
                border-2 ${value === opt ? "bg-[#0CC7B8] border-[#0CC7B8]" : "bg-white border-gray-400"}
              `}
            >
              {value === opt && (
                <svg
                  className="absolute w-5 h-5 text-white pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            <span
              className={`text-sm font-semibold ${
                value === opt ? "text-[#0CC7B8]" : "text-gray-700"
              }`}
            >
              {opt}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
