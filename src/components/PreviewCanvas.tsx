import React, { useEffect, useRef, useState } from 'react';
import {
  Download,
  Dices,
  Maximize2,
  Minimize2,
  Smartphone,
  Monitor,
  Eye,
  Camera,
  Flashlight,
  Wifi,
  Battery,
  Sparkles,
} from 'lucide-react';
import { WallpaperConfig, PreviewMockupMode } from '../types';
import { renderWallpaperToCanvas } from '../utils/wallpaperEngine';

interface PreviewCanvasProps {
  config: WallpaperConfig;
  mockupMode: PreviewMockupMode;
  onChangeMockupMode: (mode: PreviewMockupMode) => void;
  onRollNewSeed: () => void;
  onQuickExportJpg: () => void;
}

export const PreviewCanvas: React.FC<PreviewCanvasProps> = ({
  config,
  mockupMode,
  onChangeMockupMode,
  onRollNewSeed,
  onQuickExportJpg,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [currentTime, setCurrentTime] = useState({ time: '09:41', date: 'Wednesday, August 19' });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Update clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const dateStr = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });
      setCurrentTime({ time: `${hours}:${minutes}`, date: dateStr });
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Re-render wallpaper when configuration changes
  useEffect(() => {
    let isCancelled = false;
    const render = async () => {
      if (!canvasRef.current) return;
      setIsRendering(true);
      try {
        // Render to preview canvas at responsive display dimension
        const targetW = config.deviceType === 'mobile' ? 1080 : 1920;
        const targetH = config.deviceType === 'mobile' ? 1920 : 1080;
        await renderWallpaperToCanvas(canvasRef.current, config, { width: targetW, height: targetH });
      } catch (err) {
        console.error('Render wallpaper error:', err);
      } finally {
        if (!isCancelled) {
          setIsRendering(false);
        }
      }
    };
    render();
    return () => {
      isCancelled = true;
    };
  }, [config]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const isMobileRatio = config.resolution.aspectRatio === '9:16' || config.deviceType === 'mobile';

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col h-full bg-[#090A0D] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
    >
      {/* Sleek Dot Grid Backdrop */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Ambient Neon Cyan Backdrop Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500 rounded-full blur-[120px] opacity-15 pointer-events-none" />

      {/* Top Floating Control Bar */}
      <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between pointer-events-none">
        {/* Mockup Mode Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0F1117]/90 backdrop-blur-md border border-white/10 shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={() => onChangeMockupMode('none')}
            title="Raw Wallpaper view"
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              mockupMode === 'none'
                ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Raw Art</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeMockupMode('mobile-mockup')}
            title="Phone Lockscreen Mockup"
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              mockupMode === 'mobile-mockup'
                ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Phone Frame</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeMockupMode('desktop-mockup')}
            title="Desktop Screen Mockup"
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              mockupMode === 'desktop-mockup'
                ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop Frame</span>
          </button>
        </div>

        {/* Quick Actions (Seed Reroll, Fullscreen, Instant JPG Download) */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            id="btn-reroll-seed-preview"
            type="button"
            onClick={onRollNewSeed}
            title="Generate new procedural variation"
            className="p-2 rounded-xl bg-[#0F1117]/90 backdrop-blur-md border border-white/10 text-gray-300 hover:text-white hover:bg-[#1A1D23] transition-colors shadow-lg"
          >
            <Dices className="w-4 h-4 text-cyan-400" />
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-2 rounded-xl bg-[#0F1117]/90 backdrop-blur-md border border-white/10 text-gray-300 hover:text-white hover:bg-[#1A1D23] transition-colors shadow-lg"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            id="btn-quick-export-preview"
            type="button"
            onClick={onQuickExportJpg}
            title="Export as JPG"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-black text-xs font-black tracking-wide shadow-lg hover:bg-gray-200 active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">EXPORT JPG</span>
          </button>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden relative">
        {/* Loading Spinner */}
        {isRendering && (
          <div className="absolute z-30 flex items-center gap-2 px-4 py-2 rounded-full bg-[#0F1117]/90 backdrop-blur-md border border-cyan-500/40 text-white text-xs font-medium shadow-2xl animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>Rendering Studio Canvas...</span>
          </div>
        )}

        {/* MOCKUP CONTAINER */}
        {mockupMode === 'mobile-mockup' ? (
          /* Realistic Phone Mockup Bezel */
          <div className="relative w-[280px] sm:w-[320px] aspect-[9/19.5] rounded-[44px] p-3 bg-[#0F1117] ring-1 ring-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden transition-all">
            {/* Phone Outer Edge Highlight */}
            <div className="absolute inset-0 rounded-[44px] border-[3px] border-white/10 pointer-events-none z-20" />

            {/* Screen Inner Frame */}
            <div className="relative flex-1 rounded-[34px] overflow-hidden bg-black flex flex-col">
              {/* Canvas as Screen Background */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Dynamic Island Notch */}
              <div className="relative z-10 pt-3 flex justify-center">
                <div className="w-24 h-6 rounded-full bg-black flex items-center justify-between px-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-800" />
                  <div className="w-2 h-2 rounded-full bg-cyan-950/60" />
                </div>
              </div>

              {/* Status Bar */}
              <div className="relative z-10 px-6 flex items-center justify-between text-white text-[11px] font-semibold tracking-tight -mt-4">
                <span>{currentTime.time}</span>
                <div className="flex items-center gap-1.5">
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Lockscreen Clock & Date */}
              <div className="relative z-10 mt-10 text-center text-white select-none px-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                <p className="text-xs font-medium text-white/80">{currentTime.date}</p>
                <h2 className="text-5xl font-light tracking-tight mt-1 font-mono">{currentTime.time}</h2>
              </div>

              {/* Lockscreen Bottom Controls */}
              <div className="relative z-10 mt-auto pb-4 px-6 flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg">
                  <Flashlight className="w-4 h-4" />
                </div>
                <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg">
                  <Camera className="w-4 h-4" />
                </div>
              </div>

              {/* Home Swipe Indicator Bar */}
              <div className="relative z-10 pb-2 flex justify-center">
                <div className="w-28 h-1 rounded-full bg-white/70 shadow-sm" />
              </div>
            </div>
          </div>
        ) : mockupMode === 'desktop-mockup' ? (
          /* Realistic Desktop Monitor Mockup */
          <div className="relative w-full max-w-[620px] aspect-[16/10] rounded-2xl p-2.5 bg-[#0F1117] ring-1 ring-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden transition-all">
            {/* Screen Inner Frame */}
            <div className="relative flex-1 rounded-xl overflow-hidden bg-black flex flex-col">
              {/* Wallpaper Canvas */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Top macOS Style Menu Bar */}
              <div className="relative z-10 h-6 px-3 bg-black/40 backdrop-blur-md border-b border-white/10 flex items-center justify-between text-white text-[10px]">
                <div className="flex items-center gap-3 font-medium">
                  <span className="font-bold text-xs"></span>
                  <span>File</span>
                  <span>Edit</span>
                  <span>View</span>
                  <span>Wallpaper</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>{currentTime.date}</span>
                  <span className="font-semibold">{currentTime.time}</span>
                </div>
              </div>

              {/* Bottom Dock with Mock App Icons */}
              <div className="relative z-10 mt-auto pb-2 flex justify-center">
                <div className="h-10 px-3 rounded-2xl bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 flex items-center gap-2 shadow-2xl">
                  {['bg-cyan-500', 'bg-purple-500', 'bg-rose-500', 'bg-emerald-500', 'bg-amber-500', 'bg-indigo-500'].map(
                    (color, i) => (
                      <div
                        key={i}
                        className={`w-6 h-6 rounded-lg ${color} shadow-md flex items-center justify-center text-[10px] text-white font-bold`}
                      >
                        ●
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Monitor Stand Base */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-28 h-2 bg-zinc-700 rounded-b-md" />
          </div>
        ) : (
          /* Raw Wallpaper Canvas Presentation */
          <div
            className={`relative max-w-full max-h-[70vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group ${
              isMobileRatio ? 'aspect-[9/16] w-[280px] sm:w-[340px]' : 'aspect-video w-full max-w-[620px]'
            }`}
          >
            <canvas
              ref={canvasRef}
              className="w-full h-full object-cover block"
            />
            {/* Sleek Overlay Tag */}
            <div className="absolute inset-x-4 bottom-4 border border-white/10 bg-black/40 backdrop-blur-md rounded-lg p-3 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="h-1 w-10 bg-cyan-500 rounded-full" />
                <p className="text-[10px] font-mono tracking-tight text-white/70 uppercase">
                  Rendering: Style-{config.style.replace('-', '_')}
                </p>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                {config.theme} MODE
              </span>
            </div>
          </div>
        )}

        {/* Sleek Metrics Row (from Sleek Interface theme) */}
        <div className="mt-6 flex items-center gap-8 sm:gap-12 select-none">
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-black text-white">
              {config.resolution.width >= 3840 ? '4K' : config.resolution.width >= 2560 ? '2K' : 'FHD'}
            </p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Resolution</p>
          </div>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-black text-white">{config.resolution.aspectRatio}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Ratio</p>
          </div>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">
              {config.filters.seed}
            </p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Seed ID</p>
          </div>
        </div>
      </div>

      {/* Bottom Info Status Bar */}
      <div className="px-4 py-2.5 bg-[#0F1117] border-t border-white/10 text-xs text-gray-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold text-white uppercase">{config.style}</span>
          <span className="text-gray-600">•</span>
          <span className="font-mono">{config.palette.name}</span>
        </div>
        <div className="font-mono text-cyan-400 font-bold">
          {config.resolution.width} × {config.resolution.height} PX
        </div>
      </div>
    </div>
  );
};
