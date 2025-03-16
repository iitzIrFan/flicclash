import axios from "axios";
import cheerio from "cheerio";
import prisma from "../lib/prisma";
import { Platform } from "@prisma/client";

// Fetch contests from Codeforces
export async function fetchCodeforcesContests(): Promise<void> {
  try {
    const response = await axios.get("https://codeforces.com/api/contest.list");
    const contests = response.data.result;

    for (const contest of contests) {
      // Skip gym contests
      if (contest.type === "CF") {
        const startTime = new Date(contest.startTimeSeconds * 1000);
        const endTime = new Date(
          (contest.startTimeSeconds + contest.durationSeconds) * 1000
        );

        // Only save contests that are upcoming or ended in the last week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        if (endTime >= oneWeekAgo) {
          await prisma.contest.upsert({
            where: {
              platform_externalId: {
                platform: Platform.Codeforces,
                externalId: contest.id.toString(),
              },
            },
            update: {
              name: contest.name,
              startTime,
              endTime,
              url: `https://codeforces.com/contest/${contest.id}`,
              duration: Math.floor(contest.durationSeconds / 60), // Convert to minutes
            },
            create: {
              name: contest.name,
              platform: Platform.Codeforces,
              startTime,
              endTime,
              url: `https://codeforces.com/contest/${contest.id}`,
              duration: Math.floor(contest.durationSeconds / 60), // Convert to minutes
              externalId: contest.id.toString(),
            },
          });
        }
      }
    }
  } catch (error) {
    console.error("Error fetching Codeforces contests:", error);
    throw error;
  }
}

// Fetch contests from CodeChef
export async function fetchCodeChefContests(): Promise<void> {
  try {
    const response = await axios.get(
      "https://www.codechef.com/api/list/contests/all"
    );
    const { future_contests, present_contests, past_contests } = response.data;

    // Process future and present contests
    for (const contest of [...future_contests, ...present_contests]) {
      // Validate dates before creating Date objects
      if (!contest.start_date || !contest.end_date) {
        console.warn(
          `Skipping contest with invalid dates: ${contest.contest_code}`
        );
        continue;
      }

      // Try to parse dates with proper format
      try {
        // CodeChef dates might be in different formats, try ISO format first
        const startTime = new Date(contest.start_date);
        const endTime = new Date(contest.end_date);

        // Check if dates are valid
        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
          console.warn(
            `Skipping contest with invalid date format: ${contest.contest_code}`
          );
          continue;
        }

        const duration = Math.floor(
          (endTime.getTime() - startTime.getTime()) / (60 * 1000)
        );

        await prisma.contest.upsert({
          where: {
            platform_externalId: {
              platform: Platform.CodeChef,
              externalId: contest.contest_code,
            },
          },
          update: {
            name: contest.contest_name,
            startTime,
            endTime,
            url: `https://www.codechef.com/${contest.contest_code}`,
            duration,
          },
          create: {
            name: contest.contest_name,
            platform: Platform.CodeChef,
            startTime,
            endTime,
            url: `https://www.codechef.com/${contest.contest_code}`,
            duration,
            externalId: contest.contest_code,
          },
        });
      } catch (error) {
        console.warn(
          `Error processing contest ${contest.contest_code}:`,
          error
        );
        continue;
      }
    }

    // Process past contests from the last week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    for (const contest of past_contests) {
      const endTime = new Date(contest.end_date);
      if (endTime >= oneWeekAgo) {
        const startTime = new Date(contest.start_date);

        await prisma.contest.upsert({
          where: {
            platform_externalId: {
              platform: Platform.CodeChef,
              externalId: contest.contest_code,
            },
          },
          update: {
            name: contest.contest_name,
            startTime,
            endTime,
            url: `https://www.codechef.com/${contest.contest_code}`,
            duration: Math.floor(
              (endTime.getTime() - startTime.getTime()) / (60 * 1000)
            ), // Convert to minutes
          },
          create: {
            name: contest.contest_name,
            platform: Platform.CodeChef,
            startTime,
            endTime,
            url: `https://www.codechef.com/${contest.contest_code}`,
            duration: Math.floor(
              (endTime.getTime() - startTime.getTime()) / (60 * 1000)
            ), // Convert to minutes
            externalId: contest.contest_code,
          },
        });
      }
    }
  } catch (error) {
    console.error("Error fetching CodeChef contests:", error);
    throw error;
  }
}

export async function fetchLeetCodeContests(): Promise<void> {
  try {
    const response = await axios.get("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        query: `
            query {
              allContests {
                title
                titleSlug
                startTime
                duration
                description
              }
            }
          `,
      },
    });

    const contests = response.data.data.allContests;

    for (const contest of contests) {
      const startTime = new Date(contest.startTime * 1000);
      const endTime = new Date((contest.startTime + contest.duration) * 1000);

      // Only save contests that are upcoming or ended in the last week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      if (endTime >= oneWeekAgo) {
        await prisma.contest.upsert({
          where: {
            platform_externalId: {
              platform: Platform.LeetCode,
              externalId: contest.titleSlug,
            },
          },
          update: {
            name: contest.title,
            startTime,
            endTime,
            url: `https://leetcode.com/contest/${contest.titleSlug}`,
            duration: Math.floor(contest.duration / 60), // Convert to minutes
          },
          create: {
            name: contest.title,
            platform: Platform.LeetCode,
            startTime,
            endTime,
            url: `https://leetcode.com/contest/${contest.titleSlug}`,
            duration: Math.floor(contest.duration / 60), // Convert to minutes
            externalId: contest.titleSlug,
          },
        });
      }
    }
  } catch (error) {
    console.error("Error fetching LeetCode contests:", error);
    throw error;
  }
}

// Fetch all contests from all platforms
export async function fetchAllContests(): Promise<void> {
  try {
    await Promise.all([
      fetchCodeforcesContests(),
      fetchCodeChefContests(),
      fetchLeetCodeContests(),
    ]);
  } catch (error) {
    console.error("Error fetching all contests:", error);
    throw error;
  }
}
