"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function IntegrationSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const triggerPosition = window.innerHeight * 0.8;

      if (scrollPosition > triggerPosition) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-16">
        {/* Left Side - Integration Icons */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <div className="relative w-[500px] h-[500px]">
            <div className="absolute inset-0 rounded-full border border-gray-200 opacity-20"></div>

            {/* Integration Icons */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-white rounded-lg shadow-md flex items-center justify-center mb-2">
                    <img
                      src="/icons/slack.svg"
                      alt="Slack"
                      className="w-10 h-10"
                    />
                  </div>
                  <span className="text-xs uppercase tracking-wider text-gray-500">
                    Slack
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-white rounded-lg shadow-md flex items-center justify-center mb-2">
                    <img
                      src="/icons/discord.svg"
                      alt="Discord"
                      className="w-10 h-10"
                    />
                  </div>
                  <span className="text-xs uppercase tracking-wider text-gray-500">
                    Discord
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-white rounded-lg shadow-md flex items-center justify-center mb-2">
                    <img
                      src="/icons/teams.svg"
                      alt="MS Teams"
                      className="w-10 h-10"
                    />
                  </div>
                  <span className="text-xs uppercase tracking-wider text-gray-500">
                    MS Teams
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-white rounded-lg shadow-md flex items-center justify-center mb-2">
                    <img
                      src="/icons/discourse.svg"
                      alt="Discourse"
                      className="w-10 h-10"
                    />
                  </div>
                  <span className="text-xs uppercase tracking-wider text-gray-500">
                    Discourse
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-white rounded-lg shadow-md flex items-center justify-center mb-2">
                    <img
                      src="/icons/email.svg"
                      alt="Email"
                      className="w-10 h-10"
                    />
                  </div>
                  <span className="text-xs uppercase tracking-wider text-gray-500">
                    Email
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-white rounded-lg shadow-md flex items-center justify-center mb-2">
                    <img
                      src="/icons/chat.svg"
                      alt="Chat"
                      className="w-10 h-10"
                    />
                  </div>
                  <span className="text-xs uppercase tracking-wider text-gray-500">
                    Chat
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-white rounded-lg shadow-md flex items-center justify-center mb-2">
                    <img
                      src="/icons/forms.svg"
                      alt="Forms"
                      className="w-10 h-10"
                    />
                  </div>
                  <span className="text-xs uppercase tracking-wider text-gray-500">
                    Forms
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-white rounded-lg shadow-md flex items-center justify-center mb-2">
                    <img src="/icons/api.svg" alt="API" className="w-10 h-10" />
                  </div>
                  <span className="text-xs uppercase tracking-wider text-gray-500">
                    API
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Text Content */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Deliver instant support everywhere. From one place.
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Contest Tracker organizes and consolidates all your competitive
            programming platforms. Work through your contests in one
            lightning-fast, beautiful interface.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg text-lg font-medium transition-all"
          >
            Get Started
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
