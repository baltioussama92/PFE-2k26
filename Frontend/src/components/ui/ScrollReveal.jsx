import React from 'react'
import { motion } from 'framer-motion'

const OFFSETS = {
  up:    { x: 0, y: 40 },
  down:  { x: 0, y: -40 },
  left:  { x: 40, y: 0 },
  right: { x: -40, y: 0 },
}

export default function ScrollReveal({
  children,
  className = '',
  as = 'div',
  delay = 0,
  direction = 'up',
  duration = 0.6,
  amount = 0.2,
  once = true,
}) {
  const motionOffset = OFFSETS[direction] || OFFSETS.up
  const MotionTag = motion[as] || motion.div

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, ...motionOffset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ amount, once }}
      transition={{ duration, delay, ease: 'easeOut' }}
    >
      {children}
    </MotionTag>
  )
}
