// 예: src/app/layout.jsx
import "../../styles/globals.css"; // tailwind 등 공통 스타일

// src/app/product/layout.jsx
export default function Layout({ children }) {
  return (
    <> {/* 특정 컨테이너 요소가 필요 없다면 React Fragment (<>)를 사용합니다. */}
      {/* 여기에 헤더, 푸터, 내비게이션 등 공통 요소를 넣을 수 있습니다. */}
      <main>{children}</main> {/* 페이지 콘텐츠는 일반적으로 <main> 태그 안에 들어갑니다. */}
    </>
  );
}