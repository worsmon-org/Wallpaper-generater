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
    <div className="space-y-4">
      {/* Dark & Light Theme Switch (Requirement 3) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            4. Theme Mode (Dark & Light)
          </label>
          <span className="text-xs font-semibold uppercase text-indigo-600 dark:text-indigo-400">
            {theme}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
          {/* Dark Mode */}
          <button
            id="btn-theme-dark"
            type="button"
            onClick={() => onSelectTheme('dark')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              theme === 'dark'
                ? 'bg-zinc-900 text-white shadow-sm ring-1 ring-zinc-700'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Moon className="w-4 h-4 text-indigo-400" />
            <span>Dark Theme</span>
          </button>

          {/* Light Mode */}
          <button
            id="btn-theme-light"
            type="button"
            onClick={() => onSelectTheme('light')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              theme === 'light'
                ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Light Theme</span>
          </button>
        </div>
      </div>

      {/* Lighting Mood Options */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 flex items-center justify-between">
          <span>Lighting & Atmosphere</span>
          <span className="text-[11px] text-zinc-400 capitalize">{lightingMood.replace('-', ' ')}</span>
        </label>

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
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 ring-1 ring-indigo-500/30'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className={`p-1.5 rounded-md ${isSelected ? 'bg-indigo-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>
                  {getIcon(mood.iconName)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold truncate">{mood.label}</p>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
