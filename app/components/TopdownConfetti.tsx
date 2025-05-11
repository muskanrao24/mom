import React, { useEffect, useRef } from "react";

export default function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const confettiCount = 150;
    const confetti: {
      x: number;
      y: number;
      r: number;
      d: number;
      color: string;
      tilt: number;
      tiltAngle: number;
      tiltAngleIncrement: number;
    }[] = [];

    const colors = ["#FF69B4", "#FFD700", "#00CED1", "#ADFF2F", "#FF6347"];

    for (let i = 0; i < confettiCount; i++) {
      confetti.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        r: Math.random() * 6 + 4,
        d: Math.random() * confettiCount,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngle: 0,
        tiltAngleIncrement: Math.random() * 0.1 + 0.05,
      });
    }

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      confetti.forEach((c) => {
        ctx.beginPath();
        ctx.lineWidth = c.r;
        ctx.strokeStyle = c.color;
        ctx.moveTo(c.x + c.tilt + c.r / 2, c.y);
        ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r);
        ctx.stroke();
      });

      update();
      requestAnimationFrame(draw);
    };

    const update = () => {
      confetti.forEach((c) => {
        c.tiltAngle += c.tiltAngleIncrement;
        c.y += (Math.cos(c.d) + 3 + c.r / 2) * 0.6;
        c.x += Math.sin(0.5);
        c.tilt = Math.sin(c.tiltAngle) * 15;

        if (c.y > height) {
          c.y = -10;
          c.x = Math.random() * width;
        }
      });
    };

    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 5,
        pointerEvents: "none",
      }}
    />
  );
}
