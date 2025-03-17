"use client";

import { useState, useEffect } from "react";
import { useAuth, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { StarryBackground } from "@/components/StarryBackground";
import { HeroGlow } from "@/components/HeroGlow";
import {
  Trophy,
  ExternalLink,
  Bookmark,
  Play,
  Calendar,
  Clock,
  Filter,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("upcoming");
  const [filter, setFilter] = useState<string[]>([
    "Codeforces",
    "CodeChef",
    "LeetCode",
  ]);
  const [contests, setContests] = useState<Contest[]>([]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    } else if (isLoaded) {
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

      if (isLoaded && isSignedIn) {
        fetchBookmarks();
      }

      return () => clearInterval(intervalId);
    }
  }, [isLoaded, isSignedIn, router]);

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
      if (contest) {
        setContests(
          contests.map((c) =>
            c.id === contestId ? { ...c, isBookmarked: !c.isBookmarked } : c
          )
        );
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      setContests([...contests]);
    }
  };

  const toggleFilter = (platform: string) => {
    if (filter.includes(platform)) {
      setFilter(filter.filter((p) => p !== platform));
    } else {
      setFilter([...filter, platform]);
    }
  };

  const getTimeRemaining = (startTime: string) => {
    const start = new Date(startTime).getTime();
    const now = new Date().getTime();
    const diff = start - now;

    if (diff <= 0) return "Started";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const filteredContests = contests.filter((contest) => {
    const contestDate = new Date(contest.startTime);
    const now = new Date();
    const isPast = contestDate < now;
    const isWithinLastWeek =
      isPast && now.getTime() - contestDate.getTime() < 7 * 24 * 60 * 60 * 1000;

    return (
      filter.includes(contest.platform) &&
      ((view === "upcoming" && !isPast) ||
        (view === "past" && isWithinLastWeek))
    );
  });

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/tp.jpg"
          alt="Dashboard Background"
          fill
          priority
          className="object-cover"
          quality={100}
        />
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
      </div>

      {/* Starry background */}
      <StarryBackground />

      {/* Glow effects */}
      <div className="absolute inset-0 z-0 opacity-30">
        <HeroGlow />
      </div>

      {/* Dashboard content */}
      <div className="relative z-10">
        <header className="bg-white/90 shadow-sm backdrop-blur-md sticky top-0 z-10 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <motion.div
                initial={{ rotate: -10, scale: 0.9 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg"
              >
                <Trophy className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
                >
                  Contest Tracker
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-sm text-gray-500"
                >
                  Track your coding contests
                </motion.p>
              </div>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
          >
            <div className="flex space-x-3">
              <Button
                variant={view === "upcoming" ? "success" : "outline"}
                onClick={() => setView("upcoming")}
                className="min-w-[100px] bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Upcoming
              </Button>
              <Button
                variant={view === "past" ? "success" : "outline"}
                onClick={() => setView("past")}
                className={`min-w-[100px] shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 ${
                  view === "past"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Clock className="h-4 w-4" />
                Past
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-500 flex items-center">
                <Filter className="h-4 w-4 mr-1" /> Filter:
              </span>
              {["Codeforces", "CodeChef", "LeetCode"].map((platform) => (
                <Button
                  key={platform}
                  variant={filter.includes(platform) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter(platform)}
                  className={`min-w-[100px] transition-all duration-300 ${
                    filter.includes(platform)
                      ? platform === "Codeforces"
                        ? "bg-red-500 hover:bg-red-600"
                        : platform === "CodeChef"
                        ? "bg-amber-500 hover:bg-amber-600"
                        : "bg-green-500 hover:bg-green-600"
                      : "bg-white"
                  }`}
                >
                  {platform}
                </Button>
              ))}
            </div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredContests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-2 border-dashed bg-white/80 backdrop-blur-sm shadow-xl">
                <CardContent className="p-12 text-center">
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-6"
                  >
                    <Trophy className="mx-auto h-16 w-16 text-gray-300" />
                  </motion.div>
                  <motion.h3
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-xl font-semibold text-gray-900 mb-2"
                  >
                    No Contests Found
                  </motion.h3>
                  <motion.p
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-gray-600"
                  >
                    {view === "upcoming"
                      ? "No upcoming contests found for the selected platforms."
                      : "No past contests found in the last week for the selected platforms."}
                  </motion.p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="overflow-hidden border shadow-xl bg-white/90 backdrop-blur-md">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-blue-50 to-blue-100 hover:bg-blue-100">
                        <TableHead className="font-semibold text-blue-900">
                          Contest
                        </TableHead>
                        <TableHead className="font-semibold text-blue-900">
                          Platform
                        </TableHead>
                        <TableHead className="font-semibold text-blue-900">
                          {view === "upcoming" ? "Starts In" : "Date"}
                        </TableHead>
                        <TableHead className="font-semibold text-blue-900">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContests.map((contest, index) => (
                        <motion.tr
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          key={contest.id}
                          className="group hover:bg-blue-50 transition-colors duration-200"
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
                                {new Date(
                                  contest.startTime
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleBookmark(contest.id)}
                                className="text-gray-400 hover:text-yellow-500 transition-colors duration-200"
                                aria-label={
                                  contest.isBookmarked
                                    ? "Remove bookmark"
                                    : "Add bookmark"
                                }
                              >
                                <Bookmark
                                  className={`h-5 w-5 transition-colors duration-200 ${
                                    contest.isBookmarked
                                      ? "fill-yellow-500 text-yellow-500"
                                      : ""
                                  }`}
                                />
                              </Button>
                              {view === "past" && contest.solutionUrl && (
                                <Button variant="ghost" size="icon" asChild>
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
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
