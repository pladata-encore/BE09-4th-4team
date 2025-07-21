export default function ReviewStats({ reviews }) {
  if (!reviews || reviews.length === 0) return null;

  // 각 항목별 빈도수 계산
  const skinType = {};
  const skinConcern = {};
  const texture = {};

  reviews.forEach((r) => {
    // skinType 빈도
    if (r.skinType) skinType[r.skinType] = (skinType[r.skinType] || 0) + 1;
    // skinConcern 빈도
    if (r.skinConcern) skinConcern[r.skinConcern] = (skinConcern[r.skinConcern] || 0) + 1;
    // texture 빈도
    if (r.texture) texture[r.texture] = (texture[r.texture] || 0) + 1;
  });

  // 그래프/리스트로 표현
  const renderSection = (title, obj) => (
    <div className="mb-4">
      <div className="font-bold">{title}</div>
      {Object.entries(obj).length === 0
        ? <div className="text-gray-400">데이터 없음</div>
        : Object.entries(obj).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span>{key}</span>
              <span>{value}명</span>
            </div>
          ))}
    </div>
  );

  return (
    <div className="grid grid-cols-3 gap-6 text-center">
      {renderSection("피부타입", skinType)}
      {renderSection("피부고민", skinConcern)}
      {renderSection("제형", texture)}
    </div>
  );
}
