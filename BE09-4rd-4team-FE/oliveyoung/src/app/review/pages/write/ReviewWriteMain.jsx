"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import ReviewProductHeader from "./ReviewProductHeader";
import ReviewRatingSection from "./ReviewRatingSection";
import ReviewSkinTypeSection from "./ReviewSkinTypeSection";
import ReviewCleansingSection from "./ReviewCleansingSection";
import ReviewIrritationSection from "./ReviewIrritationSection";
import ReviewPointNotice from "./ReviewPointNotice";
import ReviewTextInput from "./ReviewTextInput";
import ReviewWriteButtons from "./ReviewWriteButton";

const dashedLineStyle = {
  border: "none",
  borderBottom: "1px dashed #D1D5DB",
  borderImage:
    "repeating-linear-gradient(to right, #D1D5DB 0, #D1D5DB 4px, transparent 4px, transparent 8px) 1",
};

export default function ReviewWriteLayout({
  orderItemId,
  onClose,
  onReviewSuccess, // ⭐️ 반드시 props로 받기
  review,
  mode = "create",
  showCloseButton = false, // 기본값 false
}) {
  // review가 있을 때는 기존 값을 state 초기값으로!
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(review?.rating || 0);
  const [skinType, setSkinType] = useState(review?.skinType || "");
  const [skinConcern, setSkinConcern] = useState(review?.skinConcern || "");
  const [texture, setTexture] = useState(review?.texture || "");
  const [content, setContent] = useState(review?.content || "");

  // 상품 정보 불러오기 (수정 모드/등록 모드 모두 대응)
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("http://localhost:8080/api/orders", {
          headers: { ...(token && { Authorization: `Bearer ${token}` }) },
        });
        // 주문 전체 펼치기
        const orders = res.data;
        const flatItems = Array.isArray(orders)
          ? orders.flatMap((order) =>
              order.orderItems.map((item) => ({
                ...item,
                orderId: order.orderId,
                createdAt: order.createdAt,
                status: order.status,
              }))
            )
          : [];

        // 전체 orderItem 목록 콘솔 출력
        console.log(
          "orderItems 전체:",
          flatItems.map((item) => ({
            orderItemId: item.orderItemId,
            hasReview: item.hasReview,
          }))
        );

        // 선택한 orderItem도 콘솔 출력
        const found = flatItems.find(
          (item) => String(item.orderItemId) === String(orderItemId)
        );
        if (found) {
          console.log(
            "선택된 orderItem:",
            found.orderItemId,
            "hasReview:",
            found.hasReview
          );
          setProduct(found);
        } else {
          // ⭐️ [수정모드] orderItemId 매칭이 안될 경우에도 리뷰 정보로 폼 세팅
          if (mode === "edit" && review) {
            setProduct({
              productId: review.productId,
              productName: review.productName,
              brandName: review.brandName,
              imageUrl: review.imageUrl,
              orderItemId: review.orderItemId,
            });
          } else {
            alert("상품 정보를 찾을 수 없습니다.");
          }
        }
      } catch (err) {
        // [수정모드] 주문 내역 조회 불가시에도 리뷰 정보로 폼 세팅
        if (mode === "edit" && review) {
          setProduct({
            productId: review.productId,
            productName: review.productName,
            brandName: review.brandName,
            imageUrl: review.imageUrl,
            orderItemId: review.orderItemId,
          });
        } else {
          alert("상품 정보를 불러오는 중 오류 발생");
        }
      }
    };

    if (orderItemId) fetchProduct();
    // [추가] orderItemId 없고 수정모드라면 review로 세팅
    else if (mode === "edit" && review) {
      setProduct({
        productId: review.productId,
        productName: review.productName,
        brandName: review.brandName,
        imageUrl: review.imageUrl,
        orderItemId: review.orderItemId,
      });
    }
  }, [orderItemId, mode, review]);

  // product가 바뀔 때마다 콘솔 출력
  useEffect(() => {
    if (product) {
      console.log("product:", product);
      console.log(
        "hasReview:",
        product.hasReview,
        "orderItemId:",
        product.orderItemId
      );
    }
  }, [product]);

  // 등록/수정 구분
  const handleSubmit = async () => {
    const token = localStorage.getItem("accessToken");
    if (!product) {
      alert("상품 정보가 없습니다.");
      return;
    }

    const payload = {
      content,
      rating,
      skinType,
      skinConcern,
      texture,
      orderItemId: product.orderItemId,
    };

    try {
      if (mode === "edit" && review) {
        // **수정 요청**
        await axios.put(
          `http://localhost:8080/api/reviews/${review?.reviewId}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );
        alert("리뷰 수정 성공!");
        onClose();
      } else {
        // **신규 등록**
        const res = await axios.post(
          `http://localhost:8080/api/products/${product?.productId}/reviews`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );
        const result = res.data;
        if (result.success) {
          alert("리뷰 등록 성공!");
          if (onReviewSuccess) onReviewSuccess(product.orderItemId); // ⭐️ 반드시 호출
          onClose();
        } else {
          alert("등록 실패: " + (result.message || "에러 발생"));
        }
      }
    } catch (err) {
      alert("서버 오류: " + (err.response?.data?.message || "에러 발생"));
    }
  };

  if (!product) {
    return (
      <div className="p-10 text-center text-gray-500">
        상품 정보를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="w-full max-w-[600px] mx-auto bg-white py-10 px-1 ">
      {/* X 버튼 - showCloseButton이 true일 때만 보임 */}
      {showCloseButton && (
        <button
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-2xl"
          aria-label="닫기"
          onClick={onClose}
          type="button"
        >
          &times;
        </button>
      )}

      {/* 제목 - 상단 간격 mt-6, 아래 mb-8 */}
      <h2 className="text-[27px] font-bold mb-4  text-left">
        {mode === "edit" ? "리뷰 수정" : "리뷰 작성"}
      </h2>
      <hr className="mb-7 mt-3" />

      <ReviewProductHeader data={product} />
      <ReviewRatingSection value={rating} onChange={setRating} />
      <hr style={dashedLineStyle} className="my-6" />
      <ReviewSkinTypeSection value={skinType} onChange={setSkinType} />
      <hr style={dashedLineStyle} className="my-6" />
      <ReviewCleansingSection value={skinConcern} onChange={setSkinConcern} />
      <hr style={dashedLineStyle} className="my-6" />
      <ReviewIrritationSection value={texture} onChange={setTexture} />
      <br className="my-6" />

      <ReviewPointNotice />
      <br className="my-6" />
      <div className="-mx-1">
      <ReviewTextInput value={content} onChange={setContent} />
      </div>
      <br className="my-6" />

      {/* 버튼 영역 */}
      <div className="mx-4 mt-7 flex gap-3">
        <button
          className="flex-1 py-3 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200"
          onClick={onClose}
          type="button"
        >
          닫기
        </button>
        <button
          className="flex-1 py-3 rounded bg-green-500 text-white font-semibold hover:bg-green-600"
          onClick={handleSubmit}
          type="button"
        >
          {mode === "edit" ? "리뷰 수정하기" : "리뷰 등록하기"}
        </button>
      </div>

      {/* 안내 문구 */}
      <div
        className="w-[560px] h-auto -mx-10 mt-10 bg-gray-100 rounded text-sm text-gray-700 leading-relaxed break-words"
        style={{ padding: "18px 40px" }}
      >
        <ul className="list-disc list-outside space-y-2">
          <li>
            게시된 리뷰의 권리와 책임은 게시당사자에게 있으며, 올리브영은
            이용자가 작성한 리뷰 등을 이용하여 서비스 운영 등에 활용할 수
            있습니다. 이 때 리뷰는 모두 공개를 원칙으로 하며, 공개의 방법은
            올리브영의 서비스 정책에 따라 변경될 수 있습니다.
          </li>
          <li>
            작성된 리뷰에 매월 1일~말일 기준으로 받은 ‘도움이 돼요’ 수 X5P가
            익월 10일 지급됩니다. (ID 기준 월 최대 2,000P)
            <br />
            (단, 포인트 지급 후 ‘도움이 돼요’ 취소 시 지급도 지급일에 차감)
          </li>
          <li>
            결제기준 상품 구매금액이 2,000원 미만인 경우에는 리뷰 등록 보상
            포인트를 지급하지 않습니다.
          </li>
          <li>
            리뷰 삭제는 작성 후 3일 이내에만 가능합니다. (마이페이지 &gt; 리뷰
            &gt; 나의리뷰)
          </li>
          <li>
            <span className="font-semibold">
              [식품 등의 표시·광고에 대한 법률]
            </span>
            을 준수하고 아래와 같은 표현은 리뷰를 지양하고 있으며, 아래의 기준에
            해당하는 리뷰는 별도의 안내 없이 블라인드 처리됩니다.
            <ul className="list-disc ml-6 mt-1 space-y-1">
              <li>
                의약품의 효능을 지니거나 질병치료 효과를 준시라거나 암시하는
                표현
              </li>
              <li>일반식품을 건강기능식품으로 오인하게 하는 표현</li>
              <li>사실과 다르거나, 과학적으로 근거 없는 추정적인 표현</li>
            </ul>
          </li>
          <li>
            체험단, 마케팅 대행사 또는 외부 플랫폼 등을 통해 상품을 구매하고
            리뷰 작성 or 구매대금의 전부 또는 일부를 할인받는 등 경제적
            이해관계가 존재할 경우 반드시 게시물의 제목 또는 첫 부분에서 경제적
            이해관계를 공개해야 하며, 이를 공개하지 않거나 사실로 확인되지나
            합리적으로 의심시 별도의 안내 없이 블라인드 처리됩니다.
          </li>
        </ul>
      </div>
    </div>
  );
}
