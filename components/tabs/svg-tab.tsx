'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useSettings } from '@/contexts/settings-context';
import { useSVG } from '@/hooks/use-svg';
import { TRANSLATIONS, CNCConstants } from '@/lib/constants';
import type { SVGConversionOptions } from '@/types';

interface SVGTabProps {
  onGCodeGenerated: (gcode: string) => void;
}

export default function SVGTab({ onGCodeGenerated }: SVGTabProps) {
  const { settings } = useSettings();
  const { handleConvertSVG, svgFileName } = useSVG();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [options, setOptions] = useState<SVGConversionOptions>({
    scale: 1,
    feedRate: CNCConstants.DEFAULTS.FEED_RATE,
    cutDepth: CNCConstants.DEFAULTS.CUT_DEPTH,
    safeZ: CNCConstants.DEFAULTS.SAFE_Z,
  });

  const t = TRANSLATIONS[settings.language];

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) return;

    const gcode = await handleConvertSVG(selectedFile, options);
    if (gcode) {
      onGCodeGenerated(gcode);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-dark-700 pb-4">
        <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">
          {t.svg.loadTitle}
        </h3>
        <p className="text-xs text-dark-400 leading-relaxed mb-3">
          {t.svg.description}
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".svg"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn w-full flex items-center justify-center gap-2"
        >
          <i className="fas fa-image text-xs" />
          <span>{t.svg.selectFile}</span>
        </button>

        {selectedFile && (
          <div className="mt-3 p-2 bg-dark-800/60 rounded-lg text-xs">
            <span className="text-green-400">✓</span> SVG loaded:{' '}
            <span className="text-green-400 font-semibold">{selectedFile.name}</span>
          </div>
        )}

        <div className="mt-3 p-2 bg-primary-500/10 border-l-2 border-primary-500 rounded text-xs text-dark-300">
          💡 Test SVG files can be created using any vector graphics editor
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">
          {t.svg.settingsTitle}
        </h3>

        <div className="p-3 mb-3 bg-amber-500/10 border-l-2 border-amber-500 rounded text-xs text-dark-300 space-y-1">
          <div dangerouslySetInnerHTML={{ __html: t.svg.warning }} />
          <div dangerouslySetInnerHTML={{ __html: t.svg.tipText }} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-dark-300 font-medium">{t.svg.scale}</label>
            <input
              type="number"
              value={options.scale}
              onChange={(e) => setOptions({ ...options, scale: parseFloat(e.target.value) })}
              step="0.1"
              min="0.001"
              className="input-base w-20"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm text-dark-300 font-medium">{t.svg.feedRate}</label>
            <input
              type="number"
              value={options.feedRate}
              onChange={(e) => setOptions({ ...options, feedRate: parseInt(e.target.value) })}
              step="50"
              min="10"
              className="input-base w-24"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm text-dark-300 font-medium">{t.svg.cutDepth}</label>
            <input
              type="number"
              value={options.cutDepth}
              onChange={(e) => setOptions({ ...options, cutDepth: parseFloat(e.target.value) })}
              step="0.5"
              className="input-base w-20"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm text-dark-300 font-medium">{t.svg.safeZ}</label>
            <input
              type="number"
              value={options.safeZ}
              onChange={(e) => setOptions({ ...options, safeZ: parseFloat(e.target.value) })}
              step="1"
              min="0"
              className="input-base w-20"
            />
          </div>
        </div>

        <button
          onClick={handleConvert}
          disabled={!selectedFile}
          className="btn btn-success w-full mt-4 flex items-center justify-center gap-2"
        >
          <i className="fas fa-cogs text-xs" />
          <span>{t.svg.convert}</span>
        </button>
      </div>
    </div>
  );
}
