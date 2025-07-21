'use client';

import React, { useState,useEffect } from 'react';
import axios from 'axios';
import NewCouponModal from '../../../components/NewCouponModal'; // 위치 확인 필수
import { PlusIcon, TrashIcon } from 'lucide-react';



export default function CouponsPage() {

// 날짜 포맷 함수 추가
  const formatDate = (datetime) => {
    return new Date(datetime).toISOString().split('T')[0]; // "2025-07-11"
  };

  const [coupons, setCoupons] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.get('http://localhost:8080/api/admin/coupons', {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ 올바른 템플릿 문자열
          "Content-Type": "application/json"
        },
      });

      setCoupons(response.data.data)
      } catch (error) {
      console.error('❌ 쿠폰 목록 조회 실패:', error);
    }
  };



  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleAdd = async (couponData) => {
    try {
      console.log("📦 보낼 couponData:", couponData); // 확인용
      const token = localStorage.getItem('accessToken');

      await axios.post('http://localhost:8080/api/admin/coupons', couponData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setShowModal(false);
      fetchCoupons();
    } catch (error) {
      console.error('❌ 쿠폰 등록 실패:', error);
    }
  };




  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/coupons/${id}`);
      fetchCoupons(); // 삭제 후 목록 갱신
    } catch (error) {
      console.error('❌ 쿠폰 삭제 실패:', error);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">쿠폰 관리</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#9BCC47] text-white px-4 py-2 rounded-md flex items-center"
        >
          <PlusIcon size={16} className="mr-1" />
          쿠폰 등록
        </button>
      </div>

      <div className="bg-white border rounded shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-gray-500 uppercase bg-gray-50">
              <th className="px-4 py-2">쿠폰명</th>
              <th className="px-4 py-2">할인율(%)</th>
              <th className="px-4 py-2">유효기간</th>
              <th className="px-4 py-2">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {coupons.map(c => (
              <tr key={c.id}>
                <td className="px-4 py-2">{c.name}</td>
                <td className="px-4 py-2">{c.discount}</td>
                <td className="px-4 py-2">{formatDate(c.validUntil)}</td>
                <td className="px-4 py-2">
                <button
                    onClick={() => handleDelete(c.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <NewCouponModal onAdd={handleAdd} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
