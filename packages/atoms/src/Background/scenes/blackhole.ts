import { readSceneAccent } from './index.js';

export function blackholeScene(canvas: HTMLCanvasElement): () => void {
  const HEAVY_COUNT = 6;
  const LIGHT_COUNT = 50;
  const TOTAL = HEAVY_COUNT + LIGHT_COUNT;
  const G = 0.08;
  const SOFTENING = 40;
  const DAMPING = 0.9992;
  const BG_COLOR = '#050508';
  const TAIL_SEGMENTS = 12;

  const EJECT_RADIUS = 60;
  const EJECT_THRESHOLD = 3;
  const EJECT_SPEED_MIN = 2.5;
  const EJECT_SPEED_MAX = 5.5;
  const EJECT_COOLDOWN = 120;
  const ejectTimers: number[] = [];

  const BH_MASS = 8000;
  const BH_RADIUS = 18;
  const BH_INFLUENCE = 350;
  const BH_SPEED = 0.12;

  interface BlackHole {
    x: number;
    y: number;
    vx: number;
    vy: number;
    angle: number;
  }

  let blackHole: BlackHole | null = null;

  interface Body {
    x: number;
    y: number;
    vx: number;
    vy: number;
    mass: number;
    radius: number;
  }

  const ctx = canvas.getContext('2d')!;
  let animId: number;
  let bodies: Body[] = [];

  function seedBodies(): void {
    bodies = [];
    ejectTimers.length = 0;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const spread = Math.min(canvas.width, canvas.height) * 0.38;

    const bhAngle = Math.random() * Math.PI * 2;
    const bhDist = spread * 0.3;
    blackHole = {
      x: cx + Math.cos(bhAngle) * bhDist,
      y: cy + Math.sin(bhAngle) * bhDist,
      vx: -Math.sin(bhAngle) * BH_SPEED,
      vy: Math.cos(bhAngle) * BH_SPEED,
      angle: 0,
    };

    for (let i = 0; i < TOTAL; i++) {
      const isHeavy = i < HEAVY_COUNT;
      const mass = isHeavy ? 80 + Math.random() * 120 : 2 + Math.random() * 6;
      const radius = isHeavy ? 3.5 + mass * 0.015 : 1.2 + mass * 0.15;

      const angle = Math.random() * Math.PI * 2;
      const dist = (0.15 + Math.random() * 0.85) * spread;
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;

      const orbitalSpeed = isHeavy ? 0.45 + Math.random() * 0.25 : 0.4 + Math.random() * 0.6;
      const vx = -Math.sin(angle) * orbitalSpeed + (Math.random() - 0.5) * 0.1;
      const vy = Math.cos(angle) * orbitalSpeed + (Math.random() - 0.5) * 0.1;

      bodies.push({ x, y, vx, vy, mass, radius });
      if (i < HEAVY_COUNT) ejectTimers.push(0);
    }
  }

  function applyBlackHoleGravity(body: Body): void {
    if (!blackHole) return;
    const dx = blackHole.x - body.x;
    const dy = blackHole.y - body.y;
    const distSq = dx * dx + dy * dy;
    const dist = Math.sqrt(distSq);

    if (dist < BH_RADIUS + body.radius) {
      const angle = Math.random() * Math.PI * 2;
      const ejectSpeed = 4 + Math.random() * 3;
      body.vx = Math.cos(angle) * ejectSpeed;
      body.vy = Math.sin(angle) * ejectSpeed;
      body.x = blackHole.x + Math.cos(angle) * BH_INFLUENCE * 0.6;
      body.y = blackHole.y + Math.sin(angle) * BH_INFLUENCE * 0.6;
      return;
    }

    const softDist = dist + 15;
    let force = (G * BH_MASS) / (softDist * softDist);

    if (dist < BH_INFLUENCE) {
      const proximity = 1 - dist / BH_INFLUENCE;
      force *= 1 + proximity * proximity * 8;
    }

    body.vx += force * (dx / dist);
    body.vy += force * (dy / dist);
  }

  function step(): void {
    for (let i = HEAVY_COUNT; i < bodies.length; i++) {
      let ax = 0;
      let ay = 0;
      const bi = bodies[i]!;

      for (let j = 0; j < bodies.length; j++) {
        if (i === j) continue;
        const bj = bodies[j]!;
        const dx = bj.x - bi.x;
        const dy = bj.y - bi.y;
        const distSq = dx * dx + dy * dy + SOFTENING * SOFTENING;
        const dist = Math.sqrt(distSq);
        const force = (G * bj.mass) / distSq;

        ax += force * (dx / dist);
        ay += force * (dy / dist);

        const minDist = bi.radius + bj.radius + 12;
        if (dist < minDist) {
          const repel = (0.5 * (minDist - dist)) / dist;
          ax -= repel * dx;
          ay -= repel * dy;
        }
      }

      bi.vx = (bi.vx + ax) * DAMPING;
      bi.vy = (bi.vy + ay) * DAMPING;
      applyBlackHoleGravity(bi);
    }

    for (let i = 0; i < HEAVY_COUNT; i++) {
      applyBlackHoleGravity(bodies[i]!);
    }

    for (let i = 0; i < HEAVY_COUNT; i++) {
      for (let j = i + 1; j < HEAVY_COUNT; j++) {
        const a = bodies[i]!;
        const b = bodies[j]!;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = a.radius + b.radius + 20;

        if (dist < minDist && dist > 0) {
          const nx = dx / dist;
          const ny = dy / dist;

          const dvx = a.vx - b.vx;
          const dvy = a.vy - b.vy;
          const relVel = dvx * nx + dvy * ny;

          if (relVel > 0) {
            const totalMass = a.mass + b.mass;
            const impulseA = (2 * b.mass * relVel) / totalMass;
            const impulseB = (2 * a.mass * relVel) / totalMass;

            a.vx -= impulseA * nx;
            a.vy -= impulseA * ny;
            b.vx += impulseB * nx;
            b.vy += impulseB * ny;

            const overlap = (minDist - dist) / 2;
            a.x -= overlap * nx;
            a.y -= overlap * ny;
            b.x += overlap * nx;
            b.y += overlap * ny;
          }
        }
      }
    }

    for (const b of bodies) {
      b.x += b.vx;
      b.y += b.vy;

      const margin = 60;
      const pullStrength = 0.003;
      if (b.x < -margin) b.vx += pullStrength * (-margin - b.x);
      if (b.x > canvas.width + margin) b.vx -= pullStrength * (b.x - canvas.width - margin);
      if (b.y < -margin) b.vy += pullStrength * (-margin - b.y);
      if (b.y > canvas.height + margin) b.vy -= pullStrength * (b.y - canvas.height - margin);
    }

    if (blackHole) {
      blackHole.x += blackHole.vx;
      blackHole.y += blackHole.vy;
      blackHole.angle += 0.008;

      const margin = 150;
      const pull = 0.0004;
      if (blackHole.x < margin) blackHole.vx += pull * (margin - blackHole.x);
      if (blackHole.x > canvas.width - margin)
        blackHole.vx -= pull * (blackHole.x - (canvas.width - margin));
      if (blackHole.y < margin) blackHole.vy += pull * (margin - blackHole.y);
      if (blackHole.y > canvas.height - margin)
        blackHole.vy -= pull * (blackHole.y - (canvas.height - margin));
    }

    for (let h = 0; h < HEAVY_COUNT; h++) {
      if (ejectTimers[h]! > 0) {
        ejectTimers[h] = ejectTimers[h]! - 1;
        continue;
      }

      const heavy = bodies[h]!;
      const nearby: number[] = [];

      for (let j = HEAVY_COUNT; j < bodies.length; j++) {
        const light = bodies[j]!;
        const dx = light.x - heavy.x;
        const dy = light.y - heavy.y;
        if (dx * dx + dy * dy < EJECT_RADIUS * EJECT_RADIUS) {
          nearby.push(j);
        }
      }

      if (nearby.length >= EJECT_THRESHOLD) {
        for (const j of nearby) {
          const light = bodies[j]!;
          const dx = light.x - heavy.x;
          const dy = light.y - heavy.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const speed = EJECT_SPEED_MIN + Math.random() * (EJECT_SPEED_MAX - EJECT_SPEED_MIN);
          const scatter = (Math.random() - 0.5) * 0.6;
          light.vx = (dx / dist + scatter) * speed;
          light.vy = (dy / dist + scatter) * speed;
        }
        ejectTimers[h] = EJECT_COOLDOWN;
      }
    }
  }

  function draw(): void {
    const { r, g, b } = readSceneAccent(canvas);

    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (blackHole) {
      const bh = blackHole;

      const lensRadius = BH_RADIUS * 6;
      const lens = ctx.createRadialGradient(bh.x, bh.y, BH_RADIUS * 1.5, bh.x, bh.y, lensRadius);
      lens.addColorStop(0, `rgba(${r},${g},${b},0.08)`);
      lens.addColorStop(0.5, `rgba(${r},${g},${b},0.03)`);
      lens.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = lens;
      ctx.beginPath();
      ctx.arc(bh.x, bh.y, lensRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(bh.x, bh.y);
      ctx.rotate(bh.angle);
      ctx.scale(1, 0.35);

      const diskRadius = BH_RADIUS * 3.5;
      const ring = ctx.createRadialGradient(0, 0, BH_RADIUS * 1.2, 0, 0, diskRadius);
      ring.addColorStop(0, `rgba(${r},${g},${b},0)`);
      ring.addColorStop(0.3, `rgba(${r},${g},${b},0.25)`);
      ring.addColorStop(0.5, `rgba(${r},${g},${b},0.4)`);
      ring.addColorStop(0.7, `rgba(${r},${g},${b},0.15)`);
      ring.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = ring;
      ctx.beginPath();
      ctx.arc(0, 0, diskRadius, 0, Math.PI * 2);
      ctx.fill();

      const innerRing = ctx.createRadialGradient(0, 0, BH_RADIUS * 0.9, 0, 0, BH_RADIUS * 1.8);
      innerRing.addColorStop(0, `rgba(${r},${g},${b},0)`);
      innerRing.addColorStop(0.4, `rgba(255,255,255,0.15)`);
      innerRing.addColorStop(0.6, `rgba(${r},${g},${b},0.3)`);
      innerRing.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = innerRing;
      ctx.beginPath();
      ctx.arc(0, 0, BH_RADIUS * 1.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      ctx.fillStyle = BG_COLOR;
      ctx.beginPath();
      ctx.arc(bh.x, bh.y, BH_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = `rgba(${r},${g},${b},0.5)`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(bh.x, bh.y, BH_RADIUS + 1, 0, Math.PI * 2);
      ctx.stroke();
    }

    for (const body of bodies) {
      const isHeavy = body.mass > 30;
      const speed = Math.sqrt(body.vx * body.vx + body.vy * body.vy);

      if (speed > 0.05) {
        const tailLength = isHeavy ? 60 + speed * 30 : 30 + speed * 20;
        const nx = -body.vx / speed;
        const ny = -body.vy / speed;

        for (let s = 0; s < TAIL_SEGMENTS; s++) {
          const tt = (s + 1) / TAIL_SEGMENTS;
          const tx = body.x + nx * tailLength * tt;
          const ty = body.y + ny * tailLength * tt;
          const alpha = (1 - tt) * (isHeavy ? 0.25 : 0.18);
          const segRadius = body.radius * (1 - tt * 0.7);

          ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.beginPath();
          ctx.arc(tx, ty, segRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (isHeavy) {
        const glow = ctx.createRadialGradient(body.x, body.y, 0, body.x, body.y, body.radius * 8);
        glow.addColorStop(0, `rgba(${r},${g},${b},0.15)`);
        glow.addColorStop(0.4, `rgba(${r},${g},${b},0.05)`);
        glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(body.x, body.y, body.radius * 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${r},${g},${b},0.8)`;
        ctx.shadowColor = `rgba(${r},${g},${b},0.6)`;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(body.x, body.y, body.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        ctx.fillStyle = `rgba(${r},${g},${b},0.55)`;
        ctx.beginPath();
        ctx.arc(body.x, body.y, body.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    step();
    animId = requestAnimationFrame(draw);
  }

  function resize(): void {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (bodies.length === 0) seedBodies();
  }

  resize();
  window.addEventListener('resize', resize);
  draw();

  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener('resize', resize);
  };
}
