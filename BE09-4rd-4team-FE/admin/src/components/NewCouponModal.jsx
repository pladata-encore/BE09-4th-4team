"use client";
import React, { useState } from 'react';

export default function NewCouponModal({ onAdd, onClose }) {
  const [name, setName] = useState('');
  const [discount, setDiscount] = useState('');
  const [validUntil, setValidUntil] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validUntil) {
      alert("유효기간을 입력해주세요.");
      return;
    }

    try {
      const validUntilISO = `${validUntil}T00:00:00`; // 💥 중요: LocalDateTime 형식으로 맞추기

      const couponData = {
        name,
        discount: Number(discount),
        validUntil: validUntilISO, // ← 여기 수정됨
        userId: null,
      };

      await onAdd(couponData);
    } catch (error) {
      console.error("❌ 쿠폰 등록 실패:", error);
    }
  };

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-xl font-bold">신규 쿠폰 등록</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                placeholder="쿠폰명"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2 border rounded"
                required
            />
            <input
                type="number"
                placeholder="할인율(%)"
                value={discount}
                onChange={e => setDiscount(e.target.value)}
                className="w-full p-2 border rounded"
                required
            />
            <input
                type="date"
                value={validUntil}
                onChange={e => setValidUntil(e.target.value)}
                className="w-full p-2 border rounded"
                required
            />
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
                취소
              </button>
              <button type="submit" className="px-4 py-2 bg-[#9BCC47] text-white rounded">
                등록
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}
