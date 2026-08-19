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
        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block">
          Artistic Style ({WALLPAPER_STYLES.length})
        </label>
        <span className="text-[11px] font-mono font-medium text-cyan-400 capitalize">
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
            className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all border ${
              activeCategory === cat
                ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-[#1A1D23] text-gray-400 border-white/5 hover:text-white hover:bg-[#252A33]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Styles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[340px] overflow-y-auto pr-1">
        {filteredStyles.map((styleOpt: StyleOption) => {
          const isSelected = selectedStyle === styleOpt.id;
          return (
            <button
              key={styleOpt.id}
              id={`style-${styleOpt.id}`}
              type="button"
              onClick={() => onSelectStyle(styleOpt.id)}
              className={`group relative flex flex-col p-2.5 rounded-lg text-left transition-all border overflow-hidden ${
                isSelected
                  ? 'border-cyan-500 bg-[#1A1D23] ring-1 ring-cyan-500/40 shadow-lg shadow-cyan-500/10'
                  : 'border-white/5 bg-[#1A1D23] hover:border-white/20 hover:bg-[#252A33]'
              }`}
            >
              {/* Visual Gradient Banner Thumbnail */}
              <div
                className={`w-full h-10 rounded-md bg-gradient-to-br ${styleOpt.previewGradient} shadow-inner mb-2 flex items-center justify-between p-1.5 relative overflow-hidden`}
              >
                {styleOpt.badge && (
                  <span className="text-[8px] font-bold px-1 py-0.5 rounded bg-black/70 backdrop-blur-sm text-cyan-300 uppercase tracking-wider">
                    {styleOpt.badge}
                  </span>
                )}
                {isSelected && (
                  <div className="ml-auto w-4 h-4 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-md">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Title & Tagline */}
              <div className="min-w-0">
                <p className={`text-xs font-bold truncate ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                  {styleOpt.label}
                </p>
                <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5 font-mono">
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
