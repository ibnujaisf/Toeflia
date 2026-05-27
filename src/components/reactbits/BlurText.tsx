"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
}

export default function BlurText({
  text,
  delay = 50,
  className = "",
  animateBy = "letters",
  direction = "top",
}: BlurTextProps) {
  const ref = useRef(null);
 const isInView = useInView(ref, { once: false, amount: 0.5 });
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const dropOffset = direction === "top" ? -20 : 20;

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {elements.map((element, index) => (
        <motion.span
          key={index}
          initial={{ filter: "blur(10px)", opacity: 0, y: dropOffset }}
          animate={isInView ? { filter: "blur(0px)", opacity: 1, y: 0 } : { filter: "blur(10px)", opacity: 0, y: dropOffset }}
          transition={{ duration: 0.8, delay: index * (delay / 1000), ease: [0.25, 0.4, 0.25, 1] }}
          className={animateBy === "words" ? "mr-[0.25em]" : ""}
        >
          {element === " " ? "\u00A0" : element}
        </motion.span>
      ))}
    </span>
  );
}
