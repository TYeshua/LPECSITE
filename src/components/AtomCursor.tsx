import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

const AtomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });
  const [isMagnetic, setIsMagnetic] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Mouse position values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring configurations for smooth movement
  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Track cursor visibility and position
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      
      const target = e.target as HTMLElement;
      const magneticElement = target.closest('a, button, [data-cursor="magnetic"]');

      if (magneticElement) {
        setIsMagnetic(true);
        setIsHovering(true);
        
        const rect = magneticElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Snap to center but with a slight pull towards actual mouse
        const pullFactor = 0.2;
        const finalX = centerX + (e.clientX - centerX) * pullFactor;
        const finalY = centerY + (e.clientY - centerY) * pullFactor;
        
        mouseX.set(finalX);
        mouseY.set(finalY);
      } else {
        setIsMagnetic(false);
        setIsHovering(target.closest('a, button, input, textarea, [role="button"]') !== null);
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible, mouseX, mouseY]);

  // Size and rotation transforms
  const scale = useSpring(isHovering ? 2.5 : 1, springConfig);
  const rotate = useMotionValue(0);
  
  // Animation loop for atom rotation
  useEffect(() => {
    let animationFrame: number;
    const animate = () => {
      rotate.set(rotate.get() + (isHovering ? 2 : 1));
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [isHovering]);

  if (typeof window === 'undefined') return null;

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.2s' }}
    >
      <motion.div
        className="absolute top-0 left-0"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            scale: isClicking ? 0.8 : scale.get(),
          }}
          transition={{ duration: 0.1 }}
          className="relative flex items-center justify-center w-8 h-8"
        >
          {/* Nucleus */}
          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(255,109,0,0.8)]" />

          {/* Orbits */}
          <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 40 40">
            <motion.g style={{ rotate }}>
              {/* Path 1 */}
              <ellipse 
                cx="20" cy="20" rx="18" ry="6" 
                fill="none" 
                stroke="rgba(255,109,0,0.5)" 
                strokeWidth="1"
                transform="rotate(0 20 20)" 
              />
              <motion.circle 
                r="1.2" fill="#fff" 
                animate={{ 
                  offsetDistance: ["0%", "100%"] 
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{ 
                  offsetPath: "path('M 2 20 A 18 6 0 1 0 38 20 A 18 6 0 1 0 2 20')",
                  offsetDistance: "0%" 
                }}
                className="shadow-[0_0_6px_#fff]"
              />

              {/* Path 2 */}
              <ellipse 
                cx="20" cy="20" rx="18" ry="6" 
                fill="none" 
                stroke="rgba(255,109,0,0.4)" 
                strokeWidth="1"
                transform="rotate(60 20 20)" 
              />
              <motion.circle 
                r="1.2" fill="#fff" 
                animate={{ 
                  offsetDistance: ["33%", "133%"] 
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                style={{ 
                  offsetPath: "path('M 2 20 A 18 6 0 1 0 38 20 A 18 6 0 1 0 2 20')",
                  offsetDistance: "33%",
                  rotate: 60
                }}
                className="shadow-[0_0_6px_#fff]"
              />

              {/* Path 3 */}
              <ellipse 
                cx="20" cy="20" rx="18" ry="6" 
                fill="none" 
                stroke="rgba(255,109,0,0.4)" 
                strokeWidth="1"
                transform="rotate(120 20 20)" 
              />
              <motion.circle 
                r="1.2" fill="#fff" 
                animate={{ 
                  offsetDistance: ["66%", "166%"] 
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{ 
                  offsetPath: "path('M 2 20 A 18 6 0 1 0 38 20 A 18 6 0 1 0 2 20')",
                  offsetDistance: "66%",
                  rotate: 120
                }}
                className="shadow-[0_0_6px_#fff]"
              />
            </motion.g>
          </svg>

          {/* Magnetic text hover ring */}
          {isMagnetic && (
            <motion.div
              layoutId="magnetic-ring"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1.2 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-[-10px] border border-orange-500/30 rounded-full"
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AtomCursor;
