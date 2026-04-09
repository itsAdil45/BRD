"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function RouteLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Show loader on route change
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500); // adjust as needed
    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fullscreen-loader">
      <div className="dots">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="dot"
            initial={{ y: 0, opacity: 0.3 }}
            animate={{ y: [-8, 8, -8], opacity: [0.3, 1, 0.3] }}
            transition={{
              repeat: Infinity,
              duration: 0.6,
              ease: "easeIn",
              delay: i * 0.2,
            }}
          >
            <div
              style={{
                width: "15px",
                height: "15px",
                borderRadius: "50%",
                background: "#02ab86",
                display: "inline-block",
              }}
            ></div>
          </motion.span>
        ))}
      </div>

      <style jsx>{`
        .fullscreen-loader {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999;
          background: white;
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .dot {
          font-size: 4rem;
          margin: 0 8px;
          color: #02ab86;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
