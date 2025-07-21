"use client";

import React, {useEffect, useState} from 'react';
import { PlusIcon, SearchIcon, TrashIcon, DownloadIcon } from 'lucide-react';
import NewProductModal from '../../../components/NewProductModal';
import {getImageUrl} from "../utils/image";



export default function ProductsPage() {
const [searchTerm, setSearchTerm] = useState('');
const [showModal, setShowModal] = useState(false);
const [categoryFilter, setCategoryFilter] = useState('');
const [statusFilter, setStatusFilter] = useState('');
const [currentPage, setCurrentPage] = useState(1);
const [products, setProducts] = useState([]);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/products`);
        if (!response.ok) {
          throw new Error('상품 정보를 불러오지 못했습니다.');
        }
        const data = await response.json();
        const mappedData = data.map(p => ({
          id: p.productId,
          imageUrl: p.imageUrl,
          name: p.productName,
          brand: p.brandName,
          category: p.categoryName,
          stock: p.stock,
          price: `₩ ${p.discountedPrice ? p.discountedPrice.toLocaleString() : '0'}`,
          status: p.state,
          createdAt: p.createdAt
        }));
        setProducts(mappedData);
      } catch (error) {
        console.error('상품 가져오기 오류 ', error);
      }
    };

    fetchProducts();
  }, []);


// 필터링된 상품 목록
const filteredProducts = products.filter((product) => {
  const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
  const matchesStatus = statusFilter ? product.status === statusFilter : true;
  return matchesSearch && matchesCategory && matchesStatus;
});

// 페이지네이션
const itemsPerPage = 5;
const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
);

const handlePageChange = (page) => {
  if (page >= 1 && page <= totalPages) {
    setCurrentPage(page);
  }
};

const handleDelete = (id) => {
  setProducts(prev => prev.filter(p => p.id !== id));
  // 만약 삭제 후 페이지가 비면 이전 페이지로 이동:
  const maxPage = Math.ceil((products.length - 1) / itemsPerPage);
  if (currentPage > maxPage) setCurrentPage(maxPage);
};

const handleAddProduct = async (newProduct) => {
  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productName: newProduct.name,
        brandId: newProduct.brandId,
        categoryName: newProduct.category,
        stock: Number(newProduct.stock),
        originalPrice: Number(newProduct.price.replace(/[^0-9]/g, '')),
        discountedPrice: Number(newProduct.discountedPrice) || 0,
        imageUrl: 'https://example.com/image.jpg',
        description: newProduct.description ?? '',
        state: newProduct.status,
      }),
    });

    if (!response.ok) {
      throw new Error('상품 등록 실패');
    }

    const fetchResponse = await fetch('/api/products');
    const data = await fetchResponse.json();
    const mappedData = data.map(p => ({
      id: p.productId,
      imageUrl: p.imageUrl,
      name: p.productName,
      brand: p.brandName,   // <-- 동일
      category: p.categoryName,
      stock: p.stock,
      price: `₩ ${p.discountedPrice ? p.discountedPrice.toLocaleString() : '0'}`,
      status: p.state,
      createdAt: p.createdAt
    }));
    setProducts(mappedData);
    setShowModal(false);
    setCurrentPage(1);
  } catch (error) {
    console.error('상품 등록 오류', error);
  }
};


const downloadCSV = () => {
  const headers = ['상품이미지', '상품명', '브랜드', '카테고리', '가격', '상태', '상품수량', '상품등록일'];
  const dataRows = products.map(product => [product.imageUrl, product.name, product.brand, product.category, product.stock, product.price, product.status, product.createdAt]);
  const csvContent = ['\uFEFF' + headers.join(','), ...dataRows.map(row => row.join(','))].join('\n');
  const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8'});
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', '올리브영_상품목록.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">상품 관리</h1>
        <div className="flex gap-2">
          <button onClick={downloadCSV}
                  className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            <DownloadIcon size={16} className="mr-1"/>
            엑셀 다운로드
          </button>
          <button className="bg-[#9BCC47] text-white px-4 py-2 rounded-md flex items-center"
                  onClick={() => setShowModal(true)}>
            <PlusIcon size={16} className="mr-1"/>
            상품 등록
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="relative w-full md:w-72">
              <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9BCC47] focus:border-transparent"
                  placeholder="상품명 검색..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
              />
              <SearchIcon size={18} className="absolute left-3 top-2.5 text-gray-400"/>
            </div>
            <div className="flex items-center space-x-2">
              <button className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-md">
                <div className="mr-1"/>
                필터
              </button>
              <select
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#9BCC47] focus:border-transparent"
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}>
                <option value="">카테고리</option>
                <option value="스킨케어">스킨케어</option>
                <option value="메이크업">메이크업</option>
                <option value="선케어">선케어</option>
                <option value="클렌징">클렌징</option>
              </select>
              <select
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#9BCC47] focus:border-transparent"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}>
                <option value="">상태</option>
                <option value="판매중">판매중</option>
                <option value="품절임박">품절임박</option>
                <option value="품절">품절</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
            <tr className="text-xs font-light tracking-wider text-left text-gray-500 uppercase bg-gray-50">
              <th className="items-center text-[12px] px-[40px]">상품이미지</th>
              <th className="px-6 py-3">상품명</th>
              <th className="px-6 py-3">브랜드</th>
              <th className="px-6 py-3">카테고리</th>
              <th className="px-6 py-3">가격</th>
              <th className="px-6 py-3">상태</th>
              <th className="px-6 py-3">상품수량</th>
              <th className="px-6 py-3">상품등록일</th>
              <th className="px-6 py-3">관리</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-200  text-sm font-normal">
            {paginatedProducts.map(product => (
                <tr key={product.id} className="whitespace-nowrap">
                  <td className="px-6 py-4">
                    <div className="w-24 h-16 flex items-center justify-center bg-white rounded overflow-hidden border border-gray-200">
                    <img src={getImageUrl(product.imageUrl)} alt="상품" className="object-cover w-full h-full"/>
                    </div>
                  </td>
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">{product.brand}</td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">{product.price}</td>
                  <td className="px-6 py-4">
                <span className={`text-xs font-normal inline-block px-2 py-1 rounded-full whitespace-nowrap ${
                    product.status === '판매중'
                        ? 'bg-green-100 text-green-700'
                        : product.status === '품절임박'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                }`}>
                {product.status}
              </span>
                  </td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4">{product.createdAt}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-800">
                      <TrashIcon size={18}/>
                    </button>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            총 <span className="font-medium">{filteredProducts.length}</span>개 상품 중{' '}
            <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>-
            <span className="font-medium">
      {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
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
      </div>
      {showModal && (
          <NewProductModal
              onAdd={handleAddProduct}
              onClose={() => setShowModal(false)}
          />
      )}
    </div>
);
}




