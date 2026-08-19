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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0F1117] border border-white/10 shadow-2xl p-6 space-y-5 text-[#E0E0E0]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500 text-black flex items-center justify-center font-bold shadow-lg shadow-cyan-500/20">
              <Download className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Export Wallpaper
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                EHSAAN ULLAH • High Resolution Rendering Engine
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

        {/* 1. Format Selection */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block">
            Export Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setFormat('jpg')}
              className={`py-3 px-3 rounded-xl border text-center font-bold text-xs sm:text-sm transition-all flex flex-col items-center gap-1 ${
                format === 'jpg'
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-500/30'
                  : 'border-white/5 bg-[#1A1D23] text-gray-300 hover:bg-[#252A33]'
              }`}
            >
              <span className="text-sm font-bold">JPG (Target)</span>
              <span className="text-[10px] font-normal text-gray-400">
                Optimized Size
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFormat('png')}
              className={`py-3 px-3 rounded-xl border text-center font-bold text-xs sm:text-sm transition-all flex flex-col items-center gap-1 ${
                format === 'png'
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-500/30'
                  : 'border-white/5 bg-[#1A1D23] text-gray-300 hover:bg-[#252A33]'
              }`}
            >
              <span className="text-sm font-bold">PNG</span>
              <span className="text-[10px] font-normal text-gray-400">Lossless Raw</span>
            </button>

            <button
              type="button"
              onClick={() => setFormat('webp')}
              className={`py-3 px-3 rounded-xl border text-center font-bold text-xs sm:text-sm transition-all flex flex-col items-center gap-1 ${
                format === 'webp'
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-500/30'
                  : 'border-white/5 bg-[#1A1D23] text-gray-300 hover:bg-[#252A33]'
              }`}
            >
              <span className="text-sm font-bold">WebP</span>
              <span className="text-[10px] font-normal text-gray-400">Next-Gen Compact</span>
            </button>
          </div>
        </div>

        {/* 2. Output Resolution Options */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center justify-between">
            <span>Target Resolution</span>
            <span className="text-cyan-400 font-mono">
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
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300'
                      : 'border-white/5 bg-[#1A1D23] text-gray-300 hover:bg-[#252A33]'
                  }`}
                >
                  <p className="text-xs font-bold">{res.label}</p>
                  <p className="text-[10px] font-mono text-gray-400">{res.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. JPG Quality Slider */}
        {format === 'jpg' && (
          <div className="space-y-1.5 p-3 rounded-lg bg-[#1A1D23] border border-white/5">
            <div className="flex justify-between text-xs font-semibold text-gray-300">
              <span>JPEG Quality Level</span>
              <span className="font-mono text-cyan-400">{Math.round(quality * 100)}% (Ultra Crisp)</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.0"
              step="0.02"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full h-1.5 bg-[#0F1117] rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        )}

        {/* Download Success Notice */}
        {downloadSuccess && (
          <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/40 flex items-center gap-2.5 text-cyan-300 text-xs font-semibold animate-in fade-in">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Wallpaper exported and downloaded successfully!</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg border border-white/10 text-xs font-bold text-gray-300 hover:bg-[#1A1D23] transition-colors"
          >
            Cancel
          </button>

          <button
            id="btn-confirm-export"
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white hover:bg-gray-200 text-black text-xs font-black tracking-wide shadow-lg active:scale-95 transition-all disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Sparkles className="w-4 h-4 text-cyan-500 animate-spin" />
                <span>Exporting {targetDim.width}×{targetDim.height} JPG...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>EXPORT & DOWNLOAD {format.toUpperCase()}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
