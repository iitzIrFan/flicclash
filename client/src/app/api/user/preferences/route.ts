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
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/preferences`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch preferences");

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in preferences GET API route:", error);
    return NextResponse.json({
      platforms: {
        Codeforces: true,
        CodeChef: true,
        LeetCode: true,
      },
      notificationType: "email",
      reminderTime: 60,
    });
  }
}

export async function POST(request: Request) {
  const auth_session = await auth();
  const token = await auth_session.getToken();

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/preferences`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) throw new Error("Failed to update preferences");

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in preferences POST API route:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}
