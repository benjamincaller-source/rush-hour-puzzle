# Rush Hour Puzzle

A browser-based sliding block puzzle inspired by the classic Rush Hour board game. Free the red car by moving blocking vehicles out of the way.

## Play

Just open `index.html` in your browser. No build tools, no server, no dependencies.

## Features

- **140 levels** across 4 difficulty tiers:
  - Beginner (40 levels, 5-9 moves)
  - Intermediate (40 levels, 10-16 moves)
  - Advanced (40 levels, 19-24 moves)
  - Expert (20 levels, 23-27 moves)
- **Animated welcome screen** with a live demo board
- **Drag-and-drop** vehicle controls
- **Hint system** — highlights the next optimal move (BFS solver runs in-browser)
- **Auto-solve** — watch the puzzle solve itself step by step
- **Progress saving** via localStorage
- **Level select** screen with completion tracking
- **Detailed vehicle design** with 3D CSS styling (roofs, headlights, wheels)

## How to Play

1. Drag vehicles along their lane (horizontal or vertical)
2. Clear a path for the **red car** to reach the EXIT on the right
3. Use the Hint button if you're stuck, or Solve to watch the answer

## Level Generator

The `generate-levels.mjs` script procedurally generates puzzles using a BFS solver to verify solvability and measure difficulty.

```bash
node generate-levels.mjs > levels.json
```

## Tech

Single HTML file with vanilla CSS and JavaScript. No frameworks, no build step.
