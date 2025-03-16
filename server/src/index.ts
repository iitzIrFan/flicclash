import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";

// Import routes
import contestRoutes from "./routes/contests";
import bookmarkRoutes from "./routes/bookmarks";
import userRoutes from "./routes/users";
import adminRoutes from "./routes/admin";

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
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/contests", contestRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// Health check route
app.get("/health", (req, res) => {
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

  // Initial contest fetch on server start
  fetchAllContests()
    .then(() => console.log("Initial contests fetched successfully"))
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
