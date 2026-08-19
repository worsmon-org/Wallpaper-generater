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
    <div className="space-y-3 p-3.5 bg-[#1A1D23] rounded-xl border border-white/5">
      <div className="flex items-center justify-between">
        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center gap-1.5">
          <SlidersHorizontal className="w-3 h-3 text-cyan-400" />
          <span>Texture & Seed Tuning</span>
        </label>
        <button
          type="button"
          onClick={onRollNewSeed}
          title="Regenerate random variation"
          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-md transition-colors"
        >
          <Dices className="w-3 h-3" />
          <span>Reroll Seed</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Pattern Complexity */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-medium text-gray-400">
            <span>Complexity</span>
            <span className="font-mono text-cyan-400">{filters.complexity}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={filters.complexity}
            onChange={(e) => updateFilter('complexity', Number(e.target.value))}
            className="w-full h-1.5 bg-[#0F1117] rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Film Grain Texture */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-medium text-gray-400">
            <span>Film Grain</span>
            <span className="font-mono text-cyan-400">{filters.grain}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="60"
            step="5"
            value={filters.grain}
            onChange={(e) => updateFilter('grain', Number(e.target.value))}
            className="w-full h-1.5 bg-[#0F1117] rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Cinematic Vignette */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-medium text-gray-400">
            <span>Vignette Falloff</span>
            <span className="font-mono text-cyan-400">{filters.vignette}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="80"
            step="5"
            value={filters.vignette}
            onChange={(e) => updateFilter('vignette', Number(e.target.value))}
            className="w-full h-1.5 bg-[#0F1117] rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Active Seed Tag */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-[#0F1117] border border-white/5 text-xs">
          <span className="text-gray-500 font-mono text-[11px]">Seed:</span>
          <span className="font-mono font-bold text-cyan-400">#{filters.seed}</span>
        </div>
      </div>
    </div>
  );
};
