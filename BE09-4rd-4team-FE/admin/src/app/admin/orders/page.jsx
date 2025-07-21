"use client";
import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { SearchIcon, EyeIcon, DownloadIcon } from 'lucide-react';


export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [orders, setOrders] = useState([]);

  // const orders = [
  //   { id: 'OD-7892', customer: '김지민', date: '2023-05-12', total: '₩ 56,000', payment: '카드결제', status: '배송완료' },
  //   { id: 'OD-7891', customer: '이하준', date: '2023-05-12', total: '₩ 128,000', payment: '카드결제', status: '배송중' },
  //   { id: 'OD-7890', customer: '박서연', date: '2023-05-11', total: '₩ 32,500', payment: '무통장입금', status: '결제완료' },
  //   { id: 'OD-7889', customer: '최준호', date: '2023-05-11', total: '₩ 77,000', payment: '카카오페이', status: '주문접수' },
  //   { id: 'OD-7888', customer: '정민지', date: '2023-05-10', total: '₩ 45,000', payment: '카드결제', status: '배송완료' },
  //   { id: 'OD-7887', customer: '송지원', date: '2023-05-10', total: '₩ 62,000', payment: '네이버페이', status: '배송중' },
  //   { id: 'OD-7886', customer: '윤도현', date: '2023-05-09', total: '₩ 24,000', payment: '카드결제', status: '배송완료' },
  //   { id: 'OD-7885', customer: '장서영', date: '2023-05-09', total: '₩ 88,000', payment: '카드결제', status: '취소요청' },
  //   { id: 'OD-7884', customer: '이민준', date: '2023-05-08', total: '₩ 35,500', payment: '카드결제', status: '배송완료' },
  //   { id: 'OD-7883', customer: '한소희', date: '2023-05-08', total: '₩ 146,000', payment: '무통장입금', status: '결제대기' }
  // ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.error('❌ accessToken이 없습니다. 로그인 상태를 확인하세요.');
          return;
        }

        const response = await axios.get('http://localhost:8080/api/admin/orders', {
          headers: {
            Authorization: `Bearer ${token}`, // 토큰을 헤더에 포함
          },
        });

        setOrders(response.data);
      } catch (error) {
        console.error('❌ 주문 목록 불러오기 실패:', error);
      }
    };

    fetchOrders();
  }, []);


  // 필터링된 주문 목록
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
        order.id.includes(searchTerm) || order.customer.includes(searchTerm);
    const matchesPayment = paymentFilter === '' || order.payment === paymentFilter;
    const matchesStatus = statusFilter === '' || order.status === statusFilter;

    return matchesSearch && matchesPayment && matchesStatus;
  });

  // 페이지네이션
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const downloadCSV = () => {
    const headers = ['주문번호', '고객명', '주문일자', '주문금액', '결제방법', '주문상태'];
    const dataRows = orders.map(order => [order.id, order.customer, order.date, order.total, order.payment, order.status]);
    const csvContent = ['\uFEFF' + headers.join(','), ...dataRows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '올리브영_주문목록.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">주문 관리</h1>
          <button onClick={downloadCSV} className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            <DownloadIcon size={16} className="mr-1" />
            엑셀 다운로드
          </button>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div className="relative w-full md:w-72">
                <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9BCC47] focus:border-transparent"
                    placeholder="주문번호 또는 고객명 검색..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <SearchIcon size={18} className="absolute left-3 top-2.5 text-gray-400" />
              </div>
              <div className="flex items-center space-x-2">
                <button className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-md">
                  <div className="mr-1" />
                  필터
                </button>
                <select className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#9BCC47] focus:border-transparent" value ={paymentFilter} onChange={e => setPaymentFilter(e.target.value)}>
                  <option value= "">결제방법</option>
                  <option value= "카드결제">카드결제</option>
                  <option value= "무통장입금">무통장입금</option>
                  <option value= "카카오페이">카카오페이</option>
                  <option value= "네이버페이">네이버페이</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#9BCC47] focus:border-transparent" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="">주문상태</option>
                  <option value="결제대기">결제대기</option>
                  <option value="결제완료">결제완료</option>
                  <option value="주문접수">주문접수</option>
                  <option value="배송중">배송중</option>
                  <option value="배송완료">배송완료</option>
                  <option value="취소요청">취소요청</option>
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
              <tr className="text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                <th className="px-6 py-3">주문번호</th>
                <th className="px-6 py-3">고객명</th>
                <th className="px-6 py-3">주문일자</th>
                <th className="px-6 py-3">주문금액</th>
                <th className="px-6 py-3">결제방법</th>
                <th className="px-6 py-3">주문상태</th>
                <th className="px-6 py-3">상세보기</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
              {paginatedOrders.map(order => (
                  <tr key={order.id} className="text-sm">
                    <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 text-gray-700">{order.customer}</td>
                    <td className="px-6 py-4 text-gray-700">{order.date}</td>
                    <td className="px-6 py-4 text-gray-700">{order.total}</td>
                    <td className="px-6 py-4 text-gray-700">{order.payment}</td>
                    <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                        order.status === '배송완료' ? 'bg-green-100 text-green-800' :
                            order.status === '배송중' ? 'bg-blue-100 text-blue-800' :
                                ['결제완료', '주문접수'].includes(order.status) ? 'bg-yellow-100 text-yellow-800' :
                                    order.status === '취소요청' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-[#9BCC47] hover:text-[#8ab93f]" onClick={() => {
                        setSelectedOrder(order);
                        setShowDetail(true);
                      }}>
                        <EyeIcon size={18} />
                      </button>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
          {/* 페이지네이션 */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              총 <span className="font-medium">{filteredOrders.length}</span>개 주문 중{' '}
              <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>-
              <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filteredOrders.length)}
            </span>{' '}
              표시
            </div>
            <div className="flex space-x-1">
              <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md"
              >
                이전
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                  <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-3 py-1 text-sm rounded-md ${
                          currentPage === i + 1
                              ? 'bg-[#9BCC47] text-white'
                              : 'border border-gray-300'
                      }`}
                  >
                    {i + 1}
                  </button>
              ))}

              <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md"
              >
                다음
              </button>
            </div>
          </div>


          {/* 상세보기 모달 */}
          {showDetail && selectedOrder && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="p-6 space-y-4 bg-white rounded-lg shadow-lg w-96">
                  <h2 className="text-xl font-bold">주문 상세</h2>
                  <p><strong>주문번호:</strong> {selectedOrder.id}</p>
                  <p><strong>고객명:</strong> {selectedOrder.customer}</p>
                  <p><strong>주문일자:</strong> {selectedOrder.date}</p>
                  <p><strong>주문금액:</strong> {selectedOrder.total}</p>
                  <p><strong>결제방법:</strong> {selectedOrder.payment}</p>
                  <p><strong>주문상태:</strong> {selectedOrder.status}</p>
                  <div className="flex justify-end">
                    <button
                        onClick={() => setShowDetail(false)}
                        className="px-4 py-2 bg-[#9BCC47] text-white rounded hover:bg-[#8ab93f]"
                    >
                      닫기
                    </button>
                  </div>
                </div>
              </div>
          )}
        </div>
      </div>
  );
}