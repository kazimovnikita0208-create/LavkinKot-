"use client";

import { motion } from "framer-motion";

function ElegantShape({
  className,
  delay = 0,
  width = 200,
  height = 60,
  rotate = 0,
  colorStart = "rgba(244, 162, 97, 0.08)",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  colorStart?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -100,
        rotate: rotate - 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1 },
      }}
      style={{
        position: 'absolute',
        ...parsePositionClass(className),
      }}
    >
      <motion.div
        animate={{
          y: [0, 12, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '9999px',
            background: `linear-gradient(90deg, ${colorStart}, transparent)`,
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 8px 32px 0 rgba(244, 162, 97, 0.25), 0 4px 16px 0 rgba(38, 73, 92, 0.2)',
          }}
        />
      </motion.div>
    </motion.div>
  );
}

function parsePositionClass(className?: string) {
  const styles: any = {};
  if (!className) return styles;
  
  if (className.includes('left-[-30%]')) styles.left = '-30%';
  if (className.includes('left-[-10%]')) styles.left = '-10%';
  if (className.includes('left-[10%]')) styles.left = '10%';
  if (className.includes('right-[-25%]')) styles.right = '-25%';
  if (className.includes('right-[5%]')) styles.right = '5%';
  if (className.includes('top-[8%]')) styles.top = '8%';
  if (className.includes('top-[65%]')) styles.top = '65%';
  if (className.includes('top-[12%]')) styles.top = '12%';
  if (className.includes('top-[3%]')) styles.top = '3%';
  if (className.includes('bottom-[15%]')) styles.bottom = '15%';
  
  return styles;
}

export function AnimatedBackground() {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
    }}>
      {/* Градиентный фон */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 30% 20%, rgba(244, 162, 97, 0.08), transparent 50%), radial-gradient(circle at 70% 80%, rgba(38, 73, 92, 0.12), transparent 50%)',
        filter: 'blur(60px)',
      }} />

      {/* Геометрические формы */}
      <ElegantShape
        delay={0.3}
        width={280}
        height={80}
        rotate={12}
        colorStart="rgba(244, 162, 97, 0.2)"
        className="left-[-30%] top-[8%]"
      />

      <ElegantShape
        delay={0.5}
        width={240}
        height={70}
        rotate={-15}
        colorStart="rgba(38, 73, 92, 0.25)"
        className="right-[-25%] top-[65%]"
      />

      <ElegantShape
        delay={0.4}
        width={180}
        height={50}
        rotate={-8}
        colorStart="rgba(244, 162, 97, 0.18)"
        className="left-[-10%] bottom-[15%]"
      />

      <ElegantShape
        delay={0.6}
        width={120}
        height={40}
        rotate={20}
        colorStart="rgba(38, 73, 92, 0.22)"
        className="right-[5%] top-[12%]"
      />

      <ElegantShape
        delay={0.7}
        width={100}
        height={30}
        rotate={-25}
        colorStart="rgba(244, 162, 97, 0.15)"
        className="left-[10%] top-[3%]"
      />

      {/* Виньетка */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(26, 47, 58, 0.8), transparent 30%, rgba(26, 47, 58, 0.3) 100%)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}
