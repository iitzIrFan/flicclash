import { Request, Response, NextFunction } from "express";
import { Clerk } from "@clerk/clerk-sdk-node";
import dotenv from "dotenv";
import prisma from "../lib/prisma";

dotenv.config();

// Initialize Clerk
const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

// Extend Express Request type to include auth property
declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        email?: string;
      };
    }
  }
}

// Middleware to verify Clerk JWT
export const verifyClerkJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify the token with Clerk
    const { sub, email } = await clerk.verifyToken(token);

    if (!sub) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // Add user info to request
    req.auth = {
      userId: sub,
      email: typeof email === "string" ? email : undefined,
    };

    next(); // Call next to continue to the next middleware/route handler
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// Middleware to verify admin status
export const verifyAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.auth?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if user is an admin
    const user = await prisma.user.findUnique({
      where: { clerkId: req.auth.userId },
    });

    if (!user || !user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Forbidden: Admin access required" });
    }

    next();
  } catch (error) {
    console.error("Admin verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
