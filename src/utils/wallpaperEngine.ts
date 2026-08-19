import { WallpaperConfig } from '../types';

/**
 * Seeded pseudo-random number generator for deterministic procedural generation
 */
export function createRng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Helper to convert hex color string to RGBA
 */
export function hexToRgba(hex: string, alpha = 1): string {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Primary rendering function that draws wallpaper onto an HTML5 Canvas
 */
export async function renderWallpaperToCanvas(
  canvas: HTMLCanvasElement,
  config: WallpaperConfig,
  customDimensions?: { width: number; height: number }
): Promise<void> {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  const width = customDimensions?.width || config.resolution.width;
  const height = customDimensions?.height || config.resolution.height;

  canvas.width = width;
  canvas.height = height;

  const rng = createRng(config.filters.seed || 12345);
  const colors = config.palette.colors;
  const isDark = config.theme === 'dark';

  // Base background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  if (isDark) {
    bgGrad.addColorStop(0, colors[0] || '#090a10');
    bgGrad.addColorStop(0.5, colors[1] || '#111322');
    bgGrad.addColorStop(1, colors[2] || '#05060a');
  } else {
    bgGrad.addColorStop(0, colors[colors.length - 1] || '#f8fafc');
    bgGrad.addColorStop(0.5, colors[Math.max(0, colors.length - 2)] || '#e2e8f0');
    bgGrad.addColorStop(1, '#ffffff');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // If AI Image mode is active and we have an image URL
  if (config.generationMode === 'ai' && config.aiImageUrl) {
    await renderAiImage(ctx, config.aiImageUrl, width, height);
  } else {
    // Procedural Rendering based on selected style
    switch (config.style) {
      case 'abstract':
        renderAbstract(ctx, width, height, colors, isDark, rng, config);
        break;
      case 'landscape':
        renderLandscape(ctx, width, height, colors, isDark, rng, config);
        break;
      case 'minimalist':
        renderMinimalist(ctx, width, height, colors, isDark, rng, config);
        break;
      case 'halloween':
        renderHalloween(ctx, width, height, colors, isDark, rng, config);
        break;
      case 'cyberpunk':
        renderCyberpunk(ctx, width, height, colors, isDark, rng, config);
        break;
      case 'natural':
        renderNatural(ctx, width, height, colors, isDark, rng, config);
        break;
      case 'scifi':
        renderSciFi(ctx, width, height, colors, isDark, rng, config);
        break;
      case 'synthwave':
        renderSynthwave(ctx, width, height, colors, isDark, rng, config);
        break;
      case 'anime':
        renderAnime(ctx, width, height, colors, isDark, rng, config);
        break;
      case 'glassmorphism':
        renderGlassmorphism(ctx, width, height, colors, isDark, rng, config);
        break;
      case 'oled-dark':
        renderOledDark(ctx, width, height, colors, rng, config);
        break;
      case 'geometric':
        renderGeometric(ctx, width, height, colors, isDark, rng, config);
        break;
      case 'watercolor':
        renderWatercolor(ctx, width, height, colors, isDark, rng, config);
        break;
      default:
        renderAbstract(ctx, width, height, colors, isDark, rng, config);
    }
  }

  // Apply Lighting Mood Grading
  applyLightingMood(ctx, width, height, config);

  // Apply Post-processing Filters (Vignette, Grain, Tone adjustments)
  applyPostProcessing(ctx, width, height, config);
}

// ----------------------------------------------------
// AI Image Loader
// ----------------------------------------------------
function renderAiImage(
  ctx: CanvasRenderingContext2D,
  imageUrl: string,
  width: number,
  height: number
): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Draw image object-fit cover
      const imgAspect = img.width / img.height;
      const canvasAspect = width / height;
      let drawW = width;
      let drawH = height;
      let offX = 0;
      let offY = 0;

      if (canvasAspect > imgAspect) {
        drawH = width / imgAspect;
        offY = (height - drawH) / 2;
      } else {
        drawW = height * imgAspect;
        offX = (width - drawW) / 2;
      }

      ctx.drawImage(img, offX, offY, drawW, drawH);
      resolve();
    };
    img.onerror = () => resolve();
    img.src = imageUrl;
  });
}

// ----------------------------------------------------
// Style: Abstract (Fluid Waves & Chromatic Ribbons)
// ----------------------------------------------------
function renderAbstract(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  colors: string[],
  isDark: boolean,
  rng: () => number,
  config: WallpaperConfig
) {
  const complexity = config.filters.complexity || 5;
  const layers = 5 + Math.floor(complexity * 1.2);

  // Deep backdrop lighting orb
  const orbGrad = ctx.createRadialGradient(
    w * (0.3 + rng() * 0.4),
    h * (0.3 + rng() * 0.4),
    50,
    w * 0.5,
    h * 0.5,
    w * 0.8
  );
  orbGrad.addColorStop(0, hexToRgba(colors[2] || '#ff007f', isDark ? 0.35 : 0.25));
  orbGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = orbGrad;
  ctx.fillRect(0, 0, w, h);

  // Flowing bezier ribbons
  for (let i = 0; i < layers; i++) {
    const colorIndex = i % colors.length;
    const ribbonGrad = ctx.createLinearGradient(0, 0, w, h);
    ribbonGrad.addColorStop(0, hexToRgba(colors[colorIndex], 0.85));
    ribbonGrad.addColorStop(0.5, hexToRgba(colors[(colorIndex + 1) % colors.length], 0.75));
    ribbonGrad.addColorStop(1, hexToRgba(colors[(colorIndex + 2) % colors.length], 0.6));

    ctx.save();
    ctx.beginPath();
    const startY = h * (0.1 + (i / layers) * 0.8);
    ctx.moveTo(0, startY);

    const cp1x = w * (0.2 + rng() * 0.2);
    const cp1y = startY + (rng() - 0.5) * (h * 0.4);
    const cp2x = w * (0.6 + rng() * 0.2);
    const cp2y = startY + (rng() - 0.5) * (h * 0.4);
    const endY = h * (0.15 + (i / layers) * 0.75);

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, w, endY);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();

    ctx.fillStyle = ribbonGrad;
    ctx.shadowColor = hexToRgba(colors[colorIndex], 0.4);
    ctx.shadowBlur = 40;
    ctx.fill();
    ctx.restore();
  }

  // Floating ambient glass particles
  for (let p = 0; p < 24; p++) {
    const px = rng() * w;
    const py = rng() * h;
    const pr = 4 + rng() * 16;
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba(colors[p % colors.length], 0.35);
    ctx.fill();
  }
}

// ----------------------------------------------------
// Style: Landscape (Mountains, Sunset, Mist, Horizons)
// ----------------------------------------------------
function renderLandscape(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  colors: string[],
  isDark: boolean,
  rng: () => number,
  config: WallpaperConfig
) {
  // Sky Gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.75);
  skyGrad.addColorStop(0, colors[0]);
  skyGrad.addColorStop(0.4, colors[1] || colors[0]);
  skyGrad.addColorStop(0.75, colors[2] || colors[1]);
  skyGrad.addColorStop(1, colors[3] || colors[2]);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  // Sun / Moon on the horizon
  const sunX = w * (0.35 + rng() * 0.3);
  const sunY = h * (0.3 + rng() * 0.15);
  const sunRadius = Math.min(w, h) * (isDark ? 0.12 : 0.16);

  const sunGlow = ctx.createRadialGradient(sunX, sunY, sunRadius * 0.2, sunX, sunY, sunRadius * 2.5);
  sunGlow.addColorStop(0, isDark ? '#ffffff' : (colors[colors.length - 1] || '#ffeedd'));
  sunGlow.addColorStop(0.4, hexToRgba(colors[colors.length - 1] || '#f59e0b', 0.8));
  sunGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = sunGlow;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunRadius * 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Solid Sun disc
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
  ctx.fillStyle = isDark ? '#f8fafc' : (colors[colors.length - 1] || '#fff');
  ctx.fill();

  // Distant stars if dark
  if (isDark) {
    for (let s = 0; s < 60; s++) {
      const sx = rng() * w;
      const sy = rng() * (h * 0.5);
      const sr = 0.5 + rng() * 1.8;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba('#ffffff', 0.3 + rng() * 0.7);
      ctx.fill();
    }
  }

  // Mountain Ranges (3 to 4 depth tiers)
  const tiers = 4;
  for (let t = 0; t < tiers; t++) {
    const tierProgress = t / (tiers - 1);
    const baseElevation = h * (0.45 + tierProgress * 0.35);
    const colorIndex = Math.min(colors.length - 1, Math.floor(tierProgress * colors.length));
    const mountainColor = isDark
      ? hexToRgba(colors[colorIndex], 0.7 + tierProgress * 0.3)
      : hexToRgba(colors[Math.max(0, colors.length - 1 - colorIndex)], 0.8 + tierProgress * 0.2);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, baseElevation);

    const segments = 12 + t * 4;
    for (let s = 0; s <= segments; s++) {
      const x = (s / segments) * w;
      const peakVariance = (rng() - 0.45) * (h * (0.18 - tierProgress * 0.08));
      const y = baseElevation + peakVariance;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = mountainColor;
    ctx.fill();

    // Mist layer between mountains
    const mistGrad = ctx.createLinearGradient(0, baseElevation - 40, 0, baseElevation + 80);
    mistGrad.addColorStop(0, 'transparent');
    mistGrad.addColorStop(0.5, hexToRgba(colors[2] || '#ffffff', 0.15));
    mistGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = mistGrad;
    ctx.fillRect(0, baseElevation - 40, w, 120);
    ctx.restore();
  }

  // Reflective Lake / Horizon Base
  const waterY = h * 0.82;
  const waterGrad = ctx.createLinearGradient(0, waterY, 0, h);
  waterGrad.addColorStop(0, hexToRgba(colors[0], 0.9));
  waterGrad.addColorStop(1, hexToRgba(colors[1] || colors[0], 0.98));
  ctx.fillStyle = waterGrad;
  ctx.fillRect(0, waterY, w, h - waterY);

  // Water reflection shimmer
  for (let r = 0; r < 20; r++) {
    const rx = sunX + (rng() - 0.5) * (w * 0.25);
    const ry = waterY + rng() * (h - waterY);
    const rw = 20 + rng() * 60;
    ctx.fillStyle = hexToRgba(colors[colors.length - 1], 0.35);
    ctx.fillRect(rx - rw / 2, ry, rw, 2);
  }
}

// ----------------------------------------------------
// Style: Minimalist (Clean Geometry, Aura Glows)
// ----------------------------------------------------
function renderMinimalist(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  colors: string[],
  isDark: boolean,
  rng: () => number,
  config: WallpaperConfig
) {
  // Soft ambient aura bloom
  const auraX = w * (0.35 + rng() * 0.3);
  const auraY = h * (0.4 + rng() * 0.2);
  const auraRadius = Math.min(w, h) * 0.45;

  const auraGrad = ctx.createRadialGradient(auraX, auraY, 10, auraX, auraY, auraRadius);
  auraGrad.addColorStop(0, hexToRgba(colors[colors.length - 1] || '#6366f1', isDark ? 0.45 : 0.3));
  auraGrad.addColorStop(0.5, hexToRgba(colors[1] || '#ec4899', isDark ? 0.25 : 0.15));
  auraGrad.addColorStop(1, 'transparent');

  ctx.fillStyle = auraGrad;
  ctx.beginPath();
  ctx.arc(auraX, auraY, auraRadius, 0, Math.PI * 2);
  ctx.fill();

  // Primary geometric zen shape
  ctx.save();
  const shapeType = Math.floor(rng() * 3);
  const mainX = w * 0.5;
  const mainY = h * 0.52;
  const mainSize = Math.min(w, h) * 0.28;

  if (shapeType === 0) {
    // Pure Zen Circle / Enso Arc
    ctx.beginPath();
    ctx.arc(mainX, mainY, mainSize, 0, Math.PI * 2);
    ctx.strokeStyle = isDark ? hexToRgba(colors[colors.length - 1], 0.8) : hexToRgba(colors[0], 0.8);
    ctx.lineWidth = 4;
    ctx.stroke();

    // Solid inner accent dot
    ctx.beginPath();
    ctx.arc(mainX, mainY, mainSize * 0.35, 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba(colors[2] || colors[1], 0.7);
    ctx.fill();
  } else if (shapeType === 1) {
    // Bauhaus Arch
    ctx.beginPath();
    ctx.arc(mainX, mainY - mainSize * 0.5, mainSize, Math.PI, 0, false);
    ctx.lineTo(mainX + mainSize, mainY + mainSize * 0.8);
    ctx.lineTo(mainX - mainSize, mainY + mainSize * 0.8);
    ctx.closePath();
    ctx.fillStyle = isDark ? hexToRgba(colors[1], 0.6) : hexToRgba(colors[colors.length - 2], 0.7);
    ctx.fill();
  } else {
    // Linear Horizon + floating sphere
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.15, mainY + mainSize * 0.5);
    ctx.lineTo(w * 0.85, mainY + mainSize * 0.5);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(mainX, mainY - mainSize * 0.2, mainSize * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? hexToRgba(colors[colors.length - 1], 0.9) : hexToRgba(colors[1], 0.85);
    ctx.fill();
  }
  ctx.restore();
}

// ----------------------------------------------------
// Style: Halloween (Spooky Castle, Jack-O'-Lantern, Bats, Moon)
// ----------------------------------------------------
function renderHalloween(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  colors: string[],
  isDark: boolean,
  rng: () => number,
  config: WallpaperConfig
) {
  // Spooky dark sky
  const skyGrad = ctx.createRadialGradient(w * 0.5, h * 0.25, 40, w * 0.5, h * 0.5, w * 0.8);
  skyGrad.addColorStop(0, '#2d0c42');
  skyGrad.addColorStop(0.5, '#150624');
  skyGrad.addColorStop(1, '#08010f');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  // Giant glowing Full Moon
  const moonX = w * (0.35 + rng() * 0.3);
  const moonY = h * 0.28;
  const moonR = Math.min(w, h) * 0.18;

  // Moon outer aura glow
  const moonGlow = ctx.createRadialGradient(moonX, moonY, moonR * 0.5, moonX, moonY, moonR * 2.2);
  moonGlow.addColorStop(0, 'rgba(255, 170, 0, 0.6)');
  moonGlow.addColorStop(0.5, 'rgba(255, 100, 0, 0.25)');
  moonGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = moonGlow;
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR * 2.2, 0, Math.PI * 2);
  ctx.fill();

  // Moon surface
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
  ctx.fillStyle = '#ffcf56';
  ctx.fill();

  // Moon craters
  for (let c = 0; c < 6; c++) {
    const cx = moonX + (rng() - 0.5) * (moonR * 1.2);
    const cy = moonY + (rng() - 0.5) * (moonR * 1.2);
    ctx.beginPath();
    ctx.arc(cx, cy, 6 + rng() * 14, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(217, 119, 6, 0.25)';
    ctx.fill();
  }

  // Haunted Castle Silhouette
  const hillY = h * 0.68;
  ctx.save();
  ctx.fillStyle = '#0a0312';
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(0, hillY + 40);

  // Rolling spooky hill
  ctx.quadraticCurveTo(w * 0.5, hillY - 30, w, hillY + 60);
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();

  // Castle towers in the background
  const castleX = w * 0.55;
  const castleY = hillY - 80;
  ctx.fillStyle = '#0a0312';
  // Central Keep
  ctx.fillRect(castleX - 35, castleY - 60, 70, 100);
  // Spires
  ctx.beginPath();
  ctx.moveTo(castleX - 35, castleY - 60);
  ctx.lineTo(castleX, castleY - 110);
  ctx.lineTo(castleX + 35, castleY - 60);
  ctx.fill();

  // Side turrets
  ctx.fillRect(castleX - 70, castleY - 30, 30, 80);
  ctx.beginPath();
  ctx.moveTo(castleX - 70, castleY - 30);
  ctx.lineTo(castleX - 55, castleY - 70);
  ctx.lineTo(castleX - 40, castleY - 30);
  ctx.fill();

  ctx.fillRect(castleX + 40, castleY - 20, 30, 70);
  ctx.beginPath();
  ctx.moveTo(castleX + 40, castleY - 20);
  ctx.lineTo(castleX + 55, castleY - 60);
  ctx.lineTo(castleX + 70, castleY - 20);
  ctx.fill();

  // Glowing castle window
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(castleX - 6, castleY - 35, 12, 18);
  ctx.restore();

  // Flying Bats Silhouettes
  for (let b = 0; b < 9; b++) {
    const bx = w * (0.2 + rng() * 0.6);
    const by = h * (0.15 + rng() * 0.35);
    const bw = 12 + rng() * 18;

    ctx.save();
    ctx.fillStyle = '#05010a';
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.quadraticCurveTo(bx - bw * 0.5, by - bw * 0.6, bx - bw, by - bw * 0.2);
    ctx.quadraticCurveTo(bx - bw * 0.4, by + bw * 0.2, bx, by);
    ctx.quadraticCurveTo(bx + bw * 0.4, by + bw * 0.2, bx + bw, by - bw * 0.2);
    ctx.quadraticCurveTo(bx + bw * 0.5, by - bw * 0.6, bx, by);
    ctx.fill();
    ctx.restore();
  }

  // Giant Glowing Jack-o'-Lantern on the foreground
  const pumpkinX = w * 0.48;
  const pumpkinY = h * 0.86;
  const pw = Math.min(w, h) * 0.24;
  const ph = pw * 0.85;

  ctx.save();
  // Pumpkin outer glow
  const pglow = ctx.createRadialGradient(pumpkinX, pumpkinY, pw * 0.2, pumpkinX, pumpkinY, pw * 1.5);
  pglow.addColorStop(0, 'rgba(255, 120, 0, 0.45)');
  pglow.addColorStop(1, 'transparent');
  ctx.fillStyle = pglow;
  ctx.beginPath();
  ctx.arc(pumpkinX, pumpkinY, pw * 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Pumpkin Body (3 overlapping lobes)
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.ellipse(pumpkinX, pumpkinY, pw * 0.55, ph * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#c2410c';
  ctx.beginPath();
  ctx.ellipse(pumpkinX - pw * 0.25, pumpkinY, pw * 0.35, ph * 0.48, -0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(pumpkinX + pw * 0.25, pumpkinY, pw * 0.35, ph * 0.48, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Pumpkin Stem
  ctx.fillStyle = '#3f6212';
  ctx.fillRect(pumpkinX - 6, pumpkinY - ph * 0.55, 12, 22);

  // Glowing Carved Face (Eyes & Toothy Grin)
  ctx.fillStyle = '#fef08a';
  ctx.shadowColor = '#f97316';
  ctx.shadowBlur = 20;

  // Left Eye Triangle
  ctx.beginPath();
  ctx.moveTo(pumpkinX - pw * 0.2, pumpkinY - ph * 0.15);
  ctx.lineTo(pumpkinX - pw * 0.08, pumpkinY - ph * 0.15);
  ctx.lineTo(pumpkinX - pw * 0.14, pumpkinY - ph * 0.3);
  ctx.closePath();
  ctx.fill();

  // Right Eye Triangle
  ctx.beginPath();
  ctx.moveTo(pumpkinX + pw * 0.08, pumpkinY - ph * 0.15);
  ctx.lineTo(pumpkinX + pw * 0.2, pumpkinY - ph * 0.15);
  ctx.lineTo(pumpkinX + pw * 0.14, pumpkinY - ph * 0.3);
  ctx.closePath();
  ctx.fill();

  // Nose Triangle
  ctx.beginPath();
  ctx.moveTo(pumpkinX - pw * 0.05, pumpkinY - ph * 0.05);
  ctx.lineTo(pumpkinX + pw * 0.05, pumpkinY - ph * 0.05);
  ctx.lineTo(pumpkinX, pumpkinY - ph * 0.15);
  ctx.closePath();
  ctx.fill();

  // Carved Jagged Smile
  ctx.beginPath();
  ctx.moveTo(pumpkinX - pw * 0.3, pumpkinY + ph * 0.1);
  ctx.lineTo(pumpkinX - pw * 0.18, pumpkinY + ph * 0.25);
  ctx.lineTo(pumpkinX - pw * 0.1, pumpkinY + ph * 0.12);
  ctx.lineTo(pumpkinX, pumpkinY + ph * 0.26);
  ctx.lineTo(pumpkinX + pw * 0.1, pumpkinY + ph * 0.12);
  ctx.lineTo(pumpkinX + pw * 0.18, pumpkinY + ph * 0.25);
  ctx.lineTo(pumpkinX + pw * 0.3, pumpkinY + ph * 0.1);
  ctx.quadraticCurveTo(pumpkinX, pumpkinY + ph * 0.42, pumpkinX - pw * 0.3, pumpkinY + ph * 0.1);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Eerie green/purple ground fog
  const fog = ctx.createLinearGradient(0, h * 0.85, 0, h);
  fog.addColorStop(0, 'transparent');
  fog.addColorStop(0.5, 'rgba(168, 85, 247, 0.2)');
  fog.addColorStop(1, 'rgba(74, 222, 128, 0.25)');
  ctx.fillStyle = fog;
  ctx.fillRect(0, h * 0.85, w, h * 0.15);
}

// ----------------------------------------------------
// Style: Cyberpunk (Neon Skyscrapers, Laser Grid, Rain)
// ----------------------------------------------------
function renderCyberpunk(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  colors: string[],
  isDark: boolean,
  rng: () => number,
  config: WallpaperConfig
) {
  // Dark Cyber City Sky
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.65);
  sky.addColorStop(0, '#05020d');
  sky.addColorStop(0.6, '#18072e');
  sky.addColorStop(1, '#3b0764');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Background High-tech Skyline Buildings
  const buildings = 16;
  for (let b = 0; b < buildings; b++) {
    const bw = w * (0.06 + rng() * 0.08);
    const bx = (b / buildings) * w;
    const bh = h * (0.25 + rng() * 0.35);
    const by = h * 0.65 - bh;

    ctx.fillStyle = '#0a0517';
    ctx.fillRect(bx, by, bw, bh + 50);

    // Glowing Neon Window Matrix
    const rows = Math.floor(bh / 18);
    const cols = Math.floor(bw / 12);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (rng() > 0.6) {
          ctx.fillStyle = rng() > 0.5 ? '#00f0ff' : '#ff007f';
          ctx.fillRect(bx + c * 12 + 2, by + r * 18 + 4, 6, 8);
        }
      }
    }

    // Skyscraper rooftop beacon antenna
    if (rng() > 0.5) {
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bx + bw / 2, by);
      ctx.lineTo(bx + bw / 2, by - 30);
      ctx.stroke();

      ctx.fillStyle = '#ff0055';
      ctx.beginPath();
      ctx.arc(bx + bw / 2, by - 30, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Ground 3D Perspective Laser Grid
  const gridHorizon = h * 0.65;
  ctx.fillStyle = '#05020c';
  ctx.fillRect(0, gridHorizon, w, h - gridHorizon);

  // Grid vanishing lines
  ctx.save();
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.shadowColor = '#00f0ff';
  ctx.shadowBlur = 10;

  const vpX = w * 0.5;
  const numGridLines = 22;
  for (let l = 0; l <= numGridLines; l++) {
    const bottomX = (l / numGridLines) * w * 1.8 - w * 0.4;
    ctx.beginPath();
    ctx.moveTo(vpX, gridHorizon);
    ctx.lineTo(bottomX, h);
    ctx.stroke();
  }

  // Horizontal scanlines on grid
  for (let y = gridHorizon; y < h; y += (y - gridHorizon) * 0.25 + 6) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.restore();

  // Neon Holographic Kanji / Cyber Circle in sky
  ctx.save();
  const holoX = w * 0.5;
  const holoY = h * 0.28;
  const holoR = Math.min(w, h) * 0.16;

  ctx.strokeStyle = '#ff007f';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#ff007f';
  ctx.shadowBlur = 25;
  ctx.beginPath();
  ctx.arc(holoX, holoY, holoR, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#00f0ff';
  ctx.beginPath();
  ctx.arc(holoX, holoY, holoR * 0.7, 0, Math.PI * 1.5);
  ctx.stroke();
  ctx.restore();

  // Diagonal Neon Rain Streaks
  ctx.save();
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
  ctx.lineWidth = 1;
  for (let rain = 0; rain < 90; rain++) {
    const rx = rng() * w * 1.2;
    const ry = rng() * h;
    const rlen = 20 + rng() * 50;
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx - rlen * 0.3, ry + rlen);
    ctx.stroke();
  }
  ctx.restore();
}

// ----------------------------------------------------
// Style: Natural (Botanical Leaves, Organic Ripples)
// ----------------------------------------------------
function renderNatural(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  colors: string[],
  isDark: boolean,
  rng: () => number,
  config: WallpaperConfig
) {
  // Layered tropical foliage leaves
  const leaves = 8;
  for (let l = 0; l < leaves; l++) {
    const leafX = (l / leaves) * w + (rng() - 0.5) * 100;
    const leafY = h * (0.2 + (l / leaves) * 0.6);
    const leafR = Math.min(w, h) * (0.2 + rng() * 0.15);
    const colorIndex = l % colors.length;

    ctx.save();
    ctx.translate(leafX, leafY);
    ctx.rotate((rng() - 0.5) * 1.2);

    // Leaf contour
    ctx.beginPath();
    ctx.moveTo(0, -leafR);
    ctx.quadraticCurveTo(leafR * 0.8, 0, 0, leafR);
    ctx.quadraticCurveTo(-leafR * 0.8, 0, 0, -leafR);
    ctx.closePath();

    ctx.fillStyle = hexToRgba(colors[colorIndex], isDark ? 0.45 : 0.6);
    ctx.fill();

    // Leaf main stem & veins
    ctx.strokeStyle = hexToRgba(isDark ? '#a8e6cf' : '#1e6f5c', 0.4);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -leafR);
    ctx.lineTo(0, leafR);
    for (let v = -0.6; v <= 0.6; v += 0.3) {
      ctx.moveTo(0, leafR * v);
      ctx.lineTo(leafR * 0.35, leafR * (v + 0.15));
      ctx.moveTo(0, leafR * v);
      ctx.lineTo(-leafR * 0.35, leafR * (v + 0.15));
    }
    ctx.stroke();
    ctx.restore();
  }

  // Zen Water Ripples
  for (let r = 0; r < 5; r++) {
    const ripX = w * (0.2 + rng() * 0.6);
    const ripY = h * (0.3 + rng() * 0.5);
    const ripR = 40 + rng() * 120;
    ctx.beginPath();
    ctx.arc(ripX, ripY, ripR, 0, Math.PI * 2);
    ctx.strokeStyle = hexToRgba(colors[colors.length - 1] || '#ffffff', 0.25);
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

// ----------------------------------------------------
// Style: Sci-Fi (Deep Cosmos, Planet with Rings, Nebula)
// ----------------------------------------------------
function renderSciFi(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  colors: string[],
  isDark: boolean,
  rng: () => number,
  config: WallpaperConfig
) {
  // Deep space base
  ctx.fillStyle = '#03030a';
  ctx.fillRect(0, 0, w, h);

  // Cosmic Nebula Cloud clusters
  for (let n = 0; n < 4; n++) {
    const nx = w * (0.2 + rng() * 0.6);
    const ny = h * (0.2 + rng() * 0.6);
    const nr = Math.min(w, h) * (0.4 + rng() * 0.3);
    const colorIndex = n % colors.length;

    const nebGrad = ctx.createRadialGradient(nx, ny, 10, nx, ny, nr);
    nebGrad.addColorStop(0, hexToRgba(colors[colorIndex], 0.45));
    nebGrad.addColorStop(0.5, hexToRgba(colors[(colorIndex + 1) % colors.length], 0.2));
    nebGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = nebGrad;
    ctx.beginPath();
    ctx.arc(nx, ny, nr, 0, Math.PI * 2);
    ctx.fill();
  }

  // Starfield
  for (let s = 0; s < 180; s++) {
    const sx = rng() * w;
    const sy = rng() * h;
    const sr = 0.4 + rng() * 2.2;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba('#ffffff', 0.3 + rng() * 0.7);
    ctx.fill();

    // Cross flare on bright stars
    if (sr > 2.0 && rng() > 0.6) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(sx - 12, sy);
      ctx.lineTo(sx + 12, sy);
      ctx.moveTo(sx, sy - 12);
      ctx.lineTo(sx, sy + 12);
      ctx.stroke();
    }
  }

  // Giant Ringed Gas Planet
  const planetX = w * 0.65;
  const planetY = h * 0.42;
  const planetR = Math.min(w, h) * 0.22;

  ctx.save();
  ctx.translate(planetX, planetY);
  ctx.rotate(-0.35);

  // Planet Sphere with 3D shadow gradient
  const pGrad = ctx.createRadialGradient(-planetR * 0.3, -planetR * 0.3, 10, 0, 0, planetR);
  pGrad.addColorStop(0, colors[colors.length - 1] || '#93c5fd');
  pGrad.addColorStop(0.5, colors[1] || '#3b82f6');
  pGrad.addColorStop(1, '#08081a');

  ctx.beginPath();
  ctx.arc(0, 0, planetR, 0, Math.PI * 2);
  ctx.fillStyle = pGrad;
  ctx.fill();

  // Atmospheric limb glow
  ctx.strokeStyle = hexToRgba(colors[colors.length - 1] || '#60a5fa', 0.6);
  ctx.lineWidth = 3;
  ctx.stroke();

  // Planetary Rings (Ellipse ring)
  ctx.beginPath();
  ctx.ellipse(0, 0, planetR * 2.1, planetR * 0.55, 0, 0, Math.PI * 2);
  ctx.strokeStyle = hexToRgba(colors[2] || '#c084fc', 0.65);
  ctx.lineWidth = 14;
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(0, 0, planetR * 2.3, planetR * 0.6, 0, 0, Math.PI * 2);
  ctx.strokeStyle = hexToRgba(colors[0] || '#6366f1', 0.35);
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.restore();
}

// ----------------------------------------------------
// Style: Retro Synthwave (80s Outrun Horizon & Sun)
// ----------------------------------------------------
function renderSynthwave(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  colors: string[],
  isDark: boolean,
  rng: () => number,
  config: WallpaperConfig
) {
  // Dusk Gradient
  const dusk = ctx.createLinearGradient(0, 0, 0, h * 0.65);
  dusk.addColorStop(0, '#100524');
  dusk.addColorStop(0.5, '#581c87');
  dusk.addColorStop(0.85, '#be185d');
  dusk.addColorStop(1, '#f59e0b');
  ctx.fillStyle = dusk;
  ctx.fillRect(0, 0, w, h);

  // Segmented Outrun Sun
  const sunX = w * 0.5;
  const sunY = h * 0.45;
  const sunR = Math.min(w, h) * 0.22;

  ctx.save();
  const sunGrad = ctx.createLinearGradient(0, sunY - sunR, 0, sunY + sunR);
  sunGrad.addColorStop(0, '#fde047');
  sunGrad.addColorStop(0.6, '#f97316');
  sunGrad.addColorStop(1, '#db2777');

  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR, Math.PI, 0, false);
  ctx.fill();

  // Horizontal blind cutouts across bottom half of sun
  ctx.fillStyle = '#100524';
  let cutY = sunY;
  let cutH = 3;
  while (cutY < sunY + sunR) {
    ctx.fillRect(sunX - sunR - 10, cutY, sunR * 2 + 20, cutH);
    cutY += cutH + 8;
    cutH += 2.5;
  }
  ctx.restore();

  // Wireframe Horizon Grid
  const gridY = h * 0.65;
  ctx.fillStyle = '#080112';
  ctx.fillRect(0, gridY, w, h - gridY);

  ctx.save();
  ctx.strokeStyle = '#ff007f';
  ctx.lineWidth = 2;
  ctx.shadowColor = '#ff007f';
  ctx.shadowBlur = 12;

  const vpX = w * 0.5;
  for (let l = 0; l <= 18; l++) {
    const bx = (l / 18) * w * 2.2 - w * 0.6;
    ctx.beginPath();
    ctx.moveTo(vpX, gridY);
    ctx.lineTo(bx, h);
    ctx.stroke();
  }

  for (let y = gridY; y < h; y += (y - gridY) * 0.28 + 6) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.restore();

  // Palm trees silhouettes on bottom sides
  renderPalmSilhouette(ctx, w * 0.12, h * 0.72, Math.min(w, h) * 0.2);
  renderPalmSilhouette(ctx, w * 0.88, h * 0.74, Math.min(w, h) * 0.18, true);
}

function renderPalmSilhouette(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, flip = false) {
  ctx.save();
  ctx.translate(x, y);
  if (flip) ctx.scale(-1, 1);
  ctx.fillStyle = '#080112';

  // Curved Trunk
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-size * 0.2, -size * 0.5, size * 0.1, -size);
  ctx.quadraticCurveTo(-size * 0.1, -size * 0.5, 10, 0);
  ctx.closePath();
  ctx.fill();

  // Fronds
  const frondAngles = [-0.6, -0.2, 0.2, 0.6, 1.0];
  for (const ang of frondAngles) {
    ctx.save();
    ctx.translate(size * 0.1, -size);
    ctx.rotate(ang);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(size * 0.5, -size * 0.1, size * 0.8, size * 0.3);
    ctx.quadraticCurveTo(size * 0.4, 0, 0, 0);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

// ----------------------------------------------------
// Style: Anime / Studio Ghibli (Painterly Clouds & Hills)
// ----------------------------------------------------
function renderAnime(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  colors: string[],
  isDark: boolean,
  rng: () => number,
  config: WallpaperConfig
) {
  // Vibrant Blue Sky
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.75);
  sky.addColorStop(0, '#0284c7');
  sky.addColorStop(0.6, '#38bdf8');
  sky.addColorStop(1, '#bae6fd');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Voluminous Cumulus Clouds
  for (let c = 0; c < 4; c++) {
    const cx = w * (0.2 + (c / 4) * 0.7);
    const cy = h * (0.25 + rng() * 0.25);
    const cr = Math.min(w, h) * (0.18 + rng() * 0.12);

    ctx.save();
    // Warm bottom shadow for cloud
    ctx.fillStyle = '#e0f2fe';
    for (let puff = 0; puff < 5; puff++) {
      ctx.beginPath();
      ctx.arc(cx + (puff - 2) * (cr * 0.4), cy + 10, cr * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
    // Crisp white sunlit cloud top
    ctx.fillStyle = '#ffffff';
    for (let puff = 0; puff < 5; puff++) {
      ctx.beginPath();
      ctx.arc(cx + (puff - 2) * (cr * 0.4), cy - 10, cr * 0.55, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Rolling Grass Hills (Lush Greenery)
  ctx.fillStyle = '#15803d';
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(0, h * 0.68);
  ctx.quadraticCurveTo(w * 0.5, h * 0.58, w, h * 0.7);
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(0, h * 0.78);
  ctx.quadraticCurveTo(w * 0.45, h * 0.68, w, h * 0.82);
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();
}

// ----------------------------------------------------
// Style: 3D Glassmorphism (Frosted Spheres, Prisms)
// ----------------------------------------------------
function renderGlassmorphism(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  colors: string[],
  isDark: boolean,
  rng: () => number,
  config: WallpaperConfig
) {
  // Multi-color ambient background blur orbs
  for (let o = 0; o < 3; o++) {
    const ox = w * (0.3 + (o / 3) * 0.5);
    const oy = h * (0.3 + rng() * 0.4);
    const or = Math.min(w, h) * 0.35;
    const bgOrb = ctx.createRadialGradient(ox, oy, 10, ox, oy, or);
    bgOrb.addColorStop(0, hexToRgba(colors[o % colors.length], 0.6));
    bgOrb.addColorStop(1, 'transparent');
    ctx.fillStyle = bgOrb;
    ctx.beginPath();
    ctx.arc(ox, oy, or, 0, Math.PI * 2);
    ctx.fill();
  }

  // Frosted Glass Slabs & Floating Spheres
  const numOrbs = 5;
  for (let i = 0; i < numOrbs; i++) {
    const sx = w * (0.25 + rng() * 0.5);
    const sy = h * (0.25 + rng() * 0.5);
    const sr = Math.min(w, h) * (0.1 + rng() * 0.12);

    ctx.save();
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);

    // Glass refraction gradient
    const glassGrad = ctx.createLinearGradient(sx - sr, sy - sr, sx + sr, sy + sr);
    glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    glassGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
    glassGrad.addColorStop(1, 'rgba(255, 255, 255, 0.25)');
    ctx.fillStyle = glassGrad;
    ctx.fill();

    // Specular Highlight border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Specular spot
    ctx.beginPath();
    ctx.arc(sx - sr * 0.35, sy - sr * 0.35, sr * 0.18, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fill();
    ctx.restore();
  }
}

// ----------------------------------------------------
// Style: OLED Dark (100% True Black with Neon Accents)
// ----------------------------------------------------
function renderOledDark(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  colors: string[],
  rng: () => number,
  config: WallpaperConfig
) {
  // Pure 100% OLED black
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, w, h);

  // Minimalist Sleek Neon Circuit Line
  const accentColor = colors[colors.length - 1] || '#6366f1';
  ctx.save();
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 3;
  ctx.shadowColor = accentColor;
  ctx.shadowBlur = 24;

  const startY = h * 0.45;
  ctx.beginPath();
  ctx.moveTo(w * 0.1, startY);
  ctx.lineTo(w * 0.4, startY);
  ctx.lineTo(w * 0.55, startY + h * 0.15);
  ctx.lineTo(w * 0.9, startY + h * 0.15);
  ctx.stroke();

  // Subtle glowing node
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(w * 0.55, startY + h * 0.15, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ----------------------------------------------------
// Style: Geometric Bauhaus
// ----------------------------------------------------
function renderGeometric(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  colors: string[],
  isDark: boolean,
  rng: () => number,
  config: WallpaperConfig
) {
  const shapes = 12;
  for (let s = 0; s < shapes; s++) {
    const colorIndex = s % colors.length;
    ctx.fillStyle = hexToRgba(colors[colorIndex], 0.75);

    const type = Math.floor(rng() * 3);
    const x = rng() * w;
    const y = rng() * h;
    const size = Math.min(w, h) * (0.15 + rng() * 0.25);

    ctx.beginPath();
    if (type === 0) {
      // Circle
      ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
    } else if (type === 1) {
      // Rotated square
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rng() * Math.PI) / 4);
      ctx.rect(-size / 2, -size / 2, size, size);
      ctx.restore();
    } else {
      // Triangle
      ctx.moveTo(x, y - size / 2);
      ctx.lineTo(x + size / 2, y + size / 2);
      ctx.lineTo(x - size / 2, y + size / 2);
      ctx.closePath();
    }
    ctx.fill();
  }
}

// ----------------------------------------------------
// Style: Watercolor
// ----------------------------------------------------
function renderWatercolor(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  colors: string[],
  isDark: boolean,
  rng: () => number,
  config: WallpaperConfig
) {
  const blobs = 22;
  for (let b = 0; b < blobs; b++) {
    const bx = w * (0.2 + rng() * 0.6);
    const by = h * (0.2 + rng() * 0.6);
    const br = Math.min(w, h) * (0.15 + rng() * 0.2);
    const colorIndex = b % colors.length;

    ctx.save();
    const wgrad = ctx.createRadialGradient(bx, by, 10, bx, by, br);
    wgrad.addColorStop(0, hexToRgba(colors[colorIndex], 0.4));
    wgrad.addColorStop(0.8, hexToRgba(colors[colorIndex], 0.15));
    wgrad.addColorStop(1, 'transparent');

    ctx.fillStyle = wgrad;
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// ----------------------------------------------------
// Lighting Mood Grading
// ----------------------------------------------------
function applyLightingMood(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  config: WallpaperConfig
) {
  const mood = config.lightingMood;

  switch (mood) {
    case 'golden-hour': {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, 'rgba(251, 191, 36, 0.18)');
      g.addColorStop(1, 'rgba(249, 115, 22, 0.25)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case 'moonlight': {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, 'rgba(30, 58, 138, 0.25)');
      g.addColorStop(1, 'rgba(15, 23, 42, 0.35)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case 'neon-glow': {
      const g = ctx.createRadialGradient(w * 0.5, h * 0.5, 100, w * 0.5, h * 0.5, w * 0.75);
      g.addColorStop(0, 'rgba(236, 72, 153, 0.2)');
      g.addColorStop(1, 'rgba(6, 182, 212, 0.15)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case 'cinematic': {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
      g.addColorStop(0.5, 'transparent');
      g.addColorStop(1, 'rgba(0, 0, 0, 0.35)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    default:
      break;
  }
}

// ----------------------------------------------------
// Post-Processing Filters (Vignette, Grain, Contrast)
// ----------------------------------------------------
function applyPostProcessing(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  config: WallpaperConfig
) {
  const { vignette, grain } = config.filters;

  // Vignette overlay
  if (vignette > 0) {
    const vigGrad = ctx.createRadialGradient(
      w * 0.5,
      h * 0.5,
      Math.min(w, h) * 0.35,
      w * 0.5,
      h * 0.5,
      Math.max(w, h) * 0.75
    );
    const alpha = (vignette / 100) * 0.85;
    vigGrad.addColorStop(0, 'transparent');
    vigGrad.addColorStop(1, `rgba(0, 0, 0, ${alpha})`);

    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, w, h);
  }

  // Film Grain Noise
  if (grain > 0) {
    const noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = 128;
    noiseCanvas.height = 128;
    const nctx = noiseCanvas.getContext('2d');
    if (nctx) {
      const imgData = nctx.createImageData(128, 128);
      const data = imgData.data;
      const grainStrength = (grain / 100) * 35;
      for (let i = 0; i < data.length; i += 4) {
        const val = (Math.random() - 0.5) * grainStrength * 2;
        data[i] = val > 0 ? 255 : 0;
        data[i + 1] = val > 0 ? 255 : 0;
        data[i + 2] = val > 0 ? 255 : 0;
        data[i + 3] = Math.abs(val);
      }
      nctx.putImageData(imgData, 0, 0);

      const pattern = ctx.createPattern(noiseCanvas, 'repeat');
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, w, h);
      }
    }
  }
}

/**
 * High-definition Export function to download the canvas as JPG/PNG/WebP
 */
export async function downloadWallpaper(
  config: WallpaperConfig,
  format: 'jpg' | 'png' | 'webp' = 'jpg',
  quality = 0.95,
  customDimensions?: { width: number; height: number }
): Promise<void> {
  const offscreen = document.createElement('canvas');
  const targetW = customDimensions?.width || config.resolution.width;
  const targetH = customDimensions?.height || config.resolution.height;

  await renderWallpaperToCanvas(offscreen, config, { width: targetW, height: targetH });

  const mimeType = format === 'jpg' ? 'image/jpeg' : format === 'png' ? 'image/png' : 'image/webp';
  const extension = format === 'jpg' ? 'jpg' : format === 'png' ? 'png' : 'webp';

  const dataUrl = offscreen.toDataURL(mimeType, quality);

  const link = document.createElement('a');
  const sanitizedTitle = (config.title || 'EHSAAN_ULLAH_wallpaper')
    .replace(/\s+/g, '_')
    .toLowerCase();
  link.download = `${sanitizedTitle}_${config.style}_${targetW}x${targetH}.${extension}`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
