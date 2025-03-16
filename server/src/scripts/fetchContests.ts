import prisma from "../lib/prisma";
import { fetchAllContests } from "../services/contestFetcher";

async function main() {
  try {
    console.log("Starting to fetch contests...");
    await fetchAllContests();
    console.log("Successfully fetched contests");

    // Log the number of contests in the database
    const contestCount = await prisma.contest.count();
    console.log(`Total contests in database: ${contestCount}`);

    // Log upcoming contests
    const now = new Date();
    const upcomingContests = await prisma.contest.findMany({
      where: {
        startTime: {
          gt: now,
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    console.log("\nUpcoming contests:");
    upcomingContests.forEach((contest) => {
      console.log(`${contest.name} (${contest.platform}) - Starts at ${contest.startTime}`);
    });

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 