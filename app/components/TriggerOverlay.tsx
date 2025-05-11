import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useConfig } from "../context/ConfigContext";

export type CakeOverlayProps = {
  isVisible: boolean;
  onRestart: () => void;
};

export default function CakeOverlay({
  isVisible,
  onRestart,
}: CakeOverlayProps) {
  const [greetingsText, setGreetingsText] = useState("");
  const [subGreetingsText, setSubGreetingsText] = useState("");
  const { get } = useConfig();

  useEffect(() => {
    const storedText = get("greetings_text", "Happy Mother's Day Ma!!");
    const storedSubText = get("sub_greetings_text", "You're the best!");
    setSubGreetingsText(storedSubText);
    setGreetingsText(storedText);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background:
              "radial-gradient(circle at center, rgba(255,182,193,0.2), transparent 70%)",
            pointerEvents: "none",
            zIndex: 10,
            padding: "2rem",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="greetings-text"
            style={{
              fontSize: "3rem",
              fontWeight: 700,
              color: "#fff",
              textAlign: "center",
              textShadow: "0 0 10px rgba(255, 105, 180, 0.7)",
              marginTop: "4rem",
              animation: "float 4s ease-in-out infinite",
            }}
          >
            {greetingsText}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            style={{
              fontSize: "1.25rem",
              color: "#ffdef0",
              textAlign: "center",
              marginTop: "1rem",
              maxWidth: "80%",
              textShadow: "0 0 6px rgba(255, 105, 180, 0.4)",
            }}
          >
            {subGreetingsText}
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            onClick={onRestart}
            className="restart-button"
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.75rem",
              backgroundColor: "#FF69B4",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              pointerEvents: "auto",
              marginTop: "auto",
              marginBottom: "1rem",
              animation: "pulse 2s ease-in-out infinite",
              boxShadow: `
      0 0 5px #ff69b4,
      0 0 10px #ff69b4,
      0 0 20px #ff69b4,
      0 0 30px rgba(255, 105, 180, 0.6)
    `,
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            whileHover={{
              scale: 1.1,
              boxShadow: `
      0 0 6px #ff69b4,
      0 0 12px #ff69b4,
      0 0 24px #ff69b4,
      0 0 36px rgba(255, 105, 180, 0.8)
    `,
            }}
            whileTap={{ scale: 0.9 }}
          >
            Make Another Wish
          </motion.button>

          {/* Floating and pulse keyframes */}
          <style jsx>{`
            @keyframes float {
              0% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-10px);
              }
              100% {
                transform: translateY(0);
              }
            }
            @keyframes pulse {
              0% {
                box-shadow: 0 0 0 0 rgba(255, 105, 180, 0.5);
              }
              70% {
                box-shadow: 0 0 0 10px rgba(255, 105, 180, 0);
              }
              100% {
                box-shadow: 0 0 0 0 rgba(255, 105, 180, 0);
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
