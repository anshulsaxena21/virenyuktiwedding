import React, { useEffect, useMemo, useState } from "react";
import layers from "../../layer-descriptions virenyuktiwedding.json";
import "./FigmaCanvas.css";

const ARTBOARD = { x: 3382, y: 289, width: 1440, height: 9531.1904296875 };
const imageAssets = import.meta.glob("../assets/images/*", { eager: true, query: "?url", import: "default" });
const vectorAssets = import.meta.glob("../assets/vectors/*", { eager: true, query: "?url", import: "default" });
const assetUrls = { ...imageAssets, ...vectorAssets };

function parseColor(value) {
  if (typeof value !== "string" || !value.startsWith("#")) return null;
  const match = value.match(/^(#[0-9a-fA-F]{6})(?:\s*\/\s*(\d+)%?)?$/);
  if (!match) return value;
  if (!match[2]) return match[1];
  return `color-mix(in srgb, ${match[1]} ${match[2]}%, transparent)`;
}

function shadowFromEffects(effects = []) {
  return effects
    .filter(effect => effect.visible && (effect.type === "DROP_SHADOW" || effect.type === "INNER_SHADOW"))
    .map(effect => {
      const c = effect.color || {};
      const color = `rgba(${Math.round((c.r || 0) * 255)}, ${Math.round((c.g || 0) * 255)}, ${Math.round((c.b || 0) * 255)}, ${c.a ?? 0.2})`;
      const x = effect.offset?.x || 0;
      const y = effect.offset?.y || 0;
      const blur = effect.radius || 0;
      const spread = effect.spread || 0;
      return `${effect.type === "INNER_SHADOW" ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${color}`;
    }).join(", ");
}

function layerStyle(layer) {
  const p = layer.position || {};
  const a = layer.appearance || {};
  const t = layer.typography || {};
  const fills = a.fills || [];
  const solidFill = fills.find(fill => typeof fill === "string" && fill.startsWith("#"));
  const stroke = (a.strokes || []).find(value => typeof value === "string" && value.startsWith("#"));
  const style = {
    position: "absolute",
    left: (p.x || ARTBOARD.x) - ARTBOARD.x,
    top: (p.y || ARTBOARD.y) - ARTBOARD.y,
    width: p.width || 0,
    height: p.height || 0,
    opacity: a.opacity ?? 1,
    transform: p.rotation ? `rotate(${p.rotation}rad)` : undefined,
    transformOrigin: "center center",
    pointerEvents: "none",
    boxSizing: "border-box",
    overflow: a.clipsContent ? "hidden" : undefined,
    backgroundColor: solidFill ? parseColor(solidFill) : undefined,
    border: stroke ? `${a.strokeWeight || 1}px solid ${parseColor(stroke)}` : undefined,
    borderRadius: typeof a.cornerRadius === "number" ? a.cornerRadius : undefined,
    boxShadow: shadowFromEffects(a.effects),
    mixBlendMode: a.blendMode && a.blendMode !== "PASS_THROUGH" && a.blendMode !== "NORMAL" ? a.blendMode.toLowerCase().replaceAll("_", "-") : undefined
  };

  if (layer.type === "TEXT") {
    const align = (t.textAlign || "LEFT").toLowerCase();
    style.display = "flex";
    style.alignItems = "center";
    style.justifyContent = align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start";
    style.color = parseColor(solidFill) || "#3B2A20";
    style.fontFamily = t.fontFamily ? `"${t.fontFamily}", serif` : "serif";
    style.fontSize = t.fontSize || 16;
    style.fontWeight = t.fontWeight || 400;
    style.fontStyle = /italic/i.test(t.fontStyle || "") ? "italic" : undefined;
    style.lineHeight = t.lineHeight ? `${t.lineHeight}px` : 1.2;
    style.letterSpacing = t.letterSpacing ? `${t.letterSpacing}px` : undefined;
    style.textAlign = align;
    style.whiteSpace = "pre-wrap";
    style.overflow = "visible";
    style.wordBreak = "normal";
    style.textRendering = "geometricPrecision";
  }
  return style;
}

function Layer({ layer }) {
  const style = layerStyle(layer);
  const assetKey = layer.asset
    ? (assetUrls[`../assets/images/${layer.asset}`] ? `../assets/images/${layer.asset}` : `../assets/vectors/${layer.asset}`)
    : null;
  const src = assetKey ? assetUrls[assetKey] : null;

  if (src) {
    return <div className="figma-layer" style={style} aria-hidden="true">
      <img src={src} alt="" draggable="false" />
    </div>;
  }
  if (layer.type === "TEXT" && layer.text) {
    return <div className="figma-layer figma-text" style={style}>{layer.text}</div>;
  }
  if (layer.type === "RECTANGLE" || (layer.type === "FRAME" && style.backgroundColor)) {
    return <div className="figma-layer" style={style} aria-hidden="true" />;
  }
  return null;
}

export default function FigmaCanvas() {
  const getScale = () => typeof window === "undefined" ? 1 : Math.min(window.innerWidth / ARTBOARD.width, 1);
  const [scale, setScale] = useState(getScale);
  useEffect(() => {
    const update = () => setScale(getScale());
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  const visibleLayers = useMemo(() => layers.filter(layer => layer.id !== "1119:3"), []);
  return (
    <div className="figma-stage" style={{ height: `${ARTBOARD.height * scale}px` }}>
      <main className="figma-artboard" style={{
        width: ARTBOARD.width,
        height: ARTBOARD.height,
        transform: `translateX(-50%) scale(${scale})`
      }}>
        {visibleLayers.map(layer => <Layer key={layer.id} layer={layer} />)}
      </main>
    </div>
  );
}
