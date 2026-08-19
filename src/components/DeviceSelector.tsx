import React from 'react';
import { Smartphone, Monitor, Tablet, Check } from 'lucide-react';
import { DeviceType, ResolutionPreset } from '../types';
import { RESOLUTION_PRESETS } from '../constants/devices';

interface DeviceSelectorProps {
  deviceType: DeviceType;
  selectedResolution: ResolutionPreset;
  onSelectDevice: (device: DeviceType) => void;
  onSelectResolution: (preset: ResolutionPreset) => void;
}

export const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  deviceType,
  selectedResolution,
  onSelectDevice,
  onSelectResolution,
}) => {
  const filteredPresets = RESOLUTION_PRESETS.filter((p) => p.device === deviceType);

  return (
    <div className="space-y-4">
      {/* Primary Category Selector: Mobile vs Desktop */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          1. Device & Aspect Ratio
        </label>
        <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
          {selectedResolution.aspectRatio} • {selectedResolution.width} × {selectedResolution.height}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
        {/* Mobile Option */}
        <button
          id="btn-device-mobile"
          type="button"
          onClick={() => {
            onSelectDevice('mobile');
            const defaultMobile = RESOLUTION_PRESETS.find((p) => p.id === 'mobile-fhd') || RESOLUTION_PRESETS[0];
            onSelectResolution(defaultMobile);
          }}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            deviceType === 'mobile'
              ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-zinc-200/80 dark:border-zinc-700'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Mobile (9:16)</span>
        </button>

        {/* Desktop Option */}
        <button
          id="btn-device-desktop"
          type="button"
          onClick={() => {
            onSelectDevice('desktop');
            const defaultDesktop = RESOLUTION_PRESETS.find((p) => p.id === 'desktop-4k-uhd') || RESOLUTION_PRESETS[4];
            onSelectResolution(defaultDesktop);
          }}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            deviceType === 'desktop'
              ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-zinc-200/80 dark:border-zinc-700'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <Monitor className="w-4 h-4" />
          <span>Desktop (16:9)</span>
        </button>

        {/* Tablet Option */}
        <button
          id="btn-device-tablet"
          type="button"
          onClick={() => {
            onSelectDevice('tablet');
            const defaultTablet = RESOLUTION_PRESETS.find((p) => p.id === 'tablet-ipad') || RESOLUTION_PRESETS[0];
            onSelectResolution(defaultTablet);
          }}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            deviceType === 'tablet'
              ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-zinc-200/80 dark:border-zinc-700'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <Tablet className="w-4 h-4" />
          <span>Tablet (3:4)</span>
        </button>
      </div>

      {/* Resolution Presets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {filteredPresets.map((preset) => {
          const isSelected = selectedResolution.id === preset.id;
          return (
            <button
              key={preset.id}
              id={`preset-${preset.id}`}
              type="button"
              onClick={() => onSelectResolution(preset)}
              className={`flex items-center justify-between p-2.5 rounded-lg text-left transition-all border ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 ring-1 ring-indigo-500/30'
                  : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <div className="min-w-0 pr-2">
                <p className="text-xs font-semibold truncate">{preset.name}</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                  {preset.width} × {preset.height} px
                </p>
              </div>
              {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
