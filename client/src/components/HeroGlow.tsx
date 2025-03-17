"use client";

import { useEffect, useState } from "react";

export function HeroGlow() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated glow effects - adjusted for mobile */}
      <div
        className={`absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-blue-500/10 rounded-full filter blur-3xl transition-opacity duration-1000 ${
          isVisible ? "opacity-60" : "opacity-0"
        }`}
        style={{ animationDelay: "0.2s" }}
      ></div>

      <div
        className={`absolute top-1/3 right-1/4 w-40 h-40 sm:w-56 sm:h-56 md:w-80 md:h-80 bg-purple-500/10 rounded-full filter blur-3xl transition-opacity duration-1000 ${
          isVisible ? "opacity-60" : "opacity-0"
        }`}
        style={{ animationDelay: "0.5s" }}
      ></div>

      <div
        className={`absolute bottom-1/4 left-1/3 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-indigo-500/10 rounded-full filter blur-3xl transition-opacity duration-1000 ${
          isVisible ? "opacity-60" : "opacity-0"
        }`}
        style={{ animationDelay: "0.8s" }}
      ></div>
    </div>
  );
}
