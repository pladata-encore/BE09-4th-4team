
import { getImageUrl } from "@/utils/image";
const imageUrl = getImageUrl("review/review1.jpg");
const imageUrl2 = getImageUrl("review/review2.jpg");
export default function ReviewTipImages() {
  const tipImages = [imageUrl, imageUrl2];

  return (
    <div className="space-y-2 flex flex-col">
      <p className="font-semibold text-sm text-gray-800 text-left w-full max-w-sm">
        리뷰 작성 TIP
      </p>

      <div className="flex flex-col items-center">
        <div className="flex flex-wrap justify-center gap-2">
          {tipImages.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`TIP 이미지 ${index + 1}`}
              className="w-[132px] h-[132px] object-cover rounded"
            />
          ))}
        </div>

        <p className="text-xs text-gray-500 text-center max-w-sm mt-2">
          제형이나 클렌징력을 알 수 있도록 세안 중인 모습과
          <br />
          깨끗하게 클렌징된 얼굴을 보여주세요
        </p>
      </div>
    </div>
  );
}
