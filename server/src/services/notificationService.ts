import nodemailer from "nodemailer";
import twilio from "twilio";
import prisma from "../lib/prisma";
import dotenv from "dotenv";

dotenv.config();

// Configure email transporter
const emailTransporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Configure Twilio client
const twilioClient =
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

// Send email notification
async function sendEmailNotification(
  email: string,
  contestName: string,
  platform: string,
  startTime: Date,
  url: string
): Promise<void> {
  try {
    const formattedTime = startTime.toLocaleString();

    await emailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Reminder: ${contestName} starts soon`,
      html: `
        <h1>Contest Reminder</h1>
        <p>Hello,</p>
        <p>This is a reminder that <strong>${contestName}</strong> on ${platform} starts at ${formattedTime}.</p>
        <p>You can access the contest here: <a href="${url}">${url}</a></p>
        <p>Good luck!</p>
        <p>Contest Tracker Team</p>
      `,
    });

    console.log(`Email notification sent to ${email} for ${contestName}`);
  } catch (error) {
    console.error("Error sending email notification:", error);
    throw error;
  }
}

// Send SMS notification
async function sendSMSNotification(
  phoneNumber: string,
  contestName: string,
  platform: string,
  startTime: Date
): Promise<void> {
  if (!twilioClient || !process.env.TWILIO_PHONE_NUMBER) {
    console.warn("Twilio not configured. Skipping SMS notification.");
    return;
  }

  try {
    const formattedTime = startTime.toLocaleString();

    await twilioClient.messages.create({
      body: `Reminder: ${contestName} on ${platform} starts at ${formattedTime}. Good luck!`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    console.log(`SMS notification sent to ${phoneNumber} for ${contestName}`);
  } catch (error) {
    console.error("Error sending SMS notification:", error);
    throw error;
  }
}

// Send reminders for upcoming contests
export async function sendReminders(): Promise<void> {
  try {
    const now = new Date();

    // Get all bookmarks that haven't had reminders sent yet
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        reminderSent: false,
        contest: {
          startTime: { gt: now },
        },
      },
      include: {
        user: true,
        contest: true,
      },
    });

    for (const bookmark of bookmarks) {
      // Check if the contest is in the user's preferred platforms
      const isPlatformEnabled =
        (bookmark.contest.platform === "Codeforces" &&
          bookmark.user.codeforces) ||
        (bookmark.contest.platform === "CodeChef" && bookmark.user.codechef) ||
        (bookmark.contest.platform === "LeetCode" && bookmark.user.leetcode);

      if (!isPlatformEnabled) {
        continue;
      }

      // Calculate time until contest starts
      const timeUntilStart =
        bookmark.contest.startTime.getTime() - now.getTime();
      const minutesUntilStart = timeUntilStart / (60 * 1000);

      // Check if it's time to send a reminder
      if (
        minutesUntilStart <= bookmark.user.reminderTime &&
        minutesUntilStart > 0
      ) {
        // Send notifications based on user preference
        if (
          bookmark.user.notificationType === "email" ||
          bookmark.user.notificationType === "both"
        ) {
          await sendEmailNotification(
            bookmark.user.email,
            bookmark.contest.name,
            bookmark.contest.platform,
            bookmark.contest.startTime,
            bookmark.contest.url
          );
        }

        if (
          (bookmark.user.notificationType === "sms" ||
            bookmark.user.notificationType === "both") &&
          bookmark.user.phoneNumber
        ) {
          await sendSMSNotification(
            bookmark.user.phoneNumber,
            bookmark.contest.name,
            bookmark.contest.platform,
            bookmark.contest.startTime
          );
        }

        // Mark reminder as sent
        await prisma.bookmark.update({
          where: { id: bookmark.id },
          data: { reminderSent: true },
        });
      }
    }
  } catch (error) {
    console.error("Error sending reminders:", error);
    throw error;
  }
}
