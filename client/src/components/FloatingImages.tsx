"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function FloatingImages() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Icon image floating on the left */}

      {/* Be image floating on the right - moved higher */}
      <div
        className={`absolute top-[10%] right-[8%] transform transition-all duration-1000 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}
        style={{ animationDelay: "0.6s" }}
      >
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-64 md:h-64 animate-float-delay">
          <Image
            src="/be.png"
            alt="Be"
            fill
            className="object-contain drop-shadow-lg"
          />
        </div>
      </div>

      {/* Small decorative elements - adjusted for mobile */}
      <div className="absolute top-[40%] left-[15%] w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-400/20 backdrop-blur-sm animate-pulse-slow"></div>
      <div
        className="absolute top-[60%] right-[20%] w-4 h-4 md:w-6 md:h-6 rounded-full bg-purple-400/20 backdrop-blur-sm animate-pulse-slow"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-[30%] left-[30%] w-3 h-3 md:w-4 md:h-4 rounded-full bg-green-400/20 backdrop-blur-sm animate-pulse-slow"
        style={{ animationDelay: "1.5s" }}
      ></div>
    </div>
  );
}
