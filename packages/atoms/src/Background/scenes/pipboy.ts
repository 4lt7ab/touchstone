export function pipboyScene(canvas: HTMLCanvasElement): () => void {
  const CHARS =
    'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
  const COLUMN_COUNT = 14;
  const STEP_MS = 75;
  const OPACITY = 0.18;
  const FONT_SIZE = 14;

  const ctx = canvas.getContext('2d')!;
  let columns: { x: number; y: number; speed: number }[] = [];
  let interval: ReturnType<typeof setInterval> | null = null;

  function setupColumns(): void {
    const totalCols = Math.floor(canvas.width / FONT_SIZE);
    const spacing = Math.floor(totalCols / COLUMN_COUNT);
    columns = [];
    for (let i = 0; i < COLUMN_COUNT; i++) {
      columns.push({
        x: (i * spacing + Math.floor(Math.random() * spacing)) * FONT_SIZE,
        y: Math.random() * canvas.height,
        speed: 0.5 + Math.random() * 0.5,
      });
    }
  }

  function resize(): void {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    setupColumns();
  }

  function step(): void {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = `rgba(51, 255, 51, ${OPACITY})`;
    ctx.font = FONT_SIZE + 'px monospace';

    for (const col of columns) {
      const char = CHARS[Math.floor(Math.random() * CHARS.length)]!;
      ctx.fillText(char, col.x, col.y);
      col.y += FONT_SIZE * col.speed;
      if (col.y > canvas.height && Math.random() > 0.975) {
        col.y = 0;
      }
    }
  }

  resize();
  window.addEventListener('resize', resize);
  interval = setInterval(step, STEP_MS);

  return () => {
    if (interval) clearInterval(interval);
    window.removeEventListener('resize', resize);
  };
}
