// ReviewProductHeader.jsx
import { getImageUrl } from "@/utils/image";

export default function ReviewProductHeader({ data }) {
  if (!data) return null;
  const { brandName, productName, imageUrl } = data;
  const imgSrc = getImageUrl(imageUrl);

  return (
    <div className="flex items-center gap-4 mb-3">
      <img
        src={imgSrc}
        alt={brandName}
        className="w-[70px] h-[70px] object-cover rounded border"
      />
      <div>
        <div className="text-xs text-gray-500">{brandName}</div>
        <div className="text-sm font-semibold mt-1">{productName}</div>
      </div>
    </div>
  );
}
