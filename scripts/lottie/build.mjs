/* Gera os Lotties do blog em public/lottie/*.json.
   Rodar: node scripts/lottie/build.mjs */
import { writeFileSync, mkdirSync } from "node:fs";
import { C, circle, doc, layer, path, rect } from "./lib.mjs";

const OUT = new URL("../../public/lottie/", import.meta.url);
mkdirSync(OUT, { recursive: true });
const save = (name, d) => writeFileSync(new URL(`${name}.json`, OUT), JSON.stringify(d));

const W = 640, H = 360;

/* Barra alinhada à esquerda/topo: w, h e cor podem ter keyframes nos mesmos tempos. */
function bar({ x, y, w, h, c, r = 6, o = 100, stroke }) {
  const isK = (v) => Array.isArray(v) && Array.isArray(v[0]);
  const times = isK(w) ? w.map((k) => k[0]) : isK(h) ? h.map((k) => k[0]) : null;
  const at = (v, i) => (isK(v) ? v[i][1] : v);
  const pos = times ? times.map((t, i) => [t, [x + at(w, i) / 2, y + at(h, i) / 2]]) : [x + w / 2, y + h / 2];
  return layer(rect({ w, h, r, fill: c, stroke }), { p: pos, o });
}

/* Cursor: seta simples. p = keyframes de posição. */
function cursor(p, o = 100) {
  return layer(path({ pts: [[0, 0], [0, 22], [6, 16], [11, 26], [15, 24], [10, 14], [18, 14]], closed: true, fill: C.white, stroke: C.bg, sw: 1.5 }), { p, o });
}
/* Pulso de clique. */
function pulse(x, y, t, color = C.white) {
  return layer(circle({ d: 10, stroke: color, sw: 2 }), { p: [x, y], s: [[t, 40], [t + 24, 320]], o: [[t, 0], [t + 2, 90], [t + 24, 0]] });
}
/* Check desenhado. */
function check(x, y, t, size = 1, color = C.g) {
  return layer(path({ pts: [[-10, 0], [-3, 7], [11, -8]], stroke: color, sw: 4, draw: [[t, 0], [t + 16, 100]] }), { p: [x, y], s: size * 100 });
}

/* 1. Hierarquia visual: tudo igual → tamanho → contraste → uma ação principal. */
function hierarchy() {
  const L = [];
  const T1 = 60, T2 = 120, T3 = 180;
  L.push(bar({ x: 140, y: 40, w: 360, h: 280, c: C.card, r: 18, stroke: C.line }));
  // título
  L.push(bar({ x: 170, y: [[0, 70], [T1, 64], [T1 + 30, 64]].map ? 70 : 70, w: [[0, 220], [T1, 220], [T1 + 30, 250]], h: [[0, 14], [T1, 14], [T1 + 30, 28]], c: [[0, C.mute], [T2, C.mute], [T2 + 30, C.white]] }));
  // imagem
  L.push(bar({ x: 170, y: 116, w: 300, h: 70, c: [[0, C.mute], [T2, C.mute], [T2 + 30, C.p2]], r: 10, o: [[0, 100], [T2, 100], [T2 + 30, 55]] }));
  // texto
  [200, 218, 236].forEach((y, i) => L.push(bar({ x: 170, y, w: [[0, 300 - i * 40], [T1, 300 - i * 40], [T1 + 30, 280 - i * 50]], h: [[0, 14], [T1, 14], [T1 + 30, 8]], c: [[0, C.mute], [T2, C.mute], [T2 + 30, C.soft]] })));
  // botões
  const btn = (x, primary) =>
    bar({
      x, y: 266,
      w: primary ? [[0, 90], [T3, 90], [T3 + 30, 150]] : [[0, 90], [T3, 90], [T3 + 30, 70]],
      h: 32,
      c: primary ? [[0, C.mute], [T3, C.mute], [T3 + 30, C.p]] : [[0, C.mute], [T3, C.mute], [T3 + 30, C.card]],
      r: 16,
      stroke: primary ? undefined : C.line,
    });
  L.push(btn(170, true));
  // os secundários se deslocam quando o principal cresce
  const sec = (x0, x1) => layer(rect({ w: [[0, 90], [T3, 90], [T3 + 30, 70]], h: 32, r: 16, fill: [[0, C.mute], [T3, C.mute], [T3 + 30, C.card]], stroke: C.line }), { p: [[0, [x0 + 45, 282]], [T3, [x0 + 45, 282]], [T3 + 30, [x1 + 35, 282]]] });
  L.push(sec(270, 330), sec(370, 410));
  L.push(cursor([[0, [560, 330]], [T3 + 40, [560, 330]], [T3 + 75, [250, 290]]], [[0, 0], [T3 + 36, 0], [T3 + 44, 100]]));
  L.push(pulse(245, 282, T3 + 80, C.g));
  return doc({ w: W, h: H, op: 290, nm: "hierarchy", layers: L, markers: [[0, "Sem hierarquia"], [T1, "Tamanho"], [T2, "Contraste"], [T3, "Uma ação principal"]] });
}

/* 2. Checkout: muitos campos → só o essencial → clique → feedback. */
function checkout() {
  const L = [];
  const T1 = 70, T2 = 150, T3 = 190;
  L.push(bar({ x: 170, y: 20, w: 300, h: 320, c: C.card, r: 18, stroke: C.line }));
  const keep = { 0: 0, 3: 1, 6: 2 };
  for (let i = 0; i < 10; i++) {
    const y0 = 40 + i * 25;
    const k = keep[i];
    if (k !== undefined) {
      const y1 = 60 + k * 44;
      L.push(layer(rect({ w: [[0, 260], [T1, 260], [T1 + 30, 260]], h: [[0, 18], [T1, 18], [T1 + 30, 32]], r: 8, fill: C.bg, stroke: [[0, C.line], [T1, C.line], [T1 + 30, C.p2]] }), { p: [[0, [320, y0 + 9]], [T1, [320, y0 + 9]], [T1 + 30, [320, y1 + 16]]] }));
    } else {
      L.push(layer(rect({ w: 260, h: 18, r: 8, fill: C.bg, stroke: C.line }), { p: [[0, [320, y0 + 9]], [T1, [320, y0 + 9]], [T1 + 24, [320 + (i % 2 ? 40 : -40), y0 + 9]]], o: [[0, 100], [T1, 100], [T1 + 20, 0]], s: [[0, 100], [T1, 100], [T1 + 24, 80]] }));
    }
  }
  // botão
  L.push(layer(rect({ w: 260, h: 40, r: 20, fill: [[0, C.p], [T2 + 6, C.p], [T3, C.p], [T3 + 50, C.p], [T3 + 62, C.g]] }), { p: [[0, [320, 312]], [T1, [320, 312]], [T1 + 30, [320, 222]]] }));
  // spinner no botão
  L.push(layer(path({ pts: [[0, -9], [9, 0], [0, 9], [-9, 0]], closed: true, curve: 0.5, stroke: C.white, sw: 3, draw: [[0, 70], [1, 70]] }), { p: [320, 222], r: [[T2 + 6, 0], [T3 + 60, 720]], o: [[0, 0], [T2 + 6, 0], [T2 + 10, 100], [T3 + 56, 100], [T3 + 60, 0]] }));
  L.push(check(320, 222, T3 + 62, 1, C.bg));
  // toast de sucesso
  L.push(layer([rect({ w: 200, h: 36, r: 18, fill: C.g })], { p: [[0, [320, 300]], [T3 + 66, [320, 300]], [T3 + 84, [320, 284]]], o: [[0, 0], [T3 + 66, 0], [T3 + 84, 100]] }));
  L.push(check(250, 284, T3 + 84, 0.7, C.bg));
  L.push(cursor([[0, [560, 340]], [T2 - 30, [560, 340]], [T2, [360, 232]]], [[0, 0], [T2 - 34, 0], [T2 - 26, 100]]));
  L.push(pulse(355, 226, T2 + 4));
  return doc({ w: W, h: H, op: 320, nm: "checkout", layers: L, markers: [[0, "10 campos"], [T1, "Só o essencial"], [T2, "Clique"], [T3, "Feedback imediato"]] });
}

/* 3. Teste de usabilidade: tarefa → hesitação → ponto de atrito → padrão entre pessoas. */
function usability() {
  const L = [];
  const T1 = 80, T2 = 170, T3 = 230;
  L.push(bar({ x: 110, y: 24, w: 420, h: 250, c: C.card, r: 16, stroke: C.line }));
  L.push(bar({ x: 110, y: 24, w: 420, h: 36, c: "#1f1f2a", r: 16 }));
  [130, 190, 250].forEach((x) => L.push(bar({ x, y: 38, w: 44, h: 8, c: C.soft, r: 4 })));
  L.push(layer(circle({ d: 18, stroke: C.soft, sw: 2 }), { p: [500, 42] })); // ícone ambíguo
  L.push(bar({ x: 140, y: 90, w: 220, h: 18, c: C.mute }));
  L.push(bar({ x: 140, y: 122, w: 340, h: 70, c: "#1f1f2a", r: 10 }));
  L.push(bar({ x: 140, y: 214, w: 120, h: 34, c: C.p, r: 17 }));
  // mapa de calor no ícone
  [[60, C.red, 35], [38, C.amb, 45], [18, C.red, 70]].forEach(([d, c, o]) => L.push(layer(circle({ d, fill: c }), { p: [500, 42], s: [[0, 0], [T2, 0], [T2 + 30, 160]], o: [[0, 0], [T2, 0], [T2 + 30, o]] })));
  L.push(layer(circle({ d: 30, stroke: C.red, sw: 2 }), { p: [500, 42], s: [[T1 + 20, 100], [T1 + 50, 170], [T1 + 51, 100], [T1 + 80, 170]], o: [[0, 0], [T1 + 18, 0], [T1 + 20, 90], [T1 + 50, 0], [T1 + 51, 90], [T1 + 80, 0]] }));
  // cursor: vai para o menu, hesita perto do ícone
  L.push(cursor([[0, [260, 230]], [40, [420, 120]], [T1, [470, 60]], [T1 + 20, [520, 70]], [T1 + 40, [480, 52]], [T1 + 60, [515, 48]], [T1 + 80, [492, 60]], [T2, [500, 50]]]));
  // 5 pessoas, 2 travam
  for (let i = 0; i < 5; i++) {
    const x = 220 + i * 50, stuck = i === 1 || i === 3;
    L.push(layer([circle({ d: 14, fill: [[0, C.p2], [T3 + i * 8, C.p2], [T3 + i * 8 + 12, stuck ? C.red : C.g]], y: -10 }), rect({ w: 24, h: 18, r: 9, fill: [[0, C.p2], [T3 + i * 8, C.p2], [T3 + i * 8 + 12, stuck ? C.red : C.g]], y: 8 })], { p: [x, 320], o: [[0, 0], [T3 - 20, 0], [T3, 100]] }));
  }
  return doc({ w: W, h: H, op: 320, nm: "usability", layers: L, markers: [[0, "Tarefa"], [T1, "Hesitação"], [T2, "Ponto de atrito"], [T3, "2 de 5 travam"]] });
}

/* 4. Empatia: ouvir → anotar → agrupar → problema real. */
function empathy() {
  const L = [];
  const T1 = 60, T2 = 130, T3 = 200;
  const people = [70, 140, 210, 280];
  people.forEach((y, i) => {
    L.push(layer([circle({ d: 22, fill: C.p2, y: -8 }), rect({ w: 32, h: 20, r: 10, fill: C.p2, y: 14 })], { p: [60, y], o: [[i * 8, 0], [i * 8 + 12, 100]] }));
    L.push(layer([rect({ w: 46, h: 26, r: 10, fill: C.white }), path({ pts: [[-14, 12], [-20, 22], [-4, 12]], closed: true, fill: C.white })], { p: [[0, [120, y - 14]], [T1, [120, y - 14]], [T1 + 20, [200, y - 14]]], o: [[0, 0], [10 + i * 10, 0], [20 + i * 10, 100], [T1 + 6, 100], [T1 + 20, 0]] }));
  });
  // 9 notas: espalhadas → 3 grupos
  const groups = [C.p, C.amb, C.p2];
  const target = (g, j) => [330 + g * 100, 110 + j * 46];
  for (let n = 0; n < 9; n++) {
    const g = n % 3, j = Math.floor(n / 3);
    const sx = 230 + ((n * 67) % 360), sy = 60 + ((n * 97) % 240);
    const [tx, ty] = target(g, j);
    L.push(layer(rect({ w: 40, h: 36, r: 6, fill: [[0, C.soft], [T2, C.soft], [T2 + 20, groups[g]]] }), { p: [[0, [sx, sy]], [T2, [sx, sy]], [T2 + 30, [tx, ty]]], o: [[0, 0], [T1 + 4 + n * 4, 0], [T1 + 14 + n * 4, 100]], r: [[0, (n % 2 ? 8 : -6)], [T2, (n % 2 ? 8 : -6)], [T2 + 30, 0]] }));
  }
  // destaque do grupo do meio
  L.push(layer(rect({ w: 70, h: 160, r: 14, stroke: C.g, sw: 3 }), { p: [430, 156], o: [[0, 0], [T3, 0], [T3 + 16, 100]], s: [[T3, 120], [T3 + 20, 100]] }));
  L.push(layer(circle({ d: 26, fill: C.g }), { p: [430, 268], s: [[0, 0], [T3 + 16, 0], [T3 + 32, 100]] }));
  L.push(check(430, 268, T3 + 30, 0.7, C.bg));
  return doc({ w: W, h: H, op: 290, nm: "empathy", layers: L, markers: [[0, "Ouvir"], [T1, "Anotar"], [T2, "Agrupar"], [T3, "Problema real"]] });
}

/* 5. Iteração: protótipo → teste → ajuste → teste → melhor versão. */
function iterate() {
  const L = [];
  const T = [0, 50, 110, 170, 230];
  L.push(layer(rect({ w: 220, h: 230, r: 18, fill: C.card, stroke: [[0, C.line], [T[4], C.line], [T[4] + 16, C.g]], sw: 3 }), { p: [320, 180] }));
  L.push(bar({ x: 230, y: 84, w: 120, h: 14, c: C.mute }));
  const state = [[C.red, C.red, C.amb], [C.g, C.amb, C.red], [C.g, C.g, C.g]];
  [0, 1, 2].forEach((r) => {
    const y = 130 + r * 44;
    const col = [[0, state[0][r]], [T[2], state[0][r]], [T[2] + 14, state[1][r]], [T[4], state[1][r]], [T[4] + 14, state[2][r]]];
    L.push(layer(circle({ d: 18, fill: col }), { p: [250, y] }));
    L.push(bar({ x: 270, y: y - 5, w: 130, h: 10, c: C.soft }));
  });
  // loop em volta
  L.push(layer(path({ pts: [[0, -150], [150, 0], [0, 150], [-150, 0]], closed: true, curve: 0.55, stroke: C.p2, sw: 3, draw: [[T[1], 0], [T[2], 100]] }), { p: [320, 180], s: [100, 82] }));
  L.push(layer(path({ pts: [[0, -150], [150, 0], [0, 150], [-150, 0]], closed: true, curve: 0.55, stroke: C.g, sw: 3, draw: [[T[3], 0], [T[4], 100]] }), { p: [320, 180], s: [104, 86] }));
  L.push(cursor([[0, [560, 330]], [T[1], [560, 330]], [T[1] + 30, [300, 170]], [T[3], [300, 170]], [T[3] + 20, [300, 214]]], [[0, 0], [T[1] - 4, 0], [T[1] + 4, 100]]));
  L.push(pulse(296, 166, T[1] + 32), pulse(296, 210, T[3] + 22));
  return doc({ w: W, h: H, op: 300, nm: "iterate", layers: L, markers: [[T[0], "Protótipo"], [T[1], "Teste"], [T[2], "Ajuste"], [T[3], "Teste de novo"], [T[4], "Versão melhor"]] });
}

/* 6. Double Diamond: diverge → converge → diverge → converge. Pensado para scroll. */
function doubleDiamond() {
  const L = [];
  const T = [0, 75, 150, 225];
  const xs = [40, 180, 320, 460, 600];
  const cy = 180;
  [[xs[0], xs[2]], [xs[2], xs[4]]].forEach(([a, b], i) => {
    L.push(layer(path({ pts: [[a, cy], [(a + b) / 2, cy - 120], [b, cy], [(a + b) / 2, cy + 120]], closed: true, stroke: C.line, sw: 2, fill: i ? "#1a1430" : "#141420" })));
    L.push(layer(path({ pts: [[a, cy], [(a + b) / 2, cy - 120], [b, cy], [(a + b) / 2, cy + 120]], closed: true, stroke: C.p2, sw: 2, draw: [[T[i * 2], 0], [T[i * 2 + 2] ?? 300, 100]] })));
  });
  // pontos que divergem e convergem
  const N = 11;
  for (let n = 0; n < N; n++) {
    const spread = (n - (N - 1) / 2) * 20;
    const last = n === Math.floor(N / 2);
    L.push(layer(circle({ d: 10, fill: last ? [[0, C.p2], [T[3] + 40, C.p2], [300, C.g]] : C.p2 }), {
      p: [[0, [xs[0], cy]], [T[1], [xs[1], cy + spread]], [T[2], [xs[2], cy]], [T[3], [xs[3], cy + spread]], [300, [xs[4], cy]]],
      o: last ? 100 : [[0, 100], [T[2] - 5, 100], [T[2], 60], [T[2] + 10, 100], [290, 100], [300, 0]],
    }));
  }
  L.push(layer(circle({ d: 26, stroke: C.amb, sw: 3 }), { p: [xs[2], cy], s: [[0, 0], [T[2] - 6, 0], [T[2] + 10, 100]] }));
  L.push(layer(circle({ d: 30, fill: C.g }), { p: [xs[4], cy], s: [[0, 0], [290, 0], [300, 100]] }));
  return doc({ w: W, h: H, op: 301, nm: "double-diamond", layers: L, markers: [[T[0], "Descobrir"], [T[1], "Definir"], [T[2], "Desenvolver"], [T[3], "Entregar"]] });
}

/* 7. Atomic Research: experimento → fatos → insight → conclusão → reuso. */
function atomic() {
  const L = [];
  const T = [0, 50, 110, 160, 220];
  const X = [80, 230, 400, 560];
  const facts = [[X[1], 110], [X[1], 180], [X[1], 250]];
  const ins = [[X[2], 140], [X[2], 260]];
  const link = (a, b, t, c = C.p2) => L.push(layer(path({ pts: [a, b], stroke: c, sw: 2, draw: [[t, 0], [t + 20, 100]] })));
  L.push(layer(rect({ w: 90, h: 70, r: 12, fill: C.card, stroke: C.p2 }), { p: [X[0], 140], s: [[0, 60], [14, 100]], o: [[0, 0], [10, 100]] }));
  L.push(layer(rect({ w: 90, h: 70, r: 12, fill: C.card, stroke: C.amb }), { p: [X[0], 260], s: [[0, 0], [T[4], 0], [T[4] + 14, 100]] }));
  facts.forEach((f, i) => {
    if (i < 2) link([X[0] + 45, 140], [f[0] - 22, f[1]], T[1] + i * 6);
    L.push(layer(circle({ d: 40, fill: C.p }), { p: f, s: [[0, 0], [T[1] + 10 + i * 8, 0], [T[1] + 26 + i * 8, 100]] }));
  });
  link([X[0] + 45, 260], [facts[2][0] - 22, facts[2][1]], T[4] + 10, C.amb);
  [0, 1].forEach((i) => link([facts[i][0] + 22, facts[i][1]], [ins[0][0] - 34, ins[0][1]], T[2]));
  L.push(layer(rect({ w: 68, h: 68, r: 14, fill: C.p2 }), { p: ins[0], r: 45, s: [[0, 0], [T[2] + 10, 0], [T[2] + 26, 72]] }));
  link([ins[0][0] + 34, ins[0][1]], [X[3] - 50, 140], T[3], C.g);
  L.push(layer(rect({ w: 100, h: 56, r: 12, fill: C.g }), { p: [X[3], 140], s: [[0, 0], [T[3] + 14, 0], [T[3] + 30, 100]] }));
  // reuso: o fato 2 também alimenta um novo insight
  link([facts[1][0] + 22, facts[1][1]], [ins[1][0] - 34, ins[1][1]], T[4] + 24, C.amb);
  link([facts[2][0] + 22, facts[2][1]], [ins[1][0] - 34, ins[1][1]], T[4] + 30, C.amb);
  L.push(layer(rect({ w: 68, h: 68, r: 14, fill: C.amb }), { p: ins[1], r: 45, s: [[0, 0], [T[4] + 44, 0], [T[4] + 60, 72]] }));
  L.push(layer(circle({ d: 54, stroke: C.amb, sw: 3 }), { p: facts[1], s: [[0, 0], [T[4] + 20, 0], [T[4] + 34, 100]] }));
  return doc({ w: W, h: H, op: 310, nm: "atomic", layers: L, markers: [[T[0], "Experimento"], [T[1], "Fatos"], [T[2], "Insight"], [T[3], "Conclusão"], [T[4], "Reuso"]] });
}

/* 8. Relatório longo → átomos → encontrar em segundos. */
function atomize() {
  const L = [];
  const T1 = 70, T2 = 160;
  L.push(layer(rect({ w: 200, h: 300, r: 12, fill: C.card, stroke: C.line }), { p: [180, 180], o: [[0, 100], [T1, 100], [T1 + 20, 0]] }));
  const cols = [C.p, C.p2, C.amb, C.g];
  for (let i = 0; i < 16; i++) {
    const y0 = 50 + i * 16, w0 = 160 - (i % 3) * 30;
    const gx = 360 + (i % 4) * 60, gy = 80 + Math.floor(i / 4) * 60;
    const hit = i === 9;
    L.push(layer(rect({ w: [[0, w0], [T1, w0], [T1 + 30, 34]], h: [[0, 8], [T1, 8], [T1 + 30, 34]], r: [[0, 4], [T1, 4], [T1 + 30, 17]], fill: [[0, C.soft], [T1, C.soft], [T1 + 30, cols[i % 4]], [T2 + 40, cols[i % 4]], [T2 + 54, hit ? C.g : cols[i % 4]]] }), {
      p: [[0, [100 + w0 / 2, y0]], [T1, [100 + w0 / 2, y0]], [T1 + 30, [gx, gy]]],
      o: [[0, 100], [T2 + 40, 100], [T2 + 54, hit ? 100 : 35]],
      s: [[0, 100], [T2 + 40, 100], [T2 + 54, hit ? 130 : 100]],
    }));
  }
  // lupa
  L.push(layer([circle({ d: 46, stroke: C.white, sw: 4 }), path({ pts: [[16, 16], [32, 32]], stroke: C.white, sw: 5 })], { p: [[0, [600, 330]], [T2, [600, 330]], [T2 + 40, [420, 200]]], o: [[0, 0], [T2 - 4, 0], [T2 + 4, 100]] }));
  return doc({ w: W, h: H, op: 260, nm: "atomize", layers: L, markers: [[0, "Relatório longo"], [T1, "Átomos"], [T2, "Encontrar em segundos"]] });
}

save("hierarchy", hierarchy());
save("checkout", checkout());
save("usability", usability());
save("empathy", empathy());
save("iterate", iterate());
save("double-diamond", doubleDiamond());
save("atomic", atomic());
save("atomize", atomize());
console.log("ok");
