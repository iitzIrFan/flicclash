import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AnimationStyles from "@/components/AnimationStyles";
import NavBar from "@/components/NavBar";

export default async function Home() {
  const user = await currentUser();
  if (user) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 overflow-hidden relative">
      <AnimationStyles />

      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute -left-32 -top-32 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delay"></div>

      {/* Sticky Navbar */}
      <NavBar />

      {/* Add padding to account for fixed navbar */}
      <div className="pt-24">
        {/* Hero Section */}
        <div className="relative pt-24 pb-16 sm:pt-32 sm:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* New Tag */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                <span className="text-xs font-medium text-gray-600">New</span>
                <span className="flex items-center gap-1 text-xs font-medium text-orange-600">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Smart AI Features
                </span>
              </div>
            </div>

            {/* Main Heading */}
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight">
                Perfect Every Step for{" "}
                <span className="text-orange-500">Extraordinary Growth.</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
                Enhance your competitive programming journey with intelligent
                targeted strategies and never miss an opportunity.
              </p>
            </div>

            {/* Stats Section */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Active Users Card */}
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total active users</p>
                    <p className="text-2xl font-bold text-gray-900">150K+</p>
                  </div>
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Contest Stats Card */}
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all">
                <div>
                  <p className="text-sm text-gray-500">Monthly Contests</p>
                  <p className="text-2xl font-bold text-gray-900">
                    <span className="text-green-500">↑</span> 5,490
                  </p>
                </div>
              </div>

              {/* Solutions Card */}
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all">
                <div>
                  <p className="text-sm text-gray-500">Available Solutions</p>
                  <p className="text-2xl font-bold text-gray-900">8,370+</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-12 flex justify-center gap-4">
              <Link
                href="/sign-up"
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Start Free Trial
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
              <Link
                href="/demo"
                className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-xl text-lg font-medium transition-all shadow-lg hover:shadow-xl border border-gray-200"
              >
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
