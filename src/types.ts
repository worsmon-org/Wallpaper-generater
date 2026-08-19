export type DeviceType = 'mobile' | 'desktop' | 'tablet';

export type AspectRatio = '9:16' | '16:9' | '21:9' | '3:4' | '1:1';

export interface ResolutionPreset {
  id: string;
  name: string;
  device: DeviceType;
  width: number;
  height: number;
  aspectRatio: AspectRatio;
  description: string;
}

export type WallpaperStyle =
  | 'abstract'
  | 'landscape'
  | 'minimalist'
  | 'halloween'
  | 'cyberpunk'
  | 'natural'
  | 'scifi'
  | 'synthwave'
  | 'anime'
  | 'glassmorphism'
  | 'oled-dark'
  | 'geometric'
  | 'watercolor';

export type ThemeMode = 'dark' | 'light';

export type LightingMood =
  | 'cinematic'
  | 'golden-hour'
  | 'moonlight'
  | 'neon-glow'
  | 'soft-ambient'
  | 'high-contrast'
  | 'ethereal-mist'
  | 'vibrant-day';

export interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
  category: 'dark' | 'light' | 'vibrant' | 'pastel' | 'neon' | 'earthy' | 'custom';
}

export interface FilterAdjustments {
  brightness: number; // -50 to 50
  contrast: number; // -50 to 50
  saturation: number; // -50 to 50
  blur: number; // 0 to 20
  grain: number; // 0 to 100
  vignette: number; // 0 to 100
  patternScale: number; // 50 to 200
  complexity: number; // 1 to 10
  seed: number;
}

export interface WallpaperConfig {
  id: string;
  title: string;
  deviceType: DeviceType;
  resolution: ResolutionPreset;
  style: WallpaperStyle;
  theme: ThemeMode;
  lightingMood: LightingMood;
  palette: ColorPalette;
  userPrompt: string;
  filters: FilterAdjustments;
  generationMode: 'procedural' | 'ai';
  aiImageUrl?: string;
  createdAt: number;
}

export type PreviewMockupMode = 'none' | 'mobile-mockup' | 'desktop-mockup';

export interface ExportSettings {
  format: 'jpg' | 'png' | 'webp';
  quality: number; // 0.6 to 1.0
  customWidth?: number;
  customHeight?: number;
  filename: string;
}
