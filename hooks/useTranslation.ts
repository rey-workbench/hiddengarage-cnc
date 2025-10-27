import { useTranslations } from 'next-intl';

export function useTranslation() {
  const t = useTranslations();

  return {
    t: (key: string, values?: Record<string, any>) => t(key, values),
    
    common: (key: string, values?: Record<string, any>) => t(`common.${key}`, values),
    tab: (key: string, values?: Record<string, any>) => t(`tab.${key}`, values),
    gcode: (key: string, values?: Record<string, any>) => t(`gcode.${key}`, values),
    image: (key: string, values?: Record<string, any>) => t(`image.${key}`, values),
    view: (key: string, values?: Record<string, any>) => t(`view.${key}`, values),
    settings: (key: string, values?: Record<string, any>) => t(`settings.${key}`, values),
    playback: (key: string, values?: Record<string, any>) => t(`playback.${key}`, values),
    stats: (key: string, values?: Record<string, any>) => t(`stats.${key}`, values),
    legend: (key: string, values?: Record<string, any>) => t(`legend.${key}`, values),
    status: (key: string, values?: Record<string, any>) => t(`status.${key}`, values),
    msg: (key: string, values?: Record<string, any>) => t(`msg.${key}`, values),
  };
}
