"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type FadeInProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Anima já no mount (use para conteúdo above-the-fold, ex.: hero). */
  immediate?: boolean;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function FadeIn<T extends ElementType = "div">({
  as,
  children,
  delay = 0,
  className,
  immediate = false,
  ...props
}: FadeInProps<T>) {
  const reduce = useReducedMotion();
  const Component = useMemo(() => motion.create(as || "div"), [as]);

  // Acima da dobra: a mesma entrada, feita em CSS. O texto já vem visível do
  // servidor e anima sem esperar o JavaScript (melhora o LCP).
  if (immediate) {
    const Tag = (as || "div") as ElementType;
    return (
      <Tag className={`fade-in-up${className ? ` ${className}` : ""}`} style={{ animationDelay: `${delay}s` }} {...props}>
        {children}
      </Tag>
    );
  }

  return (
    <Component
      initial={reduce ? false : { opacity: 0, y: 28 }}
      animate={immediate ? { opacity: 1, y: 0 } : undefined}
      whileInView={immediate ? undefined : { opacity: 1, y: 0 }}
      viewport={immediate ? undefined : { once: true, margin: "-80px" }}
      transition={reduce ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}
