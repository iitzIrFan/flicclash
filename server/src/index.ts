import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import cron from "node-cron";

// Import routes
import adminRoutes from "./routes/admin";
import bookmarkRoutes from "./routes/bookmarks";
import contestRoutes from "./routes/contests";
import userRoutes from "./routes/users";

// Import services
import { fetchAllContests } from "./services/contestFetcher";
import { sendReminders } from "./services/notificationService";

// Import Prisma client
import prisma from "./lib/prisma";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/contests", contestRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// Health check route
app.get("/health", (req, res) => {
  console.log("Health check requested");
  res.status(200).json({ status: "ok" });
});

// Schedule tasks
// Fetch contests every 6 hours
cron.schedule("0 */6 * * *", async () => {
  console.log("Fetching contests...");
  try {
    await fetchAllContests();
    console.log("Contests fetched successfully");
  } catch (error) {
    console.error("Error fetching contests:", error);
  }
});

// Check for reminders every 15 minutes
cron.schedule("*/15 * * * *", async () => {
  console.log("Checking for reminders...");
  try {
    await sendReminders();
    console.log("Reminders checked successfully");
  } catch (error) {
    console.error("Error checking reminders:", error);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS enabled for origin: ${process.env.CLIENT_URL || "http://localhost:3000"}`);

  // Initial contest fetch on server start
  fetchAllContests()
    .then(() => {
      console.log("Initial contests fetched successfully");
      // Log the number of contests in the database
      prisma.contest.count()
        .then(count => console.log(`Total contests in database: ${count}`))
        .catch(err => console.error("Error counting contests:", err));
    })
    .catch((err) => console.error("Error fetching initial contests:", err));
});

// Handle graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Disconnected from database");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  console.log("Disconnected from database");
  process.exit(0);
});

export default app;
