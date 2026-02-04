"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AirplaneBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">

      {/* BIG PLANE */}
      <motion.div
        initial={{ x: "-30%", y: "60%", rotate: -10, opacity: 0.25 }}
        animate={{ x: "120%", y: "10%", rotate: 10, opacity: 0.35 }}
        transition={{
          duration: 22,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        }}
        className="absolute"
      >
        <Image
          src="/airplane.png"
          alt="Airplane"
          width={320}
          height={160}
          className="opacity-60"
        />
      </motion.div>

      {/* SMALL PLANE */}
      <motion.div
        initial={{ x: "-40%", y: "20%", rotate: 8, opacity: 0.15 }}
        animate={{ x: "110%", y: "50%", rotate: -5, opacity: 0.25 }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        }}
        className="absolute"
      >
        <Image
          src="/airplane.png"
          alt="Airplane small"
          width={180}
          height={90}
          className="opacity-30"
        />
      </motion.div>
    </div>
  );
}
