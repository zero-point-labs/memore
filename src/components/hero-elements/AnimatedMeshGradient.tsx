'use client';

import { motion } from 'framer-motion';

export default function AnimatedMeshGradient() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated Mesh Gradient */}
      <motion.div
        animate={{
          background: [
            'radial-gradient(600px at 0% 0%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
            'radial-gradient(600px at 100% 0%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)',
            'radial-gradient(600px at 100% 100%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
            'radial-gradient(600px at 0% 100%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
            'radial-gradient(600px at 0% 0%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0"
      />
      
      {/* Additional floating gradients */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          x: ['-20%', '120%'],
          y: ['-20%', '120%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          x: ['120%', '-20%'],
          y: ['120%', '-20%'],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />
    </div>
  );
}