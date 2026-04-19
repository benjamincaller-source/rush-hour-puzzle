import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';

const SIZE = 2732;
const canvas = createCanvas(SIZE, SIZE);
const ctx = canvas.getContext('2d');

ctx.fillStyle = '#0f172a';
ctx.fillRect(0, 0, SIZE, SIZE);

const centerX = SIZE / 2;
const centerY = SIZE / 2 - 100;

ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

const grad = ctx.createLinearGradient(centerX - 200, centerY, centerX + 200, centerY + 60);
grad.addColorStop(0, '#ef4444');
grad.addColorStop(0.5, '#f97316');
grad.addColorStop(1, '#fbbf24');

ctx.font = 'bold 160px -apple-system, sans-serif';
ctx.fillStyle = grad;
ctx.fillText('Rush Hour', centerX, centerY);

ctx.font = '600 48px -apple-system, sans-serif';
ctx.fillStyle = '#94a3b8';
ctx.letterSpacing = '8px';
ctx.fillText('SLIDING  PUZZLE', centerX, centerY + 120);

const buf = canvas.toBuffer('image/png');
writeFileSync('Splash.png', buf);
console.log('Generated Splash.png');
