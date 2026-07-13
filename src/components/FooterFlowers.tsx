import { useEffect, useRef } from 'react';

// Flower-head landing spots for the bee, as fractions of the artwork
// (public/assets/flowers.png, 1375x474)
const LANDING_SPOTS: Array<[number, number]> = [
  [0.105, 0.16],
  [0.2, 0.17],
  [0.385, 0.2],
  [0.65, 0.28],
  [0.78, 0.36],
  [0.94, 0.58],
];

// Vertical slices the artwork is drawn in; each gets its own wind shear
const WIND_STRIPS = 60;

type BeeState = 'waiting' | 'flying-in' | 'landed' | 'flying-out';

/**
 * The footer meadow, alive: the line-art flowers sway in a travelling wind
 * wave (stems anchored at the bottom, tops drifting side to side with gusts),
 * while a little bee periodically flies in from one side, lands on a flower
 * head, rides its sway, then leaves out the other side. All drawn on a
 * transparent canvas — no GIF — so it stays crisp, seamless on the white
 * background, and never visibly loops. Renders the static artwork for
 * prefers-reduced-motion, and pauses offscreen or when the tab is hidden.
 */
export function FooterFlowers({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const art = new Image();
    art.src = '/assets/flowers.png';

    let width = 0;
    let height = 0;
    let rafId = 0;
    let running = false;
    let inView = true;
    let lastTime = 0;
    let animTime = 0;

    const bee = {
      state: 'waiting' as BeeState,
      stateTime: 0,
      duration: 2.5,
      dir: 1, // 1 = travelling left-to-right
      fromX: 0,
      fromY: 0,
      toX: 0,
      toY: 0,
      spot: LANDING_SPOTS[2],
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reducedMotion) drawStatic();
    };

    // Horizontal wind displacement at the TOP of the canvas for a given x.
    // Multiply by (1 - y/height) to get the displacement at height y, so
    // stems stay rooted at the bottom.
    const windTop = (x: number, t: number) => {
      const gust = 0.55 + 0.45 * Math.sin(0.35 * t) * Math.sin(0.13 * t + 1.3);
      const amplitude = width * 0.011 * gust;
      const k = (Math.PI * 2 * 1.3) / width;
      return amplitude * Math.sin(k * x - 1.1 * t);
    };

    const drawFlowers = (t: number) => {
      const stripW = width / WIND_STRIPS;
      const srcStripW = art.naturalWidth / WIND_STRIPS;
      for (let i = 0; i < WIND_STRIPS; i++) {
        const x = i * stripW;
        const d = windTop(x + stripW / 2, t);
        ctx.save();
        // Shear: full displacement d at the top, zero at the bottom
        ctx.transform(1, 0, -d / height, 1, d, 0);
        // 1px source overlap hides seams between sheared strips
        ctx.drawImage(
          art,
          i * srcStripW,
          0,
          srcStripW + (i < WIND_STRIPS - 1 ? 1 : 0),
          art.naturalHeight,
          x,
          0,
          stripW + (i < WIND_STRIPS - 1 ? 1 : 0),
          height
        );
        ctx.restore();
      }
    };

    const drawBee = (x: number, y: number, heading: number, wingPhase: number, alpha: number) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);
      ctx.scale(heading, 1);
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#4A4A4A';

      // Wings: two petal shapes fluttering above the body
      const flutter = 0.55 + 0.45 * Math.sin(wingPhase);
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      for (const side of [-1, 1]) {
        ctx.save();
        ctx.translate(side * 1.5, -4);
        ctx.rotate(side * (0.5 + 0.5 * flutter));
        ctx.beginPath();
        ctx.ellipse(0, -3.4, 2.6, 4.4 * flutter + 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      // Body: brand-gold with dark stripes
      ctx.fillStyle = '#CCA42A';
      ctx.beginPath();
      ctx.ellipse(0, 0, 6, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#4A4A4A';
      for (const sx of [-2.2, 0.6]) {
        ctx.beginPath();
        ctx.ellipse(sx, 0, 1.1, 3.7, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      // Head
      ctx.beginPath();
      ctx.arc(6.4, -0.6, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const pickFlight = (entering: boolean) => {
      bee.stateTime = 0;
      if (entering) {
        bee.spot = LANDING_SPOTS[Math.floor(Math.random() * LANDING_SPOTS.length)];
        bee.state = 'flying-in';
        bee.duration = 2.6 + Math.random() * 1.2;
        bee.fromX = bee.dir === 1 ? -20 : width + 20;
        bee.fromY = height * (0.15 + Math.random() * 0.3);
        bee.toX = width * bee.spot[0];
        bee.toY = height * bee.spot[1] - 7; // perch just above the flower head
      } else {
        bee.state = 'flying-out';
        bee.duration = 2.2 + Math.random() * 1;
        bee.fromX = bee.toX;
        bee.fromY = bee.toY;
        bee.toX = bee.dir === 1 ? width + 20 : -20;
        bee.toY = height * (0.1 + Math.random() * 0.25);
      }
    };

    const updateBee = (dt: number, t: number) => {
      bee.stateTime += dt;
      const swayAt = (x: number, y: number) => windTop(x, t) * (1 - y / height);

      if (bee.state === 'waiting') {
        if (bee.stateTime >= bee.duration) pickFlight(true);
        return;
      }

      if (bee.state === 'landed') {
        const x = bee.toX + swayAt(bee.toX, bee.toY);
        const y = bee.toY + 0.8 * Math.sin(t * 2.1);
        // Wings mostly folded, with the odd little shiver
        const shiver = Math.sin(0.9 * t) > 0.72 ? t * 34 : Math.PI / 2 + Math.sin(t * 2) * 0.15;
        drawBee(x, y, bee.dir, shiver, 1);
        if (bee.stateTime >= bee.duration) pickFlight(false);
        return;
      }

      // Flying in or out
      const p = Math.min(1, bee.stateTime / bee.duration);
      const ease = p * p * (3 - 2 * p); // smoothstep
      const arriving = bee.state === 'flying-in';
      // Sway the endpoint that sits on the flower so take-offs/landings track it
      const anchorSway = swayAt(bee.toX, bee.toY);
      const toX = arriving ? bee.toX + anchorSway : bee.toX;
      const fromX = arriving ? bee.fromX : bee.fromX + swayAt(bee.fromX, bee.fromY);
      const x = fromX + (toX - fromX) * ease;
      const arc = arriving ? -14 : -22;
      const bobFade = arriving ? 1 - ease : ease;
      const y =
        bee.fromY + (bee.toY - bee.fromY) * ease + arc * Math.sin(Math.PI * ease) + 2.5 * Math.sin(t * 9) * bobFade;
      const heading = toX >= fromX ? 1 : -1;
      // Fade at the canvas edge so the bee never pops in or out
      const edgeFade = Math.max(0, Math.min(1, (Math.min(x, width - x) + 20) / 40));
      drawBee(x, y, heading, t * 34, edgeFade);

      if (p >= 1) {
        bee.stateTime = 0;
        if (arriving) {
          bee.state = 'landed';
          bee.duration = 2.5 + Math.random() * 3;
        } else {
          bee.state = 'waiting';
          bee.duration = 3 + Math.random() * 5;
          bee.dir = -bee.dir; // come back from the side it left on
        }
      }
    };

    const frame = (now: number) => {
      rafId = 0;
      if (!running) return;
      const dt = Math.min(0.05, lastTime ? (now - lastTime) / 1000 : 0.016);
      lastTime = now;
      animTime += dt;

      ctx.clearRect(0, 0, width, height);
      drawFlowers(animTime);
      updateBee(dt, animTime);
      rafId = requestAnimationFrame(frame);
    };

    const drawStatic = () => {
      const draw = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(art, 0, 0, width, height);
      };
      if (art.complete && art.naturalWidth > 0) draw();
      else art.addEventListener('load', draw, { once: true });
    };

    const updateRunning = () => {
      const shouldRun =
        !reducedMotion && inView && document.visibilityState === 'visible' && art.complete && art.naturalWidth > 0;
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
      if (art.complete && art.naturalWidth > 0) updateRunning();
      else art.addEventListener('load', updateRunning, { once: true });
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
      width={557}
      height={192}
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
    />
  );
}
