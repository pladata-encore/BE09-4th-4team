export default function ReviewSkinTypeSection({ value, onChange }) {
  const options = ["건성", "복합성", "지성"];

  return (
    <div>
      <p className="mb-2 font-medium text-semibold">어떤 피부타입에 사용하면 좋은가요?</p>
      <div className="flex gap-4">
        {options.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <input
              type="radio"
              name="skinType"
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
              {/* 체크 표시: 선택 시만 보여짐 */}
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
              {opt}에 좋아요
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
