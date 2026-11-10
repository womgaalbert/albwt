import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

const NODE_COUNT = 25;
const LINK_DISTANCE = 20;
// How far, in pixels, the overlays drift when the pointer reaches the hero's edge.
const POINTER_TRAVEL = 60;

function createNodes() {
  return Array.from({ length: NODE_COUNT }, (_, id) => ({
    id,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 4,
    opacity: 0.3 + Math.random() * 0.4,
    delay: Math.random() * 2,
  }));
}

export default function InteractiveDataViz() {
  const containerRef = useRef(null);
  const [nodes] = useState(createNodes);
  const reducedMotion = useReducedMotion();
  const inView = useInView(containerRef);
  const animate = inView && !reducedMotion;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const followX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const followY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  // Tracked on window because the container ignores pointer events.
  useEffect(() => {
    if (reducedMotion) return undefined;
    const handleMouseMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect || rect.width === 0 || rect.height === 0) return;
      mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * POINTER_TRAVEL);
      mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * POINTER_TRAVEL);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return undefined;
    let frame = 0;
    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`;
        }
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      {/* Network graph: static connections, softly pulsing nodes */}
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--brand-blue))" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {nodes.map((node, i) =>
          nodes
            .slice(i + 1)
            .filter((other) => Math.hypot(node.x - other.x, node.y - other.y) < LINK_DISTANCE)
            .map((other) => (
              <line
                key={`${node.id}-${other.id}`}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${other.x}%`}
                y2={`${other.y}%`}
                stroke="hsl(var(--primary))"
                strokeWidth="0.5"
                opacity={node.opacity * 0.3}
              />
            ))
        )}

        {nodes.map((node) => (
          <motion.circle
            key={node.id}
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r={node.size}
            fill="url(#nodeGradient)"
            initial={{ opacity: node.opacity }}
            animate={animate ? { opacity: [node.opacity, node.opacity * 0.35, node.opacity] } : { opacity: node.opacity }}
            transition={{ duration: 4, delay: node.delay, repeat: animate ? Infinity : 0, ease: "easeInOut" }}
          />
        ))}
      </svg>

      {animate && (
        <>
          {/* Scatter plot that follows the pointer */}
          <motion.div className="absolute top-1/4 right-1/4 w-32 h-32" style={{ x: followX, y: followY }}>
            <svg viewBox="0 0 100 100" className="w-full h-full opacity-20">
              {[...Array(15)].map((_, i) => (
                <motion.circle
                  key={i}
                  cx={10 + ((i * 6) % 80)}
                  cy={10 + ((i * 13) % 80)}
                  r={1 + (i % 3)}
                  fill="hsl(var(--primary))"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ duration: 0.8, delay: i * 0.05, repeat: Infinity, repeatType: "reverse", repeatDelay: 2 }}
                />
              ))}
            </svg>
          </motion.div>

          {/* Data stream */}
          <div className="absolute bottom-1/3 left-1/4 w-48 h-24 opacity-10">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
                style={{ width: `${30 + i * 10}%`, top: `${i * 12}%` }}
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: 200, opacity: [0, 0.5, 0] }}
                transition={{ duration: 3, delay: i * 0.2, repeat: Infinity, repeatDelay: 1 }}
              />
            ))}
          </div>

          {/* Pulse rings that follow the pointer */}
          <motion.div className="absolute top-1/2 left-1/2" style={{ x: springX, y: springY }}>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-primary"
                style={{ width: 40 + i * 20, height: 40 + i * 20, left: -(20 + i * 10), top: -(20 + i * 10) }}
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 2, delay: i * 0.4, repeat: Infinity, repeatDelay: 1 }}
              />
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}
