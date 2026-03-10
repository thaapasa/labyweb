# Copilot Instructions for labyweb

## Commands

```sh
yarn dev        # Dev server with HMR
yarn build      # Type-check (tsc -b) + production build
yarn lint       # ESLint
```

No test runner is currently configured.

## Architecture

The app renders a randomly generated labyrinth on a full-screen HTML Canvas at
native device resolution (1-to-1 pixel mapping using `devicePixelRatio`).

**Data flow:** `window size → App state → LabyrinthRenderer (useMemo) → Canvas 2D context`

- `App.tsx` — Root component; tracks window size via resize listener, passes
  dimensions to the renderer.
- `LabyrinthRenderer.tsx` — Creates a `Labyrinth` instance (memoized on
  canvas dimensions), draws walls onto a `<canvas>` element using 2D context
  line drawing. Canvas CSS uses `image-rendering: crisp-edges` for sharp pixels.
- `data/Labyrinth.ts` — Generates the maze using randomized wall removal with
  union-find and path compression (Kruskal's-style). Shuffles all walls
  (Fisher-Yates), then removes each wall if it separates two unconnected rooms.
- `data/Walls.ts` — Stores wall state as a flat `boolean[]` of size
  `width × height × 2`. Each cell owns its NORTH and EAST walls; SOUTH/WEST
  lookups redirect to the neighboring cell's NORTH/EAST wall.
- `data/types.ts` — `Size`, `Direction` enum, `Coordinate`, and
  `coordinateTo()` helper.

## Conventions

- Plain CSS in `index.css` for all styling (no CSS-in-JS).
- Functional components with hooks (`FC<Props>`, named imports from `react`).
- PascalCase files for classes/components, camelCase for utility modules.
- Prettier: 2-space indent, single quotes, semicolons, ES5 trailing commas.
- Deployed under base path `/labyrintti/` (configured in `vite.config.ts`).
