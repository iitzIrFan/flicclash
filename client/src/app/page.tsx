import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AnimationStyles from "@/components/AnimationStyles";
import NavBar from "@/components/NavBar";
import Image from "next/image";

export default async function Home() {
  const user = await currentUser();
  if (user) redirect("/dashboard");

  return (
    <main className="min-h-screen overflow-hidden relative">
      <AnimationStyles />

      <div className="absolute inset-0 z-0">
        <Image
          src="/bg.jpg"
          alt="Background"
          fill
          priority
          className="object-cover"
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50/70 via-white/60 to-blue-50/70 mix-blend-overlay"></div>
      </div>

      <div className="absolute inset-0 bg-grid-pattern opacity-3"></div>
      <div className="absolute inset-0 bg-noise-pattern opacity-[0.10]"></div>
      <div className="absolute -left-32 -top-32 w-96 h-96 bg-sky-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delay"></div>
      <div className="absolute left-1/2 top-1/3 w-64 h-64 bg-gradient-to-r from-white via-sky-100 to-white rounded-full mix-blend-overlay filter blur-2xl opacity-30 animate-pulse-slow"></div>

      <NavBar />

      <div className="pt-24 relative z-10">
        <div className="relative pt-24 pb-16 sm:pt-32 sm:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* New Tag */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                <span className="text-xs font-medium text-gray-600">New</span>
                <span className="flex items-center gap-1 text-xs font-medium text-sky-300">
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
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-b from-sky-400 via-gray-600 to-gray-900 bg-clip-text text-transparent pb-2.5 font-medium">
                  Perfect Every Step for
                  <br />
                  Extraordinary Growth.
                </span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
                Enhance your competitive programming journey with intelligent
                targeted strategies and never miss an opportunity.
              </p>
            </div>

            {/* CTA Buttons */}
          </div>
        </div>
      </div>
    </main>
  );
}
