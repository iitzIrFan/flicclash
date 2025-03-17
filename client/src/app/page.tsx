"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import AnimationStyles from "@/components/AnimationStyles";
import NavBar from "@/components/NavBar";
import Image from "next/image";
import { FeatureCard } from "@/components/FeatureCard";
import { FloatingImages } from "@/components/FloatingImages";
import { HeroGlow } from "@/components/HeroGlow";
import { FaqSection } from "@/components/FaqSection";
import { StarryBackground } from "@/components/StarryBackground";

export default function Home() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) router.push("/dashboard");
  }, [isSignedIn, router]);

  return (
    <main className="min-h-screen overflow-hidden relative">
      <AnimationStyles />
      <StarryBackground />

      <div className="absolute inset-0 z-0">
        <Image
          src="/sow.jpg"
          alt="Background"
          fill
          priority
          className="object-cover"
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/30 via-purple-900/20 to-blue-900/30 mix-blend-multiply"></div>
      </div>

      <div className="absolute inset-0 bg-grid-pattern opacity-3"></div>
      <div className="absolute inset-0 bg-noise-pattern opacity-[0.10]"></div>

      <NavBar />

      <div className="pt-16 md:pt-24 relative z-10">
        <div className="relative pt-16 md:pt-24 pb-16 sm:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-8"></div>

            {/* Floating animated images - hidden on small screens */}
            <div className="hidden md:block">
              <FloatingImages />
            </div>

            {/* Hero glow effect */}
            <HeroGlow />

            <div className="text-center max-w-4xl mx-auto relative">
              <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-blue-500/20 rounded-full filter blur-3xl"></div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight relative">
                <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent pb-2.5 font-medium drop-shadow-sm">
                  Clean and Modern Template for
                  <br className="hidden sm:block" />
                  Elevating SaaS Products
                </span>
              </h1>
              <p className="mt-4 md:mt-6 text-base md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md px-2">
                Whether you are launching a new SaaS platform or revitalizing
                your existing website, our template offers the perfect balance
                of aesthetics and usability.
              </p>

              <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4 sm:px-0">
                <button className="px-6 md:px-8 py-3 md:py-4 bg-white rounded-lg text-indigo-900 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 hover:bg-blue-50 text-sm md:text-base">
                  Get Started
                </button>
                <button className="px-6 md:px-8 py-3 md:py-4 bg-transparent border border-white/30 backdrop-blur-sm rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 hover:bg-white/10 text-sm md:text-base">
                  Learn More
                </button>
              </div>
            </div>

            {/* Featured Image */}
            <div className="mt-12 md:mt-16 flex justify-center px-2 sm:px-0">
              <div className="relative w-full max-w-5xl rounded-xl md:rounded-2xl overflow-hidden shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
                <Image
                  src="/img.png"
                  alt="Product Screenshot"
                  width={1200}
                  height={675}
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent group-hover:from-black/20 transition-all duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                    <svg
                      className="w-3 h-3 md:w-4 md:h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    View Details
                  </span>
                </div>
              </div>
            </div>

            {/* Feature Card with pi.webp */}
            <FeatureCard />
          </div>
        </div>
      </div>

      {/* FAQ Section - Full width with beige background */}
      <FaqSection />
    </main>
  );
}
