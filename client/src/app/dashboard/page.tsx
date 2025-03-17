"use client";

import { useState, useEffect } from "react";
import { useAuth, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { StarryBackground } from "@/components/StarryBackground";
import { HeroGlow } from "@/components/HeroGlow";
import Link from "next/link";
import {
  Trophy,
  ExternalLink,
  Bookmark,
  Play,
  Calendar,
  Clock,
  Filter,
  Home,
  BarChart2,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronRight,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-blue-400 border-b-transparent border-l-transparent animate-spin animation-delay-150"></div>
          <div className="absolute inset-4 rounded-full border-4 border-t-transparent border-r-transparent border-b-blue-300 border-l-transparent animate-spin animation-delay-300"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-transparent">
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
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-white/30 to-blue-900/10 backdrop-blur-[2px]"></div>
      </div>

      {/* Starry background */}
      <StarryBackground />

      {/* Glow effects */}
      <div className="absolute inset-0 z-0 opacity-20">
        <HeroGlow />
      </div>

      {/* Dashboard content */}
      <div className="relative z-10">
        {/* Navigation */}
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="sticky top-0 z-50"
        >
          <div className="mx-4 sm:mx-6 lg:mx-8 my-4">
            <div className="rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 shadow-lg">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <Link href="/" className="flex-shrink-0 flex items-center">
                      <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Rescale
                      </span>
                    </Link>
                    <div className="hidden md:ml-8 md:flex md:space-x-6">
                      <Link
                        href="/dashboard"
                        className="flex items-center px-3 py-2 text-sm font-medium text-indigo-900 rounded-md bg-white/50 shadow-sm"
                      >
                        <Home className="h-4 w-4 mr-1.5" />
                        Dashboard
                      </Link>
                      <Link
                        href="/analytics"
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-900 hover:bg-white/50 rounded-md transition-colors duration-200"
                      >
                        <BarChart2 className="h-4 w-4 mr-1.5" />
                        Analytics
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-900 hover:bg-white/50 rounded-md transition-colors duration-200"
                      >
                        <Settings className="h-4 w-4 mr-1.5" />
                        Settings
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div
                      className={`relative ${
                        searchFocused ? "w-64" : "w-40"
                      } transition-all duration-300`}
                    >
                      <input
                        type="text"
                        placeholder="Search contests..."
                        className="w-full py-1.5 pl-9 pr-3 rounded-full bg-white/50 border border-white/40 focus:bg-white focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm transition-all duration-200"
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                      />
                      <Search className="absolute left-2.5 top-1.5 h-4 w-4 text-gray-500" />
                    </div>
                    <button className="relative p-1.5 rounded-full bg-white/50 hover:bg-white/80 transition-colors duration-200">
                      <Bell className="h-5 w-5 text-gray-700" />
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 transform translate-x-1/4 -translate-y-1/4"></span>
                    </button>
                    <div className="border-l border-gray-300/50 h-8 mx-1 hidden sm:block"></div>
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox:
                            "h-9 w-9 rounded-full ring-2 ring-white/70 shadow-md",
                        },
                      }}
                    />
                    <button
                      className="md:hidden p-1.5 rounded-md bg-white/50 hover:bg-white/80 transition-colors duration-200"
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                      {mobileMenuOpen ? (
                        <X className="h-5 w-5 text-gray-700" />
                      ) : (
                        <Menu className="h-5 w-5 text-gray-700" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: mobileMenuOpen ? "auto" : 0,
              opacity: mobileMenuOpen ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden mx-4 sm:mx-6 lg:mx-8 mb-4"
          >
            <div className="rounded-xl bg-white/30 backdrop-blur-md border border-white/40 shadow-lg">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  href="/dashboard"
                  className="flex items-center px-3 py-2 text-sm font-medium text-indigo-900 rounded-md bg-white/50"
                >
                  <Home className="h-4 w-4 mr-1.5" />
                  Dashboard
                </Link>
                <Link
                  href="/analytics"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-900 hover:bg-white/50 rounded-md"
                >
                  <BarChart2 className="h-4 w-4 mr-1.5" />
                  Analytics
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-900 hover:bg-white/50 rounded-md"
                >
                  <Settings className="h-4 w-4 mr-1.5" />
                  Settings
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-800 bg-clip-text text-transparent">
                  Coding Contests
                </span>
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Track upcoming and past coding competitions across platforms
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={view === "upcoming" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("upcoming")}
                className={`transition-all duration-300 ${
                  view === "upcoming"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-md"
                    : "bg-white"
                }`}
              >
                <Calendar className="h-4 w-4 mr-1.5" />
                Upcoming
              </Button>
              <Button
                variant={view === "past" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("past")}
                className={`transition-all duration-300 ${
                  view === "past"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md"
                    : "bg-white"
                }`}
              >
                <Clock className="h-4 w-4 mr-1.5" />
                Past Week
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-white/40 shadow-md"
          >
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600 font-medium flex items-center">
                <Filter className="h-4 w-4 mr-1.5" /> Platforms:
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
                        ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-sm"
                        : platform === "CodeChef"
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-sm"
                        : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-sm"
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
              <Card className="border-2 border-dashed bg-white/70 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden">
                <CardContent className="p-12 text-center">
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-6"
                  >
                    <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                      <Trophy className="h-10 w-10 text-indigo-300" />
                    </div>
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
              <Card className="overflow-hidden border border-white/20 shadow-xl bg-white/40 backdrop-blur-md rounded-xl">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:bg-blue-100/70">
                        <TableHead className="font-semibold text-indigo-900 py-4">
                          Contest
                        </TableHead>
                        <TableHead className="font-semibold text-indigo-900">
                          Platform
                        </TableHead>
                        <TableHead className="font-semibold text-indigo-900">
                          {view === "upcoming" ? "Starts In" : "Date"}
                        </TableHead>
                        <TableHead className="font-semibold text-indigo-900">
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
                          className="group hover:bg-blue-50/70 transition-colors duration-200"
                        >
                          <TableCell className="font-medium py-4">
                            <a
                              href={contest.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 flex items-center group/link"
                            >
                              <span className="line-clamp-1">
                                {contest.name}
                              </span>
                              <ExternalLink className="h-4 w-4 ml-1.5 opacity-0 group-hover/link:opacity-100 transition-opacity duration-200" />
                            </a>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`font-medium px-2.5 py-1 ${
                                contest.platform === "Codeforces"
                                  ? "bg-red-100 text-red-800 border-red-200"
                                  : contest.platform === "CodeChef"
                                  ? "bg-amber-100 text-amber-800 border-amber-200"
                                  : "bg-green-100 text-green-800 border-green-200"
                              }`}
                            >
                              {contest.platform}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {view === "upcoming" ? (
                              <span className="font-medium text-gray-900 flex items-center">
                                <Clock className="h-4 w-4 mr-1.5 text-blue-500" />
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
                                className={`text-gray-400 hover:text-yellow-500 transition-colors duration-200 ${
                                  contest.isBookmarked ? "bg-yellow-50" : ""
                                }`}
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
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hidden sm:flex items-center text-xs text-gray-500 hover:text-indigo-700 hover:bg-indigo-50"
                              >
                                Details
                                <ChevronRight className="h-3 w-3 ml-1" />
                              </Button>
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

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
          >
            <Card className="overflow-hidden border border-white/20 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur-sm rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-600">
                      Total Contests
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                      {contests.length}
                    </h3>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100">
                    <Trophy className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-green-600 font-medium flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                    12% increase
                  </span>
                  <span className="text-gray-500 ml-2">from last week</span>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border border-white/20 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 backdrop-blur-sm rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">
                      Bookmarked
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                      {contests.filter((c) => c.isBookmarked).length}
                    </h3>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100">
                    <Bookmark className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-purple-600 font-medium">
                    {Math.round(
                      (contests.filter((c) => c.isBookmarked).length /
                        contests.length) *
                        100
                    )}
                    % of total
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border border-white/20 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 backdrop-blur-sm rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-600">
                      Coming Up Today
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                      {
                        contests.filter((c) => {
                          const contestDate = new Date(c.startTime);
                          const today = new Date();
                          return (
                            contestDate.toDateString() === today.toDateString()
                          );
                        }).length
                      }
                    </h3>
                  </div>
                  <div className="p-3 rounded-full bg-amber-100">
                    <Calendar className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-amber-600 font-medium">
                    Today&apos;s contests
                  </span>
                  <span className="text-gray-500 ml-2">
                    across all platforms
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
