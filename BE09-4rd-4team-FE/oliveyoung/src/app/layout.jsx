// src/app/layout.jsx
"use client";
import Header from "../components/Header"; // 헤더 임포트
import Footer from "../components/Footer/Footer"; // 푸터 임포트
import Menu from "../app/menu/Menu";
import "../styles/globals.css"; // 글로벌 CSS 임포트
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

export default function Layout({ children }) {
  const pathName = usePathname();

  const isSignUpPage = pathName.startsWith("/user/signup");
  const isModifyAccount =

    pathName.startsWith('/mypage/user/modifyactinfo/modifyactdetailed') ||
    pathName.startsWith('/mypage/user/modifyactinfo/modifypwd') ||
    pathName.startsWith('/mypage/user/modifyactinfo/minfodification') ||
    pathName.startsWith('/user/login/kakaotalk');

  const shouldHideLayout = isSignUpPage || isModifyAccount;

  return (
    <html lang="ko">
      <head></head>
      <body>
        <AuthProvider>
          <CartProvider>
            {/* 공통 레이아웃 구성: Header, Main Content (children), Footer */}
            {!shouldHideLayout && <Header />}
            {!shouldHideLayout && <Menu />}
            <main>{children}</main> {/* 각 페이지의 내용이 여기에 들어감 */}
            {!shouldHideLayout && <Footer />}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
