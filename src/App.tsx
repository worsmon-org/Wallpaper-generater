import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Download,
  Dices,
  Smartphone,
  Monitor,
  Wand2,
  Bookmark,
  Share2,
  RefreshCw,
  Sliders,
  Palette,
  Eye,
} from 'lucide-react';
import {
  WallpaperConfig,
  DeviceType,
  WallpaperStyle,
  ThemeMode,
  LightingMood,
  ColorPalette,
  ResolutionPreset,
  FilterAdjustments,
  PreviewMockupMode,
} from './types';
import { RESOLUTION_PRESETS } from './constants/devices';
import { DEFAULT_PALETTES } from './constants/palettes';
import { WALLPAPER_STYLES } from './constants/styles';
import { Header } from './components/Header';
import { DeviceSelector } from './components/DeviceSelector';
import { StyleSelector } from './components/StyleSelector';
import { PaletteSelector } from './components/PaletteSelector';
import { ThemeSelector } from './components/ThemeSelector';
import { AdjustmentPanel } from './components/AdjustmentPanel';
import { PreviewCanvas } from './components/PreviewCanvas';
import { ExportModal } from './components/ExportModal';
import { AiGenerationModal } from './components/AiGenerationModal';
import { SavedGalleryModal } from './components/SavedGalleryModal';
import { downloadWallpaper } from './utils/wallpaperEngine';

const INITIAL_FILTERS: FilterAdjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  blur: 0,
  grain: 15,
  vignette: 25,
  patternScale: 100,
  complexity: 6,
  seed: 48291,
};

export default function App() {
  // Current active configuration
  const [config, setConfig] = useState<WallpaperConfig>(() => ({
    id: `wp-${Date.now()}`,
    title: 'EHSAAN ULLAH Wallpaper',
    deviceType: 'mobile',
    resolution: RESOLUTION_PRESETS[0], // Mobile FHD 1080x1920
    style: 'abstract',
    theme: 'dark',
    lightingMood: 'cinematic',
    palette: DEFAULT_PALETTES[0], // Cyberpunk Neon
    userPrompt: '',
    filters: INITIAL_FILTERS,
    generationMode: 'procedural',
    createdAt: Date.now(),
  }));

  // Preview Mockup Mode
  const [mockupMode, setMockupMode] = useState<PreviewMockupMode>('mobile-mockup');

  // Modals state
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  // Saved Wallpapers state
  const [savedWallpapers, setSavedWallpapers] = useState<WallpaperConfig[]>(() => {
    try {
      const stored = localStorage.getItem('ehsaan_saved_wallpapers');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync theme to root html element for Tailwind dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (config.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [config.theme]);

  // Persist saved wallpapers
  useEffect(() => {
    try {
      localStorage.setItem('ehsaan_saved_wallpapers', JSON.stringify(savedWallpapers));
    } catch (e) {
      console.error('Failed to save wallpapers to localStorage', e);
    }
  }, [savedWallpapers]);

  // Handlers for device selection
  const handleSelectDevice = (device: DeviceType) => {
    const defaultRes =
      RESOLUTION_PRESETS.find((p) => p.device === device) || RESOLUTION_PRESETS[0];
    setConfig((prev) => ({
      ...prev,
      deviceType: device,
      resolution: defaultRes,
      generationMode: 'procedural',
      aiImageUrl: undefined,
    }));
    // Auto-switch mockup frame based on device selection
    if (device === 'mobile') {
      setMockupMode('mobile-mockup');
    } else if (device === 'desktop') {
      setMockupMode('desktop-mockup');
    } else {
      setMockupMode('none');
    }
  };

  const handleSelectResolution = (preset: ResolutionPreset) => {
    setConfig((prev) => ({
      ...prev,
      resolution: preset,
    }));
  };

  // Style change
  const handleSelectStyle = (style: WallpaperStyle) => {
    setConfig((prev) => ({
      ...prev,
      style,
      generationMode: 'procedural',
      aiImageUrl: undefined,
      filters: {
        ...prev.filters,
        seed: Math.floor(Math.random() * 900000) + 10000,
      },
    }));
  };

  // Palette change
  const handleSelectPalette = (palette: ColorPalette) => {
    setConfig((prev) => ({
      ...prev,
      palette,
    }));
  };

  const handleUpdateCustomColors = (colors: string[]) => {
    setConfig((prev) => ({
      ...prev,
      palette: {
        id: `custom-${Date.now()}`,
        name: 'Custom Palette',
        category: 'custom',
        colors,
      },
    }));
  };

  // Theme & Lighting Mood
  const handleSelectTheme = (theme: ThemeMode) => {
    setConfig((prev) => ({
      ...prev,
      theme,
    }));
  };

  const handleSelectLightingMood = (mood: LightingMood) => {
    setConfig((prev) => ({
      ...prev,
      lightingMood: mood,
    }));
  };

  // Filter adjustments
  const handleChangeFilters = (filters: FilterAdjustments) => {
    setConfig((prev) => ({
      ...prev,
      filters,
    }));
  };

  // Reroll procedural seed
  const handleRollNewSeed = () => {
    setConfig((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        seed: Math.floor(Math.random() * 900000) + 10000,
      },
    }));
  };

  // Randomize all settings (Surprise Me)
  const handleRandomize = useCallback(() => {
    const randomStyle = WALLPAPER_STYLES[Math.floor(Math.random() * WALLPAPER_STYLES.length)].id;
    const randomPalette = DEFAULT_PALETTES[Math.floor(Math.random() * DEFAULT_PALETTES.length)];
    const randomTheme: ThemeMode = Math.random() > 0.4 ? 'dark' : 'light';
    const moods: LightingMood[] = [
      'cinematic',
      'golden-hour',
      'moonlight',
      'neon-glow',
      'soft-ambient',
      'high-contrast',
    ];
    const randomMood = moods[Math.floor(Math.random() * moods.length)];

    setConfig((prev) => ({
      ...prev,
      style: randomStyle,
      palette: randomPalette,
      theme: randomTheme,
      lightingMood: randomMood,
      generationMode: 'procedural',
      aiImageUrl: undefined,
      filters: {
        ...prev.filters,
        seed: Math.floor(Math.random() * 900000) + 10000,
        complexity: Math.floor(Math.random() * 6) + 4,
        grain: Math.floor(Math.random() * 25) + 5,
        vignette: Math.floor(Math.random() * 35) + 10,
      },
    }));
  }, []);

  // Quick export JPG directly
  const handleQuickExportJpg = async () => {
    try {
      await downloadWallpaper(config, 'jpg', 0.96);
    } catch (err) {
      console.error('Quick JPG export error:', err);
    }
  };

  // Save/Unsave to collection
  const isCurrentlySaved = savedWallpapers.some((w) => w.id === config.id);

  const handleToggleSaveToGallery = () => {
    if (isCurrentlySaved) {
      setSavedWallpapers((prev) => prev.filter((w) => w.id !== config.id));
    } else {
      const newSaved: WallpaperConfig = {
        ...config,
        id: `saved-${Date.now()}`,
        createdAt: Date.now(),
      };
      setSavedWallpapers((prev) => [newSaved, ...prev]);
    }
  };

  const handleLoadSavedWallpaper = (saved: WallpaperConfig) => {
    setConfig(saved);
    if (saved.deviceType === 'mobile') {
      setMockupMode('mobile-mockup');
    } else if (saved.deviceType === 'desktop') {
      setMockupMode('desktop-mockup');
    } else {
      setMockupMode('none');
    }
  };

  const handleDeleteSaved = (id: string) => {
    setSavedWallpapers((prev) => prev.filter((w) => w.id !== id));
  };

  // Apply AI Image
  const handleApplyAiImage = (imageUrl: string, enhancedPrompt: string) => {
    setConfig((prev) => ({
      ...prev,
      generationMode: 'ai',
      aiImageUrl: imageUrl,
      userPrompt: enhancedPrompt,
    }));
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation Bar */}
      <Header
        config={config}
        onRandomize={handleRandomize}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
        onSaveToGallery={handleToggleSaveToGallery}
        isSaved={isCurrentlySaved}
        savedCount={savedWallpapers.length}
      />

      {/* Main Workspace Layout: Controls on Left / Preview Canvas on Right */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Control Studio (5 cols on lg) */}
        <div className="lg:col-span-6 xl:col-span-5 space-y-6">
          <div className="bg-white dark:bg-zinc-900/90 rounded-2xl p-5 sm:p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6 backdrop-blur-sm">
            {/* 1. Device Selector (Mobile vs Desktop) */}
            <DeviceSelector
              deviceType={config.deviceType}
              selectedResolution={config.resolution}
              onSelectDevice={handleSelectDevice}
              onSelectResolution={handleSelectResolution}
            />

            <hr className="border-zinc-100 dark:border-zinc-800/80" />

            {/* 2. Style Selector (Abstract, Landscape, Minimalist, Halloween, Cyberpunk, Natural, Sci-Fi, etc.) */}
            <StyleSelector
              selectedStyle={config.style}
              onSelectStyle={handleSelectStyle}
            />

            <hr className="border-zinc-100 dark:border-zinc-800/80" />

            {/* 3. Color Palettes (Presets + Customizer + AI Suggestion) */}
            <PaletteSelector
              selectedPalette={config.palette}
              currentStyle={config.style}
              onSelectPalette={handleSelectPalette}
              onUpdateCustomColors={handleUpdateCustomColors}
            />

            <hr className="border-zinc-100 dark:border-zinc-800/80" />

            {/* 4. Theme Mode (Dark & Light) & Lighting Mood */}
            <ThemeSelector
              theme={config.theme}
              lightingMood={config.lightingMood}
              onSelectTheme={handleSelectTheme}
              onSelectLightingMood={handleSelectLightingMood}
            />

            <hr className="border-zinc-100 dark:border-zinc-800/80" />

            {/* 5. Texture & Refinement Sliders */}
            <AdjustmentPanel
              filters={config.filters}
              onChangeFilters={handleChangeFilters}
              onRollNewSeed={handleRollNewSeed}
            />

            {/* Main Export Action Bar */}
            <div className="pt-2">
              <button
                id="btn-main-export-jpg"
                type="button"
                onClick={() => setIsExportOpen(true)}
                className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-white font-bold text-sm sm:text-base bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all"
              >
                <Download className="w-5 h-5" />
                <span>Export as JPG ({config.resolution.width} × {config.resolution.height})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live High-Resolution Preview Canvas (7 cols on lg) */}
        <div className="lg:col-span-6 xl:col-span-7 sticky top-20">
          <div className="h-[620px] sm:h-[720px] lg:h-[780px] w-full">
            <PreviewCanvas
              config={config}
              mockupMode={mockupMode}
              onChangeMockupMode={setMockupMode}
              onRollNewSeed={handleRollNewSeed}
              onQuickExportJpg={() => setIsExportOpen(true)}
            />
          </div>
        </div>
      </main>

      {/* Export as JPG Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        config={config}
      />

      {/* AI Generative Studio Modal */}
      <AiGenerationModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        config={config}
        onApplyAiImage={handleApplyAiImage}
      />

      {/* Saved Wallpapers Vault Modal */}
      <SavedGalleryModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedWallpapers={savedWallpapers}
        onLoadWallpaper={handleLoadSavedWallpaper}
        onDeleteSaved={handleDeleteSaved}
      />
    </div>
  );
}
