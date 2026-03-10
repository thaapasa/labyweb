# labyweb

A web page that generates and renders a random labyrinth, filling the entire
browser window. The labyrinth is drawn at native device resolution so that each
pixel maps 1-to-1 to a physical device pixel, producing crisp, sharp lines on
any display — including high-DPI / Retina screens.

The labyrinth is generated using a randomized wall-removal algorithm based on
union-find (with path compression), ensuring every cell is reachable from every
other cell.

## Development

```sh
yarn dev      # Start dev server
yarn build    # Type-check and build for production
yarn lint     # Run ESLint
```
