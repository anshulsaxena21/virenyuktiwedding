# Viren & Yukti — Wedding Invitation

This site uses the original Figma-exported 1440 × 9531 px invitation composition and the complete supplied asset ZIP. The export's positioning, typography, decorative frames, photographs, backgrounds and vectors are retained. A proportional artboard wrapper scales the full composition for mobile screens.

## Run locally

```bash
npm install
npm run dev
```

The `prepare:site` step extracts the supplied `WhatsApp-UI-Screens-Community-react-css.zip`, maps every Figma image reference to its local asset, prepares the responsive Figma component, and copies the design layer descriptions and tokens into `design/`.

## Source structure

- `src/components/FigmaExport.jsx` — original Figma composition with responsive artboard scaling
- `src/components/FigmaExport.css` — original Figma-exported layout and styling
- `src/assets/images/` — supplied wedding photography and background artwork
- `src/assets/vectors/` — supplied SVG decorations
- `design/` — Figma layer descriptions and design tokens
- `WhatsApp-UI-Screens-Community-react-css.zip` — original supplied code and assets
