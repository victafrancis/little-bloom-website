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

// Trail sparkles stay within this budget; explosions may use the full cap
const TRAIL_PARTICLE_LIMIT = 150;
const MAX_PARTICLES = 420;

// Both x sinusoids start at a -sin/+sin extreme (phase ∓π/2) so at t=0 the
// butterflies sit at opposite ends of the canvas and drift inward from there.
function makeButterflies(): Butterfly[] {
  return [
    {
      centerX: 0.32,
      centerY: 0.48,
      spanX: 0.26,
      spanY: 0.3,
      freq: [0.19, 0.43, 0.16, 0.37],
      phase: [-Math.PI / 2, -Math.PI / 2, 2.4, 0.8],
      flapSpeed: 7.2,
      size: 96,
      facing: 1,
      prevX: 0,
      prevY: 0,
    },
    {
      centerX: 0.68,
      centerY: 0.52,
      spanX: 0.26,
      spanY: 0.28,
      freq: [0.16, 0.36, 0.22, 0.29],
      phase: [Math.PI / 2, Math.PI / 2, 5.2, 2.9],
      flapSpeed: 6.1,
      size: 84,
      facing: -1,
      prevX: 0,
      prevY: 0,
    },
  ];
}

function randomFairyColor() {
  const hue = Math.floor(Math.random() * 360);
  const sat = 70 + Math.floor(Math.random() * 30);
  const light = 55 + Math.floor(Math.random() * 20);
  return `hsl(${hue}, ${sat}%, ${light}%)`;
}

/**
 * Two of the brand's line-art butterflies start at opposite ends and flutter
 * along gentle looping paths while sprinkling golden fairy dust. Pressing a
 * butterfly sets off an explosion of randomly colored dust (a tap nearby
 * gives a smaller burst). Drawn on a transparent canvas so it blends into
 * whatever background it sits on. Falls back to the static
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
    // Accumulated animation time: only advances while frames actually render,
    // so the butterflies hold their opposite-ends starting pose until the
    // section first scrolls into view.
    let animTime = 0;

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

    const explode = (x: number, y: number, count: number) => {
      for (let i = 0; i < count && particles.length < MAX_PARTICLES; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 30 + Math.random() * 160;
        particles.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 25,
          life: 0,
          maxLife: 0.7 + Math.random() * 1.2,
          size: 1.2 + Math.random() * 2.6,
          color: randomFairyColor(),
          twinkle: Math.random() * Math.PI * 2,
          star: Math.random() < 0.35,
        });
      }
    };

    const emitDust = (x: number, y: number, facing: number) => {
      if (particles.length >= TRAIL_PARTICLE_LIMIT) return;
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
        const drag = Math.max(0, 1 - 1.4 * dt); // lets explosions bloom, then float
        p.vx *= drag;
        p.vy *= drag;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const fade = 1 - p.life / p.maxLife;
        const alpha = fade * (0.55 + 0.45 * Math.sin(p.twinkle + t * 9));
        if (alpha <= 0) continue;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
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
      const dt = Math.min(0.05, lastTime ? (now - lastTime) / 1000 : 0.016);
      lastTime = now;
      animTime += dt;
      const t = animTime;

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

    const hitButterfly = (x: number, y: number) =>
      butterflies.find((b) => Math.hypot(x - b.prevX, y - b.prevY) < Math.max(44, b.size * 0.65));

    const pointerPos = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onPointerDown = (e: PointerEvent) => {
      if (reducedMotion || !running) return;
      const { x, y } = pointerPos(e);
      const b = hitButterfly(x, y);
      // Pressing a butterfly sets off a big burst from it; pressing the air
      // around them still rewards the tap with a smaller sparkle pop.
      if (b) explode(b.prevX, b.prevY, 90);
      else explode(x, y, 28);
    };
    canvas.addEventListener('pointerdown', onPointerDown);

    const onPointerMove = (e: PointerEvent) => {
      if (reducedMotion || !running) return;
      const { x, y } = pointerPos(e);
      canvas.style.cursor = hitButterfly(x, y) ? 'pointer' : 'default';
    };
    canvas.addEventListener('pointermove', onPointerMove);

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
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`select-none ${className}`}
    />
  );
}
