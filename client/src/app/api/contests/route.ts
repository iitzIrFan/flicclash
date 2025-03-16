import { NextResponse } from "next/server";

const dummyContests = [
  {
    id: "1",
    name: "Codeforces Round #789",
    platform: "Codeforces",
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    endTime: new Date(
      Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
    ).toISOString(), // 2 hours duration
    url: "https://codeforces.com/contests",
  },
  {
    id: "2",
    name: "CodeChef Starters 42",
    platform: "CodeChef",
    startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    endTime: new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000
    ).toISOString(), // 3 hours duration
    url: "https://www.codechef.com/contests",
  },
  {
    id: "3",
    name: "LeetCode Weekly Contest 300",
    platform: "LeetCode",
    startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    endTime: new Date(
      Date.now() + 3 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000
    ).toISOString(), // 1.5 hours duration
    url: "https://leetcode.com/contest/",
  },
  {
    id: "4",
    name: "Codeforces Round #788",
    platform: "Codeforces",
    startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    endTime: new Date(
      Date.now() - 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
    ).toISOString(), // 2 hours duration
    url: "https://codeforces.com/contests",
    solutionUrl: "https://www.youtube.com/watch?v=example1",
  },
  {
    id: "5",
    name: "CodeChef Starters 41",
    platform: "CodeChef",
    startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    endTime: new Date(
      Date.now() - 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000
    ).toISOString(), // 3 hours duration
    url: "https://www.codechef.com/contests",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pastOnly = searchParams.get("past") === "true";

  const now = new Date();

  let contests = dummyContests;

  if (pastOnly) {
    contests = contests.filter((contest) => new Date(contest.endTime) < now);
  }

  return NextResponse.json(contests);
}
