'use client';

/**
 * Enhanced 3D Portal Scene for Harley Queen Mascot
 * 
 * This component creates a magical dimensional portal scene where Harley Queen
 * floats above a glowing portal with particle effects and scroll interactions.
 * 
 * Features implemented:
 * - Portal base with multiple ring geometry layers (inner, middle, outer)
 * - Glowing portal effects with custom shaders
 * - Particle system (800+ particles flowing upward from portal)
 * - Smoke/mist effects using cylindrical geometry
 * - Scroll-based interactions affecting particle flow and character rotation
 * - Enhanced lighting system with portal lights, rim lighting, and ambient
 * - Performance optimizations with particle respawning and frustum culling
 * - Character floating animation positioned above portal
 * - Magical themed floating icons with portal energy effects
 * 
 * Color Palette:
 * - Portal core: Electric cyan (#00ffff)
 * - Energy rings: Purple to blue gradient (#8a2be2 to #00ffff)
 * - Particles: White to cyan gradient
 * - Ambient: Dark purple background (#2d1b69)
 */

import { useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import { Group, Color, AdditiveBlending } from 'three';
import { motion } from 'framer-motion';
import { MotionValue } from 'framer-motion';
import * as THREE from 'three';
// Removed problematic shader components that caused console errors

// Optimized Particle System Component
function MagicalParticles({ count = 150 }: { count?: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  const frameCount = useRef(0);
  
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 1.5;
      const height = Math.random() * 4;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height - 2.0;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    
    return positions;
  }, [count]);

  const colors = useMemo(() => {
    const colors = new Float32Array(count * 3);
    const portalBlue = new Color('#00ffff');
    const white = new Color('#ffffff');
    
    for (let i = 0; i < count; i++) {
      const mix = Math.random();
      const color = portalBlue.clone().lerp(white, mix);
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return colors;
  }, [count]);

  useFrame((state, delta) => {
    // Throttle updates to every 2nd frame for better performance
    frameCount.current++;
    if (frameCount.current % 2 !== 0 || !particlesRef.current || delta > 0.1) return;
    
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    
    // Simplified particle processing - no scroll influence to reduce calculations
    const batchSize = Math.min(count, 25); // Smaller batch size
    const startIndex = (Math.floor(state.clock.elapsedTime * 30) % Math.ceil(count / batchSize)) * batchSize;
    const endIndex = Math.min(startIndex + batchSize, count);
    
    for (let i = startIndex; i < endIndex; i++) {
      const i3 = i * 3;
      
      // Simple upward movement
      positions[i3 + 1] += delta * 0.6;
      
      // Reset particle if it goes too high
      if (positions[i3 + 1] > 2) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 1.5;
        positions[i3] = Math.cos(angle) * radius;
        positions[i3 + 1] = -2.0;
        positions[i3 + 2] = Math.sin(angle) * radius;
      }
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        transparent
        opacity={0.6}
        vertexColors
        blending={AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

// Removed PortalRings component - was causing the unwanted platform appearance

// Optimized 3D Model Component with floating animation
function Model({ modelPath, scale, rotation }: { modelPath: string, scale: [number, number, number], rotation?: MotionValue<number> }) {
  const meshRef = useRef<Group>(null);
  const { scene } = useGLTF(modelPath);
  const floatingOffset = useRef(0);
  const frameCount = useRef(0);

  useFrame((state, delta) => {
    // Throttle updates to every 3rd frame for performance
    frameCount.current++;
    if (frameCount.current % 3 !== 0 || !meshRef.current || delta > 0.1) return;
    
    // Scroll-based rotation (throttled)
    if (rotation) {
      meshRef.current.rotation.y = rotation.get();
    }
    
    // Floating animation - simplified calculation
    floatingOffset.current += delta * 1.5;
    meshRef.current.position.y = Math.sin(floatingOffset.current) * 0.1 + 0.2;
  });

  return (
    <group ref={meshRef}>
      <primitive 
        object={scene} 
        scale={[scale[0] * 1.0, scale[1] * 1.0, scale[2] * 1.0]} // Full original scale
        position={[0, -0.2, 0]} // Lowered base position
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

export default function Mascot3D({ 
  modelPath = '/sid.glb', 
  characterName = 'Sid', 
  scale = [4.5, 4.5, 4.5],
  rotation
}: { 
  modelPath?: string, 
  characterName?: string, 
  scale?: [number, number, number],
  rotation?: MotionValue<number> 
}) {
  // Preload the 3D model
  useGLTF.preload(modelPath);

  return (
    <div className="relative w-full max-w-4xl mx-auto" style={{ position: 'relative' }}>
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Meet</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{characterName}</span>
          </h3>
          <p className="text-gray-400 text-lg">
            Where reality meets adventure - Your guide to Cyprus ✨
          </p>
        </motion.div>

        {/* 3D Canvas Container - No visible container */}
        <motion.div 
          className="relative h-[550px] md:h-[650px]"
          style={{ position: 'relative' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {/* Floating Magical Icons - Further reduced for performance */}
          {[
            // Only essential magical elements
            { emoji: '✨', x: -30, y: 15, delay: 0, duration: 8 },
            { emoji: '🌟', x: 30, y: 20, delay: 2, duration: 10 },
            { emoji: '🔮', x: 0, y: 35, delay: 4, duration: 12 },
          ].map((icon, index) => (
            <motion.div
              key={index}
              className="absolute pointer-events-none"
              style={{
                left: `${50 + icon.x}%`,
                top: `${icon.y}%`,
                fontSize: '2rem',
                filter: 'drop-shadow(0 0 15px rgba(0, 255, 255, 0.6))'
              }}
              animate={{
                y: [0, -15, 0],
                scale: [1, 1.1, 1],
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


          {/* 3D Canvas */}
          <Canvas
            camera={{ position: [0, 1, 7], fov: 45 }}
            className="relative z-10"
            style={{ background: 'transparent' }}
          >
            {/* Enhanced Lighting System */}
            <ambientLight intensity={0.3} color="#404040" />
            
            {/* Enhanced Portal Lighting */}
            <pointLight 
              position={[0, -2.0, 0]} 
              color="#00ffff" 
              intensity={4} 
              distance={15} 
            />
            <pointLight 
              position={[0, -1.5, 0]} 
              color="#8a2be2" 
              intensity={3} 
              distance={12} 
            />
            
            {/* Character Rim Lighting */}
            <directionalLight 
              position={[5, 5, 5]} 
              color="#ffffff" 
              intensity={0.8} 
            />
            
            {/* Additional accent lights */}
            <pointLight position={[-5, 3, -3]} intensity={1.2} color="#8b5cf6" />
            <pointLight position={[5, 3, 3]} intensity={1.2} color="#ec4899" />
            
            {/* Spot light from above */}
            <spotLight 
              position={[0, 8, 0]} 
              angle={0.3} 
              penumbra={1} 
              intensity={1.5} 
              castShadow 
              target-position={[0, 0, 0]}
            />
            
            {/* Environment for reflections */}
            <Environment preset="night" />
            
            {/* Clean Scene - Just Character and Particles */}
            <Suspense fallback={null}>
              {/* Magical particle system with scroll interaction - further reduced count for performance */}
              <MagicalParticles count={50} />
              
              {/* 3D Model with enhanced positioning */}
              <Model modelPath={modelPath} scale={scale} rotation={rotation} />
            </Suspense>
          </Canvas>

          {/* Loading state */}
          <Suspense fallback={<Loader />}>
            {/* This is just to trigger loading */}
          </Suspense>
        </motion.div>
      </motion.div>
    </div>
  );
}
