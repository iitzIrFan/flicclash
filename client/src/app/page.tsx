

import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();

  // If user is logged in, redirect to dashboard
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-900 to-black text-white">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-5xl font-bold mb-6">Contest Tracker</h1>
        <p className="text-xl mb-8">
          Track upcoming and past coding contests from Codeforces, CodeChef, and
          LeetCode all in one place.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-blue-800 bg-opacity-50 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-3">Track Contests</h2>
            <p>
              Stay updated with all upcoming contests from major competitive
              programming platforms.
            </p>
          </div>

          <div className="bg-blue-800 bg-opacity-50 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-3">Bookmark</h2>
            <p>
              Save contests you are interested in and get reminders before they
              start.
            </p>
          </div>

          <div className="bg-blue-800 bg-opacity-50 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-3">Solutions</h2>
            <p>
              Access contest solutions from our YouTube channel after the
              contest ends.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/sign-in"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="bg-transparent hover:bg-white hover:text-blue-900 text-white font-bold py-3 px-8 rounded-lg border-2 border-white transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}
