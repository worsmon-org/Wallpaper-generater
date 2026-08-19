import React from 'react';
import { Sparkles, Download, Shuffle, Bookmark, Wand2, Image as ImageIcon } from 'lucide-react';
import { WallpaperConfig } from '../types';

interface HeaderProps {
  config: WallpaperConfig;
  onRandomize: () => void;
  onOpenExport: () => void;
  onOpenAiModal: () => void;
  onOpenSavedModal: () => void;
  onSaveToGallery: () => void;
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
  isSaved,
  savedCount,
}) => {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* App Title & Branding */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 truncate">
                EHSAAN ULLAH
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 shrink-0">
                Wallpaper Generator
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block truncate">
              {config.deviceType.toUpperCase()} • {config.resolution.width}×{config.resolution.height} • {config.style.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Randomize / Surprise me */}
          <button
            id="btn-randomize"
            onClick={onRandomize}
            title="Surprise me with a new combination"
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-colors"
          >
            <Shuffle className="w-4 h-4 text-purple-500" />
            <span className="hidden sm:inline">Surprise Me</span>
          </button>

          {/* AI Generator Button */}
          <button
            id="btn-open-ai-modal"
            onClick={onOpenAiModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 transition-colors"
          >
            <Wand2 className="w-4 h-4 text-indigo-500" />
            <span className="hidden md:inline">AI Studio</span>
          </button>

          {/* Save to Collection */}
          <button
            id="btn-save-gallery"
            onClick={onSaveToGallery}
            title="Save to favorites"
            className={`p-2 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
              isSaved
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300'
                : 'border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span className="hidden lg:inline">{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          {/* Saved Vault Button */}
          {savedCount > 0 && (
            <button
              id="btn-view-saved-modal"
              onClick={onOpenSavedModal}
              title="View saved wallpapers"
              className="p-2 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
            >
              <ImageIcon className="w-4 h-4 text-emerald-500" />
              <span className="hidden md:inline">Vault ({savedCount})</span>
            </button>
          )}

          {/* Export as JPG Primary CTA */}
          <button
            id="btn-header-export-jpg"
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export as JPG</span>
          </button>
        </div>
      </div>
    </header>
  );
};
