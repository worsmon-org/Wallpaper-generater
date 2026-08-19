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
    <div className="space-y-3">
      {/* Primary Category Selector: Mobile vs Desktop */}
      <div className="flex items-center justify-between">
        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block">
          Canvas Aspect Ratio
        </label>
        <span className="text-[11px] text-cyan-400 font-mono font-medium">
          {selectedResolution.aspectRatio} • {selectedResolution.width}×{selectedResolution.height}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {/* Desktop Option */}
        <button
          id="btn-device-desktop"
          type="button"
          onClick={() => {
            onSelectDevice('desktop');
            const defaultDesktop = RESOLUTION_PRESETS.find((p) => p.id === 'desktop-4k-uhd') || RESOLUTION_PRESETS[4];
            onSelectResolution(defaultDesktop);
          }}
          className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
            deviceType === 'desktop'
              ? 'border-cyan-500 bg-cyan-500/10 text-white shadow-lg shadow-cyan-500/10'
              : 'border-transparent bg-[#1A1D23] hover:border-white/20 text-gray-400'
          }`}
        >
          <div
            className={`w-7 h-4.5 border rounded-sm transition-opacity ${
              deviceType === 'desktop' ? 'border-cyan-400 opacity-90' : 'border-gray-500 opacity-50'
            }`}
          />
          <span className="text-xs font-semibold">Desktop</span>
        </button>

        {/* Mobile Option */}
        <button
          id="btn-device-mobile"
          type="button"
          onClick={() => {
            onSelectDevice('mobile');
            const defaultMobile = RESOLUTION_PRESETS.find((p) => p.id === 'mobile-fhd') || RESOLUTION_PRESETS[0];
            onSelectResolution(defaultMobile);
          }}
          className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
            deviceType === 'mobile'
              ? 'border-cyan-500 bg-cyan-500/10 text-white shadow-lg shadow-cyan-500/10'
              : 'border-transparent bg-[#1A1D23] hover:border-white/20 text-gray-400'
          }`}
        >
          <div
            className={`w-3.5 h-6 border rounded-sm transition-opacity ${
              deviceType === 'mobile' ? 'border-cyan-400 opacity-90' : 'border-gray-500 opacity-50'
            }`}
          />
          <span className="text-xs font-semibold">Mobile</span>
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
          className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
            deviceType === 'tablet'
              ? 'border-cyan-500 bg-cyan-500/10 text-white shadow-lg shadow-cyan-500/10'
              : 'border-transparent bg-[#1A1D23] hover:border-white/20 text-gray-400'
          }`}
        >
          <div
            className={`w-5 h-6 border rounded-sm transition-opacity ${
              deviceType === 'tablet' ? 'border-cyan-400 opacity-90' : 'border-gray-500 opacity-50'
            }`}
          />
          <span className="text-xs font-semibold">Tablet</span>
        </button>
      </div>

      {/* Resolution Presets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
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
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-500/30'
                  : 'border-white/5 bg-[#1A1D23] hover:bg-[#252A33] text-gray-300'
              }`}
            >
              <div className="min-w-0 pr-2">
                <p className="text-xs font-semibold text-white truncate">{preset.name}</p>
                <p className="text-[10px] text-gray-400 font-mono truncate">
                  {preset.width} × {preset.height} px
                </p>
              </div>
              {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
