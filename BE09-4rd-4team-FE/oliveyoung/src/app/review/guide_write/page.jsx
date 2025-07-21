import MyPageLayout from "@/app/mypage/layout";
import ReviewTabs from "../pages/guide/ReviewTabs";
import ReviewWriteSection from "../pages/guide/ReviewWriteSection";
import UserInfoBox from "@/app/mypage/user/components/UserInfoBox";

export default function ReviewWritePage() {
  return (
    <MyPageLayout>
      <div className="px-3">
        <UserInfoBox />
      </div>
      {/* 리뷰 작성 섹션 */}
      <div className="max-w-4xl mx-auto">
        <ReviewWriteSection />
      </div>
    </MyPageLayout>
  );
}
