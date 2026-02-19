'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/i18n';

interface CountdownTimerProps {
  targetDate: Date;
  label?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: Date): TimeLeft | null {
  const now = new Date().getTime();
  const target = targetDate.getTime();
  const difference = target - now;

  if (difference <= 0) return null;

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export default function CountdownTimer({ targetDate, label }: CountdownTimerProps) {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <div className="text-center">
        {label && <p className="text-sm text-gray-400 mb-2">{label}</p>}
        <p className="text-red-400 font-semibold">{t("countdown.expired")}</p>
      </div>
    );
  }

  const units = [
    { value: timeLeft.days, label: t("countdown.days") },
    { value: timeLeft.hours, label: t("countdown.hours") },
    { value: timeLeft.minutes, label: t("countdown.min") },
    { value: timeLeft.seconds, label: t("countdown.sec") },
  ];

  return (
    <div className="text-center">
      {label && <p className="text-sm text-gray-400 mb-3">{label}</p>}
      <div className="flex items-center justify-center gap-2">
        {units.map((unit, i) => (
          <div key={unit.label} className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <div className="bg-wc-card border border-wc-border rounded-lg px-3 py-2 min-w-[56px]">
                <span className="text-xl font-bold text-gold-400 tabular-nums">
                  {String(unit.value).padStart(2, '0')}
                </span>
              </div>
              <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">
                {unit.label}
              </span>
            </div>
            {i < units.length - 1 && (
              <span className="text-blue-400/50 font-bold text-lg mb-4">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
