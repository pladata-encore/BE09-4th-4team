"use client";
import axios from "axios";
import React, { useState } from "react";

export default function AdminLogin({ onClose, onAdd }) {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // 오류 메시지 상태



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/api/auth/login", {
                userId,
                password,
            });

            const { accessToken, refreshToken } = response.data.data; // 백엔드가 반환하는 필드 이름 확인
            if (!accessToken) {
                setError("accessToken이 응답에 없습니다.");
                return;
            }

            localStorage.setItem("accessToken", accessToken); // ✅ 토큰 저장
            localStorage.setItem("refreshToken", refreshToken); // ✅ 리프레시 토큰도 저장

            onAdd(response.data); // 로그인 성공 콜백
        } catch (err) {
            console.error("로그인 오류", err);
            if (err.response?.status === 401) {
                setError("이메일 또는 비밀번호가 잘못되었습니다.");
            } else {
                setError("서버 오류가 발생했습니다.");
            }
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
                <h2 className="mb-4 text-xl font-bold">관리자 로그인</h2>

                {/* ❗ 에러 메시지 출력 */}
                {error && (
                    <div className="mb-2 text-sm text-red-500">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="id"
                        value={userId}
                        onChange={e => setUserId(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />

                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
                            취소
                        </button>
                        <button type="submit" className="px-4 py-2 bg-[#9BCC47] text-white rounded">
                            로그인
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
