import { useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import type { UISize } from '@/lib/Constants';

/**
 * Map UI size presets to zoom values
 */
const SCALE_MAP: Record<UISize, number> = {
  small: 0.85,
  medium: 1.0,
  large: 1.15,
};

/**
 * Custom hook to apply UI scaling based on uiSize setting
 * Uses CSS zoom property for crisp rendering (no blur)
 * Applies to ALL UI elements (panels, buttons, text, etc)
 */
export function useUIScale() {
  const { settings } = useSettings();

  useEffect(() => {
    const scale = SCALE_MAP[settings.uiSize];
    
    // Apply zoom to document body to scale ALL UI elements
    document.body.style.zoom = `${scale}`;

    // Cleanup on unmount
    return () => {
      document.body.style.zoom = '1';
    };
  }, [settings.uiSize]);
}
