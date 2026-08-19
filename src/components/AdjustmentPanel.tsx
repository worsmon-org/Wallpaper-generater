import React from 'react';
import { Dices, SlidersHorizontal, Sparkles } from 'lucide-react';
import { FilterAdjustments } from '../types';

interface AdjustmentPanelProps {
  filters: FilterAdjustments;
  onChangeFilters: (filters: FilterAdjustments) => void;
  onRollNewSeed: () => void;
}

export const AdjustmentPanel: React.FC<AdjustmentPanelProps> = ({
  filters,
  onChangeFilters,
  onRollNewSeed,
}) => {
  const updateFilter = (key: keyof FilterAdjustments, val: number) => {
    onChangeFilters({
      ...filters,
      [key]: val,
    });
  };

  return (
    <div className="space-y-3 p-3.5 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Visual Refinements & Texture</span>
        </label>
        <button
          type="button"
          onClick={onRollNewSeed}
          title="Regenerate random variation"
          className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/60 hover:bg-purple-200 dark:hover:bg-purple-900/60 rounded-md transition-colors"
        >
          <Dices className="w-3.5 h-3.5" />
          <span>Reroll Seed</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Pattern Complexity */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400">
            <span>Pattern Complexity</span>
            <span>{filters.complexity}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={filters.complexity}
            onChange={(e) => updateFilter('complexity', Number(e.target.value))}
            className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        {/* Film Grain Texture */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400">
            <span>Film Grain Noise</span>
            <span>{filters.grain}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="60"
            step="5"
            value={filters.grain}
            onChange={(e) => updateFilter('grain', Number(e.target.value))}
            className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        {/* Cinematic Vignette */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400">
            <span>Radial Vignette</span>
            <span>{filters.vignette}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="80"
            step="5"
            value={filters.vignette}
            onChange={(e) => updateFilter('vignette', Number(e.target.value))}
            className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        {/* Active Seed Tag */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs">
          <span className="text-zinc-500">Procedural Seed:</span>
          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">#{filters.seed}</span>
        </div>
      </div>
    </div>
  );
};
