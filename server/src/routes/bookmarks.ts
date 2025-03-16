import express from "express";
import prisma from "../lib/prisma";
import { verifyClerkJWT } from "../middleware/auth";

const router = express.Router();

// Get all bookmarks for the current user
router.get("/", verifyClerkJWT, async (req, res) => {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get all bookmarks with contest details
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      include: {
        contest: true,
      },
    });

    // Transform to match expected format in frontend
    const transformedBookmarks = bookmarks.map((bookmark) => ({
      id: bookmark.id.toString(),
      contestId: bookmark.contestId.toString(),
      userId: bookmark.userId,
      name: bookmark.contest.name,
      platform: bookmark.contest.platform,
      startTime: bookmark.contest.startTime,
      endTime: bookmark.contest.endTime,
      url: bookmark.contest.url,
      solutionUrl: bookmark.contest.solutionUrl || undefined,
    }));

    res.json(transformedBookmarks);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add a bookmark
router.post("/", verifyClerkJWT, async (req, res) => {
  try {
    const userId = req.auth?.userId;
    const { contestId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!contestId) {
      return res.status(400).json({ message: "Contest ID is required" });
    }

    // Check if the contest exists
    const contest = await prisma.contest.findUnique({
      where: { id: parseInt(contestId) },
    });

    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }

    // Check if user exists, create if not
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: req.auth?.email || "unknown@example.com",
        },
      });
    }

    // Create bookmark if it doesn't exist
    const bookmark = await prisma.bookmark.upsert({
      where: {
        userId_contestId: {
          userId: userId,
          contestId: parseInt(contestId),
        },
      },
      update: {},
      create: {
        userId: userId,
        contestId: parseInt(contestId),
      },
    });

    res.status(201).json(bookmark);
  } catch (error) {
    console.error("Error creating bookmark:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a bookmark
router.delete("/", verifyClerkJWT, async (req, res) => {
  try {
    const userId = req.auth?.userId;
    const { contestId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!contestId) {
      return res.status(400).json({ message: "Contest ID is required" });
    }

    // Delete the bookmark
    await prisma.bookmark.delete({
      where: {
        userId_contestId: {
          userId: userId,
          contestId: parseInt(contestId),
        },
      },
    });

    res.json({ message: "Bookmark deleted successfully" });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
