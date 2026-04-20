import React, { useMemo } from "react";

export default function Spiral(props) {
  const {
    totalDots = 600,
    dotRadius = 2,
    duration = 3,
    dotColor = "#FFFFFF",
    backgroundColor = "#000000",
    margin = 2,
    minOpacity = 0.3,
    maxOpacity = 1,
    minScale = 0.5,
    maxScale = 1.5,
  } = props;

  const dots = useMemo(() => {
    const SIZE = 400;
    const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
    const CENTER = SIZE / 2;
    const MAX_RADIUS = CENTER - margin - dotRadius;
    const items = [];

    for (let i = 0; i < totalDots; i++) {
      const idx = i + 0.5;
      const frac = idx / totalDots;
      const r = Math.sqrt(frac) * MAX_RADIUS;
      const theta = idx * GOLDEN_ANGLE;
      const x = CENTER + r * Math.cos(theta);
      const y = CENTER + r * Math.sin(theta);
      const delay = frac * duration;

      items.push(
        <circle
          key={i}
          cx={x}
          cy={y}
          r={dotRadius}
          fill={dotColor}
          style={{
            transformOrigin: `${x}px ${y}px`,
            animation: `spiral-pulse ${duration}s infinite cubic-bezier(0.4, 0, 0.6, 1)`,
            animationDelay: `${delay}s`,
          }}
        />
      );
    }
    return items;
  }, [totalDots, dotRadius, duration, dotColor, margin]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        ...props.style,
      }}
    >
      <style>{`
        @keyframes spiral-pulse {
          0% { transform: scale(${minScale}); opacity: ${minOpacity}; }
          50% { transform: scale(${maxScale}); opacity: ${maxOpacity}; }
          100% { transform: scale(${minScale}); opacity: ${minOpacity}; }
        }
      `}</style>
      <svg
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid meet"
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "800px",
          maxHeight: "800px",
          willChange: "transform",
        }}
      >
        {dots}
      </svg>
    </div>
  );
}

Spiral.displayName = "Spiral";