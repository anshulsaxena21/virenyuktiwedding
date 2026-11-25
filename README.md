# Viren & Yukti — Wedding Invitation

A React + Vite implementation of the supplied Figma wedding invitation. The original 1440 × 9531 artboard composition is preserved and proportionally scaled for smaller viewports so the illustrated frames, typography, spacing, photographs and decorative artwork retain their positions in the mobile presentation.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build`.

## Source structure

- `src/components/FigmaExport.jsx` — original Figma-exported composition with a responsive artboard wrapper
- `src/components/FigmaExport.css` — exported positioning and styling with corrected local WebP paths
- `src/assets/images/` and `src/assets/vectors/` — optimized supplied Figma artwork, unpacked automatically by `predev` and `prebuild`
- `design/` — supplied Figma tokens and layer descriptions

The Figma image/vector bundle is stored in `scripts/asset-parts/` and unpacked automatically when running the app or creating a production build. Fonts are loaded from Google Fonts using the supplied Figma families.
