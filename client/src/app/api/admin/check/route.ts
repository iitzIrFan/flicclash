import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const auth_session = await auth();
  const token = await auth_session.getToken();

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/check`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 403) {
        return NextResponse.json({ isAdmin: false }, { status: 403 });
      }
      throw new Error("Failed to check admin status");
    }

    return NextResponse.json({ isAdmin: true });
  } catch (error) {
    console.error("Error in admin check API route:", error);
    return NextResponse.json({ isAdmin: false }, { status: 500 });
  }
}
