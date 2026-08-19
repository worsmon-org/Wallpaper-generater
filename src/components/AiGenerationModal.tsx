import React, { useState } from 'react';
import { X, Sparkles, Wand2, Image as ImageIcon, AlertCircle, Check } from 'lucide-react';
import { WallpaperConfig } from '../types';

interface AiGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: WallpaperConfig;
  onApplyAiImage: (imageUrl: string, enhancedPrompt: string) => void;
}

export const AiGenerationModal: React.FC<AiGenerationModalProps> = ({
  isOpen,
  onClose,
  config,
  onApplyAiImage,
}) => {
  const [prompt, setPrompt] = useState(config.userPrompt || '');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEnhancePrompt = async () => {
    setIsEnhancing(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: prompt || `A stunning ${config.style} wallpaper`,
          style: config.style,
          theme: config.theme,
          deviceType: config.deviceType,
          colors: config.palette.colors,
        }),
      });
      const data = await res.json();
      if (data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
      }
    } catch (err: any) {
      setErrorMsg('Failed to enhance prompt. You can write your custom prompt manually.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerateAi = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/generate-ai-wallpaper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt || `${config.style} wallpaper`,
          aspectRatio: config.deviceType === 'mobile' ? '9:16' : '16:9',
          style: config.style,
          theme: config.theme,
          colors: config.palette.colors,
        }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        onApplyAiImage(data.imageUrl, prompt);
        onClose();
      } else {
        setErrorMsg(data.error || 'Failed to generate AI wallpaper. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error while generating AI wallpaper.');
    } finally {
      setIsGenerating(false);
    }
  };

  const promptSuggestions = [
    `Hyper-detailed ${config.style} wallpaper with atmospheric fog, volumetric lighting, and deep color tones`,
    `Minimalist cinematic vista with ${config.palette.name} gradient highlights and clean negative space`,
    `Cyberpunk neon rain skyline with glowing kanji holographic reflections and wet asphalt`,
    `Spooky Halloween harvest with full moon, gothic silhouette castle and glowing orange pumpkin`,
    `Deep space cosmic nebula with orbital ring planet and glittering starfield`,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0F1117] border border-white/10 shadow-2xl p-6 space-y-5 text-[#E0E0E0]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500 text-black flex items-center justify-center font-bold shadow-lg shadow-cyan-500/20">
              <Wand2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Gemini AI Wallpaper Studio
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                Generate high-definition AI wallpapers tailored to your style & device
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

        {/* Prompt Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block">
              Wallpaper Prompt / Idea
            </label>
            <button
              type="button"
              onClick={handleEnhancePrompt}
              disabled={isEnhancing}
              className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
              <span>{isEnhancing ? 'Synthesizing...' : 'Magic Prompt Enhance'}</span>
            </button>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder={`Describe your dream wallpaper (e.g. "A moody ${config.style} with glowing neon elements and deep shadows")...`}
            className="w-full p-3 rounded-xl border border-white/10 bg-[#1A1D23] text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500/50 resize-none font-sans"
          />
        </div>

        {/* Quick Inspiration Prompts */}
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Quick Inspiration:</span>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {promptSuggestions.map((sug, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPrompt(sug)}
                className="text-[11px] px-2.5 py-1 rounded-md bg-[#1A1D23] text-gray-300 hover:bg-[#252A33] hover:text-cyan-300 text-left transition-colors border border-white/5 truncate max-w-full"
              >
                + {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Error Notice */}
        {errorMsg && (
          <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/40 flex items-start gap-2.5 text-amber-300 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-gray-400 font-mono">
            Target: <span className="font-bold text-cyan-400">{config.deviceType.toUpperCase()} ({config.resolution.aspectRatio})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-white/10 text-xs font-bold text-gray-300 hover:bg-[#1A1D23] transition-colors"
            >
              Cancel
            </button>

            <button
              id="btn-confirm-generate-ai"
              type="button"
              onClick={handleGenerateAi}
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-white hover:bg-gray-200 text-black text-xs font-black tracking-wide shadow-lg active:scale-95 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-500 animate-spin" />
                  <span>Synthesizing AI Artwork...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>GENERATE ARTWORK</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
