import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo } from "react";

interface CandleProps {
  blowStrength: number; // 0 (no blow) → 1 (full blow)
  noFlame?: boolean; // Optional prop to extinguish the flame
}

export default function Candle({
  blowStrength = 0,
  noFlame = false,
}: CandleProps) {
  const springConfig = { stiffness: 150, damping: 8, mass: 0.8 };
  const strength = useSpring(blowStrength, springConfig);

  const skewAmount = useTransform(strength, [0, 1], [2, 25]);
  const flameHeight = useTransform(strength, [0, 1], [35, 30]);
  const flameWidth = useTransform(strength, [0, 1], [15, 13]);
  const scaleY = useTransform(strength, [0, 1], [1, 0.3]);
  const scaleX = useTransform(strength, [0, 1], [1, 0.5]);

  const flameVariants = useMemo(() => {
    const blowFactor = Math.min(Math.max(blowStrength, 0), 1);
    const idleAmplitude = 3 + blowFactor * 7;
    const idleSpeed = 2 - blowFactor * 0.8;

    return {
      idle: {
        skewX: [
          0,
          idleAmplitude,
          -idleAmplitude * 0.8,
          idleAmplitude * 1.2,
          -idleAmplitude * 0.5,
          idleAmplitude * 0.7,
          0,
        ],
        rotate: [
          0,
          idleAmplitude * 0.4,
          -idleAmplitude * 0.3,
          idleAmplitude * 0.5,
          -idleAmplitude * 0.2,
          0,
        ],
        opacity: 1,
        scale: 1,
        boxShadow: [
          `0 0 10px rgba(255,165,0,${
            0.6 - blowFactor * 0.2
          }), 0 0 20px rgba(255,165,0,${
            0.4 - blowFactor * 0.1
          }), 0 0 60px rgba(255,165,0,${
            0.2 - blowFactor * 0.05
          }), 0 0 80px rgba(255,165,0,0.1)`,
          `0 0 12px rgba(255,165,0,${
            0.7 - blowFactor * 0.3
          }), 0 0 25px rgba(255,165,0,${
            0.5 - blowFactor * 0.2
          }), 0 0 65px rgba(255,165,0,${
            0.3 - blowFactor * 0.1
          }), 0 0 85px rgba(255,165,0,0.2)`,
          `0 0 10px rgba(255,165,0,${
            0.6 - blowFactor * 0.2
          }), 0 0 20px rgba(255,165,0,${
            0.4 - blowFactor * 0.1
          }), 0 0 60px rgba(255,165,0,${
            0.2 - blowFactor * 0.05
          }), 0 0 80px rgba(255,165,0,0.1)`,
        ],
      },
      extinguish: {
        opacity: 0,
        scale: 0.3,
        boxShadow: "0 0 0px rgba(0,0,0,0)",
        transition: {
          duration: 0.5,
          ease: "easeOut",
        },
      },
      transition: {
        duration: idleSpeed,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror",
      },
    };
  }, [blowStrength]);

  useEffect(() => {
    strength.set(blowStrength);
  }, [blowStrength, strength]);

  return (
    <motion.div
      style={{
        position: "absolute",
        backgroundColor: "orange",
        width: flameWidth,
        height: flameHeight,
        borderRadius: "10px 10px 10px 10px / 25px 25px 10px 10px",
        top: -34,
        left: "50%",
        marginLeft: -7.5,
        zIndex: 10,
        transformOrigin: "50% 90%",
        skewX: skewAmount,
        scaleY,
        scaleX,
      }}
      animate={noFlame ? "extinguish" : "idle"}
      variants={flameVariants}
      transition={
        noFlame ? flameVariants.extinguish.transition : flameVariants.transition
      }
    />
  );
}
