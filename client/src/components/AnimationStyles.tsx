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
          opacity: 0.6;
          transform: scale(1);
        }
        50% {
          opacity: 1;
          transform: scale(1.1);
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

      @keyframes twinkle {
        0%,
        100% {
          opacity: 0.2;
          transform: scale(0.8);
        }
        50% {
          opacity: 1;
          transform: scale(1.2);
        }
      }

      @keyframes orbit {
        0% {
          transform: rotate(0deg) translateX(10px) rotate(0deg);
        }
        100% {
          transform: rotate(360deg) translateX(10px) rotate(-360deg);
        }
      }

      @keyframes fall {
        0% {
          transform: translateY(0) rotate(0deg);
        }
        25% {
          transform: translateY(25vh) rotate(45deg);
        }
        50% {
          transform: translateY(50vh) rotate(90deg);
        }
        75% {
          transform: translateY(75vh) rotate(135deg);
        }
        100% {
          transform: translateY(100vh) rotate(180deg);
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

      .animate-twinkle {
        animation: twinkle 4s ease-in-out infinite;
      }

      .animate-orbit {
        animation: orbit 20s linear infinite;
      }

      .animate-fall {
        animation: fall 30s linear infinite;
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
