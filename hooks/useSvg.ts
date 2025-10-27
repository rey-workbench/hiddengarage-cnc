'use client';

import { useCallback, useState } from 'react';
import { useSimulation } from '@/contexts/SimulationContext';
import { useUI } from '@/contexts/UiContext';
import type { SVGConversionOptions } from '@/types';

export function useSVG() {
  const { convertSVG } = useSimulation();
  const { showSuccess, showError, setLoading } = useUI();
  const [svgFileName, setSVGFileName] = useState<string>('');

  const handleConvertSVG = useCallback(
    async (file: File, options: SVGConversionOptions): Promise<string | null> => {
      try {
        setLoading(true, 'Converting SVG to G-code...');
        
        const gcode = await convertSVG(file, options);
        
        setLoading(false);
        showSuccess(`SVG converted successfully: ${file.name}`);
        setSVGFileName(file.name);
        
        return gcode;
      } catch (error) {
        setLoading(false);
        showError(`Error converting SVG: ${error}`);
        console.error('SVG conversion error:', error);
        return null;
      }
    },
    [convertSVG, showSuccess, showError, setLoading]
  );

  const clearSVG = useCallback(() => {
    setSVGFileName('');
  }, []);

  return {
    handleConvertSVG,
    svgFileName,
    clearSVG,
  };
}
