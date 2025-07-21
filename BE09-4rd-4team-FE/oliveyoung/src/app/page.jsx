'use client';

import { useEffect, useState } from 'react';
import CustomerSupportSection from './main/CustomerSupportSection';
import MainBanner from './main/MainBanner';
import ProductCarouselSlider from './main/ProductCarouselSlider';
import ProductRecommendationSection from './main/RecommendationSection';
import { getImageUrl } from '@/utils/image';

// 변환 함수: API 데이터 → UI 형태로 변환
const convertProduct = (p) => ({
  image: getImageUrl(p.imageUrl),
  title: p.productName || p.title || p.name, // <- API 컬럼명에 맞춤
  originalPrice: p.originalPrice,
  discountPrice: p.discountedPrice || p.discountPrice, // <- 둘 다 체크
  labels: p.badgeNames || p.labels || p.badge || [], // <- 핵심! (badgeNames 기준)
});

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/products');
        if (!res.ok) throw new Error('상품 조회 실패');
        const result = await res.json();
        // ✅ 여기서 변환
        const converted = result.map(convertProduct);
        setProducts(converted);
        // 개발용 콘솔 출력
        converted.forEach((p, i) => {
          console.log(`[${i}] ${p.title} / labels:`, p.labels);
        });
      } catch (e) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (!products.length) return <div>상품이 없습니다.</div>;

  return (
    <div className="container px-4 mx-auto">
      <MainBanner />
      <ProductRecommendationSection
        leftTitle="요즘 주목 받는 상품"
        rightTitle="고객님을 위한 추천 상품"
        leftProducts={products.slice(0, 10)}
        rightProducts={products.slice(10, 20)}
      />
      <ProductCarouselSlider title="이 상품 어때요?" products={products.slice(0, 16)} />
      <CustomerSupportSection />
    </div>
  );
}
