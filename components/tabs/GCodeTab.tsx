'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { useSimulation } from '@/contexts/SimulationContext';
import { useGCode } from '@/hooks/useGcode';
import { TRANSLATIONS } from '@/lib/Constants';

interface GCodeTabProps {
  pathRenderer: any;
  sceneManager: any;
  toolhead: any;
}

export default function GCodeTab({ pathRenderer, sceneManager, toolhead }: GCodeTabProps) {
  const { settings } = useSettings();
  const { segments } = useSimulation();
  const { handleParseGCode, exportGCode } = useGCode(pathRenderer, sceneManager, toolhead);
  const [gcodeText, setGCodeText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = TRANSLATIONS[settings.language];

  const handleFileLoad = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setGCodeText(text);
    };
    reader.readAsText(file);
  };

  const handleLoadExample = () => {
    const exampleGCode = `G21 ; Units in mm
G90 ; Absolute positioning
G00 Z5.000 ; Safe Z
M03 S12000 ; Spindle on

; Square pattern
G00 X0.000 Y0.000
G01 Z-2.000 F600
G01 X50.000 Y0.000 F600
G01 X50.000 Y50.000 F600
G01 X0.000 Y50.000 F600
G01 X0.000 Y0.000 F600

; Circle in center
G00 Z5.000
G00 X35.000 Y25.000
G01 Z-2.000 F600
G02 X35.000 Y25.000 I-10.000 J0.000 F600

G00 Z5.000
M05 ; Spindle off
G00 X0 Y0
M30 ; End program`;
    
    setGCodeText(exampleGCode);
  };

  const handleParse = async () => {
    await handleParseGCode(gcodeText);
  };

  const handleExport = () => {
    exportGCode(segments);
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-dark-700 pb-4">
        <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">
          {t.gcode.loadTitle}
        </h3>
        <div className="flex flex-wrap gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".nc,.ngc,.gcode,.txt"
            onChange={handleFileLoad}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn flex items-center gap-2"
          >
            <i className="fas fa-folder-open text-xs" />
            <span>{t.gcode.loadFile}</span>
          </button>
          <button onClick={handleLoadExample} className="btn flex items-center gap-2">
            <i className="fas fa-file-code text-xs" />
            <span>{t.gcode.example}</span>
          </button>
          <button
            onClick={handleExport}
            disabled={segments.length === 0}
            className="btn flex items-center gap-2"
          >
            <i className="fas fa-download text-xs" />
            <span>{t.gcode.export}</span>
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">
          {t.gcode.editorTitle}
        </h3>
        <textarea
          value={gcodeText}
          onChange={(e) => setGCodeText(e.target.value)}
          placeholder={t.gcode.placeholder}
          className="textarea-base w-full h-56 scrollbar-thin"
          spellCheck={false}
        />
        
        <button
          onClick={handleParse}
          disabled={!gcodeText.trim()}
          className="btn btn-primary w-full mt-3 flex items-center justify-center gap-2"
        >
          <i className="fas fa-hammer text-xs" />
          <span>{t.gcode.parse}</span>
        </button>
      </div>
    </div>
  );
}
