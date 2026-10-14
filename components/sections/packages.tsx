"use client";
import { AnimatePresence, motion } from "framer-motion";
import { createContext, useContext, useState, type ReactNode } from "react";

const ease = [0.16, 1, 0.3, 1] as const;
export const packages = [
 { id: "essencial", name: "Essencial", price: 4760, rounds: "1 rodada", roundsLong: "Uma rodada de ajustes por vídeo", note: "Ideal quando o roteiro e os cortes já chegam bem definidos." },
 { id: "padrao", name: "Padrão", price: 5500, rounds: "3 rodadas", roundsLong: "Três rodadas de ajustes por vídeo", note: "Mais espaço para refinar ritmo, textos e identificações.", featured: true },
 { id: "ilimitado", name: "Ilimitado", price: 6500, rounds: "Ilimitadas", roundsLong: "Rodadas de ajustes ilimitadas, até a aprovação final", note: "Tranquilidade total para validar com várias áreas e lideranças." },
] as const;
type Pkg = (typeof packages)[number];

const brl = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const Ctx = createContext<{ pkg: Pkg; setId: (id: Pkg["id"]) => void } | null>(null);
const usePkg = () => useContext(Ctx)!;

export function PackageProvider({ children }: { children: ReactNode }) {
 const [id, setId] = useState<Pkg["id"]>("padrao");
 const pkg = packages.find(p => p.id === id)!;
 return <Ctx.Provider value={{ pkg, setId }}><div className="pkg-scope" data-pkg={id}>{children}</div></Ctx.Provider>;
}

function Swap({ k, children }: { k: string; children: ReactNode }) {
 return <AnimatePresence mode="popLayout" initial={false}>
  <motion.span key={k} className="swap" style={{ display: "inline-block" }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .45, ease }}>{children}</motion.span>
 </AnimatePresence>;
}

export function PackagePicker() {
 const { pkg, setId } = usePkg();
 const [int, cents] = brl(pkg.price).split(",");
 return <div className="price-block">
  <div className="pkg-tabs" data-pkg={pkg.id} role="radiogroup" aria-label="Escolher pacote">
   {packages.map(p => <button key={p.id} type="button" role="radio" aria-checked={p.id === pkg.id} onClick={() => setId(p.id)}>
    {p.id === pkg.id && <motion.span layoutId="pkg-pill" className="pkg-pill" transition={{ duration: .5, ease }}/>}
    <span className="pkg-tab-label">{p.name}{"featured" in p && <small>Recomendado</small>}</span>
   </button>)}
  </div>
  <p className="eyebrow">Pacote {pkg.name} · 14 vídeos</p>
  <p className="price" aria-live="polite"><span>R$</span> <Swap k={pkg.id}>{int}</Swap><span>,{cents}</span></p>
  <dl>
   <div><dt>Rodadas de ajustes por vídeo</dt><dd><Swap k={pkg.id}>{pkg.rounds}</Swap></dd></div>
   <div><dt>Valor médio por vídeo</dt><dd><Swap k={pkg.id}>R$ {brl(pkg.price / 14)}</Swap></dd></div>
   <div><dt>Duração estimada por vídeo</dt><dd>60–90 s</dd></div>
   <div><dt>Entregas</dt><dd>2 lotes de 7 vídeos</dd></div>
  </dl>
  <p className="small pkg-note"><Swap k={pkg.id}>{pkg.note}</Swap></p>
 </div>;
}

export function PackageTerms() {
 const { pkg, setId } = usePkg();
 const start = pkg.price * .4, end = pkg.price - start;
 return <div className="terms">
  <div className="pkg-compare" data-pkg={pkg.id} role="radiogroup" aria-label="Pacote selecionado">
   {packages.map(p => <button key={p.id} type="button" role="radio" data-pkg={p.id} aria-checked={p.id === pkg.id} onClick={() => setId(p.id)}>
    <span className="pkg-check" aria-hidden="true"><svg viewBox="0 0 16 16"><motion.path d="M3.5 8.5 6.5 11.5 12.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" initial={false} animate={{ pathLength: p.id === pkg.id ? 1 : 0 }} transition={{ duration: .4, ease }}/></svg></span>
    <strong>{p.name}</strong><span>R$ {brl(p.price)}</span><small>{p.rounds}</small>
   </button>)}
  </div>
  <div><h3>Pacote & revisões</h3><p><Swap k={pkg.id}>{pkg.name}: R$ {brl(pkg.price)} por 14 vídeos de aproximadamente 60 a 90 segundos. {pkg.roundsLong}, respeitando o roteiro e o escopo aprovados.</Swap></p></div>
  <div><h3>Entregas em dois lotes</h3><p>O projeto é dividido em duas etapas de 7 vídeos. O primeiro lote define o padrão visual; o segundo segue a linguagem aprovada, conforme a chegada dos materiais.</p></div>
  <div><h3>Pagamento</h3>
   <div className="pay-split">
    <div><span>40% no início</span><b><Swap k={pkg.id}>R$ {brl(start)}</Swap></b></div>
    <div><span>60% na entrega final, com nota fiscal</span><b><Swap k={pkg.id}>R$ {brl(end)}</Swap></b></div>
    <span className="pay-bar" aria-hidden="true"><motion.i initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: .9, ease }}/></span>
   </div>
   <p>Formatos e resoluções finais definidos em conjunto antes do início.</p></div>
  <div><h3>Alterações de escopo</h3><p>Mudanças de roteiro, alterações estruturais após aprovação e solicitações fora do escopo podem exigir orçamento adicional, alinhado antes da execução.</p></div>
  <div><h3>Cronograma & materiais</h3><p>O calendário será acordado com a FSB e depende do recebimento dos materiais e das aprovações necessárias. Não há prazo fixo assumido nesta proposta.</p></div>
 </div>;
}
