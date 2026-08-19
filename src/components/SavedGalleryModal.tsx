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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0F1117] border border-white/10 shadow-2xl p-6 space-y-5 max-h-[85vh] flex flex-col text-[#E0E0E0]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500 text-black flex items-center justify-center font-bold shadow-lg shadow-cyan-500/20">
              <Bookmark className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Saved Wallpaper Vault ({savedWallpapers.length})
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                Click any saved wallpaper to reload and customize it
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1A1D23] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto pr-1">
          {savedWallpapers.length === 0 ? (
            <div className="py-12 text-center text-gray-400 space-y-2">
              <Bookmark className="w-8 h-8 mx-auto opacity-40 text-cyan-400" />
              <p className="text-sm font-bold text-white">No saved wallpapers yet</p>
              <p className="text-xs font-mono">Click the "Save" button in the top bar to bookmark your favorite art.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {savedWallpapers.map((saved) => (
                <div
                  key={saved.id}
                  className="group relative p-3.5 rounded-xl border border-white/10 bg-[#1A1D23] hover:border-cyan-500/50 hover:bg-[#252A33] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white capitalize">
                        {saved.style} ({saved.deviceType})
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 text-cyan-400 border border-white/5 font-bold">
                        {saved.theme.toUpperCase()}
                      </span>
                    </div>

                    {/* Color Swatch Preview */}
                    <div className="flex h-3 rounded-md overflow-hidden border border-black/30">
                      {saved.palette.colors.map((c, i) => (
                        <div key={i} className="flex-1 h-full" style={{ backgroundColor: c }} />
                      ))}
                    </div>

                    <p className="text-[11px] font-mono text-gray-400 truncate">
                      {saved.resolution.name} • {saved.palette.name}
                    </p>
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => {
                        onLoadWallpaper(saved);
                        onClose();
                      }}
                      className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Load in Studio</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteSaved(saved.id)}
                      className="p-1 text-gray-400 hover:text-rose-400 transition-colors"
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
