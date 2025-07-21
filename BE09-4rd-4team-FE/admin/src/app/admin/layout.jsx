// src/app/admin/layout.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import "../../styles/globals.css";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Skip authentication check for login page
    if (pathname === "/admin/login") {
      setIsLoading(false);
      return;
    }

    // Check if user is authenticated
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      router.push("/admin/login");
    } else {
      setIsLoading(false);
    }
  }, [pathname, router]);

  // Don't render layout for login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Show loading state or render layout
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <Header />
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
