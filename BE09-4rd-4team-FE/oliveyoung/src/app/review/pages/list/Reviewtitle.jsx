"use client";
import { useState } from "react";
import ReviewList from "./ReviewList";
import ReviewItem from "./ReviewItem";
export default function ReviewTabExample() {
  const [selected, setSelected] = useState("general");

  return (
    <>
      <div className="w-[792px] h-[49px] flex items-center gap-[28px] mb-6">
        <h2
          onClick={() => setSelected("general")}
          className={`w-[73.6px] h-[49px] flex items-center justify-center text-[18px] font-semibold cursor-pointer bg-transparent ${
            selected === "general" ? "text-black" : "text-gray-400"
          }`}
        >
          일반 리뷰
        </h2>
      </div>
      <div className="w-[802px] h-auto padding-[24px]">
        <ReviewList />
        <ReviewItem />
      </div>
    </>
  );
}
