'use client';

export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check for mobile user agent
  const userAgent = window.navigator.userAgent;
  const mobileRegex = /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone/i;
  
  // Also check for screen width
  const screenWidth = window.innerWidth;
  
  return mobileRegex.test(userAgent) || screenWidth < 768;
}

export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return 'ontouchstart' in window || 
         navigator.maxTouchPoints > 0 || 
         (navigator as unknown as { msMaxTouchPoints?: number }).msMaxTouchPoints ? 
         (navigator as unknown as { msMaxTouchPoints: number }).msMaxTouchPoints > 0 : false;
}