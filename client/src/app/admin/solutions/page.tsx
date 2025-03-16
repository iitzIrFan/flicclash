"use client";

import { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";

interface Contest {
  id: string;
  name: string;
  platform: "Codeforces" | "CodeChef" | "LeetCode";
  startTime: string;
  endTime: string;
  url: string;
  solutionUrl?: string;
}

export default function SolutionManager() {
  const { user, isLoaded } = useUser();
  const [pastContests, setPastContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [solutionUrl, setSolutionUrl] = useState("");
  const [selectedContestId, setSelectedContestId] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoaded && !user) {
      redirect("/");
    }

    const checkAdmin = async () => {
      try {
        const response = await fetch("/api/admin/check");
        if (!response.ok) {
          redirect("/dashboard");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        redirect("/dashboard");
      }
    };

    if (isLoaded && user) {
      checkAdmin();
      fetchPastContests();
    }
  }, [isLoaded, user]);

  const fetchPastContests = async () => {
    try {
      const response = await fetch("/api/contests?past=true");
      if (!response.ok) throw new Error("Failed to fetch past contests");

      const data = await response.json();
      setPastContests(data);
    } catch (error) {
      console.error("Error fetching past contests:", error);
      setError("Failed to load past contests. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleContestSelect = (contestId: string) => {
    setSelectedContestId(contestId);
    const contest = pastContests.find((c) => c.id === contestId);
    setSolutionUrl(contest?.solutionUrl || "");
  };

  const saveSolution = async () => {
    if (!selectedContestId) return;

    setSaving(true);
    setSaveSuccess(false);
    setError("");

    try {
      const response = await fetch("/api/admin/solutions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contestId: selectedContestId,
          solutionUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save solution URL");
      }

      // Update local state
      setPastContests((prev) =>
        prev.map((contest) =>
          contest.id === selectedContestId
            ? { ...contest, solutionUrl }
            : contest
        )
      );

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving solution URL:", error);
      setError("Failed to save solution URL. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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
          <h1 className="text-2xl font-bold text-gray-900">Solution Manager</h1>
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900"
            >
              Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Manage Solution Links
          </h2>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label
              htmlFor="contest-select"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Contest
            </label>
            <select
              id="contest-select"
              value={selectedContestId}
              onChange={(e) => handleContestSelect(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">-- Select a contest --</option>
              {pastContests.map((contest) => (
                <option key={contest.id} value={contest.id}>
                  {contest.name} ({contest.platform}) -{" "}
                  {new Date(contest.startTime).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          {selectedContestId && (
            <div className="mb-6">
              <label
                htmlFor="solution-url"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                YouTube Solution URL
              </label>
              <input
                type="url"
                id="solution-url"
                value={solutionUrl}
                onChange={(e) => setSolutionUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter the YouTube URL for the contest solution video.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={saveSolution}
              disabled={saving || !selectedContestId}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Solution URL"}
            </button>

            {saveSuccess && (
              <span className="text-green-600 font-medium">
                Solution URL saved successfully!
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Current Solution Links
          </h2>

          {pastContests.filter((c) => c.solutionUrl).length === 0 ? (
            <p className="text-gray-500">
              No solution links have been added yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
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
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Solution URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pastContests
                    .filter((contest) => contest.solutionUrl)
                    .map((contest) => (
                      <tr key={contest.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-900 font-medium">
                            {contest.name}
                          </span>
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
                          <span className="text-gray-500">
                            {new Date(contest.startTime).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a
                            href={contest.solutionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 truncate block max-w-xs"
                          >
                            {contest.solutionUrl}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleContestSelect(contest.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
