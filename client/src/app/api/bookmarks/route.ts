import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// This would be replaced with actual database calls
let bookmarks = [
  { userId: "user_123", contestId: "1" },
  { userId: "user_123", contestId: "3" },
];

export async function GET() {
  const auth_session = await auth();
  const { userId } = auth_session;

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Filter bookmarks for the current user
  const userBookmarks = bookmarks.filter(
    (bookmark) => bookmark.userId === userId
  );

  return NextResponse.json(userBookmarks);
}

export async function POST(request: Request) {
  const auth_session = await auth();
  const { userId } = auth_session;

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { contestId } = await request.json();

  if (!contestId) {
    return new Response("Contest ID is required", { status: 400 });
  }

  // Check if bookmark already exists
  const existingBookmark = bookmarks.find(
    (bookmark) => bookmark.userId === userId && bookmark.contestId === contestId
  );

  if (existingBookmark) {
    return new Response("Bookmark already exists", { status: 409 });
  }

  // Add new bookmark
  bookmarks.push({ userId, contestId });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const auth_session = await auth();
  const { userId } = auth_session;

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { contestId } = await request.json();

  if (!contestId) {
    return new Response("Contest ID is required", { status: 400 });
  }

  // Remove bookmark
  const initialLength = bookmarks.length;
  bookmarks = bookmarks.filter(
    (bookmark) =>
      !(bookmark.userId === userId && bookmark.contestId === contestId)
  );

  if (bookmarks.length === initialLength) {
    return new Response("Bookmark not found", { status: 404 });
  }

  return NextResponse.json({ success: true });
}
