"use client";

import { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

interface Contest {
  id: string;
  name: string;
  platform: "Codeforces" | "CodeChef" | "LeetCode";
  startTime: string;
  endTime: string;
  url: string;
  isBookmarked?: boolean;
  solutionUrl?: string;
}

export default function BookmarksPage() {
  const [bookmarkedContests, setBookmarkedContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarkedContests = async () => {
      try {
        const response = await fetch("/api/bookmarks");
        if (!response.ok) throw new Error("Failed to fetch bookmarks");

        const bookmarks = await response.json();

        const contestsResponse = await fetch("/api/contests");
        if (!contestsResponse.ok) throw new Error("Failed to fetch contests");

        const allContests = await contestsResponse.json();

        const bookmarkedContests = allContests
          .filter((contest: Contest) =>
            bookmarks.some(
              (b: { contestId: string }) => b.contestId === contest.id
            )
          )
          .map((contest: Contest) => ({
            ...contest,
            isBookmarked: true,
          }));

        setBookmarkedContests(bookmarkedContests);
      } catch (error) {
        console.error("Error fetching bookmarked contests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkedContests();
  }, []);

  const removeBookmark = async (contestId: string) => {
    try {
      setBookmarkedContests((prev) => prev.filter((c) => c.id !== contestId));

      const response = await fetch("/api/bookmarks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contestId }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove bookmark");
      }
    } catch (error) {
      console.error("Error removing bookmark:", error);

      const fetchBookmarkedContests = async () => {};
      fetchBookmarkedContests();
    }
  };

  const getTimeRemaining = (startTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = start.getTime() - now.getTime();

    if (diff <= 0) return "Started";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Bookmarked Contests
          </h1>
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900"
            >
              Dashboard
            </Link>
            <Link
              href="/settings"
              className="text-gray-600 hover:text-gray-900"
            >
              Settings
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : bookmarkedContests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">
              You have not bookmarked any contests yet.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              Go to dashboard to browse contests
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platform
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookmarkedContests.map((contest) => {
                  const now = new Date();
                  const startTime = new Date(contest.startTime);
                  const endTime = new Date(contest.endTime);
                  const isPast = endTime < now;
                  const isLive = startTime <= now && endTime >= now;

                  return (
                    <tr key={contest.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={contest.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {contest.name}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            contest.platform === "Codeforces"
                              ? "bg-red-100 text-red-800"
                              : contest.platform === "CodeChef"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {contest.platform}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isPast ? (
                          <span className="text-gray-500">Ended</span>
                        ) : isLive ? (
                          <span className="text-green-600 font-medium">
                            Live Now
                          </span>
                        ) : (
                          <span className="text-blue-600">
                            Starts in {getTimeRemaining(contest.startTime)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => removeBookmark(contest.id)}
                            className="text-yellow-500 hover:text-gray-500"
                            aria-label="Remove bookmark"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                            </svg>
                          </button>

                          {isPast && contest.solutionUrl && (
                            <a
                              href={contest.solutionUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-red-500"
                              aria-label="Watch solution"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
