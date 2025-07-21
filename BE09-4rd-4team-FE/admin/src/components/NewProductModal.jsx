"use client";
import React, { useState,useEffect } from 'react';
import axios from "axios";



export default function NewProductModal({ onClose, onAdd }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');
  const [brandId, setBrandId] = useState('');
  const [status, setStatus] = useState('');
  const [brandList, setBrandList] = useState([]);


  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axios.get("http://localhost:8080/admin/brands");
        setBrandList(res.data); // brand_id, brand_name
      } catch (error) {
        console.error("❌ 브랜드 불러오기 실패:", error);
        setBrandList([]);
      }
    };
    fetchBrands();
  }, []);





  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      name,
      category,
      stock: Number(stock),
      price: `₩ ${price.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
      status,
      brandId: Number(brandId),
    });

  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-xl font-bold">상품 등록</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            type="text"
            placeholder="상품명"
            className="w-full p-2 border rounded"
            required
          />
          <select
              value={brandId}
              onChange={e => setBrandId(e.target.value)}
              className="w-full p-2 border rounded"
              required
          >
            <option value="">브랜드 선택</option>
            {brandList
                .filter(brand => brand && brand.brand_id !== undefined)
                .map(brand => (
                    <option key={brand.brand_id} value={brand.brand_id}>
                      {brand.brand_name}
                    </option>
            ))}
          </select>
          <input
            value={category}
            onChange={e => setCategory(e.target.value)}
            type="text"
            placeholder="카테고리"
            className="w-full p-2 border rounded"
            required
          />
          <input
            value={stock}
            onChange={e => setStock(e.target.value)}
            type="number"
            placeholder="상품 수량"
            className="w-full p-2 border rounded"
            required
          />
          <input
            value={price}
            onChange={e => setPrice(e.target.value)}
            type="text"
            placeholder="가격 (숫자만 입력)"
            className="w-full p-2 border rounded"
            required
          />
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">상태</option>
            <option value="판매중">판매중</option>
            <option value="품절임박">품절임박</option>
            <option value="품절">품절</option>
          </select>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#9BCC47] text-white rounded"
            >
              등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
