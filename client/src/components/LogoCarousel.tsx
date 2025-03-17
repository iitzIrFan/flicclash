"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function LogoCarousel() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const triggerPosition = window.innerHeight * 0.5;

      if (scrollPosition > triggerPosition) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`mt-24 w-full overflow-hidden transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div
            className="flex items-center justify-center w-full overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 12.5%, rgb(0, 0, 0) 87.5%, rgba(0, 0, 0, 0) 100%)",
            }}
          >
            <div
              className="flex items-center gap-14 animate-carousel"
              style={{
                display: "flex",
                width: "100%",
                height: "100%",
                maxWidth: "100%",
                maxHeight: "100%",
                placeItems: "center",
                margin: 0,
                padding: 0,
                listStyleType: "none",
                gap: "56px",
                position: "relative",
                flexDirection: "row",
                willChange: "transform",
              }}
            >
              {/* Logo Items */}
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-32 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                <Image
                  src="/logos/stytch.svg"
                  alt="Stytch"
                  width={100}
                  height={100}
                  className="h-8"
                />
              </div>
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-32 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                <Image
                  src="/logos/mintify.svg"
                  alt="Mintify"
                  width={100}
                  height={100}
                  className="h-8"
                />
              </div>
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-32 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                <Image
                  src="/logos/sanity.svg"
                  alt="Sanity"
                  width={100}
                  height={100}
                  className="h-8"
                />
              </div>
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-32 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                <Image
                  src="/logos/evervault.svg"
                  alt="Evervault"
                  width={100}
                  height={100}
                  className="h-8"
                />
              </div>
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-32 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                <Image
                  src="/logos/kick.svg"
                  alt="Kick"
                  width={100}
                  height={100}
                  className="h-8"
                />
              </div>
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-32 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                <Image
                  src="/logos/granola.svg"
                  alt="Granola"
                  width={100}
                  height={100}
                  className="h-8"
                />
              </div>
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-32 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                <Image
                  src="/logos/galileo.svg"
                  alt="Galileo"
                  width={100}
                  height={100}
                  className="h-8"
                />
              </div>
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-32 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                <Image
                  src="/logos/raycast.svg"
                  alt="Raycast"
                  width={100}
                  height={100}
                  className="h-8"
                />
              </div>
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-32 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                <Image
                  src="/logos/laravel.svg"
                  alt="Laravel"
                  width={100}
                  height={100}
                  className="h-8"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
