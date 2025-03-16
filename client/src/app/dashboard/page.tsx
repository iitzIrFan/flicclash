"use client";

import { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
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

interface Bookmark {
  contestId: string;
  userId: string;
}

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string[]>([
    "Codeforces",
    "CodeChef",
    "LeetCode",
  ]);
  const [view, setView] = useState<"upcoming" | "past">("upcoming");

  useEffect(() => {
    // Fetch contests from backend
    const fetchContests = async () => {
      try {
        const response = await fetch("/api/contests");
        if (!response.ok) throw new Error("Failed to fetch contests");

        const data = await response.json();
        setContests(data);
      } catch (error) {
        console.error("Error fetching contests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();

    // Fetch bookmarks if user is logged in
    if (isLoaded && user) {
      fetchBookmarks();
    }
  }, [isLoaded, user]);

  const fetchBookmarks = async () => {
    try {
      const response = await fetch("/api/bookmarks");
      if (!response.ok) throw new Error("Failed to fetch bookmarks");

      const bookmarks = await response.json();

      // Update contests with bookmark status
      setContests((prevContests) =>
        prevContests.map((contest) => ({
          ...contest,
          isBookmarked: bookmarks.some(
            (b: Bookmark) => b.contestId === contest.id
          ),
        }))
      );
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  };

  const toggleBookmark = async (contestId: string) => {
    try {
      const contest = contests.find((c) => c.id === contestId);
      if (!contest) return;

      const isCurrentlyBookmarked = contest.isBookmarked;

      // Optimistically update UI
      setContests((prevContests) =>
        prevContests.map((c) =>
          c.id === contestId ? { ...c, isBookmarked: !c.isBookmarked } : c
        )
      );

      // Send request to server
      const response = await fetch("/api/bookmarks", {
        method: isCurrentlyBookmarked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contestId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update bookmark");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      // Revert the optimistic update if there was an error
      fetchBookmarks();
    }
  };

  const toggleFilter = (platform: string) => {
    setFilter((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
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

  const filteredContests = contests.filter((contest) => {
    const now = new Date();
    const startTime = new Date(contest.startTime);
    const endTime = new Date(contest.endTime);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const isPast = endTime < now;
    const isRecent = startTime > oneWeekAgo;

    return (
      filter.includes(contest.platform) &&
      ((view === "upcoming" && !isPast) ||
        (view === "past" && isPast && isRecent))
    );
  });

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Contest Tracker</h1>
          <div className="flex items-center space-x-4">
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
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {view === "upcoming"
                ? "Upcoming Contests"
                : "Past Contests (Last Week)"}
            </h2>
            <div className="flex space-x-4">
              <button
                onClick={() => setView("upcoming")}
                className={`px-4 py-2 rounded-md ${
                  view === "upcoming"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setView("past")}
                className={`px-4 py-2 rounded-md ${
                  view === "past"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Past
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 mr-2 self-center">
              Filter:
            </span>
            {["Codeforces", "CodeChef", "LeetCode"].map((platform) => (
              <button
                key={platform}
                onClick={() => toggleFilter(platform)}
                className={`px-3 py-1 text-sm rounded-full ${
                  filter.includes(platform)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredContests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">
              {view === "upcoming"
                ? "No upcoming contests found for the selected platforms."
                : "No past contests found in the last week for the selected platforms."}
            </p>
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
                    {view === "upcoming" ? "Starts In" : "Date"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContests.map((contest) => (
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
                      {view === "upcoming" ? (
                        <span className="text-gray-700">
                          {getTimeRemaining(contest.startTime)}
                        </span>
                      ) : (
                        <span className="text-gray-700">
                          {new Date(contest.startTime).toLocaleDateString()}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleBookmark(contest.id)}
                          className="text-gray-400 hover:text-yellow-500"
                          aria-label={
                            contest.isBookmarked
                              ? "Remove bookmark"
                              : "Add bookmark"
                          }
                        >
                          {contest.isBookmarked ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-yellow-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                            </svg>
                          ) : (
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
                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                              />
                            </svg>
                          )}
                        </button>

                        {view === "past" && contest.solutionUrl && (
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
