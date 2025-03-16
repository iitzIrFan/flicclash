"use client";

export default function AnimationStyles() {
  return (
    <style jsx global>{`
      .bg-grid-pattern {
        background-image: linear-gradient(
            to right,
            rgba(0, 0, 0, 0.05) 1px,
            transparent 1px
          ),
          linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
        background-size: 64px 64px;
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

      .animate-float {
        animation: float 20s ease-in-out infinite;
      }

      .animate-float-delay {
        animation: float-delay 20s ease-in-out infinite;
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
