"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <nav
          className={`relative mx-auto max-w-7xl rounded-2xl border transition-all duration-300 ${
            scrolled
              ? "border-white/40 bg-white/90 backdrop-blur-lg shadow-lg"
              : "border-white/30 bg-gradient-to-r from-white/40 via-sky-50/40 to-white/40 backdrop-blur-md"
          }`}
        >
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-lg transition-all duration-300 flex items-center justify-center ${
                        scrolled
                          ? "bg-gradient-to-r from-sky-300 to-blue-300 shadow-md"
                          : "bg-gradient-to-r from-sky-200 to-blue-400 shadow-lg"
                      }`}
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6l4 2"
                        />
                      </svg>
                    </div>
                    <span
                      className={`text-xl font-bold transition-all duration-300 ${
                        scrolled
                          ? "text-gray-900"
                          : "text-gray-900/90 mix-blend-overlay"
                      }`}
                    >
                      Contest Tracker
                    </span>
                  </div>
                </div>
                <div className="hidden md:flex md:ml-10 md:space-x-8">
                  <Link
                    href="/features"
                    className="text-gray-600/90 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Features
                  </Link>
                  <Link
                    href="/benefits"
                    className="text-gray-600/90 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Benefits
                  </Link>
                  <Link
                    href="/pricing"
                    className="text-gray-600/90 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Pricing
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href="/sign-in"
                  className="text-gray-600/90 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-gradient-to-r from-sky-300 to-blue-200 hover:from-sky-400 hover:to-blue-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  Get Started
                  <svg
                    className="w-4 h-4"
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
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
