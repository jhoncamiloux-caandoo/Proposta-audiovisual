"use client";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { useRef } from "react";

const ease = [0.16, 1, 0.3, 1] as const;
const icons = [
 "M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4M12 4v11m0 0-4-4m4 4 4-4",
 "M6 4v16M18 4v16M6 9h12M6 15h12",
 "M4 5h16v11H9l-5 4zM9 10.5l2 2 4-4",
 "M5 12.5 10 17 19 7",
 "M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4",
];

export function ProcessSteps({ steps }: { steps: string[][] }) {
 const list = useRef<HTMLOListElement>(null);
 const reduce = useReducedMotion();
 const { scrollYProgress } = useScroll({ target: list, offset: ["start 75%", "end 60%"] });
 const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: .4 });

 return <ol ref={list} className="process-list is-animated">
  <span className="process-rail" aria-hidden="true"><motion.span style={{ scaleY: reduce ? 1 : progress }}/></span>
  {steps.map(([title, text], i) => <motion.li key={title}
   initial={reduce ? false : "idle"} whileInView="active" viewport={{ once: false, margin: "0px 0px -45% 0px" }}
   variants={{ idle: { opacity: .38 }, active: { opacity: 1 } }} transition={{ duration: .6, ease }}>
   <motion.span className="process-node" aria-hidden="true"
    variants={{ idle: { scale: .86, backgroundColor: "#f5f5f3", borderColor: "#20202230", color: "#9d9da5" }, active: { scale: 1, backgroundColor: "#622ffd", borderColor: "#622ffd", color: "#ffffff" } }}
    transition={{ duration: .5, ease }}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
     <motion.path d={icons[i % icons.length]} variants={{ idle: { pathLength: 0 }, active: { pathLength: 1 } }} transition={{ duration: .7, ease, delay: .1 }}/>
    </svg>
   </motion.span>
   <motion.div variants={{ idle: { x: 0 }, active: { x: 6 } }} transition={{ duration: .6, ease }}>
    <span className="index">0{i + 1} <motion.em variants={{ idle: { opacity: 0, y: 4 }, active: { opacity: 1, y: 0 } }} transition={{ duration: .45, ease, delay: .15 }}>Etapa {i + 1} de {steps.length}</motion.em></span>
    <h3>{title}</h3><p>{text}</p>
   </motion.div>
  </motion.li>)}
 </ol>;
}
