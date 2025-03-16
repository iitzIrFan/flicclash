import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const userPreferences = new Map();

const defaultPreferences = {
  platforms: {
    Codeforces: true,
    CodeChef: true,
    LeetCode: true,
  },
  notificationType: "email",
  reminderTime: 60,
};

export async function GET() {
  const auth_session = await auth();
  const { userId } = auth_session;

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const preferences = userPreferences.get(userId) || defaultPreferences;

  return NextResponse.json(preferences);
}

export async function POST(request: Request) {
  const auth_session = await auth();
  const { userId } = auth_session;

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const preferences = await request.json();

  if (
    !preferences.platforms ||
    !preferences.notificationType ||
    !preferences.reminderTime
  ) {
    return new Response("Invalid preferences format", { status: 400 });
  }

  userPreferences.set(userId, preferences);

  return NextResponse.json({ success: true });
}
