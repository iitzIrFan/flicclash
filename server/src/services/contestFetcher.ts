import { Platform } from "@prisma/client";
import axios from "axios";
import prisma from "../lib/prisma";

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
      "https://www.codechef.com/api/list/contests/all",
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      }
    );

    console.log("CodeChef API Response:", response.data); // Debug log

    const { future_contests, present_contests, past_contests } = response.data;

    // Process future and present contests
    for (const contest of [...future_contests, ...present_contests]) {
      try {
        // Parse dates using the ISO format provided by the API
        const startTime = new Date(contest.contest_start_date_iso);
        const endTime = new Date(contest.contest_end_date_iso);

        // Check if dates are valid
        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
          console.warn(
            `Skipping contest with invalid date format: ${contest.contest_code}`,
            contest.contest_start_date_iso,
            contest.contest_end_date_iso
          );
          continue;
        }

        const duration = Math.floor(
          (endTime.getTime() - startTime.getTime()) / (60 * 1000)
        );

        console.log(`Processing CodeChef contest: ${contest.contest_name}`, {
          startTime,
          endTime,
          duration
        });

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
      try {
        // Parse dates using the ISO format provided by the API
        const startTime = new Date(contest.contest_start_date_iso);
        const endTime = new Date(contest.contest_end_date_iso);

        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
          console.warn(
            `Skipping past contest with invalid date format: ${contest.contest_code}`,
            contest.contest_start_date_iso,
            contest.contest_end_date_iso
          );
          continue;
        }

        if (endTime >= oneWeekAgo) {
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
        }
      } catch (error) {
        console.warn(
          `Error processing past contest ${contest.contest_code}:`,
          error
        );
        continue;
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
