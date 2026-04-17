import React, { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FlippingCardProps {
  className?: string
  frontContent?: React.ReactNode
  backContent?: React.ReactNode
}

export function FlippingCard({
  className,
  frontContent,
  backContent,
}: FlippingCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div
      className={cn("relative w-full h-full [perspective:1000px] cursor-pointer", className)}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full [transform-style:preserve-3d]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 20 }}
      >
        {/* Front Face */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden]">
          {frontContent}
        </div>
        
        {/* Back Face */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
          {backContent}
        </div>
      </motion.div>
    </div>
  )
}
