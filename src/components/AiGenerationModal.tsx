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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Gemini AI Wallpaper Studio
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Generate high-definition AI wallpapers tailored to your style & device
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

        {/* Prompt Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Wallpaper Prompt / Idea
            </label>
            <button
              type="button"
              onClick={handleEnhancePrompt}
              disabled={isEnhancing}
              className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
              <span>{isEnhancing ? 'Enhancing...' : 'Magic Enhance with Gemini 3.7'}</span>
            </button>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder={`Describe your dream wallpaper (e.g. "A moody ${config.style} with glowing elements and deep shadows")...`}
            className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
          />
        </div>

        {/* Quick Inspiration Prompts */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-zinc-400">Quick Inspiration:</span>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {promptSuggestions.map((sug, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPrompt(sug)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 dark:hover:text-purple-300 text-left transition-colors border border-zinc-200/60 dark:border-zinc-700/60 truncate max-w-full"
              >
                + {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Error Notice */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 flex items-start gap-2.5 text-amber-800 dark:text-amber-300 text-xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-zinc-500">
            Target: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{config.deviceType.toUpperCase()} ({config.resolution.aspectRatio})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>

            <button
              id="btn-confirm-generate-ai"
              type="button"
              onClick={handleGenerateAi}
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-500/25 active:scale-95 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Synthesizing AI Artwork...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate with Gemini</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
