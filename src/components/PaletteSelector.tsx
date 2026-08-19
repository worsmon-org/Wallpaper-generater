import React, { useState } from 'react';
import { Palette, Plus, Trash2, Shuffle, Wand2, Check } from 'lucide-react';
import { ColorPalette, WallpaperStyle } from '../types';
import { DEFAULT_PALETTES } from '../constants/palettes';

interface PaletteSelectorProps {
  selectedPalette: ColorPalette;
  currentStyle: WallpaperStyle;
  onSelectPalette: (palette: ColorPalette) => void;
  onUpdateCustomColors: (colors: string[]) => void;
}

export const PaletteSelector: React.FC<PaletteSelectorProps> = ({
  selectedPalette,
  currentStyle,
  onSelectPalette,
  onUpdateCustomColors,
}) => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');

  // Handle individual color change in palette
  const handleColorChange = (index: number, newColor: string) => {
    const updated = [...selectedPalette.colors];
    updated[index] = newColor;
    onUpdateCustomColors(updated);
  };

  // Add new color to palette
  const handleAddColor = () => {
    if (selectedPalette.colors.length >= 6) return;
    const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const updated = [...selectedPalette.colors, randomHex];
    onUpdateCustomColors(updated);
  };

  // Remove color from palette
  const handleRemoveColor = (index: number) => {
    if (selectedPalette.colors.length <= 2) return;
    const updated = selectedPalette.colors.filter((_, i) => i !== index);
    onUpdateCustomColors(updated);
  };

  // Shuffle existing colors
  const handleShuffleColors = () => {
    const shuffled = [...selectedPalette.colors].sort(() => Math.random() - 0.5);
    onUpdateCustomColors(shuffled);
  };

  // Request AI Palette from backend
  const handleGenerateAiPalette = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/suggest-palette', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: 'modern harmonious aesthetic',
          style: currentStyle,
        }),
      });
      const data = await res.json();
      if (data.palette && Array.isArray(data.palette)) {
        const newPalette: ColorPalette = {
          id: `ai-${Date.now()}`,
          name: data.name || 'AI Generated Palette',
          category: 'custom',
          colors: data.palette,
        };
        onSelectPalette(newPalette);
        setActiveTab('custom');
      }
    } catch (err) {
      console.error('Failed to generate AI palette:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          3. Color Palette & Harmony
        </label>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`px-2 py-0.5 rounded text-xs font-medium ${
              activeTab === 'presets'
                ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            Presets
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`px-2 py-0.5 rounded text-xs font-medium ${
              activeTab === 'custom'
                ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            Customizer
          </button>
        </div>
      </div>

      {activeTab === 'presets' ? (
        <div className="space-y-2">
          {/* Preset Palettes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
            {DEFAULT_PALETTES.map((pal) => {
              const isSelected = selectedPalette.id === pal.id;
              return (
                <button
                  key={pal.id}
                  id={`palette-${pal.id}`}
                  type="button"
                  onClick={() => onSelectPalette(pal)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 ring-1 ring-indigo-500/30'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate pr-1">
                      {pal.name}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                  </div>

                  {/* Swatches Bar */}
                  <div className="flex h-5 rounded-lg overflow-hidden border border-zinc-200/60 dark:border-zinc-700/60 shadow-inner">
                    {pal.colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="flex-1 h-full"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* AI Suggestion Generator */}
          <button
            id="btn-ai-palette"
            type="button"
            onClick={handleGenerateAiPalette}
            disabled={isAiLoading}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800 transition-colors"
          >
            <Wand2 className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
            <span>{isAiLoading ? 'Generating Palette...' : 'Suggest Harmonious Palette with AI'}</span>
          </button>
        </div>
      ) : (
        /* Custom Palette Builder */
        <div className="p-3 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Active Colors ({selectedPalette.colors.length})
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShuffleColors}
                title="Shuffle color order"
                className="p-1 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 text-xs flex items-center gap-1"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Shuffle</span>
              </button>
              {selectedPalette.colors.length < 6 && (
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="p-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive Color Chips with HTML Color Input */}
          <div className="flex flex-wrap gap-2.5">
            {selectedPalette.colors.map((color, idx) => (
              <div
                key={idx}
                className="group relative flex items-center gap-1.5 p-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm"
              >
                {/* Native Color Picker Circle */}
                <label className="relative cursor-pointer w-7 h-7 rounded-md overflow-hidden shrink-0 border border-black/10">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => handleColorChange(idx, e.target.value)}
                    className="absolute -top-4 -left-4 w-16 h-16 cursor-pointer opacity-0"
                  />
                  <div className="w-full h-full" style={{ backgroundColor: color }} />
                </label>

                {/* Hex Code */}
                <span className="text-[11px] font-mono font-medium text-zinc-700 dark:text-zinc-300 uppercase">
                  {color}
                </span>

                {/* Delete Color button */}
                {selectedPalette.colors.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(idx)}
                    title="Remove color"
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-zinc-400 hover:text-rose-500 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
