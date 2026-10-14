"use client";
import { useEffect, useRef, useState } from "react";

type Reel = { slug: string; title: string; kind: string; format: "16:9" | "9:16"; yt?: string };
const ytSrc = (id: string) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

const base = "/videos/portfolio";
const reels: Reel[] = [
 { slug: "como-a-clint-funciona", title: "Descubra como a Clint funciona", kind: "Vídeo institucional", format: "16:9", yt: "g22oso2dm9Y" },
 { slug: "apresentando-a-aura", title: "Apresentando a Aura", kind: "Vídeo vertical · lançamento", format: "9:16" },
 { slug: "ferramenta-ruim-ou-cara", title: "Ferramenta ruim ou cara?", kind: "Vídeo explicativo", format: "16:9", yt: "P8mcAw7WLIs" },
 { slug: "aura", title: "Aura, o copiloto de IA do CRM", kind: "Lançamento de produto", format: "16:9", yt: "BQY7hjlEPWE" },
 { slug: "vendedor-destaque", title: "Vendedor destaque", kind: "Vídeo vertical · redes", format: "9:16" },
 { slug: "comparativo", title: "Monta um comparativo", kind: "Vídeo vertical · redes", format: "9:16" },
 { slug: "agente-de-suporte", title: "Agente de suporte da Clint", kind: "Vídeo vertical · produto", format: "9:16" },
];

export function Showreel() {
 const [index, setIndex] = useState(0);
 const [playing, setPlaying] = useState(false);
 const [failed, setFailed] = useState(false);
 const [lightbox, setLightbox] = useState(false);
 const [progress, setProgress] = useState(0);
 const strip = useRef<HTMLDivElement>(null);
 const stage = useRef<HTMLVideoElement>(null);
 const dialog = useRef<HTMLDialogElement>(null);
 const reel = reels[index];
 const src = `${base}/${reel.slug}.mp4`;

 useEffect(() => {
  const d = dialog.current;
  if (!d) return;
  if (lightbox && !d.open) d.showModal();
  if (!lightbox && d.open) d.close();
 }, [lightbox]);

 const select = (i: number) => {
  stage.current?.pause();
  const n = (i + reels.length) % reels.length;
  setIndex(n); setPlaying(false); setFailed(false); setProgress(0);
  strip.current?.children[n]?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
 };
 const next = reels[(index + 1) % reels.length];
 const Arrow = ({ dir }: { dir: 1 | -1 }) => <button type="button" className={`reel-arrow ${dir > 0 ? "next" : "prev"}`} onClick={() => select(index + dir)} aria-label={dir > 0 ? "Próximo vídeo" : "Vídeo anterior"}>
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d={dir > 0 ? "M9 5l7 7-7 7" : "M15 5l-7 7 7 7"}/></svg></button>;
 const play = () => { if (reel.yt) { setPlaying(true); return; } void stage.current?.play().catch(() => setFailed(true)); };
 const openLightbox = () => { stage.current?.pause(); setLightbox(true); };

 return <div className="showreel">
  <div className={`reel-stage is-${reel.format === "9:16" ? "vertical" : "wide"}${playing ? " is-playing" : ""}`}>
   <img className="reel-backdrop" src={`${base}/${reel.slug}.jpg`} alt="" aria-hidden="true"/>
   {reel.yt
    ? playing && <iframe key={reel.slug} className="reel-yt" src={ytSrc(reel.yt)} title={reel.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen/>
    : null}
   {reel.yt && !playing && <img className="reel-poster" src={`${base}/${reel.slug}.jpg`} alt=""/>}
   {!reel.yt && <video key={reel.slug} ref={stage} controls={playing} playsInline preload="metadata" poster={`${base}/${reel.slug}.jpg`}
    aria-label={reel.title} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => { setPlaying(false); select(index + 1); }} onTimeUpdate={e => { const v = e.currentTarget; if (v.duration) setProgress(v.currentTime / v.duration); }} onError={() => setFailed(true)}>
    <source src={src} type="video/mp4"/>
   </video>}
   {!playing && <div className="reel-overlay">
    <button type="button" className="reel-play" onClick={play} aria-label={`Reproduzir ${reel.title}`}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg></button>
    <div className="reel-caption"><span className="eyebrow">{reel.kind} · {reel.format}</span><h3>{reel.title}</h3></div>
    <div className="reel-actions">
     <button type="button" className="reel-expand" onClick={openLightbox}>Ampliar <span aria-hidden="true">⤢</span></button>
     <button type="button" className="reel-next" onClick={() => select(index + 1)}><img src={`${base}/${next.slug}.jpg`} alt=""/><span><small>A seguir</small>{next.title}</span><span aria-hidden="true">→</span></button>
    </div>
   </div>}
   <Arrow dir={-1}/><Arrow dir={1}/>
   <span className="reel-count" aria-live="polite"><b>{String(index + 1).padStart(2, "0")}</b> / {String(reels.length).padStart(2, "0")}</span>
   {failed && <p className="reel-error" role="alert">Não foi possível carregar o vídeo. <a href={src}>Abrir arquivo</a></p>}
  </div>

  <div className="reel-strip-head"><p className="eyebrow">Escolha um vídeo <span aria-hidden="true">→</span></p><div><Arrow dir={-1}/><Arrow dir={1}/></div></div>
  <div className="reel-picker" ref={strip} role="group" aria-label="Escolher vídeo" onKeyDown={e => { if (e.key === "ArrowRight") select(index + 1); if (e.key === "ArrowLeft") select(index - 1); }}>
   {reels.map((r, i) => <button key={r.slug} type="button" aria-pressed={i === index} onClick={() => select(i)} className={r.format === "9:16" ? "is-vertical" : undefined}>
    <span className="reel-thumb"><img src={`${base}/${r.slug}.jpg`} alt="" loading="lazy" decoding="async"/>
     <span className="reel-thumb-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z"/></svg></span>
     {i === index && <span className="reel-now">{playing ? "Assistindo" : "Selecionado"}</span>}
     {i === index && <span className="reel-progress" style={{ transform: `scaleX(${progress})` }}/>}
    </span>
    <span className="reel-meta"><small>{String(i + 1).padStart(2, "0")} · {r.format}</small>{r.title}</span>
   </button>)}
  </div>

  <dialog ref={dialog} className="reel-lightbox" aria-label={reel.title} onClose={() => setLightbox(false)} onClick={e => { if (e.target === e.currentTarget) setLightbox(false); }}>
   {lightbox && reel.yt && <iframe className="reel-lightbox-yt" src={ytSrc(reel.yt)} title={reel.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen/>}
   {lightbox && !reel.yt && <video src={src} controls autoPlay playsInline preload="metadata" poster={`${base}/${reel.slug}.jpg`} className={reel.format === "9:16" ? "is-vertical" : undefined}/>}
   <button type="button" className="reel-close" onClick={() => setLightbox(false)} aria-label="Fechar">×</button>
  </dialog>
 </div>;
}

export function YouTubeCase({ id, title, eyebrow = "Case de apoio · Binamik", text = "Produção realizada durante minha passagem pela Binamik Tecnologia, incluída como referência complementar." }: { id: string; title: string; eyebrow?: string; text?: string }) {
 const [active, setActive] = useState(false);
 return <div className="yt-case">
  <div className="yt-frame">
   {active
    ? <iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title={title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen/>
    : <button type="button" onClick={() => setActive(true)} aria-label={`Reproduzir ${title} no YouTube`}>
      <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" decoding="async"/>
      <span className="reel-play small" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z"/></svg></span>
     </button>}
  </div>
  <div className="yt-info"><p className="eyebrow">{eyebrow}</p><h3>{title}</h3><p>{text}</p></div>
 </div>;
}
