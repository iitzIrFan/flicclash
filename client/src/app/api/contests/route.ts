import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pastParam = searchParams.get("past");
  const platformParam = searchParams.get("platform");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  let url = `${apiUrl}/api/contests`;

  // Add query parameters if they exist
  const params = new URLSearchParams();
  if (pastParam) params.append("past", pastParam);
  if (platformParam) params.append("platform", platformParam);

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  console.log("Fetching contests from:", url); // Debug log

  try {
    console.log("Making request to backend..."); // Debug log
    const response = await fetch(url);
    console.log("Response status:", response.status); // Debug log
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    ); // Debug log

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText); // Debug log
      throw new Error(
        `Failed to fetch contests: ${response.status} ${errorText}`
      );
    }

    const data = await response.json();
    console.log("Received contests data:", data); // Debug log
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in contests API route:", error);
    // Return empty array instead of error status
    return NextResponse.json([]);
  }
}
