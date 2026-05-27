"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";

interface CountUpProps {
  to: number;
  from?: number;
  direction?: "up" | "down";
  delay?: number;
  duration?: number; // dalam detik
  className?: string;
  startWhen?: boolean;
  separator?: string;
  decimals?: number;
}

export default function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 2,
  className = "",
  startWhen = true,
  separator = "",
  decimals = 0,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? to : from);

  // Konfigurasi Spring (pegas)
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
    duration: duration * 1000,
  });

  // UBAH 1: once dijadikan false agar bisa mendeteksi keluar-masuk layar berkali-kali
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = String(direction === "down" ? to : from);
    }
  }, [from, to, direction]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isInView && startWhen) {
      // Jika masuk layar, jalankan animasi menuju target
      timeoutId = setTimeout(() => {
        motionValue.set(direction === "down" ? from : to);
      }, delay * 1000);
    } else {
      // UBAH 2: Jika keluar layar, RESET angka kembali ke awal (0)
      motionValue.set(direction === "down" ? to : from);
    }

    // Cleanup timeout untuk mencegah memory leak
    return () => clearTimeout(timeoutId);
  }, [isInView, startWhen, motionValue, direction, from, to, delay]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        const options = {
          useGrouping: !!separator,
          minimumFractionDigits: 0,
          maximumFractionDigits: decimals,
        };

        const formattedNumber = Intl.NumberFormat("en-US", options).format(
          Number(latest.toFixed(decimals))
        );

        ref.current.textContent = separator
          ? formattedNumber.replace(/,/g, separator)
          : formattedNumber;
      }
    });
  }, [springValue, decimals, separator]);

  return <span className={className} ref={ref} />;
}