import React from 'react';
import { Moon, Sun, Clapperboard, Zap, Sparkles, Sliders, Cloud, SunMedium, Check } from 'lucide-react';
import { ThemeMode, LightingMood } from '../types';
import { LIGHTING_MOODS } from '../constants/styles';

interface ThemeSelectorProps {
  theme: ThemeMode;
  lightingMood: LightingMood;
  onSelectTheme: (theme: ThemeMode) => void;
  onSelectLightingMood: (mood: LightingMood) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  theme,
  lightingMood,
  onSelectTheme,
  onSelectLightingMood,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Clapperboard':
        return <Clapperboard className="w-3.5 h-3.5" />;
      case 'Sun':
        return <Sun className="w-3.5 h-3.5" />;
      case 'Moon':
        return <Moon className="w-3.5 h-3.5" />;
      case 'Zap':
        return <Zap className="w-3.5 h-3.5" />;
      case 'Sparkles':
        return <Sparkles className="w-3.5 h-3.5" />;
      case 'Sliders':
        return <Sliders className="w-3.5 h-3.5" />;
      case 'Cloud':
        return <Cloud className="w-3.5 h-3.5" />;
      case 'SunMedium':
      default:
        return <SunMedium className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-3">
      {/* Dark & Light Theme Switch */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block">
            Theme & Illumination
          </label>
          <span className="text-[11px] font-mono font-bold uppercase text-cyan-400">
            {theme} MODE
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 p-1 bg-[#1A1D23] rounded-xl border border-white/5">
          {/* Dark Mode */}
          <button
            id="btn-theme-dark"
            type="button"
            onClick={() => onSelectTheme('dark')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              theme === 'dark'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>DARK THEME</span>
          </button>

          {/* Light Mode */}
          <button
            id="btn-theme-light"
            type="button"
            onClick={() => onSelectTheme('light')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              theme === 'light'
                ? 'bg-white text-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>LIGHT THEME</span>
          </button>
        </div>
      </div>

      {/* Lighting Mood Options */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {LIGHTING_MOODS.map((mood) => {
            const isSelected = lightingMood === mood.id;
            return (
              <button
                key={mood.id}
                id={`mood-${mood.id}`}
                type="button"
                onClick={() => onSelectLightingMood(mood.id)}
                className={`flex items-center gap-2 p-2 rounded-lg text-left transition-all border ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-500/30'
                    : 'border-white/5 bg-[#1A1D23] hover:bg-[#252A33] text-gray-300'
                }`}
              >
                <div className={`p-1 rounded-md ${isSelected ? 'bg-cyan-500 text-black' : 'bg-[#0F1117] text-gray-400'}`}>
                  {getIcon(mood.iconName)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold truncate">{mood.label}</p>
                </div>
                {isSelected && <Check className="w-3 h-3 text-cyan-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
