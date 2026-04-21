#!/usr/bin/env node
// Generate additional levels and merge them into index.html, grouped by difficulty,
// deduplicated against existing levels.
import { readFileSync, writeFileSync } from 'node:fs';

const GRID = 6, TARGET_ROW = 2;

function solve(vehicles, maxMoves) {
  const N = vehicles.length;
  const initial = new Int8Array(N * 2);
  let targetIdx = -1;
  const sizes = new Int8Array(N);
  const orients = new Int8Array(N);
  for (let i = 0; i < N; i++) {
    initial[i * 2] = vehicles[i].row;
    initial[i * 2 + 1] = vehicles[i].col;
    sizes[i] = vehicles[i].size;
    orients[i] = vehicles[i].orient === 'v' ? 1 : 0;
    if (vehicles[i].isTarget) targetIdx = i;
  }
  const encode = (state) => {
    let s = '';
    for (let i = 0; i < state.length; i++) s += String.fromCharCode(state[i] + 48);
    return s;
  };
  const queue = [{ state: initial, moves: 0 }];
  const seen = new Set([encode(initial)]);
  while (queue.length) {
    const { state, moves } = queue.shift();
    if (state[targetIdx * 2 + 1] + sizes[targetIdx] >= GRID) return moves;
    if (moves >= maxMoves) continue;
    for (let vi = 0; vi < N; vi++) {
      const grid = new Uint8Array(36);
      for (let i = 0; i < N; i++) {
        if (i === vi) continue;
        const r = state[i * 2], c = state[i * 2 + 1];
        for (let j = 0; j < sizes[i]; j++) {
          if (orients[i]) grid[(r + j) * 6 + c] = 1;
          else grid[r * 6 + c + j] = 1;
        }
      }
      const r = state[vi * 2], c = state[vi * 2 + 1];
      if (orients[vi] === 0) {
        for (let nc = c - 1; nc >= 0 && !grid[r * 6 + nc]; nc--) {
          const ns = new Int8Array(state); ns[vi * 2 + 1] = nc;
          const k = encode(ns);
          if (!seen.has(k)) { seen.add(k); queue.push({ state: ns, moves: moves + 1 }); }
        }
        for (let nc = c + 1; nc + sizes[vi] - 1 < GRID && !grid[r * 6 + nc + sizes[vi] - 1]; nc++) {
          const ns = new Int8Array(state); ns[vi * 2 + 1] = nc;
          const k = encode(ns);
          if (!seen.has(k)) { seen.add(k); queue.push({ state: ns, moves: moves + 1 }); }
        }
      } else {
        for (let nr = r - 1; nr >= 0 && !grid[nr * 6 + c]; nr--) {
          const ns = new Int8Array(state); ns[vi * 2] = nr;
          const k = encode(ns);
          if (!seen.has(k)) { seen.add(k); queue.push({ state: ns, moves: moves + 1 }); }
        }
        for (let nr = r + 1; nr + sizes[vi] - 1 < GRID && !grid[(nr + sizes[vi] - 1) * 6 + c]; nr++) {
          const ns = new Int8Array(state); ns[vi * 2] = nr;
          const k = encode(ns);
          if (!seen.has(k)) { seen.add(k); queue.push({ state: ns, moves: moves + 1 }); }
        }
      }
    }
  }
  return -1;
}

function randInt(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo)); }

function generateBoard(minVeh, maxVeh) {
  const grid = new Uint8Array(36);
  const vehicles = [];
  const occ = (r, c, s, o) => {
    for (let i = 0; i < s; i++) {
      const rr = o === 'v' ? r + i : r, cc = o === 'h' ? c + i : c;
      if (rr < 0 || rr >= GRID || cc < 0 || cc >= GRID || grid[rr * 6 + cc]) return true;
    }
    return false;
  };
  const place = (r, c, s, o) => {
    for (let i = 0; i < s; i++) {
      const rr = o === 'v' ? r + i : r, cc = o === 'h' ? c + i : c;
      grid[rr * 6 + cc] = 1;
    }
  };
  const tc = randInt(0, 3);
  place(TARGET_ROW, tc, 2, 'h');
  vehicles.push({ row: TARGET_ROW, col: tc, size: 2, orient: 'h', isTarget: true });
  const bc = randInt(Math.max(tc + 2, 2), GRID);
  if (bc < GRID) {
    const bs = Math.random() < 0.5 ? 2 : 3;
    const minR = Math.max(0, TARGET_ROW - bs + 1);
    const starts = [];
    for (let r = minR; r <= Math.min(GRID - bs, TARGET_ROW); r++) if (!occ(r, bc, bs, 'v')) starts.push(r);
    if (starts.length) {
      const sr = starts[randInt(0, starts.length)];
      place(sr, bc, bs, 'v');
      vehicles.push({ row: sr, col: bc, size: bs, orient: 'v', isTarget: false });
    }
  }
  const num = randInt(minVeh, maxVeh + 1);
  let att = 0;
  while (vehicles.length < num && att < 500) {
    att++;
    const s = Math.random() < 0.6 ? 2 : 3;
    const o = Math.random() < 0.5 ? 'h' : 'v';
    const r = randInt(0, o === 'v' ? GRID - s + 1 : GRID);
    const c = randInt(0, o === 'h' ? GRID - s + 1 : GRID);
    if (!occ(r, c, s, o)) { place(r, c, s, o); vehicles.push({ row: r, col: c, size: s, orient: o, isTarget: false }); }
  }
  return vehicles;
}

// Parse existing levels from index.html to dedup against them
const html = readFileSync('index.html', 'utf-8');
const startMarker = '  const LEVELS = [\n';
const startIdx = html.indexOf(startMarker);
if (startIdx < 0) { console.error('Could not find LEVELS array'); process.exit(1); }
const endIdx = html.indexOf('\n];', startIdx);
if (endIdx < 0) { console.error('Could not find end of LEVELS array'); process.exit(1); }
const levelsBlock = html.slice(startIdx + startMarker.length, endIdx);
const existingLines = levelsBlock.split('\n').filter(l => l.trim().startsWith('{v:'));
process.stderr.write(`Found ${existingLines.length} existing levels\n`);

const sigOf = (vArr) => vArr.map(x => x.join(',')).sort().join(';');

const existingSigs = new Set();
const existingByDifficulty = { Beginner: [], Intermediate: [], Advanced: [], Expert: [] };
for (const line of existingLines) {
  const vMatch = line.match(/v:(\[.*?\]\])/);
  const dMatch = line.match(/d:"([^"]+)"/);
  if (!vMatch || !dMatch) continue;
  const vArr = JSON.parse(vMatch[1]);
  const sig = sigOf(vArr);
  existingSigs.add(sig);
  existingByDifficulty[dMatch[1]].push(line.replace(/,$/, ''));
}

const buckets = [
  { label: 'Beginner',     minMoves: 5,  maxMoves: 9,  minVeh: 5,  maxVeh: 9,  target: 30, timeLimitS: 60 },
  { label: 'Intermediate', minMoves: 10, maxMoves: 18, minVeh: 7,  maxVeh: 11, target: 60, timeLimitS: 120 },
  { label: 'Advanced',     minMoves: 19, maxMoves: 24, minVeh: 9,  maxVeh: 13, target: 60, timeLimitS: 900 },
  { label: 'Expert',       minMoves: 25, maxMoves: 50, minVeh: 10, maxVeh: 13, target: 50, timeLimitS: 1200 },
];

const newByDifficulty = { Beginner: [], Intermediate: [], Advanced: [], Expert: [] };
for (const b of buckets) {
  const found = [];
  let att = 0;
  const t0 = Date.now();
  process.stderr.write(`${b.label} (${b.minMoves}-${b.maxMoves} moves, target ${b.target})...\n`);
  while (found.length < b.target) {
    const elapsed = (Date.now() - t0) / 1000;
    if (elapsed > b.timeLimitS) { process.stderr.write(`  timeout at ${found.length}/${b.target}\n`); break; }
    att++;
    if (att % 20_000 === 0) process.stderr.write(`  ${found.length}/${b.target} (${att} attempts, ${elapsed.toFixed(0)}s)\n`);
    const v = generateBoard(b.minVeh, b.maxVeh);
    const m = solve(v, b.maxMoves);
    if (m >= b.minMoves && m <= b.maxMoves) {
      const d = v.map(x => [x.row, x.col, x.size, x.orient, x.isTarget]);
      const sig = sigOf(d);
      if (!existingSigs.has(sig)) {
        existingSigs.add(sig);
        found.push({ d, m });
      }
    }
  }
  found.sort((a, b2) => a.m - b2.m);
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  process.stderr.write(`  => ${found.length} new levels in ${elapsed}s\n`);
  for (const f of found) {
    const vStr = '[' + f.d.map(x => '[' + x.map(y => typeof y === 'string' ? `"${y}"` : y).join(',') + ']').join(',') + ']';
    newByDifficulty[b.label].push(`{v:${vStr},par:${f.m},d:"${b.label}"}`);
  }
}

// Merge: existing + new per difficulty, in order Beginner -> Expert
const order = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const allLines = [];
for (const label of order) {
  for (const l of existingByDifficulty[label]) allLines.push(l);
  for (const l of newByDifficulty[label]) allLines.push(l);
}
const mergedBlock = allLines.map(l => l + ',').join('\n') + '\n';

const newHtml = html.slice(0, startIdx + startMarker.length) + mergedBlock + html.slice(endIdx + 1);
writeFileSync('index.html', newHtml);
const total = allLines.length;
const counts = order.map(l => `${l}: ${existingByDifficulty[l].length + newByDifficulty[l].length}`).join(', ');
process.stderr.write(`\nMerged. Total: ${total} (${counts})\n`);
