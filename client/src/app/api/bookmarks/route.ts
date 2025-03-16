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
      `${process.env.NEXT_PUBLIC_API_URL}/api/bookmarks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch bookmarks");

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in bookmarks GET API route:", error);
    return NextResponse.json([], { status: 200 });
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/bookmarks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) throw new Error("Failed to create bookmark");

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in bookmarks POST API route:", error);
    return NextResponse.json(
      { error: "Failed to create bookmark" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const auth_session = await auth();
  const token = await auth_session.getToken();

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/bookmarks`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) throw new Error("Failed to delete bookmark");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in bookmarks DELETE API route:", error);
    return NextResponse.json(
      { error: "Failed to delete bookmark" },
      { status: 500 }
    );
  }
}
