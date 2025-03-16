import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// This would be replaced with actual database calls
const userPreferences = new Map();

// Default preferences
const defaultPreferences = {
  platforms: {
    Codeforces: true,
    CodeChef: true,
    LeetCode: true,
  },
  notificationType: "email",
  reminderTime: 60, // 1 hour by default
};

export async function GET() {
  const auth_session = await auth();
  const { userId } = auth_session;

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Get user preferences or return defaults
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

  // Validate preferences
  if (
    !preferences.platforms ||
    !preferences.notificationType ||
    !preferences.reminderTime
  ) {
    return new Response("Invalid preferences format", { status: 400 });
  }

  // Save preferences
  userPreferences.set(userId, preferences);

  return NextResponse.json({ success: true });
}
