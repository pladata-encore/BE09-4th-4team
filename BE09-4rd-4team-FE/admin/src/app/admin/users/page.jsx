"use client";

import axios from 'axios';
import React, { useState, useEffect} from 'react';
import { SearchIcon, UserPlusIcon, EyeIcon } from 'lucide-react';
import NewAdminModal from '../../../components/NewAdminModal'; // 위치 확인 필수


export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [joinDateFilter, setJoinDateFilter] = useState('');
  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [users, setUsers] = useState([]);



  /*const [users,setUsers] = useState([
    { id: 3, name: '박서연', email: 'seoyeon@example.com', phone: '010-3456-7890', joinDate: '2023-03-10', orders: 5, status: '활성' },
    { id: 4, name: '최준호', email: 'junho@example.com', phone: '010-4567-8901', joinDate: '2023-01-05', orders: 15, status: '활성' },
    { id: 5, name: '정민지', email: 'minji@example.com', phone: '010-5678-9012', joinDate: '2023-04-22', orders: 3, status: '활성' },
    { id: 6, name: '송지원', email: 'jiwon@example.com', phone: '010-6789-0123', joinDate: '2023-02-14', orders: 7, status: '비활성' },
    { id: 7, name: '윤도현', email: 'dohyun@example.com', phone: '010-7890-1234', joinDate: '2023-03-30', orders: 4, status: '활성' },
    { id: 8, name: '장서영', email: 'seoyoung@example.com', phone: '010-8901-2345', joinDate: '2023-01-25', orders: 10, status: '활성' },
    { id: 9, name: '이민준', email: 'minjun@example.com', phone: '010-9012-3456', joinDate: '2023-04-18', orders: 2, status: '비활성' },
    { id: 10, name: '한소희', email: 'sohee@example.com', phone: '010-0123-4567', joinDate: '2023-05-01', orders: 1, status: '활성' }
  ]);*/


  // 신규 관리자 등록 핸들러
  const handleAddAdmin = async (formData) => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await axios.post(
          'http://localhost:8080/api/admin/users/create-admin',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
      );
      alert("✅ 관리자 등록 성공!");
      await fetchAdmins();
      setCurrentPage(1);
    } catch (error) {
      console.error("❌ 관리자 등록 실패:", error.response?.data || error.message);
      alert("등록 실패: " + (error.response?.data?.message || '서버 오류'));
      throw error; // ❗ 반드시 필요
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  //관리자 전체 목록 조회
  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:8080/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ 관리자 응답:", response.data); // 👈 이거 찍어보세요
      setUsers(response.data.data); // ✅ 핵심 수정: 배열만 전달
    } catch (error) {
      console.error("❌ 관리자 목록 조회 실패:", error.response?.data || error.message);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = true; // 현재 응답엔 status 없음
    const matchesJoinDate = joinDateFilter ? user.createdAt === joinDateFilter : true;
    return matchesSearch && matchesStatus && matchesJoinDate;
  });


  // 페이지네이션
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
};


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">관리자 관리</h1>
        <button className="bg-[#9BCC47] text-white px-4 py-2 rounded-md flex items-center" onClick={()=> setShowModal(true)}>
          <UserPlusIcon size={16} className="mr-1" />
          신규 관리자 등록
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="relative w-full md:w-72">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9BCC47] focus:border-transparent"
                placeholder="이름 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon size={18} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            <div className="flex items-center space-x-2">
              <button className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-md">
                <div size={16} className="mr-1" />
                필터
              </button>
              <select className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#9BCC47] focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">회원상태</option>
                <option value="활성">활성</option>
                <option value="비활성">비활성</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#9BCC47] focus:border-transparent"
              value={joinDateFilter}
              onChange={(e) => setJoinDateFilter(e.target.value)}>
                <option value="">가입일순</option>
                <option value="최근가입순">최근가입순</option>
                <option value="오래된순">오래된순</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
            <tr className="text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50">
              <th className="px-6 py-3">회원명</th>
              <th className="px-6 py-3">이메일</th>
              <th className="px-6 py-3">전화번호</th>
              <th className="px-6 py-3">가입일</th>
              <th className="px-6 py-3">관리</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
            {paginatedUsers.map((user, index) => (
                <tr key={user.userId || index} className="text-sm">
                  <td className="px-6 py-4 font-medium text-gray-900">{user.userName}</td>
                  <td className="px-6 py-4 text-gray-700">{user.email}</td>
                  <td className="px-6 py-4 text-gray-700">{user.phone}</td>
                  <td className="px-6 py-4 text-gray-700">{user.createdAt?.split("T")[0]}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                          className="text-[#9BCC47] hover:text-[#8ab93f]"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDetail(true);
                          }}
                      >
                        <EyeIcon size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
            ))}
            </tbody>

          </table>
        </div>

        {/* …테이블 아래에 붙이는 페이징… */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            총 <span className="font-medium">{filteredUsers.length}</span>명 회원 중{' '}
            <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>-
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
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

            {Array.from({length: totalPages}, (_, i) => (
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

        {showDetail && selectedUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="p-6 space-y-4 bg-white rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold">회원 상세</h2>
                <p><strong>회원명:</strong> {selectedUser.userName}</p>
                <p><strong>이메일:</strong> {selectedUser.email}</p>
                <p><strong>전화번호:</strong> {selectedUser.phone}</p>
                <p><strong>가입일:</strong> {selectedUser.createdAt?.split("T")[0]}</p>
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
      {showModal && (
        <NewAdminModal
          onAdd={handleAddAdmin}
          onClose={() => setShowModal(false)}
          showModal={showModal}
        />
      )}
    </div>
  );
}
