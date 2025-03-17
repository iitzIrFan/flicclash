"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Star = {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  fallDistance: number;
};

export function StarryBackground() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate random stars
    const generateStars = () => {
      const newStars: Star[] = [];
      const starCount = Math.min(window.innerWidth / 15, 50); // Responsive star count

      for (let i = 0; i < starCount; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100, // percentage
          y: Math.random() * 100, // percentage
          size: Math.random() * 3 + 1, // 1-4px
          opacity: Math.random() * 0.5 + 0.3, // 0.3-0.8
          duration: Math.random() * 15 + 20, // 20-35s - slower falling
          delay: Math.random() * -20, // Stagger the animations
          fallDistance: Math.random() * 30 + 20, // 20-50% of screen height
        });
      }
      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <>
      {/* Falling stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, ${
                star.opacity
              })`,
            }}
            animate={{
              y: [`0%`, `${star.fallDistance}%`],
              x: [`0%`, `${Math.random() * 10 - 5}%`], // Slight horizontal drift
              opacity: [
                star.opacity,
                star.opacity * 1.2,
                star.opacity * 0.8,
                star.opacity * 1.1,
                star.opacity * 0.7,
              ],
              scale: [1, 1.1, 0.9, 1.2, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Star regeneration at top */}
      <div className="fixed top-0 left-0 right-0 h-20 pointer-events-none z-10">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={`top-star-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 10 + 5}px`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              opacity: Math.random() * 0.5 + 0.3,
              boxShadow: `0 0 ${Math.random() * 6 + 2}px rgba(255, 255, 255, ${
                Math.random() * 0.5 + 0.3
              })`,
            }}
            animate={{
              y: [0, 1000],
              opacity: [0, 0.7, 0.5, 0.8, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 25,
              repeat: Infinity,
              delay: Math.random() * 20,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </>
  );
}
