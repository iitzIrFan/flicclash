import express from "express";
import prisma from "../lib/prisma";
import { verifyClerkJWT, verifyAdmin } from "../middleware/auth";

const router = express.Router();

// Check if user is an admin
router.get("/check", verifyClerkJWT, async (req, res) => {
  try {
    const clerkId = req.auth?.userId;

    if (!clerkId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Forbidden: Not an admin" });
    }

    res.json({ isAdmin: true });
  } catch (error) {
    console.error("Error checking admin status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all past contests for solution management
router.get("/solutions", verifyClerkJWT, verifyAdmin, async (req, res) => {
  try {
    const now = new Date();

    const pastContests = await prisma.contest.findMany({
      where: {
        endTime: { lt: now },
      },
      orderBy: {
        endTime: "desc",
      },
    });

    // Transform to match expected format in frontend
    const transformedContests = pastContests.map((contest) => ({
      id: contest.id.toString(),
      name: contest.name,
      platform: contest.platform,
      startTime: contest.startTime,
      endTime: contest.endTime,
      url: contest.url,
      solutionUrl: contest.solutionUrl || undefined,
    }));

    res.json(transformedContests);
  } catch (error) {
    console.error("Error fetching past contests:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add or update solution URL for a contest
router.post("/solutions", verifyClerkJWT, verifyAdmin, async (req, res) => {
  try {
    const { contestId, solutionUrl } = req.body;

    if (!contestId || !solutionUrl) {
      return res
        .status(400)
        .json({ message: "Contest ID and solution URL are required" });
    }

    // Update the contest with the solution URL
    const contest = await prisma.contest.update({
      where: { id: parseInt(contestId) },
      data: { solutionUrl },
    });

    res.json({
      id: contest.id.toString(),
      name: contest.name,
      solutionUrl: contest.solutionUrl,
    });
  } catch (error) {
    console.error("Error updating solution URL:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
