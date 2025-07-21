"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Eye, EyeOff, Shield } from "lucide-react"

export default function AdminLogin() {
    const router = useRouter()

    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({ userId: "", password: "" })
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    // Removed auto-login functionality
    useEffect(() => {
        // Auto-login has been disabled
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const response = await axios.post("http://localhost:8080/api/auth/login", {
                userId: formData.userId,
                password: formData.password,
            })

            const { accessToken, refreshToken } = response.data.data
            if (!accessToken) {
                setError("accessToken이 응답에 없습니다.")
                setIsLoading(false)
                return
            }

            localStorage.setItem("accessToken", accessToken)
            localStorage.setItem("refreshToken", refreshToken)
            router.push("/admin/dashboard")
        } catch (err) {
            console.error("로그인 오류", err)
            if (err.response?.status === 401) {
                setError("아이디 또는 비밀번호가 잘못되었습니다.")
            } else {
                setError("서버 오류가 발생했습니다.")
            }
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* 로고 및 헤더 */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-green-800 mb-2">올리브영 어드민</h1>
                    <p className="text-green-600">관리자 시스템에 로그인하세요</p>
                </div>

                {/* 로그인 카드 */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">로그인</h2>
                    <p className="text-center text-sm text-gray-500 mb-6">관리자 계정으로 로그인해주세요</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-100 rounded-md">
                                {error}
                            </div>
                        )}

                        {/* 아이디 입력 */}
                        <div>
                            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                                아이디
                            </label>
                            <input
                                type="text"
                                id="userId"
                                name="userId"
                                placeholder="관리자 아이디 입력"
                                value={formData.userId}
                                onChange={handleChange}
                                required
                                className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>

                        {/* 비밀번호 입력 */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                비밀번호
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder="비밀번호를 입력하세요"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full h-11 px-4 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* 로그인 버튼 */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md transition-colors"
                        >
                            {isLoading ? "로그인 중..." : "로그인"}
                        </button>

                        {/* 추가 링크 */}
                        <div className="text-center mt-2">
                            <button
                                type="button"
                                className="text-sm text-green-600 hover:text-green-700 hover:underline"
                            >
                                비밀번호를 잊으셨나요?
                            </button>
                        </div>
                    </form>
                </div>

                {/* 푸터 */}
                <div className="text-center mt-8 text-sm text-gray-500">
                    <p>© 2024 올리브영. 모든 권리 보유.</p>
                    <p className="mt-1">관리자 전용 시스템입니다.</p>
                </div>
            </div>
        </div>
    )
}
