import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const token = request.headers.get('authorization');

  try {
    const backendRes = await fetch(`https://auth-api-fastapi-2ls5.onrender.com/profile`, {
      headers: {
        ...(token ? { 'Authorization': token } : {}),
      },
      // 8 second timeout
      signal: AbortSignal.timeout(8000)
    });

    if (backendRes.status === 401) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    if (!backendRes.ok) {
      // If Render returns 502/503 during startup
      return NextResponse.json({ error: "Backend is starting up" }, { status: 503 });
    }

    const data = await backendRes.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error: any) {
    if (error.name === 'AbortError' || error.name === 'TimeoutError' || error.message?.includes('fetch')) {
      console.error("Backend unreachable during fetch:", error);
      return NextResponse.json(
        { error: "Backend is currently starting up or unreachable" }, 
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
