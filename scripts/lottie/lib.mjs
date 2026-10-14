/* Mini construtor de Lottie (bodymovin 5.x) para as animações do blog.
   Só formas (sem texto): os rótulos ficam no HTML, sincronizados por markers. */

export const C = {
  bg: "#0d0d12",
  card: "#17171f",
  line: "#2a2a35",
  mute: "#3a3a48",
  soft: "#55556a",
  white: "#ffffff",
  p: "#622FFD",
  p2: "#8b6bff",
  g: "#A3E635",
  red: "#f87171",
  amb: "#fbbf24",
};

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).concat(1);
const EASE = { o: { x: [0.33], y: [0] }, i: { x: [0.2], y: [1] } };
const arr = (v) => (Array.isArray(v) ? v : [v]);

const isKf = (v) => Array.isArray(v) && Array.isArray(v[0]) && typeof v[0][0] === "number" && (Array.isArray(v[0][1]) || typeof v[0][1] === "number" || typeof v[0][1] === "string");
const P = (v, map = (x) => x) => (isKf(v) ? { a: 1, k: v.map(([t, val], i) => ({ t, s: arr(map(val)), ...(i < v.length - 1 ? EASE : {}) })) } : { a: 0, k: map(v) });

const tr = () => ({ ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 } });
const fill = (c, o = 100) => ({ ty: "fl", c: P(c, hex), o: P(o), r: 1 });
const stroke = (c, w, o = 100) => ({ ty: "st", c: P(c, hex), o: P(o), w: P(w), lc: 2, lj: 2, ml: 4 });

/* Formas. Tamanhos/cores aceitam keyframes. */
export function rect({ w, h, r = 8, fill: f, stroke: s, sw = 2, x = 0, y = 0 }) {
  const it = [{ ty: "rc", d: 1, s: P(isKf(w) ? w.map(([t, v], i) => [t, [v, isKf(h) ? h[i][1] : h]]) : isKf(h) ? h.map(([t, v]) => [t, [w, v]]) : [w, h]), p: { a: 0, k: [x, y] }, r: P(r) }];
  if (f) it.push(fill(f));
  if (s) it.push(stroke(s, sw));
  it.push(tr());
  return { ty: "gr", it };
}
export function circle({ d, fill: f, stroke: s, sw = 2, x = 0, y = 0 }) {
  const it = [{ ty: "el", d: 1, s: P(isKf(d) ? d.map(([t, v]) => [t, [v, v]]) : [d, d]), p: { a: 0, k: [x, y] } }];
  if (f) it.push(fill(f));
  if (s) it.push(stroke(s, sw));
  it.push(tr());
  return { ty: "gr", it };
}
/* Linha/caminho com desenho progressivo (trim). draw = [[t, 0..100], ...] */
export function path({ pts, closed = false, stroke: s, sw = 3, draw, fill: f, curve = 0 }) {
  const n = pts.length;
  const tang = pts.map((_, i) => {
    if (!curve || i === 0 || i === n - 1) return [[0, 0], [0, 0]];
    const [px, py] = pts[i - 1], [nx, ny] = pts[i + 1];
    const dx = (nx - px) * curve, dy = (ny - py) * curve;
    return [[-dx, -dy], [dx, dy]];
  });
  const it = [{ ty: "sh", ks: { a: 0, k: { i: tang.map((t) => t[0]), o: tang.map((t) => t[1]), v: pts, c: closed } } }];
  if (draw) it.push({ ty: "tm", s: { a: 0, k: 0 }, e: P(draw), o: { a: 0, k: 0 }, m: 1 });
  if (f) it.push(fill(f));
  if (s) it.push(stroke(s, sw));
  it.push(tr());
  return { ty: "gr", it };
}

let IND = 1;
/* Camada de forma com transform animável: p=[x,y], s=escala %, o=opacidade, r=rotação. */
export function layer(shapes, { p = [0, 0], s = 100, o = 100, r = 0, a = [0, 0], ip = 0, op = 9999, nm = "l" } = {}) {
  return {
    ddd: 0, ind: IND++, ty: 4, nm, sr: 1, ao: 0, ip, op, st: 0, bm: 0,
    ks: {
      o: P(o), r: P(r),
      p: P(p, (v) => [v[0], v[1], 0]),
      a: { a: 0, k: [a[0], a[1], 0] },
      s: P(s, (v) => (Array.isArray(v) ? [...v, 100] : [v, v, 100])),
    },
    shapes: arr(shapes),
  };
}

/* Documento. markers = [[frame, "nome"], ...] para os botões de etapa. */
export function doc({ w, h, op, fr = 60, layers, markers = [], nm }) {
  IND = 1;
  return {
    v: "5.7.4", fr, ip: 0, op, w, h, nm, ddd: 0, assets: [],
    // A primeira camada da lista fica por cima: invertemos para escrever de trás para frente.
    layers: [...layers].reverse().map((l, i) => ({ ...l, ind: i + 1, op })),
    markers: markers.map(([tm, cm], i) => ({ tm, cm, dr: (markers[i + 1]?.[0] ?? op) - tm })),
  };
}

/* Ajudas de tempo. */
export const fade = (t0, t1 = t0 + 12, from = 0, to = 100) => [[t0, from], [t1, to]];
export const hold = (pairs) => pairs; // documentação: [[t, v], ...]
