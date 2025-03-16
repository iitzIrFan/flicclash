import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pastParam = searchParams.get("past");
  const platformParam = searchParams.get("platform");

  let url = `${process.env.NEXT_PUBLIC_API_URL}/api/contests`;

  // Add query parameters if they exist
  const params = new URLSearchParams();
  if (pastParam) params.append("past", pastParam);
  if (platformParam) params.append("platform", platformParam);

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  console.log("Fetching contests from:", url); // Debug log

  try {
    const response = await fetch(url);
    console.log("Response status:", response.status); // Debug log

    if (!response.ok) throw new Error("Failed to fetch contests");

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in contests API route:", error);
    // Return empty array instead of error status
    return NextResponse.json([]);
  }
}
