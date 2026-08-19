import React from 'react';
import { X, Bookmark, Trash2, Download, ExternalLink, Sparkles } from 'lucide-react';
import { WallpaperConfig } from '../types';

interface SavedGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedWallpapers: WallpaperConfig[];
  onLoadWallpaper: (config: WallpaperConfig) => void;
  onDeleteSaved: (id: string) => void;
}

export const SavedGalleryModal: React.FC<SavedGalleryModalProps> = ({
  isOpen,
  onClose,
  savedWallpapers,
  onLoadWallpaper,
  onDeleteSaved,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 space-y-5 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-md">
              <Bookmark className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Saved Wallpaper Vault ({savedWallpapers.length})
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Click any saved wallpaper to reload and customize it
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto pr-1">
          {savedWallpapers.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 dark:text-zinc-400 space-y-2">
              <Bookmark className="w-8 h-8 mx-auto opacity-40" />
              <p className="text-sm font-semibold">No saved wallpapers yet</p>
              <p className="text-xs">Click the "Save" button in the top bar to bookmark your favorite art.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {savedWallpapers.map((saved) => (
                <div
                  key={saved.id}
                  className="group relative p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 capitalize">
                        {saved.style} ({saved.deviceType})
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                        {saved.theme.toUpperCase()}
                      </span>
                    </div>

                    {/* Color Swatch Preview */}
                    <div className="flex h-3.5 rounded-md overflow-hidden border border-black/10">
                      {saved.palette.colors.map((c, i) => (
                        <div key={i} className="flex-1 h-full" style={{ backgroundColor: c }} />
                      ))}
                    </div>

                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                      {saved.resolution.name} • {saved.palette.name}
                    </p>
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-200/60 dark:border-zinc-700/60">
                    <button
                      type="button"
                      onClick={() => {
                        onLoadWallpaper(saved);
                        onClose();
                      }}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Load Studio</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteSaved(saved.id)}
                      className="p-1 text-zinc-400 hover:text-rose-500 transition-colors"
                      title="Delete from vault"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
