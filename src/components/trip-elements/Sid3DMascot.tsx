'use client';

import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, PresentationControls } from '@react-three/drei';
import { Group } from 'three';
import { motion } from 'framer-motion';

// 3D Model Component
function SidModel() {
  const meshRef = useRef<Group>(null);
  const { scene } = useGLTF('/sid.glb');

  // Auto-rotation animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2; // Slower rotation speed
    }
  });

  return (
    <group ref={meshRef}>
      <primitive 
        object={scene} 
        scale={[4.5, 4.5, 4.5]} // Make it bigger
        position={[0, -0.3, 0]} // Move up to show full body
        rotation={[0, Math.PI, 0]} // Start from front (180 degree rotation)
      />
    </group>
  );
}

// Loader component
function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full"
      />
    </div>
  );
}

export default function Sid3DMascot() {

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        {/* Title and Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center mb-4"
        >
          <h3 className="text-3xl font-bold text-white mb-2">
            Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Sid</span>
          </h3>
          <p className="text-gray-400 text-lg">
            Your ultimate party companion in Cyprus 🎉
          </p>
        </motion.div>

        {/* 3D Canvas Container - No visible container */}
        <motion.div 
          className="relative h-[550px] md:h-[650px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {/* Floating Party Icons */}
          {[
            // Top-left area
            { emoji: '🎉', x: -40, y: 8, delay: 0, duration: 6 },
            { emoji: '🥳', x: -35, y: 18, delay: 2, duration: 5 },
            
            // Top-center area
            { emoji: '🎊', x: -5, y: 5, delay: 1, duration: 7 },
            { emoji: '🎵', x: 5, y: 15, delay: 1, duration: 6 },
            
            // Top-right area  
            { emoji: '🎈', x: 35, y: 8, delay: 0.5, duration: 8 },
            { emoji: '🍾', x: 40, y: 18, delay: 2.5, duration: 7 },
            
            // Middle-left area
            { emoji: '✨', x: -42, y: 35, delay: 1.5, duration: 6 },
            { emoji: '🌟', x: -38, y: 45, delay: 2, duration: 5 },
            
            // Middle-center area
            { emoji: '🕺', x: -8, y: 40, delay: 0.5, duration: 7 },
            { emoji: '💃', x: 8, y: 50, delay: 3.5, duration: 6 },
            
            // Middle-right area
            { emoji: '🎯', x: 42, y: 35, delay: 3, duration: 9 },
            { emoji: '🎸', x: 38, y: 45, delay: 1.5, duration: 8 },
          ].map((icon, index) => (
            <motion.div
              key={index}
              className="absolute pointer-events-none"
              style={{
                left: `${50 + icon.x}%`,
                top: `${icon.y}%`,
                fontSize: '2rem',
                filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.5))'
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, -10, 0],
                rotate: [0, 15, -15, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: icon.duration,
                repeat: Infinity,
                delay: icon.delay,
                ease: "easeInOut"
              }}
            >
              {icon.emoji}
            </motion.div>
          ))}

          {/* Subtle floor shadow */}
          <div className="absolute bottom-0 left-0 right-0 h-[100px] pointer-events-none z-20">
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2"
              style={{
                width: '200px',
                height: '60px',
                background: 'radial-gradient(ellipse, rgba(0, 0, 0, 0.1) 0%, transparent 70%)',
                filter: 'blur(15px)',
                transform: 'translateX(-50%) perspective(100px) rotateX(85deg)',
              }}
              animate={{
                opacity: [0.3, 0.5, 0.3],
                scale: [0.9, 1.1, 0.9]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
          {/* 3D Canvas */}
          <Canvas
            camera={{ position: [0, 0.5, 8], fov: 45 }}
            className="relative z-10"
            style={{ background: 'transparent' }}
          >
            {/* Lighting */}
            <ambientLight intensity={0.6} />
            <spotLight 
              position={[10, 10, 10]} 
              angle={0.15} 
              penumbra={1} 
              intensity={1.2} 
              castShadow 
            />
            <pointLight position={[-10, -10, -10]} intensity={0.7} color="#8b5cf6" />
            <pointLight position={[10, -10, 10]} intensity={0.7} color="#ec4899" />
            
            {/* Environment for reflections */}
            <Environment preset="city" />
            
            {/* 3D Model with highly responsive controls */}
            <PresentationControls
              global
              rotation={[0, 0, 0]}
              polar={[-1.2, 1.2]}
              azimuth={[-Infinity, Infinity]}
              snap={false}
              speed={3.5}
            >
              <Suspense fallback={null}>
                <SidModel />
              </Suspense>
            </PresentationControls>
          </Canvas>

          {/* Loading state */}
          <Suspense fallback={<Loader />}>
            {/* This is just to trigger loading */}
          </Suspense>
        </motion.div>

        {/* Interactive hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center text-sm text-gray-500 mt-4"
        >
          <span className="hidden md:inline">✨ Click and drag to interact with Sid</span>
          <span className="md:hidden">✨ Touch and drag to interact with Sid</span>
        </motion.p>
      </motion.div>
    </div>
  );
}

// Preload the 3D model
useGLTF.preload('/sid.glb');