import { useEffect, useRef } from 'react';

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

// Sprite size is tuned for the ~560px-wide Home canvas and scales down
// proportionally in narrower containers (e.g. the mobile menu)
const SIZE_REFERENCE_WIDTH = 560;

// The x sinusoids share this start phase so that at t=0 each butterfly sits
// at exactly centerX - 0.4545 * spanX (left) / centerX + 0.4545 * spanX
// (right): 25% and 75% of the canvas width, drifting toward each other.
const START_PHASE = Math.asin(0.4545);

function makeButterflies(): Butterfly[] {
  return [
    {
      centerX: 0.35,
      centerY: 0.48,
      spanX: 0.22,
      spanY: 0.3,
      freq: [0.19, 0.43, 0.16, 0.37],
      phase: [-START_PHASE, -START_PHASE, 2.4, 0.8],
      flapSpeed: 7.2,
      size: 96,
      facing: 1,
      prevX: 0,
      prevY: 0,
    },
    {
      centerX: 0.65,
      centerY: 0.52,
      spanX: 0.22,
      spanY: 0.28,
      freq: [0.16, 0.36, 0.22, 0.29],
      phase: [Math.PI - START_PHASE, Math.PI - START_PHASE, 5.2, 2.9],
      flapSpeed: 6.1,
      size: 84,
      facing: -1,
      prevX: 0,
      prevY: 0,
    },
  ];
}

/**
 * Two of the brand's line-art butterflies start at 25% and 75% of the canvas
 * width, facing each other, and flutter along gentle looping paths. Drawn on
 * a transparent canvas so it blends into whatever background it sits on.
 * The animation clock only advances while frames render, so the starting
 * pose holds until the canvas first becomes visible. Falls back to static
 * butterflies for prefers-reduced-motion, and pauses whenever it is
 * offscreen or the tab is hidden.
 */
export function ButterfliesAnimation({
  className = '',
  spriteScale = 1,
}: {
  className?: string;
  /** Multiplier on the width-proportional sprite size, for small containers */
  spriteScale?: number;
}) {
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

    let width = 0;
    let height = 0;
    let rafId = 0;
    let running = false;
    let inView = true;
    let lastTime = 0;
    // Accumulated animation time: only advances while frames actually render
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

    const spriteSize = (b: Butterfly) => b.size * Math.min(1, width / SIZE_REFERENCE_WIDTH) * spriteScale;

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
      const size = spriteSize(b);

      ctx.save();
      ctx.translate(x, y + bob);
      ctx.rotate(tilt);
      // The sprite faces left; mirror it when flying right
      ctx.scale(b.facing === 1 ? -flap : flap, 1);
      // Guard against the sprite being unavailable/broken: drawImage throws an
      // InvalidStateError on a broken HTMLImageElement.
      if (sprite.complete && sprite.naturalWidth > 0) {
        ctx.drawImage(sprite, -size / 2, -size / 2, size, size);
      }
      ctx.restore();
    };

    const frame = (now: number) => {
      rafId = 0;
      if (!running) return;
      const dt = Math.min(0.05, lastTime ? (now - lastTime) / 1000 : 0.016);
      lastTime = now;
      animTime += dt;

      ctx.clearRect(0, 0, width, height);
      for (const b of butterflies) drawButterfly(b, animTime);
      rafId = requestAnimationFrame(frame);
    };

    const drawStatic = () => {
      const draw = () => {
        ctx.clearRect(0, 0, width, height);
        for (const b of butterflies) {
          const { x, y } = pathPoint(b, 0);
          const size = spriteSize(b);
          ctx.save();
          ctx.translate(x, y);
          ctx.scale(b.facing === 1 ? -1 : 1, 1);
          ctx.drawImage(sprite, -size / 2, -size / 2, size, size);
          ctx.restore();
        }
      };
      if (sprite.complete && sprite.naturalWidth > 0) draw();
      else sprite.addEventListener('load', draw, { once: true });
    };

    const updateRunning = () => {
      const shouldRun =
        !reducedMotion &&
        inView &&
        document.visibilityState === 'visible' &&
        sprite.complete &&
        sprite.naturalWidth > 0;
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
  }, [spriteScale]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
    />
  );
}
