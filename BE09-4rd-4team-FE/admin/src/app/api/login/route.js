// admin/src/app/api/login/route.js

export async function POST(req) {
    const { email, password } = await req.json();

    if (email === "admin@oliveyoung.com" && password === "admin") {
        return Response.json({ email, name: "관리자" }, { status: 200 });
    }

    return Response.json({ message: "인증 실패" }, { status: 401 });
}
