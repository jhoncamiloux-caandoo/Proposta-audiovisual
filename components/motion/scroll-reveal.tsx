"use client";
import { useEffect } from "react";

/* Revela títulos e textos de apoio ao entrar na viewport.
   As classes só são aplicadas via JS: sem JS (ou com movimento reduzido) o texto fica visível. */
const targets = [
 "main h1", "main h2", "main h3",
 "main .eyebrow", "main .section-heading > p", "main .lead", "main .hero-description",
 "main .investment-copy", "main .process-intro", "main .closing p:not(.eyebrow)",
].join(",");
// blocos que já têm animação própria (framer-motion / estado interativo)
const skip = ".scope-card, .process-list, .reel-stage, .reel-strip-head, .pkg-tabs, .price-block, .terms, .yt-case, .video-info, .hero-summary";

export function ScrollReveal() {
 useEffect(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const els = [...document.querySelectorAll<HTMLElement>(targets)].filter(el => !el.closest(skip));
  const groups = new Map<Element, number>();
  els.forEach(el => {
   const parent = el.closest("section, .hero-copy, .section-heading") ?? el.parentElement!;
   const i = groups.get(parent) ?? 0;
   groups.set(parent, i + 1);
   el.style.setProperty("--rv-delay", `${Math.min(i, 5) * 100}ms`);
   el.classList.add("rv");
  });
  const done = (e: TransitionEvent) => { const el = e.currentTarget as HTMLElement; el.classList.add("rv-done"); el.removeEventListener("transitionend", done); };
  const io = new IntersectionObserver(entries => entries.forEach(({ isIntersecting, target }) => {
   if (!isIntersecting) return;
   target.addEventListener("transitionend", done as EventListener);
   target.classList.add("rv-in");
   io.unobserve(target);
  }), { threshold: .18, rootMargin: "0px 0px -6% 0px" });
  requestAnimationFrame(() => els.forEach(el => io.observe(el)));
  return () => io.disconnect();
 }, []);
 return null;
}
