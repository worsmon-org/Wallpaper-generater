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
  const [activeColorIdx, setActiveColorIdx] = useState<number>(0);

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
          mood: 'sleek cyberpunk modern aesthetic',
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
        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block">
          Custom Palette
        </label>
        <div className="flex items-center gap-1 bg-[#1A1D23] p-0.5 rounded-md border border-white/5">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all ${
              activeTab === 'presets'
                ? 'bg-cyan-500 text-black shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Presets
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all ${
              activeTab === 'custom'
                ? 'bg-cyan-500 text-black shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Customizer
          </button>
        </div>
      </div>

      {/* Sleek Visual Circular Swatches Row */}
      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#1A1D23] border border-white/5 overflow-x-auto scrollbar-none">
        {selectedPalette.colors.map((color, idx) => (
          <label
            key={idx}
            className={`relative w-8 h-8 rounded-full border border-white/20 cursor-pointer shrink-0 transition-transform active:scale-95 ${
              activeColorIdx === idx
                ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-[#0F1117] scale-105'
                : 'hover:scale-105'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => setActiveColorIdx(idx)}
          >
            <input
              type="color"
              value={color}
              onChange={(e) => handleColorChange(idx, e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </label>
        ))}

        {/* Add Color Circular Button */}
        {selectedPalette.colors.length < 6 && (
          <button
            type="button"
            onClick={handleAddColor}
            title="Add color"
            className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-[#1A1D23] hover:bg-[#252A33] text-gray-400 hover:text-white shrink-0 transition-colors"
          >
            <span className="text-base font-bold">+</span>
          </button>
        )}

        <div className="ml-auto flex items-center gap-1.5 shrink-0 pl-2">
          <button
            type="button"
            onClick={handleShuffleColors}
            title="Shuffle color order"
            className="p-1.5 rounded-lg bg-[#252A33] text-gray-400 hover:text-cyan-300 border border-white/5 transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {activeTab === 'presets' ? (
        <div className="space-y-2">
          {/* Preset Palettes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-1">
            {DEFAULT_PALETTES.map((pal) => {
              const isSelected = selectedPalette.id === pal.id;
              return (
                <button
                  key={pal.id}
                  id={`palette-${pal.id}`}
                  type="button"
                  onClick={() => onSelectPalette(pal)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-500/30'
                      : 'border-white/5 bg-[#1A1D23] hover:bg-[#252A33] text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-white truncate pr-1">
                      {pal.name}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                  </div>

                  {/* Swatches Bar */}
                  <div className="flex h-3.5 rounded-md overflow-hidden border border-black/30 shadow-inner">
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
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-colors"
          >
            <Wand2 className={`w-3.5 h-3.5 text-cyan-400 ${isAiLoading ? 'animate-spin' : ''}`} />
            <span>{isAiLoading ? 'Synthesizing Palette...' : 'Suggest Harmonious Palette with AI'}</span>
          </button>
        </div>
      ) : (
        /* Custom Palette Details */
        <div className="p-3 bg-[#1A1D23] rounded-lg border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-gray-400">
              Color Hex Codes ({selectedPalette.colors.length})
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedPalette.colors.map((color, idx) => (
              <div
                key={idx}
                className="group flex items-center gap-1.5 p-1.5 rounded-md bg-[#0F1117] border border-white/10"
              >
                <label className="relative cursor-pointer w-5 h-5 rounded-md overflow-hidden shrink-0 border border-white/10">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => handleColorChange(idx, e.target.value)}
                    className="absolute -top-4 -left-4 w-12 h-12 cursor-pointer opacity-0"
                  />
                  <div className="w-full h-full" style={{ backgroundColor: color }} />
                </label>

                <span className="text-[11px] font-mono font-bold text-gray-200 uppercase">
                  {color}
                </span>

                {selectedPalette.colors.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(idx)}
                    title="Remove color"
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-rose-400 transition-opacity"
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
