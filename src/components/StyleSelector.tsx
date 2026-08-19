import React, { useState } from 'react';
import { Sparkles, Check } from 'lucide-react';
import { WallpaperStyle } from '../types';
import { WALLPAPER_STYLES, StyleOption } from '../constants/styles';

interface StyleSelectorProps {
  selectedStyle: WallpaperStyle;
  onSelectStyle: (style: WallpaperStyle) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyle,
  onSelectStyle,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const categories = ['All', 'Popular', 'Nature & Mood', 'Sci-Fi & Cyber', 'Artistic'];

  const filteredStyles = activeCategory === 'All'
    ? WALLPAPER_STYLES
    : WALLPAPER_STYLES.filter((s) => s.category === activeCategory);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          2. Artistic Style ({WALLPAPER_STYLES.length} Available)
        </label>
        <span className="text-xs font-medium text-purple-600 dark:text-purple-400 capitalize">
          {selectedStyle.replace('-', ' ')}
        </span>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Styles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
        {filteredStyles.map((styleOpt: StyleOption) => {
          const isSelected = selectedStyle === styleOpt.id;
          return (
            <button
              key={styleOpt.id}
              id={`style-${styleOpt.id}`}
              type="button"
              onClick={() => onSelectStyle(styleOpt.id)}
              className={`group relative flex flex-col p-3 rounded-xl text-left transition-all border overflow-hidden ${
                isSelected
                  ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/40 ring-2 ring-purple-500/30'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              {/* Visual Gradient Banner Thumbnail */}
              <div
                className={`w-full h-12 rounded-lg bg-gradient-to-br ${styleOpt.previewGradient} shadow-inner mb-2 flex items-center justify-between p-2 relative overflow-hidden`}
              >
                {styleOpt.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white uppercase tracking-wider">
                    {styleOpt.badge}
                  </span>
                )}
                {isSelected && (
                  <div className="ml-auto w-5 h-5 rounded-full bg-white text-purple-600 flex items-center justify-center shadow-md">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Title & Tagline */}
              <div className="min-w-0">
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1 truncate">
                  {styleOpt.label}
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                  {styleOpt.tagline}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
