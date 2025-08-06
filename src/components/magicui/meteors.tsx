'use client';

import { cn } from "@/utils/cn";
import React, { useMemo } from "react";

interface MeteorsProps {
  number?: number;
  className?: string;
}

export const Meteors = ({ number = 60, className }: MeteorsProps) => {
  // Generate meteor configs only once
  const meteorConfigs = useMemo(() => {
    return new Array(number).fill(true).map(() => ({
      top: Math.floor(Math.random() * 100) + "%",
      left: Math.floor(Math.random() * 100) + "%",
      animationDelay: Math.random() * 20 + "s",
      animationDuration: (Math.random() * 2.5 + 1.5) + "s", // 1.5s to 4s for more intensity
    }));
  }, [number]);

  return (
    <>
      {meteorConfigs.map((config, idx) => (
        <span
          key={"meteor" + idx}
          className={cn(
            "animate-meteor absolute left-1/2 top-1/2 h-0.5 w-0.5 rounded-[9999px] bg-purple-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]",
            "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-px before:bg-gradient-to-r before:from-[#8b5cf6] before:to-transparent",
            className
          )}
          style={{
            top: config.top,
            left: config.left,
            animationDelay: config.animationDelay,
            animationDuration: config.animationDuration,
          }}
        />
      ))}
    </>
  );
};