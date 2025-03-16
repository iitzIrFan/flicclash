import express from "express";
import prisma from "../lib/prisma";
import { verifyClerkJWT } from "../middleware/auth";

const router = express.Router();

// Get user preferences
router.get("/preferences", verifyClerkJWT, async (req, res) => {
  try {
    const clerkId = req.auth?.userId;

    if (!clerkId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      // Create a new user with default preferences
      user = await prisma.user.create({
        data: {
          clerkId,
          email: req.auth?.email || "unknown@example.com",
        },
      });
    }

    // Return user preferences
    const preferences = {
      platforms: {
        Codeforces: user.codeforces,
        CodeChef: user.codechef,
        LeetCode: user.leetcode,
      },
      notificationType: user.notificationType,
      reminderTime: user.reminderTime,
      phoneNumber: user.phoneNumber || "",
    };

    res.json(preferences);
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user preferences
router.post("/preferences", verifyClerkJWT, async (req, res) => {
  try {
    const clerkId = req.auth?.userId;
    const { platforms, notificationType, reminderTime, phoneNumber } = req.body;

    if (!clerkId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Validate input
    if (!platforms || !notificationType || reminderTime === undefined) {
      return res.status(400).json({ message: "Invalid preferences format" });
    }

    // Update or create user
    const user = await prisma.user.upsert({
      where: { clerkId },
      update: {
        codeforces: platforms.Codeforces,
        codechef: platforms.CodeChef,
        leetcode: platforms.LeetCode,
        notificationType,
        reminderTime,
        phoneNumber: phoneNumber || null,
      },
      create: {
        clerkId,
        email: req.auth?.email || "unknown@example.com",
        codeforces: platforms.Codeforces,
        codechef: platforms.CodeChef,
        leetcode: platforms.LeetCode,
        notificationType,
        reminderTime,
        phoneNumber: phoneNumber || null,
      },
    });

    // Return updated preferences
    const preferences = {
      platforms: {
        Codeforces: user.codeforces,
        CodeChef: user.codechef,
        LeetCode: user.leetcode,
      },
      notificationType: user.notificationType,
      reminderTime: user.reminderTime,
      phoneNumber: user.phoneNumber || "",
    };

    res.json(preferences);
  } catch (error) {
    console.error("Error updating user preferences:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
