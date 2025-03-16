"use client";

import { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

interface NotificationPreferences {
  platforms: {
    Codeforces: boolean;
    CodeChef: boolean;
    LeetCode: boolean;
  };
  notificationType: "email" | "sms" | "both";
  reminderTime: number; // minutes before contest
}

export default function Settings() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    platforms: {
      Codeforces: true,
      CodeChef: true,
      LeetCode: true,
    },
    notificationType: "email",
    reminderTime: 60, // 1 hour by default
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Fetch user preferences
    const fetchPreferences = async () => {
      try {
        const response = await fetch("/api/user/preferences");
        if (response.ok) {
          const data = await response.json();
          setPreferences(data);
          setPhoneNumber(data.phoneNumber || "");
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  const handlePlatformToggle = (
    platform: keyof typeof preferences.platforms
  ) => {
    setPreferences((prev) => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [platform]: !prev.platforms[platform],
      },
    }));
  };

  const handleNotificationTypeChange = (type: "email" | "sms" | "both") => {
    setPreferences((prev) => ({
      ...prev,
      notificationType: type,
    }));
  };

  const handleReminderTimeChange = (minutes: number) => {
    setPreferences((prev) => ({
      ...prev,
      reminderTime: minutes,
    }));
  };

  const savePreferences = async () => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      const response = await fetch("/api/user/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...preferences,
          phoneNumber:
            preferences.notificationType !== "email" ? phoneNumber : undefined,
        }),
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        throw new Error("Failed to save preferences");
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900"
            >
              Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Notification Preferences
          </h2>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">
              Platforms
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              Select the platforms you want to receive notifications for:
            </p>

            <div className="space-y-2">
              {Object.keys(preferences.platforms).map((platform) => (
                <div key={platform} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`platform-${platform}`}
                    checked={
                      preferences.platforms[
                        platform as keyof typeof preferences.platforms
                      ]
                    }
                    onChange={() =>
                      handlePlatformToggle(
                        platform as keyof typeof preferences.platforms
                      )
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`platform-${platform}`}
                    className="ml-2 block text-gray-700"
                  >
                    {platform}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">
              Notification Type
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              How would you like to receive notifications?
            </p>

            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="notification-email"
                  name="notification-type"
                  checked={preferences.notificationType === "email"}
                  onChange={() => handleNotificationTypeChange("email")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label
                  htmlFor="notification-email"
                  className="ml-2 block text-gray-700"
                >
                  Email
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="notification-sms"
                  name="notification-type"
                  checked={preferences.notificationType === "sms"}
                  onChange={() => handleNotificationTypeChange("sms")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label
                  htmlFor="notification-sms"
                  className="ml-2 block text-gray-700"
                >
                  SMS
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="notification-both"
                  name="notification-type"
                  checked={preferences.notificationType === "both"}
                  onChange={() => handleNotificationTypeChange("both")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label
                  htmlFor="notification-both"
                  className="ml-2 block text-gray-700"
                >
                  Both
                </label>
              </div>
            </div>

            {(preferences.notificationType === "sms" ||
              preferences.notificationType === "both") && (
              <div className="mt-4">
                <label
                  htmlFor="phone-number"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone-number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (123) 456-7890"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter your phone number with country code for SMS
                  notifications.
                </p>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">
              Reminder Time
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              How long before the contest should we remind you?
            </p>

            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="reminder-30"
                  name="reminder-time"
                  checked={preferences.reminderTime === 30}
                  onChange={() => handleReminderTimeChange(30)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label
                  htmlFor="reminder-30"
                  className="ml-2 block text-gray-700"
                >
                  30 minutes before
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="reminder-60"
                  name="reminder-time"
                  checked={preferences.reminderTime === 60}
                  onChange={() => handleReminderTimeChange(60)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label
                  htmlFor="reminder-60"
                  className="ml-2 block text-gray-700"
                >
                  1 hour before
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="reminder-180"
                  name="reminder-time"
                  checked={preferences.reminderTime === 180}
                  onChange={() => handleReminderTimeChange(180)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label
                  htmlFor="reminder-180"
                  className="ml-2 block text-gray-700"
                >
                  3 hours before
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="reminder-1440"
                  name="reminder-time"
                  checked={preferences.reminderTime === 1440}
                  onChange={() => handleReminderTimeChange(1440)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label
                  htmlFor="reminder-1440"
                  className="ml-2 block text-gray-700"
                >
                  1 day before
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={savePreferences}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Preferences"}
            </button>

            {saveSuccess && (
              <span className="text-green-600 font-medium">
                Preferences saved successfully!
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Bookmarked Contests
          </h2>

          <Link
            href="/bookmarks"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            View all bookmarked contests
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </main>
    </div>
  );
}
