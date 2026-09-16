import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function InteractiveDataViz() {
  const containerRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Generate network nodes
  useEffect(() => {
    const generateNodes = () => {
      const nodeCount = 25;
      const generatedNodes = [];
      for (let i = 0; i < nodeCount; i++) {
        generatedNodes.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 2 + Math.random() * 4,
          opacity: 0.3 + Math.random() * 0.4,
          delay: Math.random() * 2,
        });
      }
      setNodes(generatedNodes);
    };
    generateNodes();
  }, []);

  // Mouse tracking
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  // Scroll-based animation
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const parallax = scrollY * 0.3;
      if (containerRef.current) {
        containerRef.current.style.transform = `translateY(${parallax}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ transition: "transform 0.1s ease-out" }}
    >
      {/* Network Graph */}
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d4b8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0066ff" stopOpacity="0.4" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connections */}
        {nodes.map((node, i) =>
          nodes
            .slice(i + 1)
            .filter((other) => {
              const dx = node.x - other.x;
              const dy = node.y - other.y;
              return Math.sqrt(dx * dx + dy * dy) < 20;
            })
            .map((other, j) => (
              <motion.line
                key={`${i}-${j}`}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${other.x}%`}
                y2={`${other.y}%`}
                stroke="url(#nodeGradient)"
                strokeWidth="0.5"
                opacity={node.opacity * 0.3}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: node.delay }}
              />
            ))
        )}

        {/* Nodes */}
        {nodes.map((node) => (
          <motion.circle
            key={node.id}
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r={node.size}
            fill="url(#nodeGradient)"
            opacity={node.opacity}
            filter="url(#glow)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: node.opacity }}
            transition={{
              duration: 1,
              delay: node.delay,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 3,
            }}
            style={{
              transformOrigin: `${node.x}% ${node.y}%`,
            }}
          />
        ))}
      </svg>

      {/* Interactive Scatter Plot Overlay */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-32 h-32"
        style={{
          x: useSpring(mouseX, { stiffness: 100, damping: 30 }),
          y: useSpring(mouseY, { stiffness: 100, damping: 30 }),
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-20">
          {[...Array(15)].map((_, i) => (
            <motion.circle
              key={i}
              cx={10 + (i * 6) % 80}
              cy={10 + ((i * 13) % 80)}
              r={1 + (i % 3)}
              fill="#00d4b8"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.6, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: i * 0.05,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 2,
              }}
            />
          ))}
        </svg>
      </motion.div>

      {/* Animated Data Stream */}
      <div className="absolute bottom-1/3 left-1/4 w-48 h-24 opacity-10">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent"
            style={{
              width: `${30 + i * 10}%`,
              top: `${i * 12}%`,
            }}
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 200, opacity: [0, 0.5, 0] }}
            transition={{
              duration: 3,
              delay: i * 0.2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          />
        ))}
      </div>

      {/* Pulse Rings */}
      <motion.div
        className="absolute top-1/2 left-1/2"
        style={{
          x: springX,
          y: springY,
        }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-teal-500"
            style={{
              width: 40 + i * 20,
              height: 40 + i * 20,
              left: -(20 + i * 10),
              top: -(20 + i * 10),
            }}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{
              duration: 2,
              delay: i * 0.4,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}