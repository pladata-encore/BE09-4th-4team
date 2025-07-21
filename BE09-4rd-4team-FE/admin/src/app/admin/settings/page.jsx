"use client";
import React, { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import NewAdminModal from '../../../components/NewAdminModal'; // 위치 확인 필수

export default function SettingsPage() {
  const [admins, setAdmins] = useState(['admin@oliveyoung.com']);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const [autoOrderConfirm, setAutoOrderConfirm] = useState(false);
  const [lowStockAlert, setLowStockAlert] = useState(true);
  const [emailAlert, setEmailAlert] = useState(true);

  const handleAddAdmin = email => {
    setAdmins(prev => [...prev, email]);
    setShowAdminModal(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">설정</h1>
        <p className="text-gray-500">시스템 설정을 관리합니다.</p>
      </div>

      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="mb-2 text-xl font-semibold">관리자 계정 관리</h2>
        <p className="mb-4 text-gray-500">관리자 권한을 가진 계정을 관리합니다.</p>
        <div className="space-y-2">
          {admins.map((email, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span>{email}</span>
              <button className="px-3 py-1 text-sm border rounded">권한 수정</button>
            </div>
          ))}
        </div>
        <button
          onClick={() => setShowAdminModal(true)}
          className="mt-4 px-4 py-2 bg-[#9BCC47] text-white rounded inline-flex items-center"
        >
          <PlusIcon size={16} className="mr-1" /> 새 관리자 추가
        </button>
      </div>

      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="mb-4 text-xl font-semibold">시스템 설정</h2>
        <div className="space-y-4">
          <ToggleRow
            label="자동 주문 확인"
            description="새 주문이 들어오면 자동으로 확인 상태로 변경"
            checked={autoOrderConfirm}
            onChange={() => setAutoOrderConfirm(prev => !prev)}
          />
          <ToggleRow
            label="재고 부족 알림"
            description="재고가 10개 이하일 때 알림 발송"
            checked={lowStockAlert}
            onChange={() => setLowStockAlert(prev => !prev)}
          />
          <ToggleRow
            label="이메일 알림"
            description="중요한 이벤트 발생 시 이메일 발송"
            checked={emailAlert}
            onChange={() => setEmailAlert(prev => !prev)}
          />
        </div>
      </div>

      {showAdminModal && <NewAdminModal onAdd={handleAddAdmin} onClose={() => setShowAdminModal(false)} />}
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-sm text-gray-500">{description}</div>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-5 h-5"
      />
    </div>
  );
}