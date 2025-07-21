// src/app/product/skintoner/[productId]/page.jsx

"use client";

import ProductPage from "./components/ProductPage";
import { useParams } from "next/navigation";

export default function ProductDynamicPage() {
  const { productId } = useParams();

  return (
    <div className="w-full max-w-[1020px] mx-auto">
      <ProductPage productId={productId} />
    </div>
  );
}