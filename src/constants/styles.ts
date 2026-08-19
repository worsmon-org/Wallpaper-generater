import { WallpaperStyle, LightingMood } from '../types';

export interface StyleOption {
  id: WallpaperStyle;
  label: string;
  category: 'Popular' | 'Nature & Mood' | 'Sci-Fi & Cyber' | 'Artistic';
  description: string;
  tagline: string;
  badge?: string;
  previewGradient: string;
}

export const WALLPAPER_STYLES: StyleOption[] = [
  {
    id: 'abstract',
    label: 'Abstract',
    category: 'Popular',
    description: 'Generative fluid curves, layered silk ribbons, dynamic organic gradient waves.',
    tagline: 'Flowing shapes & chromatic depth',
    badge: 'Popular',
    previewGradient: 'from-violet-600 via-pink-500 to-amber-400',
  },
  {
    id: 'landscape',
    label: 'Landscape',
    category: 'Nature & Mood',
    description: 'Majestic mountain ranges, serene alpine lakes, glowing suns, layered atmospheric mist.',
    tagline: 'Scenic vistas & mountain horizons',
    badge: 'Classic',
    previewGradient: 'from-amber-600 via-rose-500 to-indigo-900',
  },
  {
    id: 'minimalist',
    label: 'Minimalist',
    category: 'Popular',
    description: 'Clean negative space, subtle aura blooms, precise geometric zen silhouettes.',
    tagline: 'Pure clarity & refined negative space',
    badge: 'Essential',
    previewGradient: 'from-slate-700 via-zinc-800 to-slate-900',
  },
  {
    id: 'halloween',
    label: 'Halloween',
    category: 'Artistic',
    description: 'Gothic nightscapes, glowing jack-o\'-lanterns, silhouetted haunted castles, bats & eerie mist.',
    tagline: 'Spooky ambiance, pumpkins & full moon',
    badge: 'Thematic',
    previewGradient: 'from-purple-950 via-orange-600 to-amber-500',
  },
  {
    id: 'cyberpunk',
    label: 'Cyberpunk',
    category: 'Sci-Fi & Cyber',
    description: 'Neon drenched city skyline, rain wet reflections, glowing holographic grids & cyber vibes.',
    tagline: 'High-tech neon noir & cyber grids',
    badge: 'High Impact',
    previewGradient: 'from-fuchsia-600 via-purple-700 to-cyan-400',
  },
  {
    id: 'natural',
    label: 'Natural',
    category: 'Nature & Mood',
    description: 'Lush botanical foliage, macro dew droplets, soothing sand dunes & organic forest ripples.',
    tagline: 'Botanical foliage & organic serenity',
    previewGradient: 'from-emerald-800 via-teal-600 to-lime-400',
  },
  {
    id: 'scifi',
    label: 'Sci-Fi Space',
    category: 'Sci-Fi & Cyber',
    description: 'Deep cosmic nebulae, planetary ring systems, warp-speed starfields & alien celestial worlds.',
    tagline: 'Cosmic nebulae & planetary rings',
    previewGradient: 'from-indigo-950 via-blue-800 to-cyan-400',
  },
  {
    id: 'synthwave',
    label: 'Retro Synthwave',
    category: 'Sci-Fi & Cyber',
    description: '80s outrun wireframe mountains, glowing neon horizon sun, retro palm silhouettes & laser grids.',
    tagline: '80s retro outrun & sunset grid',
    previewGradient: 'from-pink-600 via-purple-800 to-amber-400',
  },
  {
    id: 'anime',
    label: 'Anime / Ghibli',
    category: 'Artistic',
    description: 'Painterly cumulus clouds, grassy hills, floating celestial islands & nostalgic golden hour skies.',
    tagline: 'Painterly clouds & nostalgic horizons',
    previewGradient: 'from-sky-400 via-blue-500 to-emerald-400',
  },
  {
    id: 'glassmorphism',
    label: '3D Glassmorphism',
    category: 'Artistic',
    description: 'Translucent frosted glass orbs, floating geometric prisms, realistic caustic light refractions.',
    tagline: 'Frosted prisms & translucent orbs',
    previewGradient: 'from-cyan-400 via-indigo-500 to-purple-600',
  },
  {
    id: 'oled-dark',
    label: 'OLED Pure Dark',
    category: 'Popular',
    description: 'True 100% black background with sleek minimalist neon edge accents & zero battery drain.',
    tagline: 'True deep black with neon edges',
    badge: 'Battery Saver',
    previewGradient: 'from-black via-zinc-900 to-indigo-950',
  },
  {
    id: 'geometric',
    label: 'Geometric Bauhaus',
    category: 'Artistic',
    description: 'Intersecting circles, bold diagonal vectors, modern architectural color blocks & rhythms.',
    tagline: 'Modern architectural forms & bold cuts',
    previewGradient: 'from-rose-600 via-amber-500 to-sky-600',
  },
  {
    id: 'watercolor',
    label: 'Watercolor Art',
    category: 'Artistic',
    description: 'Flowing wet pigment washes, soft ink bleeds, pastel splashes & paper grain texture.',
    tagline: 'Fluid pigments & painterly ink bleeds',
    previewGradient: 'from-rose-400 via-amber-300 to-teal-300',
  },
];

export interface LightingOption {
  id: LightingMood;
  label: string;
  description: string;
  iconName: string;
}

export const LIGHTING_MOODS: LightingOption[] = [
  {
    id: 'cinematic',
    label: 'Cinematic Drama',
    description: 'Rich deep shadows, dramatic highlights, movie-grade contrast',
    iconName: 'Clapperboard',
  },
  {
    id: 'golden-hour',
    label: 'Golden Hour',
    description: 'Warm sunset amber glow, soft long shadows, honey lighting',
    iconName: 'Sun',
  },
  {
    id: 'moonlight',
    label: 'Moonlight Glow',
    description: 'Cool indigo night illumination, silvery lunar rays, twilight',
    iconName: 'Moon',
  },
  {
    id: 'neon-glow',
    label: 'Cyber Neon Pulse',
    description: 'Vibrant electric highlights, bioluminescent glow, hyper-saturation',
    iconName: 'Zap',
  },
  {
    id: 'soft-ambient',
    label: 'Soft Ambient',
    description: 'Diffused studio lighting, gentle gradients, balanced soft tones',
    iconName: 'Sparkles',
  },
  {
    id: 'high-contrast',
    label: 'High Contrast',
    description: 'Bold crisp edges, punchy stark transitions, vibrant punch',
    iconName: 'Sliders',
  },
  {
    id: 'ethereal-mist',
    label: 'Ethereal Mist',
    description: 'Dreamy soft focus, atmospheric haze, subtle pastel diffusion',
    iconName: 'Cloud',
  },
  {
    id: 'vibrant-day',
    label: 'Vibrant Daylight',
    description: 'Crisp clear daylight, cheerful luminous saturation, crisp clarity',
    iconName: 'SunMedium',
  },
];
