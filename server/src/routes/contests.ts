import express from "express";
import prisma from "../lib/prisma";

const router = express.Router();

// Get all contests
router.get("/", async (req, res) => {
  try {
    const { past, platform } = req.query;
    const now = new Date();

    // Build the where clause based on query parameters
    let whereClause: any = {};

    // Filter by platform if specified
    if (platform) {
      whereClause.platform = platform;
    }

    // Filter by past or upcoming
    if (past === "true") {
      whereClause.endTime = { lt: now };
    } else if (past === "false") {
      whereClause.startTime = { gt: now };
    } else {
      // If no filter is specified, return contests from the last week and upcoming
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      whereClause.OR = [
        { startTime: { gt: now } }, // Upcoming contests
        {
          AND: [{ endTime: { lt: now } }, { endTime: { gt: oneWeekAgo } }],
        }, // Past contests from the last week
      ];
    }

    const contests = await prisma.contest.findMany({
      where: whereClause,
      orderBy: { startTime: "asc" },
    });

    // Transform the data to match the expected format in the frontend
    const transformedContests = contests.map((contest) => ({
      id: contest.id.toString(),
      name: contest.name,
      platform: contest.platform,
      startTime: contest.startTime,
      endTime: contest.endTime,
      url: contest.url,
      solutionUrl: contest.solutionUrl || undefined,
      duration: contest.duration,
    }));

    res.json(transformedContests);
  } catch (error) {
    console.error("Error fetching contests:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a specific contest by ID
router.get("/:id", async (req, res) => {
  try {
    const contestId = parseInt(req.params.id);

    if (isNaN(contestId)) {
      return res.status(400).json({ message: "Invalid contest ID" });
    }

    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
    });

    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }

    // Transform the data to match the expected format in the frontend
    const transformedContest = {
      id: contest.id.toString(),
      name: contest.name,
      platform: contest.platform,
      startTime: contest.startTime,
      endTime: contest.endTime,
      url: contest.url,
      solutionUrl: contest.solutionUrl || undefined,
      duration: contest.duration,
    };

    res.json(transformedContest);
  } catch (error) {
    console.error("Error fetching contest:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
