
import { redirect } from "next/navigation";


export default function RootRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.push("/admin"); // 로그인 여부에 따라 "/user/main" 도 가능
  }, []);
  return null;
}
