import React from 'react';
import { Sparkles, Download, Shuffle, Bookmark, Wand2, Image as ImageIcon, Moon, Sun } from 'lucide-react';
import { WallpaperConfig, ThemeMode } from '../types';

interface HeaderProps {
  config: WallpaperConfig;
  onRandomize: () => void;
  onOpenExport: () => void;
  onOpenAiModal: () => void;
  onOpenSavedModal: () => void;
  onSaveToGallery: () => void;
  onToggleTheme: (theme: ThemeMode) => void;
  isSaved: boolean;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  onRandomize,
  onOpenExport,
  onOpenAiModal,
  onOpenSavedModal,
  onSaveToGallery,
  onToggleTheme,
  isSaved,
  savedCount,
}) => {
  return (
    <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 sm:px-8 bg-[#0F1117] sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
        {/* App Title & Branding */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
            <span className="text-white font-black text-xs tracking-tighter">EU</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base md:text-lg font-black tracking-widest text-white uppercase truncate">
                EHSAAN ULLAH
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shrink-0 hidden sm:inline-block">
                Generator
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-mono tracking-tight hidden md:block truncate">
              {config.deviceType.toUpperCase()} • {config.resolution.width}×{config.resolution.height} • {config.style.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Quick Actions & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Header Theme Switch Pill */}
          <div className="flex bg-[#1A1D23] p-1 rounded-full border border-white/5">
            <button
              id="header-btn-theme-dark"
              type="button"
              onClick={() => onToggleTheme('dark')}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all flex items-center gap-1 ${
                config.theme === 'dark'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20 font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Moon className="w-3 h-3" />
              <span>DARK</span>
            </button>
            <button
              id="header-btn-theme-light"
              type="button"
              onClick={() => onToggleTheme('light')}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all flex items-center gap-1 ${
                config.theme === 'light'
                  ? 'bg-white text-black shadow-md font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sun className="w-3 h-3" />
              <span>LIGHT</span>
            </button>
          </div>

          {/* Randomize / Surprise me */}
          <button
            id="btn-randomize"
            onClick={onRandomize}
            title="Surprise me with a new combination"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg text-gray-300 bg-[#1A1D23] hover:bg-[#252A33] border border-white/10 transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden lg:inline">Randomize</span>
          </button>

          {/* AI Generator Button */}
          <button
            id="btn-open-ai-modal"
            onClick={onOpenAiModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-colors"
          >
            <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">AI Studio</span>
          </button>

          {/* Save to Collection */}
          <button
            id="btn-save-gallery"
            onClick={onSaveToGallery}
            title="Save to favorites"
            className={`p-2 sm:px-3 sm:py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
              isSaved
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                : 'bg-[#1A1D23] border-white/10 text-gray-300 hover:bg-[#252A33]'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-purple-400 text-purple-400' : ''}`} />
            <span className="hidden xl:inline">{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          {/* Saved Vault Button */}
          {savedCount > 0 && (
            <button
              id="btn-view-saved-modal"
              onClick={onOpenSavedModal}
              title="View saved wallpapers"
              className="p-2 sm:px-3 sm:py-2 text-xs font-semibold rounded-lg border border-white/10 bg-[#1A1D23] text-gray-300 hover:bg-[#252A33] transition-colors flex items-center gap-1.5"
            >
              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Vault ({savedCount})</span>
            </button>
          )}

          {/* Export as JPG Primary CTA (Sleek High-Contrast White Pill) */}
          <button
            id="btn-header-export-jpg"
            onClick={onOpenExport}
            className="bg-white text-black px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-black tracking-wider hover:bg-gray-200 transition-colors flex items-center gap-1.5 shadow-lg active:scale-95"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>EXPORT JPG</span>
          </button>
        </div>
      </div>
    </header>
  );
};

