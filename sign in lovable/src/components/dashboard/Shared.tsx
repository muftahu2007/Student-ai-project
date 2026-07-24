import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], staggerChildren: 0.15 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

export const itemVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 20 } }
};

export const AnimatedCounter = ({ value, suffix = "" }: { value: number, suffix?: string }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
      setCount(end);
      return;
    }
    let duration = 2000;
    let startTime: number | null = null;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [value]);
  
  return <span>{count}{suffix}</span>;
};

export const DecodingText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState("");
  const chars = "!<>-_\\/[]{}—=+*^?#_";
  
  useEffect(() => {
    let iteration = 0;
    let animationFrame: number;
    
    const animate = () => {
      setDisplayText(text.split("").map((letter, index) => {
        if(index < iteration) return text[index];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(""));
      
      if(iteration >= text.length){
        cancelAnimationFrame(animationFrame);
      } else {
        iteration += 1 / 3;
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [text]);
  
  return <span className="font-mono">{displayText}</span>;
};

export const SciFiLoader = ({ text }: { text: string }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-12">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-primary/30 blur-2xl animate-pulse" />
        <div className="h-16 w-16 rounded-2xl border-2 border-primary/50 bg-background/50 flex items-center justify-center relative z-10 animate-[spin_4s_linear_infinite] shadow-[0_0_30px_rgba(var(--primary),0.3)]">
          <Sparkles className="h-8 w-8 text-primary animate-pulse" />
        </div>
      </div>
      <div className="text-primary font-bold tracking-[0.2em] uppercase text-sm">
        <DecodingText text={text} />
      </div>
    </div>
  );
};

export const Sparkline = () => {
  const points = "0,20 15,25 30,10 45,30 60,15 75,20 90,5 100,10";
  return (
    <svg className="absolute bottom-0 left-0 w-full h-16 opacity-20 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 40">
      <path d={`M0,40 L0,20 L15,25 L30,10 L45,30 L60,15 L75,20 L90,5 L100,10 L100,40 Z`} fill="currentColor" opacity="0.2" />
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const ProgressRing = ({ radius, stroke, progress, total }: { radius: number, stroke: number, progress: number, total: number }) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    if (total === 0) return;
    const strokeDashoffset = circumference - ((progress / total) * circumference);
    const timeout = setTimeout(() => {
      setOffset(strokeDashoffset);
    }, 100);
    return () => clearTimeout(timeout);
  }, [progress, total, circumference]);

  return (
    <div className="relative inline-flex items-center justify-center group">
      <div className="absolute inset-0 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-colors" />
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90 relative z-10">
        <circle stroke="currentColor" fill="transparent" strokeWidth={stroke} className="text-primary/10" r={normalizedRadius} cx={radius} cy={radius} />
        <circle stroke="currentColor" fill="transparent" strokeWidth={stroke} strokeDasharray={circumference + ' ' + circumference} style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)' }} strokeLinecap="round" className="text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]" r={normalizedRadius} cx={radius} cy={radius} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <span className="text-5xl font-display font-bold text-foreground">
          <AnimatedCounter value={progress} />
        </span>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Out of {total}</span>
      </div>
    </div>
  );
};
