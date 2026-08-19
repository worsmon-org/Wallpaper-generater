import React, { useState } from 'react';
import { X, Download, Check, Sparkles, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import { WallpaperConfig, ExportSettings } from '../types';
import { downloadWallpaper } from '../utils/wallpaperEngine';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: WallpaperConfig;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  config,
}) => {
  const [format, setFormat] = useState<'jpg' | 'png' | 'webp'>('jpg');
  const [quality, setQuality] = useState<number>(0.96);
  const [exportResMode, setExportResMode] = useState<'current' | 'fhd' | '2k' | '4k' | '8k'>('current');
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const isMobile = config.deviceType === 'mobile';

  const getTargetDimensions = () => {
    switch (exportResMode) {
      case 'fhd':
        return isMobile ? { width: 1080, height: 1920 } : { width: 1920, height: 1080 };
      case '2k':
        return isMobile ? { width: 1440, height: 2560 } : { width: 2560, height: 1440 };
      case '4k':
        return isMobile ? { width: 2160, height: 3840 } : { width: 3840, height: 2160 };
      case '8k':
        return isMobile ? { width: 4320, height: 7680 } : { width: 7680, height: 4320 };
      case 'current':
      default:
        return { width: config.resolution.width, height: config.resolution.height };
    }
  };

  const targetDim = getTargetDimensions();

  const handleExport = async () => {
    setIsExporting(true);
    setDownloadSuccess(false);
    try {
      await downloadWallpaper(config, format, quality, targetDim);
      setDownloadSuccess(true);
      setTimeout(() => {
        setDownloadSuccess(false);
      }, 3500);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Export Wallpaper
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                EHSAAN ULLAH Generator • High Resolution Export
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

        {/* 1. Format Selection (JPG is highlighted as required by user) */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Export Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setFormat('jpg')}
              className={`py-3 px-3 rounded-xl border text-center font-bold text-xs sm:text-sm transition-all flex flex-col items-center gap-1 ${
                format === 'jpg'
                  ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/30'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <span className="text-sm sm:text-base font-extrabold">JPG (Recommended)</span>
              <span className="text-[10px] font-normal text-zinc-500 dark:text-zinc-400">
                Optimal Wallpaper Size
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFormat('png')}
              className={`py-3 px-3 rounded-xl border text-center font-bold text-xs sm:text-sm transition-all flex flex-col items-center gap-1 ${
                format === 'png'
                  ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/30'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <span className="text-sm sm:text-base font-extrabold">PNG</span>
              <span className="text-[10px] font-normal text-zinc-500 dark:text-zinc-400">Lossless Raw</span>
            </button>

            <button
              type="button"
              onClick={() => setFormat('webp')}
              className={`py-3 px-3 rounded-xl border text-center font-bold text-xs sm:text-sm transition-all flex flex-col items-center gap-1 ${
                format === 'webp'
                  ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/30'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <span className="text-sm sm:text-base font-extrabold">WebP</span>
              <span className="text-[10px] font-normal text-zinc-500 dark:text-zinc-400">Modern Compact</span>
            </button>
          </div>
        </div>

        {/* 2. Output Resolution Options */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
            <span>Export Resolution</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-mono">
              {targetDim.width} × {targetDim.height} PX
            </span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'current', label: 'Preset Match', desc: `${config.resolution.width}×${config.resolution.height}` },
              { id: 'fhd', label: '1080p FHD', desc: isMobile ? '1080×1920' : '1920×1080' },
              { id: '4k', label: '4K Ultra HD', desc: isMobile ? '2160×3840' : '3840×2160' },
              { id: '8k', label: '8K Ultra-Res', desc: isMobile ? '4320×7680' : '7680×4320' },
            ].map((res) => {
              const isSelected = exportResMode === res.id;
              return (
                <button
                  key={res.id}
                  type="button"
                  onClick={() => setExportResMode(res.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                  }`}
                >
                  <p className="text-xs font-bold">{res.label}</p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400">{res.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. JPG Quality Slider (when JPG is selected) */}
        {format === 'jpg' && (
          <div className="space-y-1.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60">
            <div className="flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              <span>JPEG Compression Quality</span>
              <span>{Math.round(quality * 100)}% (Ultra Crisp)</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.0"
              step="0.02"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        )}

        {/* Download Success Notice */}
        {downloadSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300 text-xs font-semibold animate-in fade-in">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Wallpaper exported and downloaded successfully!</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Close
          </button>

          <button
            id="btn-confirm-export"
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-500/25 active:scale-95 transition-all disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Generating {targetDim.width}×{targetDim.height} JPG...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export & Download {format.toUpperCase()}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
