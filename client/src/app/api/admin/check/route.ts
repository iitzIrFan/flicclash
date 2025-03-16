import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const adminUsers = ["user_2NNcWHK2hYdRJJ8vL8LLQOt6oqb"];

export async function GET() {
  const auth_session = await auth();
  const { userId } = auth_session;

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const isAdmin = adminUsers.includes(userId);

  if (!isAdmin) {
    return new Response("Forbidden", { status: 403 });
  }

  return NextResponse.json({ isAdmin: true });
}
