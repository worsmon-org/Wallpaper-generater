import { ResolutionPreset } from '../types';

export const RESOLUTION_PRESETS: ResolutionPreset[] = [
  // Mobile Presets
  {
    id: 'mobile-fhd',
    name: 'Standard Mobile FHD',
    device: 'mobile',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    description: '1080 × 1920 (9:16) • Standard Android / iPhone',
  },
  {
    id: 'mobile-iphone-pro',
    name: 'iPhone 16 Pro Max',
    device: 'mobile',
    width: 1320,
    height: 2868,
    aspectRatio: '9:16',
    description: '1320 × 2868 • Retina OLED HDR Display',
  },
  {
    id: 'mobile-galaxy-ultra',
    name: 'Samsung Galaxy Ultra',
    device: 'mobile',
    width: 1440,
    height: 3120,
    aspectRatio: '9:16',
    description: '1440 × 3120 • Quad HD+ AMOLED',
  },
  {
    id: 'mobile-4k',
    name: 'Mobile 4K Ultra',
    device: 'mobile',
    width: 2160,
    height: 3840,
    aspectRatio: '9:16',
    description: '2160 × 3840 • Ultra-Res 4K Vertical',
  },

  // Desktop Presets
  {
    id: 'desktop-fhd',
    name: 'Full HD Desktop',
    device: 'desktop',
    width: 1920,
    height: 1080,
    aspectRatio: '16:9',
    description: '1920 × 1080 (16:9) • Standard 1080p Monitor',
  },
  {
    id: 'desktop-2k-qhd',
    name: '2K QHD Desktop',
    device: 'desktop',
    width: 2560,
    height: 1440,
    aspectRatio: '16:9',
    description: '2560 × 1440 (16:9) • High-Res 1440p Monitor',
  },
  {
    id: 'desktop-4k-uhd',
    name: '4K Ultra HD Desktop',
    device: 'desktop',
    width: 3840,
    height: 2160,
    aspectRatio: '16:9',
    description: '3840 × 2160 (16:9) • 4K UHD Crisp Canvas',
  },
  {
    id: 'desktop-ultrawide',
    name: 'Ultrawide 21:9',
    device: 'desktop',
    width: 3440,
    height: 1440,
    aspectRatio: '21:9',
    description: '3440 × 1440 (21:9) • Panoramic Ultrawide Display',
  },

  // Tablet Preset
  {
    id: 'tablet-ipad',
    name: 'Tablet / iPad Pro',
    device: 'tablet',
    width: 2048,
    height: 2732,
    aspectRatio: '3:4',
    description: '2048 × 2732 (3:4) • iPad / Tablet Retina Display',
  },
];
