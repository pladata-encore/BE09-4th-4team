// ✅ 파일 경로: src/app/page.jsx
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/admin/login");
}
