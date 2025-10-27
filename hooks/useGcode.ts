'use client';

import { useCallback } from 'react';
import { useSimulation } from '@/contexts/SimulationContext';
import { useUI } from '@/contexts/UiContext';
import { useSettings } from '@/contexts/SettingsContext';
import { CNCConstants } from '@/lib/Constants';
import type { PathRenderer } from '@/lib/three/PathRenderer';
import type { SceneManager } from '@/lib/three/SceneManager';
import type { Toolhead } from '@/lib/three/Toolhead';
import { useTranslations } from 'next-intl';

export function useGCode(
  pathRenderer: PathRenderer | null,
  sceneManager: SceneManager | null,
  toolhead: Toolhead | null
) {
  const { parseGCode } = useSimulation();
  const { showSuccess, showWarning, showError, setLoading } = useUI();
  const { settings } = useSettings();

  const t = useTranslations();

  const handleParseGCode = useCallback(async (gcodeText: string) => {
    if (!pathRenderer || !sceneManager || !toolhead) {
      showError('3D scene not initialized');
      return null;
    }

    if (!gcodeText.trim()) {
      showError('Please enter G-code');
      return null;
    }

    try {
      setLoading(true, t('status.parsing'));

      await new Promise(resolve => setTimeout(resolve, 100));

      const result = parseGCode(gcodeText, { arcSegments: settings.arcSegments });

      setLoading(true, t('status.rendering'));

      await new Promise(resolve => setTimeout(resolve, 100));

      pathRenderer.setSegments(result.segments);
      pathRenderer.buildVisuals();

      if (isFinite(result.bbox.minX)) {
        const objectSize = sceneManager.adjustCameraToFitBBox(result.bbox);
        toolhead.scale(objectSize);
        
        if (objectSize > CNCConstants.DEFAULTS.TOOLHEAD_AUTO_HIDE_SIZE) {
          toolhead.setVisible(false);
        } else {
          toolhead.setVisible(settings.showToolhead);
        }
      }

      setLoading(false);

      const bboxSize = Math.max(
        result.bbox.maxX - result.bbox.minX,
        result.bbox.maxY - result.bbox.minY,
        result.bbox.maxZ - result.bbox.minZ
      );

      if (bboxSize > CNCConstants.DEFAULTS.TOOLHEAD_AUTO_HIDE_SIZE) {
        showWarning(
          `${t('msg.objectLarge')} (${(bboxSize / 1000).toFixed(1)}m) ${t('msg.useSmallScale')}`
        );
      } else if (result.segments.length > CNCConstants.DEFAULTS.VERY_LARGE_FILE_WARNING) {
        showError(
          `${t('msg.veryLargeFile')} ${result.segments.length} ${t('msg.segments')} ${t('msg.reduceSegments')}`
        );
      } else if (result.segments.length > CNCConstants.DEFAULTS.LARGE_FILE_WARNING) {
        showWarning(
          `${t('msg.largeFile')} ${result.segments.length} ${t('msg.segments')} ${t('msg.renderingSlow') as string}`
        );
      } else {
        showSuccess(`${t('msg.gcodeSuccess')} ${result.segments.length} ${t('msg.segments')}`);
      }

      return result;
    } catch (error) {
      setLoading(false);
      showError(`Error parsing G-code: ${error}`);
      console.error('Parse error:', error);
      return null;
    }
  }, [
    pathRenderer,
    sceneManager,
    toolhead,
    parseGCode,
    settings,
    showSuccess,
    showWarning,
    showError,
    setLoading,
    t,
  ]);

  const exportGCode = useCallback((segments: any[]) => {
    if (segments.length === 0) {
      showError('No G-code to export');
      return;
    }

    const lines: string[] = [];
    lines.push('G21 ; Units in mm');
    lines.push('G90 ; Absolute positioning');
    lines.push('');

    for (const seg of segments) {
      const to = seg.to;
      if (seg.type === 'rapid') {
        lines.push(`G00 X${to[0].toFixed(3)} Y${to[1].toFixed(3)} Z${to[2].toFixed(3)}`);
      } else {
        const feed = seg.feed || CNCConstants.DEFAULTS.FEED_RATE;
        lines.push(`G01 X${to[0].toFixed(3)} Y${to[1].toFixed(3)} Z${to[2].toFixed(3)} F${feed}`);
      }
    }

    lines.push('');
    lines.push('M30 ; End program');

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exported.gcode';
    a.click();
    URL.revokeObjectURL(url);

    showSuccess('G-code exported successfully');
  }, [showSuccess, showError]);

  return {
    handleParseGCode,
    exportGCode,
  };
}
