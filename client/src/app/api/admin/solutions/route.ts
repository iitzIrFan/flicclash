import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const adminUsers = ["user_2NNcWHK2hYdRJJ8vL8LLQOt6oqb"];
const solutions = new Map();

export async function POST(request: Request) {
  const auth_session = await auth();
  const { userId } = auth_session;

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const isAdmin = adminUsers.includes(userId);

  if (!isAdmin) {
    return new Response("Forbidden", { status: 403 });
  }

  const { contestId, solutionUrl } = await request.json();

  if (!contestId || !solutionUrl) {
    return new Response("Contest ID and solution URL are required", {
      status: 400,
    });
  }

  solutions.set(contestId, solutionUrl);

  return NextResponse.json({ success: true });
}
