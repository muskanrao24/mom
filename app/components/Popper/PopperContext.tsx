import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";

interface PopperContextType {
  triggerPopper: () => void;
}

const PopperContext = createContext<PopperContextType | null>(null);

export const usePopperAnimation = () => {
  const ctx = useContext(PopperContext);
  if (!ctx) throw new Error("Wrap your app with <PopperAnimationProvider>");
  return ctx.triggerPopper;
};

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  rotation: number;
  rotationSpeed: number;
};

export const PopperAnimationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number | null>(null);
  const resize = () => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    }
  };

  useEffect(() => {
    window.addEventListener("resize", resize);
    resize();
    return () => window.removeEventListener("resize", resize);
  }, []);

  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15; // gravity
      p.rotation += p.rotationSpeed;
      p.alpha -= 0.008;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    });

    particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0);

    if (particlesRef.current.length > 0) {
      frameRef.current = requestAnimationFrame(animate);
    } else {
      frameRef.current = null;
    }
  };

  const triggerPopper = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = canvas;
    const originX = width / 2;
    const originY = height - 60;

    const particles = Array.from({ length: 80 }, () => {
      // 30 - 150deg
      const angle = Math.random() * ((Math.PI * 2) / 3) + Math.PI / 6;
      const speed = Math.random() * 6 + 6;
      const vx = Math.cos(angle) * speed;
      const vy = -Math.sin(angle) * speed - 4;

      return {
        x: originX,
        y: originY,
        vx,
        vy,
        size: Math.random() * 12 + 4,
        color: `${Math.floor(Math.random() * 255)},${Math.floor(
          Math.random() * 255
        )},${Math.floor(Math.random() * 255)}`,
        alpha: 1,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      };
    });

    particlesRef.current.push(...particles);
    if (!frameRef.current) animate();
  }, []);

  return (
    <PopperContext.Provider value={{ triggerPopper }}>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
      {children}
    </PopperContext.Provider>
  );
};
