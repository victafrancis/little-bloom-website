import { useEffect, useRef } from 'react';

type DustParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  twinkle: number;
  star: boolean;
};

type Butterfly = {
  // Fractions of canvas size the flight path is centered on / spans
  centerX: number;
  centerY: number;
  spanX: number;
  spanY: number;
  // Sinusoid frequencies (rad/s) and phases for an organic wandering path
  freq: [number, number, number, number];
  phase: [number, number, number, number];
  flapSpeed: number;
  size: number;
  facing: number;
  prevX: number;
  prevY: number;
};

// Golden fairy dust palette, anchored on the site's mustard (#CCA42A)
const DUST_COLORS = ['#CCA42A', '#DDBB4E', '#EDD684', '#F9EDBB'];

const MAX_PARTICLES = 150;

function makeButterflies(): Butterfly[] {
  return [
    {
      centerX: 0.32,
      centerY: 0.48,
      spanX: 0.26,
      spanY: 0.3,
      freq: [0.19, 0.43, 0.16, 0.37],
      phase: [0.2, 1.7, 2.4, 0.8],
      flapSpeed: 7.2,
      size: 96,
      facing: -1,
      prevX: 0,
      prevY: 0,
    },
    {
      centerX: 0.68,
      centerY: 0.52,
      spanX: 0.26,
      spanY: 0.28,
      freq: [0.16, 0.36, 0.22, 0.29],
      phase: [3.4, 0.4, 5.2, 2.9],
      flapSpeed: 6.1,
      size: 84,
      facing: 1,
      prevX: 0,
      prevY: 0,
    },
  ];
}

/**
 * Two of the brand's line-art butterflies fluttering along gentle looping
 * paths while sprinkling golden fairy dust. Drawn on a transparent canvas so
 * it blends into whatever background it sits on. Falls back to the static
 * butterflies when the visitor prefers reduced motion, and pauses whenever
 * it is offscreen or the tab is hidden.
 */
export function ButterfliesAnimation({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const sprite = new Image();
    sprite.src = '/assets/butterfly.png';

    const butterflies = makeButterflies();
    const particles: DustParticle[] = [];

    let width = 0;
    let height = 0;
    let rafId = 0;
    let running = false;
    let inView = true;
    let lastTime = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reducedMotion) drawStatic();
    };

    const pathPoint = (b: Butterfly, t: number) => {
      const x =
        width * b.centerX +
        width * b.spanX * (0.75 * Math.sin(b.freq[0] * t + b.phase[0]) + 0.25 * Math.sin(b.freq[1] * t + b.phase[1]));
      const y =
        height * b.centerY +
        height * b.spanY * (0.7 * Math.sin(b.freq[2] * t + b.phase[2]) + 0.3 * Math.sin(b.freq[3] * t + b.phase[3]));
      return { x, y };
    };

    const drawButterfly = (b: Butterfly, t: number) => {
      const { x, y } = pathPoint(b, t);
      const dx = x - b.prevX;
      const dy = y - b.prevY;
      if (dx > 0.05) b.facing = 1;
      else if (dx < -0.05) b.facing = -1;
      b.prevX = x;
      b.prevY = y;

      // Wing flap: squash the side-view sprite horizontally
      const flap = 0.62 + 0.38 * Math.abs(Math.sin(t * b.flapSpeed + b.phase[0]));
      // Gentle tilt into the direction of vertical travel, plus a tiny bob
      const tilt = Math.max(-0.22, Math.min(0.22, dy * 0.18)) * b.facing;
      const bob = 2 * Math.sin(t * b.flapSpeed * 0.5 + b.phase[1]);

      ctx.save();
      ctx.translate(x, y + bob);
      ctx.rotate(tilt);
      // The sprite faces left; mirror it when flying right
      ctx.scale(b.facing === 1 ? -flap : flap, 1);
      ctx.drawImage(sprite, -b.size / 2, -b.size / 2, b.size, b.size);
      ctx.restore();

      return { x, y: y + bob };
    };

    const emitDust = (x: number, y: number, facing: number) => {
      if (particles.length >= MAX_PARTICLES) return;
      // Sprinkle from just behind and below the body
      particles.push({
        x: x - facing * (8 + Math.random() * 14),
        y: y + 10 + Math.random() * 16,
        vx: -facing * (4 + Math.random() * 10) + (Math.random() - 0.5) * 8,
        vy: 8 + Math.random() * 22,
        life: 0,
        maxLife: 1 + Math.random() * 1.4,
        size: 1 + Math.random() * 2.2,
        color: DUST_COLORS[Math.floor(Math.random() * DUST_COLORS.length)],
        twinkle: Math.random() * Math.PI * 2,
        star: Math.random() < 0.22,
      });
    };

    const drawDust = (dt: number, t: number) => {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        p.vy += 14 * dt; // light gravity so the dust drifts down
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const fade = 1 - p.life / p.maxLife;
        const alpha = fade * (0.55 + 0.45 * Math.sin(p.twinkle + t * 9));
        if (alpha <= 0) continue;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = '#E9CF6B';
        ctx.shadowBlur = p.size * 3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * fade + 0.4, 0, Math.PI * 2);
        ctx.fill();
        if (p.star) {
          // Little four-point sparkle
          const r = (p.size + 2.5) * fade;
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(p.x - r, p.y);
          ctx.lineTo(p.x + r, p.y);
          ctx.moveTo(p.x, p.y - r);
          ctx.lineTo(p.x, p.y + r);
          ctx.stroke();
        }
        ctx.restore();
      }
    };

    const frame = (now: number) => {
      rafId = 0;
      if (!running) return;
      const t = now / 1000;
      const dt = Math.min(0.05, lastTime ? t - lastTime : 0.016);
      lastTime = t;

      ctx.clearRect(0, 0, width, height);
      drawDust(dt, t);
      for (const b of butterflies) {
        const pos = drawButterfly(b, t);
        if (Math.random() < 0.75) emitDust(pos.x, pos.y, b.facing);
      }
      rafId = requestAnimationFrame(frame);
    };

    const drawStatic = () => {
      const draw = () => {
        ctx.clearRect(0, 0, width, height);
        for (const b of butterflies) {
          ctx.save();
          ctx.translate(width * b.centerX, height * b.centerY);
          ctx.scale(b.facing === 1 ? -1 : 1, 1);
          ctx.drawImage(sprite, -b.size / 2, -b.size / 2, b.size, b.size);
          ctx.restore();
        }
      };
      if (sprite.complete && sprite.naturalWidth > 0) draw();
      else sprite.addEventListener('load', draw, { once: true });
    };

    const updateRunning = () => {
      const shouldRun = !reducedMotion && inView && document.visibilityState === 'visible';
      if (shouldRun && !running) {
        running = true;
        lastTime = 0;
        if (!rafId) rafId = requestAnimationFrame(frame);
      } else if (!shouldRun) {
        running = false;
      }
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        updateRunning();
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(canvas);

    const onVisibility = () => updateRunning();
    document.addEventListener('visibilitychange', onVisibility);

    if (!reducedMotion) {
      if (sprite.complete && sprite.naturalWidth > 0) updateRunning();
      else sprite.addEventListener('load', updateRunning, { once: true });
    }

    return () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
    />
  );
}
