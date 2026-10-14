"use client";

import { useEffect, useRef, type ReactNode } from "react";

const FRAME_COUNT = 100;
// Quantos frames baixar em paralelo. Mantém a rede livre no primeiro paint
// (fonte/JS/LCP) em vez de disparar 100 requisições de uma vez.
const LOAD_CONCURRENCY = 12;

const frameSrc = (index: number) =>
  `/frames/camilo_${String(index).padStart(3, "0")}.webp`;

function drawCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
) {
  const imageRatio = image.width / image.height;
  const canvasRatio = width / height;
  const renderWidth = imageRatio > canvasRatio ? height * imageRatio : width;
  const renderHeight = imageRatio > canvasRatio ? height : width / imageRatio;
  const offsetX = (width - renderWidth) / 2;
  const offsetY = (height - renderHeight) / 2;

  context.clearRect(0, 0, width, height);
  context.drawImage(image, offsetX, offsetY, renderWidth, renderHeight);
}

/**
 * Casca animada do hero: ocupa 240vh de scroll com um canvas "sticky" que
 * percorre os 100 frames do rosto conforme o usuário rola a página.
 *
 * Carregamento: frame 0 primeiro (paint imediato), o restante em fila
 * ascendente com concorrência limitada — então os frames chegam na mesma
 * ordem em que serão exibidos. Se o usuário rolar rápido antes de um frame
 * carregar, desenhamos o frame carregado mais próximo (nunca em branco),
 * mantendo a animação fluida e refinando quando o frame exato chega.
 */
export function HeroCanvas({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedRef = useRef<boolean[]>([]);
  const frameRef = useRef(0);
  // Cache do tamanho do backing-store: só reabastecemos o canvas quando a
  // dimensão real muda (evita realocar o bitmap a cada frame de scroll).
  const sizeRef = useRef({ w: 0, h: 0, dpr: 0 });

  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const images = imagesRef.current;
    const loaded = loadedRef.current;

    // Resolve o frame a desenhar: o pedido, ou o carregado mais próximo.
    let drawIndex = index;
    if (!loaded[drawIndex]) {
      let found = -1;
      for (let d = 1; d < FRAME_COUNT; d++) {
        if (index - d >= 0 && loaded[index - d]) {
          found = index - d;
          break;
        }
        if (index + d < FRAME_COUNT && loaded[index + d]) {
          found = index + d;
          break;
        }
      }
      if (found === -1) return; // nada carregado ainda
      drawIndex = found;
    }

    const image = images[drawIndex];
    if (!image?.complete || image.naturalWidth === 0) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const dpr = window.devicePixelRatio || 1;
    const { width, height } = canvas.getBoundingClientRect();
    if (width === 0 || height === 0) return;

    const size = sizeRef.current;
    if (size.w !== width || size.h !== height || size.dpr !== dpr) {
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      sizeRef.current = { w: width, h: height, dpr };
    }

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawCover(context, image, width, height);
  };

  // Carrega os frames de forma progressiva (frame 0 primeiro, resto em fila).
  useEffect(() => {
    let cancelled = false;
    const images = Array.from({ length: FRAME_COUNT }, () => new Image());
    const loaded = new Array<boolean>(FRAME_COUNT).fill(false);
    imagesRef.current = images;
    loadedRef.current = loaded;

    const markLoaded = (index: number) => {
      if (cancelled) return;
      loaded[index] = true;
      // Redesenha se este é o frame que o scroll pede agora — ou se ainda não
      // havíamos desenhado nada (primeiro frame disponível na tela).
      if (index === frameRef.current || sizeRef.current.dpr === 0) {
        renderFrame(frameRef.current);
      }
    };

    const load = (index: number) =>
      new Promise<void>((resolve) => {
        const image = images[index];
        image.onload = () => {
          markLoaded(index);
          resolve();
        };
        image.onerror = () => resolve();
        image.decoding = "async";
        image.src = frameSrc(index);
      });

    void (async () => {
      // Frame visível primeiro, com prioridade alta.
      images[0].fetchPriority = "high";
      await load(0);

      // O restante começa logo em seguida: o efeito depende do scroll desde o
      // primeiro gesto, e esperar o "load"/idle deixava o rosto congelado em
      // redes reais. São ~3 MB no total.
      if (cancelled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Restante em fila ascendente, com concorrência limitada.
      let next = 1;
      const worker = async () => {
        while (!cancelled && next < FRAME_COUNT) {
          const index = next++;
          await load(index);
        }
      };
      await Promise.all(
        Array.from({ length: LOAD_CONCURRENCY }, () => worker()),
      );
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Liga o frame ao progresso de scroll da seção.
  useEffect(() => {
    let animationFrame = 0;

    const update = () => {
      const section = sectionRef.current;
      if (!section) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { frameRef.current = 0; renderFrame(0); return; }

      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      // Guarda contra divisão por zero/negativo (seção menor que a viewport).
      const progress = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      const nextFrame = Math.min(
        FRAME_COUNT - 1,
        Math.max(0, Math.round(progress * (FRAME_COUNT - 1))),
      );

      if (nextFrame !== frameRef.current) {
        frameRef.current = nextFrame;
        renderFrame(nextFrame);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(update);
    };

    const onResize = () => renderFrame(frameRef.current);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    update();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section
      id="inicio"
      ref={sectionRef}
      data-nav-theme="light"
      className="proposal-hero force-light relative h-[240vh] bg-canvas text-ink"
    >
      {/*
        Mobile: coluna — texto em cima (fluxo), imagem animada num box embaixo.
        Desktop (md+): overlay clássico — canvas full-bleed atrás do texto.
      */}
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden md:block">
        {/* TEXTO — fluxo no topo (mobile) / overlay centralizado (desktop) */}
        <div className="relative z-20 shrink-0 pt-16 md:absolute md:inset-0 md:z-10 md:flex md:h-full md:items-center md:pt-0">
          {children}
        </div>

        {/* IMAGEM ANIMADA — box emoldurado embaixo (mobile) / full-bleed atrás (desktop) */}
        <div className="relative z-0 mx-4 mb-4 min-h-0 flex-1 overflow-hidden rounded-3xl border border-ink/[0.06] bg-[#f2f2f4] shadow-[0_20px_60px_-24px_rgba(10,10,10,0.18)] md:absolute md:inset-0 md:m-0 md:flex-none md:rounded-none md:border-0 md:shadow-none">
          <canvas
            ref={canvasRef}
            aria-label="Sequência animada de Jhon Camilo Rios"
            className="absolute inset-0 h-full w-full"
          />
        </div>

        {/* Véu de luz: apenas desktop à esquerda — mantém a área de texto limpa */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[5] hidden md:block bg-[linear-gradient(90deg,#f2f2f4_0%,rgba(242,242,244,0.86)_30%,rgba(242,242,244,0)_58%)]"
        />
      </div>
    </section>
  );
}
