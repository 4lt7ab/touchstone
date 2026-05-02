import { readSceneAccent } from './index.js';

export function neuralScene(canvas: HTMLCanvasElement): () => void {
  const NODE_COUNT = 22;
  const CONNECTION_DIST = 180;
  const PULSE_INTERVAL = 3000;
  const NODE_RADIUS = 2.5;

  const ctx = canvas.getContext('2d')!;
  let nodes: { x: number; y: number; vx: number; vy: number }[] = [];
  const pulses: { from: number; to: number; t: number }[] = [];
  let animId: number;
  let pulseTimer: ReturnType<typeof setInterval> | null = null;

  function seedNodes(): void {
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      });
    }
  }

  function resize(): void {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (nodes.length === 0) seedNodes();
  }

  function spawnPulse(): void {
    if (nodes.length < 2) return;
    const a = Math.floor(Math.random() * nodes.length);
    let b = a;
    let bestDist = Infinity;
    for (let i = 0; i < nodes.length; i++) {
      if (i === a) continue;
      const d = Math.hypot(nodes[i]!.x - nodes[a]!.x, nodes[i]!.y - nodes[a]!.y);
      if (d < CONNECTION_DIST && d < bestDist) {
        bestDist = d;
        b = i;
      }
    }
    if (b !== a) pulses.push({ from: a, to: b, t: 0 });
  }

  function draw(): void {
    const { r, g, b } = readSceneAccent(canvas);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = Math.hypot(nodes[i]!.x - nodes[j]!.x, nodes[i]!.y - nodes[j]!.y);
        if (d < CONNECTION_DIST) {
          const opacity = (1 - d / CONNECTION_DIST) * 0.15;
          ctx.strokeStyle = `rgba(${r},${g},${b},${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(nodes[i]!.x, nodes[i]!.y);
          ctx.lineTo(nodes[j]!.x, nodes[j]!.y);
          ctx.stroke();
        }
      }
    }

    for (const n of nodes) {
      ctx.fillStyle = `rgba(${r},${g},${b},0.4)`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, NODE_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const p of pulses) {
      const from = nodes[p.from]!;
      const to = nodes[p.to]!;
      const x = from.x + (to.x - from.x) * p.t;
      const y = from.y + (to.y - from.y) * p.t;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    }

    for (let i = pulses.length - 1; i >= 0; i--) {
      pulses[i]!.t += 0.015;
      if (pulses[i]!.t >= 1) pulses.splice(i, 1);
    }

    animId = requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
  pulseTimer = setInterval(spawnPulse, PULSE_INTERVAL);
  spawnPulse();

  return () => {
    cancelAnimationFrame(animId);
    if (pulseTimer) clearInterval(pulseTimer);
    window.removeEventListener('resize', resize);
  };
}
