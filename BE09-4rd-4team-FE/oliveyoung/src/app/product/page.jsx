import CategorySidebar from './components/CategorySidebar';
import CategoryCarousel from './components/CategoryCarousel';
import BannerCarousel from './components/BannerCarousel';
import BestProductList from './components/BestProductList';
import ProductCarousel from './components/ProductCarousel';

export default function Main() {
  return (
    <div className="flex justify-center w-full bg-white">
      <div className="flex flex-row w-[1020px] mx-auto">

        {/* 왼쪽 카테고리 */}
        <CategorySidebar />

        {/* 오른쪽 컨텐츠 */}
        <div className="flex flex-col w-[770px]">

          {/* 카테고리 슬라이드 */}
          <div className="py-6">
            <CategoryCarousel />
          </div>

          {/* 배너 */}
          <div>
            <BannerCarousel />
          </div>

          {/* BEST 상품 */}
          <BestProductList />

          {/* 중간 배너/상품 캐러셀 */}
          <div className="my-6">
            <ProductCarousel />
          </div>
        </div>
      </div>
    </div>
  );
}