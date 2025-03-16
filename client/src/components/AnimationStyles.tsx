"use client";

export default function AnimationStyles() {
  return (
    <style jsx global>{`
      .bg-grid-pattern {
        background-image: linear-gradient(
            to right,
            rgba(0, 0, 0, 0.03) 1px,
            transparent 1px
          ),
          linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
        background-size: 64px 64px;
      }

      .bg-noise-pattern {
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        background-size: 200px 200px;
      }

      @keyframes float {
        0%,
        100% {
          transform: translateY(0) rotate(-4deg);
        }
        50% {
          transform: translateY(-20px) rotate(4deg);
        }
      }

      @keyframes float-delay {
        0%,
        100% {
          transform: translateY(0) rotate(4deg);
        }
        50% {
          transform: translateY(-20px) rotate(-4deg);
        }
      }

      @keyframes pulse-slow {
        0%,
        100% {
          opacity: 0.4;
        }
        50% {
          opacity: 0.6;
        }
      }

      @keyframes shimmer {
        0% {
          background-position: -200% center;
        }
        100% {
          background-position: 200% center;
        }
      }

      .animate-float {
        animation: float 20s ease-in-out infinite;
      }

      .animate-float-delay {
        animation: float-delay 20s ease-in-out infinite;
      }

      .animate-pulse-slow {
        animation: pulse-slow 8s ease-in-out infinite;
      }

      .animate-shimmer {
        background-size: 200% auto;
        animation: shimmer 6s linear infinite;
      }

      /* Add smooth transition for mobile menu */
      @media (max-width: 768px) {
        .nav-menu {
          transition: max-height 0.3s ease-in-out;
          max-height: 0;
          overflow: hidden;
        }

        .nav-menu.open {
          max-height: 400px;
        }
      }
    `}</style>
  );
}
