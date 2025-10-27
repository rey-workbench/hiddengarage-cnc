import { useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import type { UISize } from '@/lib/Constants';

const SCALE_MAP: Record<UISize, number> = {
  small: 0.85,
  medium: 1.0,
  large: 1.15,
};

export function useUIScale() {
  const { settings } = useSettings();

  useEffect(() => {
    const scale = SCALE_MAP[settings.uiSize];
    
    document.body.style.zoom = `${scale}`;

    return () => {
      document.body.style.zoom = '1';
    };
  }, [settings.uiSize]);
}
