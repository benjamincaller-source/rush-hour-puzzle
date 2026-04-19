import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';

const SIZE = 1024;
const canvas = createCanvas(SIZE, SIZE);
const ctx = canvas.getContext('2d');

ctx.fillStyle = '#0f172a';
ctx.fillRect(0, 0, SIZE, SIZE);

const gridSize = 6;
const padding = 140;
const cellSize = (SIZE - padding * 2) / gridSize;

ctx.fillStyle = '#1e293b';
const boardR = 40;
roundRect(ctx, padding - 20, padding - 20, SIZE - 2 * padding + 40, SIZE - 2 * padding + 40, boardR);
ctx.fill();

ctx.fillStyle = '#334155';
roundRect(ctx, padding, padding, SIZE - 2 * padding, SIZE - 2 * padding, 24);
ctx.fill();

for (let i = 1; i < gridSize; i++) {
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, padding + i * cellSize);
  ctx.lineTo(SIZE - padding, padding + i * cellSize);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(padding + i * cellSize, padding);
  ctx.lineTo(padding + i * cellSize, SIZE - padding);
  ctx.stroke();
}

const cars = [
  { row: 2, col: 0, size: 2, orient: 'h', color: '#ef4444', glow: 'rgba(239,68,68,0.4)' },
  { row: 0, col: 3, size: 3, orient: 'v', color: '#8b5cf6' },
  { row: 1, col: 4, size: 2, orient: 'v', color: '#3b82f6' },
  { row: 4, col: 1, size: 3, orient: 'h', color: '#f97316' },
  { row: 0, col: 0, size: 2, orient: 'v', color: '#22c55e' },
  { row: 3, col: 5, size: 3, orient: 'v', color: '#06b6d4' },
  { row: 0, col: 1, size: 2, orient: 'h', color: '#ec4899' },
];

for (const car of cars) {
  const x = padding + car.col * cellSize + 4;
  const y = padding + car.row * cellSize + 4;
  const w = (car.orient === 'h' ? car.size * cellSize : cellSize) - 8;
  const h = (car.orient === 'v' ? car.size * cellSize : cellSize) - 8;

  if (car.glow) {
    ctx.shadowColor = car.glow;
    ctx.shadowBlur = 30;
  }

  const grad = ctx.createLinearGradient(x, y, x + w * 0.7, y + h * 0.7);
  grad.addColorStop(0, car.color);
  grad.addColorStop(1, car.color + 'cc');
  ctx.fillStyle = grad;
  roundRect(ctx, x, y, w, h, 16);
  ctx.fill();

  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  const shineGrad = ctx.createLinearGradient(x, y, x, y + h * 0.5);
  shineGrad.addColorStop(0, 'rgba(255,255,255,0.3)');
  shineGrad.addColorStop(0.6, 'rgba(255,255,255,0.05)');
  shineGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = shineGrad;
  roundRect(ctx, x + 8, y + 4, w - 16, h * 0.45, 10);
  ctx.fill();
}

const exitX = SIZE - padding + 24;
const exitY = padding + 2 * cellSize;
const exitGrad = ctx.createLinearGradient(exitX - 30, exitY, exitX, exitY);
exitGrad.addColorStop(0, 'transparent');
exitGrad.addColorStop(1, '#ef4444');
ctx.fillStyle = exitGrad;
roundRect(ctx, exitX - 30, exitY + 8, 30, cellSize - 16, 6);
ctx.fill();

const buf = canvas.toBuffer('image/png');
writeFileSync('AppIcon-1024.png', buf);
console.log('Generated AppIcon-1024.png (1024x1024)');

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
