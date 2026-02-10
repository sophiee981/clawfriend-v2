"use client";

import { useEffect, useState } from "react";

// Target date: 2 days from now (fixed for demo purposes to match the mockup/request vibe)
// In a real app, this would be a prop or fetched from config
const TARGET_DATE = new Date();
TARGET_DATE.setDate(TARGET_DATE.getDate() + 2);
TARGET_DATE.setHours(TARGET_DATE.getHours() + 8);
TARGET_DATE.setMinutes(45);
TARGET_DATE.setSeconds(30);

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeLeft = (): TimeLeft => {
  const difference = +TARGET_DATE - +new Date();
  let timeLeft: TimeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

const TimeUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white font-mono relative z-10 tabular-nums tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
        {value.toString().padStart(2, "0")}
      </span>
    </div>
    <span className="mt-2 sm:mt-3 text-[9px] sm:text-[10px] md:text-xs font-bold text-neutral-500 uppercase tracking-[0.15em] sm:tracking-[0.2em]">
      {label}
    </span>
  </div>
);

const Separator = () => (
  <div className="flex flex-col gap-1.5 sm:gap-2 pt-4 sm:pt-6 md:pt-8 lg:pt-10 opacity-30">
    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white" />
    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white" />
  </div>
);

export const Countdown = () => {
  // Use client-side only rendering to avoid hydration mismatch with dates
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setMounted(true);
    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center animate-fade-in-up delay-200 px-2 sm:px-0">
      <h3 className="text-xs sm:text-sm md:text-base font-bold text-neutral-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-4 sm:mb-6 md:mb-8 drop-shadow-md">
        TRADING GOES LIVE IN
      </h3>

      <div className="flex items-start gap-2 sm:gap-3 md:gap-4 lg:gap-6">
        <TimeUnit value={timeLeft.days} label="Days" />
        <Separator />
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <Separator />
        <TimeUnit value={timeLeft.minutes} label="Mins" />
        <Separator />
        <TimeUnit value={timeLeft.seconds} label="Secs" />
      </div>
    </div>
  );
};
