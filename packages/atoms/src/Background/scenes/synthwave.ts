export function synthwaveScene(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext('2d')!;
  let animId: number;
  let t = 0;

  const BG_COLOR = '#06020f';

  const STAR_SEEDS: [number, number][] = [
    [8, 12],
    [23, 5],
    [45, 18],
    [67, 8],
    [82, 22],
    [15, 24],
    [38, 7],
    [55, 20],
    [72, 14],
    [91, 19],
    [5, 20],
    [29, 3],
    [50, 10],
    [76, 23],
    [88, 6],
    [12, 21],
    [42, 15],
    [63, 2],
    [35, 22],
    [58, 9],
    [95, 16],
    [18, 8],
    [47, 22],
    [70, 4],
    [83, 22],
    [26, 14],
    [53, 20],
    [9, 17],
    [61, 11],
    [78, 21],
    [33, 6],
    [44, 23],
    [86, 10],
    [20, 18],
    [66, 21],
    [14, 45],
    [37, 55],
    [62, 48],
    [85, 60],
    [8, 70],
    [48, 65],
    [73, 75],
    [25, 80],
    [55, 85],
    [90, 50],
    [42, 90],
    [68, 95],
    [16, 58],
    [94, 42],
    [31, 72],
    [77, 88],
    [3, 52],
    [59, 38],
    [46, 78],
    [81, 68],
    [22, 92],
    [65, 55],
    [11, 35],
    [38, 42],
    [52, 30],
    [87, 38],
    [71, 82],
    [19, 62],
  ];

  interface Star {
    x: number;
    y: number;
    size: number;
    color: string;
    phase: number;
    speed: number;
  }
  let stars: Star[] = [];

  function buildStars(): void {
    stars = STAR_SEEDS.map(([px, py], i) => ({
      x: (px / 100) * canvas.width,
      y: (py / 100) * canvas.height,
      size: i % 5 === 0 ? 2 : i % 3 === 0 ? 1.5 : 0.8,
      color:
        i % 5 === 0
          ? 'rgba(0,240,255,0.9)'
          : i % 7 === 0
            ? 'rgba(255,45,149,0.8)'
            : i % 11 === 0
              ? 'rgba(57,255,20,0.8)'
              : 'rgba(255,255,255,0.8)',
      phase: (i * 0.7) % 5,
      speed: 2 + (i % 3),
    }));
  }

  function drawStars(): void {
    for (const s of stars) {
      const twinkle = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * (6.28 / s.speed) + s.phase));
      ctx.globalAlpha = twinkle;
      ctx.fillStyle = s.color;

      if (s.size > 1.5) {
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 6;
      } else if (s.size > 1) {
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 4;
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;
  }

  function drawSun(): void {
    const cx = canvas.width * 0.5;
    const sunBottom = canvas.height * 0.36;
    const cy = canvas.height - sunBottom;
    const r = 90;
    const breathe = 1 + 0.06 * Math.sin(t * 0.785);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(breathe, breathe);

    ctx.save();
    ctx.filter = 'blur(40px)';
    const haloW = canvas.width * 0.3;
    const haloH = canvas.height * 0.2;
    const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(haloW, haloH));
    halo.addColorStop(0, 'rgba(255,45,149,0.10)');
    halo.addColorStop(0.25, 'rgba(255,107,53,0.07)');
    halo.addColorStop(0.5, 'rgba(255,45,149,0.03)');
    halo.addColorStop(1, 'transparent');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.ellipse(0, 0, haloW, haloH, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.filter = 'none';
    ctx.restore();

    const glow1 = ctx.createRadialGradient(0, 0, r, 0, 0, r + 110);
    glow1.addColorStop(0, 'rgba(255,45,149,0.30)');
    glow1.addColorStop(0.5, 'rgba(255,45,149,0.10)');
    glow1.addColorStop(1, 'transparent');
    ctx.fillStyle = glow1;
    ctx.fillRect(-r - 110, -r - 110, (r + 110) * 2, (r + 110) * 2);

    const glow2 = ctx.createRadialGradient(0, 0, r, 0, 0, r + 220);
    glow2.addColorStop(0, 'rgba(255,107,53,0.15)');
    glow2.addColorStop(0.4, 'rgba(255,107,53,0.06)');
    glow2.addColorStop(1, 'transparent');
    ctx.fillStyle = glow2;
    ctx.fillRect(-r - 220, -r - 220, (r + 220) * 2, (r + 220) * 2);

    const glow3 = ctx.createRadialGradient(0, 0, r, 0, 0, r + 400);
    glow3.addColorStop(0, 'rgba(255,45,149,0.08)');
    glow3.addColorStop(0.3, 'rgba(255,45,149,0.03)');
    glow3.addColorStop(1, 'transparent');
    ctx.fillStyle = glow3;
    ctx.fillRect(-r - 400, -r - 400, (r + 400) * 2, (r + 400) * 2);

    const sunCanvas = document.createElement('canvas');
    const sunSize = r * 2 + 20;
    sunCanvas.width = sunSize;
    sunCanvas.height = sunSize;
    const sc = sunCanvas.getContext('2d')!;
    const sr = r;
    const scx = sunSize / 2;
    const scy = sunSize / 2;

    sc.beginPath();
    sc.arc(scx, scy, sr, 0, Math.PI * 2);
    sc.clip();

    const sunGrd = sc.createLinearGradient(scx, scy - sr, scx, scy + sr);
    sunGrd.addColorStop(0, '#ff2d95');
    sunGrd.addColorStop(0.2, '#ff4d6d');
    sunGrd.addColorStop(0.45, '#ff6b35');
    sunGrd.addColorStop(0.7, '#ffaa33');
    sunGrd.addColorStop(1, '#ffe44d');
    sc.fillStyle = sunGrd;
    sc.fillRect(0, 0, sunSize, sunSize);

    const hazeBands = [
      { top: 0.15, height: 0.14, color: 'rgba(255,140,60,0.35)' },
      { top: 0.28, height: 0.14, color: 'rgba(255,100,50,0.30)' },
      { top: 0.4, height: 0.16, color: 'rgba(200,60,30,0.35)' },
      { top: 0.52, height: 0.14, color: 'rgba(180,50,40,0.35)' },
      { top: 0.62, height: 0.18, color: 'rgba(120,25,40,0.40)' },
      { top: 0.76, height: 0.16, color: 'rgba(80,15,35,0.40)' },
    ];

    sc.filter = 'blur(6px)';
    for (const band of hazeBands) {
      const by = scy - sr + band.top * sr * 2;
      const bh = band.height * sr * 2;
      const bandGrd = sc.createLinearGradient(0, by, 0, by + bh);
      bandGrd.addColorStop(0, 'transparent');
      bandGrd.addColorStop(0.2, band.color);
      bandGrd.addColorStop(0.5, band.color);
      bandGrd.addColorStop(0.8, band.color);
      bandGrd.addColorStop(1, 'transparent');
      sc.fillStyle = bandGrd;
      sc.fillRect(0, by, sunSize, bh);
    }
    sc.filter = 'none';

    ctx.shadowColor = 'rgba(255,45,149,0.3)';
    ctx.shadowBlur = 80;
    ctx.drawImage(sunCanvas, -sunSize / 2, -sunSize / 2);
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  function drawWaveLine(
    w: number,
    centerY: number,
    time: number,
    amplitude: number,
    frequency: number,
    lineWidth: number,
    stops: { pos: number; color: string }[],
  ): void {
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    for (const s of stops) grad.addColorStop(s.pos, s.color);

    ctx.beginPath();
    for (let x = 0; x <= w; x += 2) {
      const y =
        centerY +
        Math.sin(x * frequency + time) * amplitude +
        Math.sin(x * frequency * 2.3 + time * 1.4) * (amplitude * 0.3) +
        Math.sin(x * frequency * 0.5 + time * 0.6) * (amplitude * 0.5);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.strokeStyle = grad;
    ctx.lineWidth = lineWidth;
    ctx.shadowColor = 'rgba(255,80,120,0.3)';
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  function drawWaves(): void {
    const centerY = canvas.height * 0.64;
    const w = canvas.width;

    drawWaveLine(w, centerY, t, 30, 0.003, 2.5, [
      { pos: 0, color: 'rgba(255,45,149,0.5)' },
      { pos: 0.3, color: 'rgba(255,120,60,0.45)' },
      { pos: 0.6, color: 'rgba(255,45,149,0.4)' },
      { pos: 1, color: 'rgba(255,80,100,0.3)' },
    ]);

    drawWaveLine(w, centerY, t * 0.7 + 1.5, 20, 0.004, 1.5, [
      { pos: 0, color: 'rgba(255,80,100,0.25)' },
      { pos: 0.5, color: 'rgba(255,140,70,0.2)' },
      { pos: 1, color: 'rgba(255,60,120,0.15)' },
    ]);
  }

  function drawScanlines(): void {
    ctx.fillStyle = 'rgba(0,0,0,0.04)';
    for (let y = 0; y < canvas.height; y += 4) {
      ctx.fillRect(0, y + 2, canvas.width, 2);
    }

    const barY = ((t * (1 / 7) * (canvas.height + 6)) % (canvas.height + 100)) - 50;
    const barGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    barGrad.addColorStop(0, 'transparent');
    barGrad.addColorStop(0.3, 'rgba(0,240,255,0.18)');
    barGrad.addColorStop(0.6, 'rgba(255,45,149,0.12)');
    barGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = barGrad;
    ctx.shadowColor = 'rgba(0,240,255,0.10)';
    ctx.shadowBlur = 16;
    ctx.globalAlpha = 0.8;
    ctx.fillRect(0, barY, canvas.width, 6);
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }

  function resize(): void {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    buildStars();
  }

  function draw(): void {
    t += 0.008;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawStars();
    drawSun();
    drawWaves();
    drawScanlines();

    animId = requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();

  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener('resize', resize);
  };
}
