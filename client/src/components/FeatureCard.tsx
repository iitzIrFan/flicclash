"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export function FeatureCard() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const triggerPosition = window.innerHeight * 0.3;

      if (scrollPosition > triggerPosition) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on initial load

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`mt-20 md:mt-32 transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
      }`}
    >
      <div className="text-center mb-8 md:mb-12 px-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
          <span className="bg-gradient-to-r from-blue-200 via-white to-purple-200 bg-clip-text text-transparent">
            Powerful Analytics at Your Fingertips
          </span>
        </h2>
        <p className="mt-3 md:mt-4 text-base md:text-xl text-white/80 max-w-3xl mx-auto">
          Visualize your data with beautiful, interactive dashboards
        </p>
      </div>

      <div className="mx-2 sm:mx-0 rounded-xl md:rounded-2xl overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] transform hover:scale-[1.02] transition-all duration-500 relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl md:rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative rounded-xl md:rounded-2xl overflow-hidden">
          <Image
            src="/pi.webp"
            alt="Analytics Dashboard"
            width={1200}
            height={675}
            className="w-full h-auto"
          />

          {/* Top corner overlay */}
          <div className="absolute top-0 left-0 right-0 h-16 md:h-24 bg-gradient-to-b from-black/60 via-black/30 to-transparent"></div>

          {/* Top corner content */}
          <div className="absolute top-0 left-0 p-4 md:p-8 lg:p-12">
            <div className="inline-block bg-blue-500/30 backdrop-blur-sm text-white text-xs md:text-sm font-medium px-3 py-1 md:px-4 md:py-2 rounded-full border border-blue-400/30">
              Featured
            </div>
          </div>

          {/* Bottom gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

          {/* Bottom content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 lg:p-12">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 md:gap-6">
              <div>
                <div className="inline-block bg-blue-500/30 backdrop-blur-sm text-white text-xs md:text-sm font-medium px-3 py-1 md:px-4 md:py-2 rounded-full border border-blue-400/30 mb-2 md:mb-4">
                  Premium Dashboard
                </div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-2 drop-shadow-lg">
                  Interactive Data Visualization
                </h3>
                <p className="text-white/90 max-w-xl text-sm md:text-base lg:text-lg">
                  Transform complex data into actionable insights with our
                  intuitive dashboard
                </p>
              </div>

              <Link
                href="/sign-up"
                className="mt-4 md:mt-0 inline-flex items-center bg-white hover:bg-blue-50 text-blue-900 px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm md:text-lg font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Try it Now
                <svg
                  className="ml-2 w-4 h-4 md:w-5 md:h-5"
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
      </div>
    </div>
  );
}
