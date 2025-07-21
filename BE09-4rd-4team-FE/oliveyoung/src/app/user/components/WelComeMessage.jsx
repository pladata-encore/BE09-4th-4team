'use client';
import { useRouter } from 'next/navigation';

export default function WelcomeMessage({ userName }) {
  const router = useRouter();

  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl font-bold text-[#9bce26] mb-4">{userName}님, 환영합니다!</h2>
      <p className="text-gray-700">이제 로그인 후 서비스를 이용하실 수 있습니다.</p>
      <br />
      <button
        onClick={() => router.push('/user/login')} // 로그인 경로로 이동
        className="bg-[#8ec324] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#899A00] transition-colors"
      >
        로그인 하러 가기
      </button>
    </div>
  );
}
