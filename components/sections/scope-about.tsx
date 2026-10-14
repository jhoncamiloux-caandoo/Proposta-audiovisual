"use client";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

const scopeIcons = [
 "M3 7h18M3 12h12M3 17h7M17 15l4 2-4 2z",           // montagem & ritmo
 "M4 6h16v9H4zM7 19h10M8 10h4M8 12.5h7",            // legendas
 "M12 3v12M8 7l4-4 4 4M5 21h14M9 17c0-1.7 1.3-3 3-3s3 1.3 3 3", // destaques & trilha
 "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z", // consistência
];

export function ScopeGrid({ items }: { items: string[][] }) {
 const reduce = useReducedMotion();
 return <div className="scope-grid">
  {items.map(([title, text], i) => <motion.article key={title} className="scope-card"
   initial={reduce ? false : "hidden"} whileInView="shown" whileHover="hover" viewport={{ once: true, margin: "-15% 0px" }}
   variants={{ hidden: { opacity: 0, y: 18 }, shown: { opacity: 1, y: 0, transition: { duration: .7, ease, delay: i * .08 } }, hover: { y: -4, transition: { duration: .4, ease } } }}>
   <div className="scope-top"><span className="index">0{i + 1}</span>
    <motion.span className="scope-icon" variants={{ hover: { rotate: -6, scale: 1.06 } }} transition={{ duration: .4, ease }}>
     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <motion.path d={scopeIcons[i]} variants={{ hidden: { pathLength: 0 }, shown: { pathLength: 1, transition: { duration: 1, ease, delay: .2 + i * .08 } } }}/>
     </svg>
    </motion.span>
   </div>
   <motion.span className="scope-line" aria-hidden="true" variants={{ hidden: { scaleX: 0 }, shown: { scaleX: .25, transition: { duration: .8, ease, delay: .3 + i * .08 } }, hover: { scaleX: 1 } }}/>
   <h3>{title}</h3><p>{text}</p>
  </motion.article>)}
 </div>;
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
 const ref = useRef<HTMLSpanElement>(null);
 const inView = useInView(ref, { once: true });
 const reduce = useReducedMotion();
 const [n, setN] = useState(reduce ? to : 0);
 useEffect(() => {
  if (!inView || reduce) return;
  const c = animate(0, to, { duration: 1.4, ease, onUpdate: v => setN(Math.round(v)) });
  return () => c.stop();
 }, [inView, reduce, to]);
 return <span ref={ref}>{n.toLocaleString("pt-BR")}{suffix}</span>;
}

const stats: [number, string, string][] = [[10, "", "anos em design e comunicação visual"], [1000, "+", "vídeos editados e finalizados"], [4, "", "empresas de tecnologia e marketing"]];
const career = ["Clint", "E-Saúde Marketing", "Binamik Tecnologia", "Bonitour"];
const tools = [["Pr", "Premiere Pro"], ["Ae", "After Effects"], ["Ps", "Photoshop"], ["Ai", "Illustrator"], ["Cc", "CapCut"]];

export function AboutPanel() {
 const reduce = useReducedMotion();
 const fade = (d: number) => ({ initial: reduce ? false : { opacity: 0, y: 14 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: .7, ease, delay: d } });
 return <div className="about-panel">
  <div className="about-stats">{stats.map(([n, s, label], i) => <motion.div key={label} {...fade(i * .1)}><strong><Counter to={n} suffix={s}/></strong><span>{label}</span></motion.div>)}</div>
  <motion.ol className="career" aria-label="Trajetória" {...fade(.15)}>
   {career.map((name, i) => <motion.li key={name} initial={reduce ? false : { opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .6, ease, delay: .2 + i * .08 }}>
    <span className="career-dot" aria-hidden="true"/><b>{name}</b>
   </motion.li>)}
  </motion.ol>
  <div className="tools">{tools.map(([abbr, name], i) => <motion.span key={name} {...fade(.3 + i * .06)} whileHover={{ y: -3 }}><i aria-hidden="true">{abbr}</i>{name}</motion.span>)}</div>
 </div>;
}
