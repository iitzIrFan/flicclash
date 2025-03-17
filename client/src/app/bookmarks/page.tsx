"use client";

import { useState, useEffect } from "react";
import { useAuth, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { StarryBackground } from "@/components/StarryBackground";

import {
  Clock,
  Search,
  Trash2,
  ExternalLink,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BookmarkedContest {
  id: string;
  name: string;
  platform: string;
  startTime: string;
  url: string;
  difficulty?: string;
}

export default function BookmarksPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [bookmarkedContests, setBookmarkedContests] = useState<
    BookmarkedContest[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    } else {
      // Simulate fetching bookmarked contests
      setTimeout(() => {
        setBookmarkedContests([
          {
            id: "1",
            name: "Codeforces Round #789",
            platform: "Codeforces",
            startTime: new Date(Date.now() + 86400000).toISOString(),
            url: "https://codeforces.com",
            difficulty: "Hard",
          },
          {
            id: "2",
            name: "LeetCode Weekly Contest",
            platform: "LeetCode",
            startTime: new Date(Date.now() + 172800000).toISOString(),
            url: "https://leetcode.com",
            difficulty: "Medium",
          },
          // Add more sample contests as needed
        ]);
        setIsLoading(false);
      }, 1000);
    }
  }, [isLoaded, isSignedIn, router]);

  const filteredContests = bookmarkedContests.filter((contest) => {
    const matchesSearch = contest.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesPlatform =
      selectedPlatform === "all" || contest.platform === selectedPlatform;
    return matchesSearch && matchesPlatform;
  });

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

  if (!isLoaded || isLoading) {
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/tp.jpg"
          alt="Background"
          fill
          priority
          className="object-cover"
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-white/30 to-blue-900/10 backdrop-blur-[2px]"></div>
      </div>

      <StarryBackground />

      {/* Content */}
      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/dashboard")}
              className="bg-white/50 hover:bg-white/70 transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Bookmarked Contests
            </h1>
          </div>
          <UserButton afterSignOutUrl="/" />
        </motion.div>

        {/* Search and filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-6 bg-white/50 backdrop-blur-sm border border-white/20">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search bookmarks..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/50 border border-white/20 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  {["all", "Codeforces", "LeetCode", "CodeChef"].map(
                    (platform) => (
                      <Button
                        key={platform}
                        variant={
                          selectedPlatform === platform ? "default" : "outline"
                        }
                        onClick={() => setSelectedPlatform(platform)}
                        className={`${
                          selectedPlatform === platform
                            ? "bg-indigo-500 text-white"
                            : "bg-white/50 hover:bg-white/70"
                        } transition-all duration-200`}
                      >
                        {platform === "all" ? "All Platforms" : platform}
                      </Button>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bookmarked contests grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContests.map((contest, index) => (
            <motion.div
              key={contest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="group bg-white/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border border-white/20">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <Badge
                      variant="outline"
                      className={`${
                        contest.platform === "Codeforces"
                          ? "bg-red-100 text-red-800 border-red-200"
                          : contest.platform === "CodeChef"
                          ? "bg-amber-100 text-amber-800 border-amber-200"
                          : "bg-green-100 text-green-800 border-green-200"
                      }`}
                    >
                      {contest.platform}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => {
                        // Handle remove bookmark
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    <a
                      href={contest.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-indigo-600 flex items-start gap-1 group-hover:gap-2 transition-all duration-200"
                    >
                      {contest.name}
                      <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </a>
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(contest.startTime).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Clock className="h-4 w-4" />
                    <span>{getTimeRemaining(contest.startTime)}</span>
                  </div>
                  {contest.difficulty && (
                    <div className="mt-3">
                      <Badge
                        variant="outline"
                        className={`${
                          contest.difficulty === "Hard"
                            ? "bg-red-50 text-red-600 border-red-100"
                            : contest.difficulty === "Medium"
                            ? "bg-yellow-50 text-yellow-600 border-yellow-100"
                            : "bg-green-50 text-green-600 border-green-100"
                        }`}
                      >
                        {contest.difficulty}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
