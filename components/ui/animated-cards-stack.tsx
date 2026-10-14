"use client";

import * as React from "react";
import {
  type HTMLMotionProps,
  type MotionValue,
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";

import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────────
   Animated Cards Stack
   Pilha de cartões controlada por scroll: cada cartão sobe e gira até
   se alinhar, revelando o de baixo. Adaptado para framer-motion + tokens
   da marca (sem cva, sem next-themes, sem dependências extras).
   ────────────────────────────────────────────────────────────────── */

interface ContainerScrollContextValue {
  scrollYProgress: MotionValue<number>;
}

const ContainerScrollContext = React.createContext<
  ContainerScrollContextValue | undefined
>(undefined);

function useContainerScrollContext() {
  const context = React.useContext(ContainerScrollContext);
  if (!context) {
    throw new Error(
      "useContainerScrollContext must be used within a <ContainerScroll>",
    );
  }
  return context;
}

export function ContainerScroll({
  children,
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start center", "end end"],
  });

  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress }}>
      <div
        ref={scrollRef}
        className={cn("relative w-full", className)}
        style={{ perspective: "1000px", ...style }}
        {...props}
      >
        {children}
      </div>
    </ContainerScrollContext.Provider>
  );
}
ContainerScroll.displayName = "ContainerScroll";

export function CardsContainer({
  children,
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("relative", className)}
      style={{ perspective: "1000px", ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
CardsContainer.displayName = "CardsContainer";

interface CardTransformedProps extends HTMLMotionProps<"div"> {
  arrayLength: number;
  index: number;
  incrementY?: number;
  incrementZ?: number;
  incrementRotation?: number;
}

export const CardTransformed = React.forwardRef<
  HTMLDivElement,
  CardTransformedProps
>(
  (
    {
      arrayLength,
      index,
      incrementY = 10,
      incrementZ = 10,
      incrementRotation,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const { scrollYProgress } = useContainerScrollContext();
    const rotation = incrementRotation ?? -index + 90;

    const start = index / (arrayLength + 1);
    const end = (index + 1) / (arrayLength + 1);
    const range = React.useMemo(() => [start, end], [start, end]);
    const rotateRange = React.useMemo(
      () => [range[0] - 1.5, range[1] / 1.5],
      [range],
    );

    const y = useTransform(scrollYProgress, range, ["0%", "-180%"]);
    const rotate = useTransform(scrollYProgress, rotateRange, [rotation, 0]);
    const transform = useMotionTemplate`translateZ(${
      index * incrementZ
    }px) translateY(${y}) rotate(${rotate}deg)`;

    // Sombra projetada que ganha profundidade conforme o cartão se alinha.
    const dx = useTransform(scrollYProgress, rotateRange, [4, 0]);
    const dy = useTransform(scrollYProgress, rotateRange, [4, 14]);
    const blur = useTransform(scrollYProgress, rotateRange, [2, 26]);
    const alpha = useTransform(scrollYProgress, rotateRange, [0.2, 0.32]);
    const filter = useMotionTemplate`drop-shadow(${dx}px ${dy}px ${blur}px rgba(2,2,4,${alpha}))`;

    return (
      <motion.div
        ref={ref}
        style={{
          top: index * incrementY,
          transform,
          backfaceVisibility: "hidden",
          zIndex: (arrayLength - index) * incrementZ,
          filter,
          ...style,
        }}
        className={cn("absolute will-change-transform", className)}
        {...props}
      />
    );
  },
);
CardTransformed.displayName = "CardTransformed";
