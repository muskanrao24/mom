"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Cake from "./Cake";
import WelcomeScreen from "./WelcomeScreen";
import { PopperAnimationProvider } from "./Popper/PopperContext";

export default function MothersDay() {
  const [showCake, setShowCake] = useState(false);

  const handleContinue = () => {
    setShowCake(true);
  };

  return (
    <PopperAnimationProvider>
      <div
        style={{
          display: "grid",
          placeItems: "center",
          width: "100vw",
          height: "100vh",
          margin: 0,
          padding: 0,
          backgroundColor: "#333",
          fontSize: "1.5rem",
          overflow: "hidden", // Prevent any potential scrolling issues
          position: "relative", // For proper overlay positioning
        }}
      >
        <AnimatePresence mode="wait">
          {!showCake ? (
            <WelcomeScreen
              key="welcome"
              onContinue={handleContinue}
              glowColor="#FFA500"
            />
          ) : (
            <Cake key="cake" />
          )}
        </AnimatePresence>
      </div>
    </PopperAnimationProvider>
  );
}
