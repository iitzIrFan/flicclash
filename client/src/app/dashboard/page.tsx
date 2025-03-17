"use client";

import { ContestSolutions } from '@/components/ContestSolutions';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useClickOutside } from "@/hooks/useClickOutside";
import { UserButton, useUser } from "@clerk/nextjs";
import { Bookmark, ExternalLink, Play, Trophy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const solutionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
    const intervalId = setInterval(fetchContests, 5 * 60 * 1000);

    if (isLoaded && user) {
      fetchBookmarks();
    }

    return () => clearInterval(intervalId);
  }, [isLoaded, user]);

  const fetchBookmarks = async () => {
    try {
      const response = await fetch("/api/bookmarks");
      if (!response.ok) throw new Error("Failed to fetch bookmarks");
      const bookmarks = await response.json();
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
      setContests((prevContests) =>
        prevContests.map((c) =>
          c.id === contestId ? { ...c, isBookmarked: !c.isBookmarked } : c
        )
      );

      const response = await fetch("/api/bookmarks", {
        method: isCurrentlyBookmarked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contestId }),
      });

      if (!response.ok) throw new Error("Failed to update bookmark");
    } catch (error) {
      console.error("Error toggling bookmark:", error);
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

  const handleContestClick = (contest: Contest) => {
    setSelectedContest(contest);
  };

  useClickOutside(solutionsRef, () => {
    setSelectedContest(null);
  });

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white/90 shadow-sm backdrop-blur-md sticky top-0 z-10 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Contest Tracker
              </h1>
              <p className="text-sm text-gray-500">Track your coding contests</p>
            </div>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex space-x-3">
            <Button
              variant={view === "upcoming" ? "success" : "outline"}
              onClick={() => setView("upcoming")}
              className="min-w-[100px]"
            >
              Upcoming
            </Button>
            <Button
              variant={view === "past" ? "success" : "outline"}
              onClick={() => setView("past")}
              className="min-w-[100px]"
            >
              Past
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {["Codeforces", "CodeChef", "LeetCode"].map((platform) => (
              <Button
                key={platform}
                variant={filter.includes(platform) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFilter(platform)}
                className="min-w-[100px]"
              >
                {platform}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredContests.length === 0 ? (
          <Card className="border-2 border-dashed bg-white/80">
            <CardContent className="p-12 text-center">
              <div className="mb-6">
                <Trophy className="mx-auto h-16 w-16 text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Contests Found
              </h3>
              <p className="text-gray-600">
                {view === "upcoming"
                  ? "No upcoming contests found for the selected platforms."
                  : "No past contests found in the last week for the selected platforms."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="overflow-hidden border shadow-lg bg-white/80">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100 hover:bg-gray-100">
                    <TableHead className="font-semibold text-gray-900">Contest</TableHead>
                    <TableHead className="font-semibold text-gray-900">Platform</TableHead>
                    <TableHead className="font-semibold text-gray-900">{view === "upcoming" ? "Starts In" : "Date"}</TableHead>
                    <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContests.map((contest) => (
                    <TableRow 
                      key={contest.id} 
                      className="group hover:bg-gray-50 transition-colors duration-200"
                    >
                      <TableCell className="font-medium">
                        <a
                          href={contest.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center group/link"
                        >
                          {contest.name}
                          <ExternalLink className="h-4 w-4 ml-1 opacity-0 group-hover/link:opacity-100 transition-opacity duration-200" />
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            contest.platform === "Codeforces"
                              ? "destructive"
                              : contest.platform === "CodeChef"
                              ? "warning"
                              : "success"
                          }
                          className="font-medium"
                        >
                          {contest.platform}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {view === "upcoming" ? (
                          <span className="font-medium text-gray-900">
                            {getTimeRemaining(contest.startTime)}
                          </span>
                        ) : (
                          <span className="text-gray-600">
                            {new Date(contest.startTime).toLocaleDateString()}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(contest.id);
                            }}
                            className="text-gray-400 hover:text-yellow-500 transition-colors duration-200"
                            aria-label={
                              contest.isBookmarked
                                ? "Remove bookmark"
                                : "Add bookmark"
                            }
                          >
                            <Bookmark
                              className={`h-5 w-5 transition-colors duration-200 ${
                                contest.isBookmarked ? "fill-yellow-500 text-yellow-500" : ""
                              }`}
                            />
                          </Button>
                          {view === "past" && (
                            <>
                              {contest.solutionUrl && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  asChild
                                >
                                  <a
                                    href={contest.solutionUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                                    aria-label="Watch solution"
                                  >
                                    <Play className="h-5 w-5" />
                                  </a>
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleContestClick(contest);
                                }}
                                className={`text-gray-400 hover:text-blue-500 transition-colors duration-200 ${
                                  selectedContest?.id === contest.id ? "text-blue-500" : ""
                                }`}
                              >
                                <Play className="h-5 w-5" />
                              </Button>
                              {selectedContest?.id === contest.id && (
                                <div 
                                  ref={solutionsRef}
                                  className="absolute right-16 mt-2 bg-white rounded-lg shadow-xl border p-4 w-96 z-20"
                                >
                                  <ContestSolutions
                                    contestName={contest.name}
                                    channelId="UCkGxt0Twkuf8e0nEQm5_-Ig"
                                  />
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
