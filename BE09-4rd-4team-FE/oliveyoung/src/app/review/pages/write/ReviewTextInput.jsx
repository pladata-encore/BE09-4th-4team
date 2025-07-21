export default function ReviewTextInput({ value, onChange }) {
  return (
    <div className="text-left" style={{ width: 512 }}>
      {/* 박스 바깥에 라벨 */}
      <label
        htmlFor="reviewText"
        className="block mb-2 font-semibold text-gray-800"
        style={{ width: 512 }}
      >
        솔직한 상품 리뷰를 남겨주세요
      </label>

      {/* 텍스트박스 및 안내문구 + 글자수 컨테이너 */}
      <div className="relative border rounded" style={{ width: 512, height: 230 }}>
        {/* 안내 문구 (텍스트박스 안에 겹침) */}
        {value === "" && (
          <p
            className="absolute text-xs text-gray-400 whitespace-pre-line pointer-events-none select-none"
            style={{
              top: "8px",
              left: "8px",
              right: "8px",
              lineHeight: "1.4rem",
              fontSize: "0.875rem",
            }}
          >
            꿀팁 가득. 상세한 리뷰를 작성해보세요! 도움수가 올라가면 포인트도 받고,
            {"\n"}탑리뷰어가 될 확률도 높아져요!{"\n"}
            반품,환불 관련 내용은 고객센터로 별도 문의해주세요.
          </p>
        )}

        {/* textarea */}
        <textarea
          id="reviewText"
          rows={5}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder=""
          className="resize-none focus:outline-blue-500 text-sm"
          style={{
            padding: "8px",
            border: "none",
            fontSize: "0.875rem",
            lineHeight: "1.4rem",
            boxSizing: "border-box",
            backgroundColor: "transparent",
            width: "100%",
            height: "100%",
          }}
          maxLength={1000}
        />

        {/* 글자 수 표시 - 우측 하단 고정 */}
        <p
          className="text-xs text-gray-500 select-none"
          style={{
            position: "absolute",
            bottom: "4px",
            right: "8px",
            userSelect: "none",
            backgroundColor: "white",
            padding: "0 4px",
          }}
        >
          {value.length} / 1000 글자
        </p>
      </div>
    </div>
  );
}
