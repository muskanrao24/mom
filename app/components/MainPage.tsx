"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Cake from "./Cake";
import WelcomeScreen from "./WelcomeScreen";
import { PopperAnimationProvider } from "../context/PopperContext";
import { ConfigProvider, useConfig } from "../context/ConfigContext";

export default function MothersDay() {
  const [showCake, setShowCake] = useState(false);
  const [glowColor, setGlowColor] = useState("#FFA500");
  const { get } = useConfig();

  useEffect(() => {
    const storedGlowColor = get("background_color", "#FFA500");
    setGlowColor(storedGlowColor);
  }, []);

  const handleContinue = () => {
    setShowCake(true);
  };

  return (
    <ConfigProvider>
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
                glowColor={glowColor}
              />
            ) : (
              <Cake key="cake" />
            )}
          </AnimatePresence>
        </div>
      </PopperAnimationProvider>
    </ConfigProvider>
  );
}
