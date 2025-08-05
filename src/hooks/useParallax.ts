'use client';

import { useState, useEffect, useRef } from 'react';

interface ParallaxValues {
  x: number;
  y: number;
  rotateX: number;
  rotateY: number;
}

export function useParallax(strength: number = 1) {
  const [parallax, setParallax] = useState<ParallaxValues>({
    x: 0,
    y: 0,
    rotateX: 0,
    rotateY: 0,
  });

  const requestRef = useRef<number | undefined>(undefined);
  const targetRef = useRef<ParallaxValues>({
    x: 0,
    y: 0,
    rotateX: 0,
    rotateY: 0,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const percentX = (clientX - centerX) / centerX;
      const percentY = (clientY - centerY) / centerY;

      targetRef.current = {
        x: percentX * 20 * strength,
        y: percentY * 20 * strength,
        rotateX: -percentY * 10 * strength,
        rotateY: percentX * 10 * strength,
      };
    };

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null && e.gamma !== null) {
        targetRef.current = {
          x: (e.gamma / 90) * 20 * strength,
          y: (e.beta / 90) * 20 * strength,
          rotateX: -(e.beta / 90) * 10 * strength,
          rotateY: (e.gamma / 90) * 10 * strength,
        };
      }
    };

    const animate = () => {
      setParallax((prev) => ({
        x: prev.x + (targetRef.current.x - prev.x) * 0.1,
        y: prev.y + (targetRef.current.y - prev.y) * 0.1,
        rotateX: prev.rotateX + (targetRef.current.rotateX - prev.rotateX) * 0.1,
        rotateY: prev.rotateY + (targetRef.current.rotateY - prev.rotateY) * 0.1,
      }));

      requestRef.current = requestAnimationFrame(animate);
    };

    // Check if device supports orientation
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    }

    window.addEventListener('mousemove', handleMouseMove);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [strength]);

  return parallax;
}