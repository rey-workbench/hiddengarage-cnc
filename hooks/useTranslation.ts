import { useTranslations } from 'next-intl';

/**
 * Custom translation hook dengan shorthand methods
 * Wrap next-intl useTranslations untuk kemudahan penggunaan
 * 
 * @example
 * const { t, tab, gcode } = useTranslation();
 * 
 * // Full path
 * t('gcode.parse')
 * 
 * // Shorthand - lebih pendek
 * gcode('parse')
 * tab('settings')
 */
export function useTranslation() {
  const t = useTranslations();

  return {
    // Full translation function
    t: (key: string) => t(key),
    
    // Shorthand methods - lebih pendek dan readable
    common: (key: string) => t(`common.${key}`),
    tab: (key: string) => t(`tab.${key}`),
    gcode: (key: string) => t(`gcode.${key}`),
    image: (key: string) => t(`image.${key}`),
    view: (key: string) => t(`view.${key}`),
    settings: (key: string) => t(`settings.${key}`),
    playback: (key: string) => t(`playback.${key}`),
    stats: (key: string) => t(`stats.${key}`),
    legend: (key: string) => t(`legend.${key}`),
    status: (key: string) => t(`status.${key}`),
    msg: (key: string) => t(`msg.${key}`),
  };
}
