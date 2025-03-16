import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const auth_session = await auth();
  const token = await auth_session.getToken();

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/solutions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) throw new Error("Failed to update solution");

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in solutions POST API route:", error);
    return NextResponse.json(
      { error: "Failed to update solution" },
      { status: 500 }
    );
  }
}
