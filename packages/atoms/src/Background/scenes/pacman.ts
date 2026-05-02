export function pacmanScene(canvas: HTMLCanvasElement): () => void {
  const PAC_COLOR = '#ffff00';
  const GHOST_COLORS = ['#ff0000', '#ffb8ff', '#00ffff', '#ffb852'];
  const SCARED_COLOR = '#2121de';
  const DOT_COLOR = '#ffb8ae';

  const PAC_RADIUS = 40;
  const GHOST_SIZE = 38;
  const SPEED = 1.2;
  const GHOST_SPACING = 110;
  const CHASE_GAP = 130;
  const DOT_RADIUS = 4;
  const DOT_SPACING = 40;
  const SCARED_CHANCE = 0.15;
  const SCARED_DURATION = 180;

  const ctx = canvas.getContext('2d')!;
  let animId: number;
  let direction = 1;
  let scaredTimer = 0;

  let pacman = { x: 0, y: 0, mouthAngle: 0, mouthDir: 1 };
  let ghosts: { x: number; y: number; color: string; wobbleOffset: number }[] = [];
  let dots: { x: number; y: number; eaten: boolean }[] = [];

  function totalTrainLength(): number {
    return CHASE_GAP + (GHOST_COLORS.length - 1) * GHOST_SPACING + GHOST_SIZE + PAC_RADIUS;
  }

  function spawnCrossing(): void {
    const y = canvas.height * (0.3 + Math.random() * 0.4);
    direction = Math.random() < 0.5 ? 1 : -1;
    const offscreen = totalTrainLength() + 60;
    const startX = direction === 1 ? -offscreen : canvas.width + offscreen;

    pacman = { x: startX, y, mouthAngle: 0, mouthDir: 1 };
    ghosts = GHOST_COLORS.map((color, i) => ({
      x: startX - direction * (CHASE_GAP + i * GHOST_SPACING),
      y,
      color: color!,
      wobbleOffset: i * 1.3,
    }));
    scaredTimer = Math.random() < SCARED_CHANCE ? SCARED_DURATION : 0;

    dots = [];
    for (let x = DOT_SPACING; x < canvas.width; x += DOT_SPACING) {
      dots.push({ x, y, eaten: false });
    }
  }

  function resize(): void {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function update(): void {
    const t = Date.now() / 1000;
    pacman.x += SPEED * direction;

    for (let i = 0; i < ghosts.length; i++) {
      const ghost = ghosts[i]!;
      const targetX = pacman.x - direction * (CHASE_GAP + i * GHOST_SPACING);
      ghost.x += (targetX - ghost.x) * 0.04;
      ghost.y = pacman.y + Math.sin(t * 2 + ghost.wobbleOffset) * 6;
    }

    pacman.mouthAngle += 0.06 * pacman.mouthDir;
    if (pacman.mouthAngle > 0.75) pacman.mouthDir = -1;
    if (pacman.mouthAngle < 0.05) pacman.mouthDir = 1;

    if (scaredTimer > 0) scaredTimer--;

    for (const dot of dots) {
      if (!dot.eaten && Math.abs(dot.x - pacman.x) < PAC_RADIUS * 0.8) {
        dot.eaten = true;
      }
    }

    const clearance = totalTrainLength() + 100;
    const offScreen = direction === 1 ? pacman.x > canvas.width + clearance : pacman.x < -clearance;
    if (offScreen) spawnCrossing();
  }

  function drawGhost(ghost: (typeof ghosts)[0]): void {
    const { x, y } = ghost;
    const r = GHOST_SIZE;
    const scared = scaredTimer > 0;
    const flashing = scared && scaredTimer < 60 && Math.floor(scaredTimer / 8) % 2 === 0;
    const bodyColor = scared ? (flashing ? '#ffffff' : SCARED_COLOR) : ghost.color;

    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.arc(x, y - r * 0.15, r, Math.PI, 0);
    ctx.lineTo(x + r, y + r * 0.85);
    const bumps = 5;
    const bumpW = (r * 2) / bumps;
    for (let i = bumps - 1; i >= 0; i--) {
      const bx = x + r - i * bumpW - bumpW / 2;
      const by = y + r * 0.85 + (i % 2 === 0 ? -6 : 4);
      ctx.lineTo(bx, by);
    }
    ctx.lineTo(x - r, y + r * 0.85);
    ctx.closePath();
    ctx.fill();

    const eyeR = r * 0.22;
    const pupilR = r * 0.12;
    const eyeY = y - r * 0.15;
    const eyeSpread = r * 0.35;

    if (scared) {
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x - eyeSpread, eyeY, pupilR, 0, Math.PI * 2);
      ctx.arc(x + eyeSpread, eyeY, pupilR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const mouthY = y + r * 0.25;
      ctx.moveTo(x - r * 0.4, mouthY);
      for (let i = 0; i < 5; i++) {
        const mx = x - r * 0.4 + (i + 0.5) * ((r * 0.8) / 5);
        const my = mouthY + (i % 2 === 0 ? -3 : 3);
        ctx.lineTo(mx, my);
      }
      ctx.stroke();
    } else {
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x - eyeSpread, eyeY, eyeR, 0, Math.PI * 2);
      ctx.arc(x + eyeSpread, eyeY, eyeR, 0, Math.PI * 2);
      ctx.fill();
      const px = direction * pupilR * 0.5;
      ctx.fillStyle = '#00f';
      ctx.beginPath();
      ctx.arc(x - eyeSpread + px, eyeY, pupilR, 0, Math.PI * 2);
      ctx.arc(x + eyeSpread + px, eyeY, pupilR, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function draw(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.3;

    ctx.fillStyle = DOT_COLOR;
    for (const dot of dots) {
      if (dot.eaten) continue;
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = PAC_COLOR;
    ctx.beginPath();
    const facing = direction === 1 ? 0 : Math.PI;
    ctx.arc(
      pacman.x,
      pacman.y,
      PAC_RADIUS,
      facing + pacman.mouthAngle,
      facing + Math.PI * 2 - pacman.mouthAngle,
    );
    ctx.lineTo(pacman.x, pacman.y);
    ctx.closePath();
    ctx.fill();

    for (const ghost of ghosts) drawGhost(ghost);

    ctx.globalAlpha = 1.0;
    update();
    animId = requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  spawnCrossing();
  draw();

  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener('resize', resize);
  };
}
