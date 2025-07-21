import ReviewTabs from "./ReviewTabs"
import ReviewPointGuide from "./ReviewPointGuide"
import Reviewtitle from "../list/Reviewtitle"
export default function ReviewWriteSection() {
    return (
      <div className="w-[850px] px-6 py-8">
        <h2 className="text-2xl font-semibold mb-6">리뷰</h2>
        <ReviewTabs />
        <div className="mt-6 text-gray-600 text-sm leading-relaxed space-y-2">
          <p>
            • 리뷰는 배송 완료 후 90일 내 작성할 수 있습니다. (매장 구매는 CJ ONE
            포인트 적립 및 결제 완료 시)
          </p>
          <p>
            • 탑리뷰어는 리뷰 포인트 2배 지급 (최대 2,000P. 탈리뷰어로 선정된 기간
            작성한 리뷰 대상)
          </p>
          <p>
            • 리뷰 작성 포인트는 리뷰 작성 4일 뒤, 최대 혜택 기준으로 지급되며
            중복 지급되지 않습니다.
          </p>
        </div>
        <ReviewPointGuide />
        <br />
        <Reviewtitle />
      </div>
    );
  }
