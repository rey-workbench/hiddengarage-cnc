import { useTranslations } from 'next-intl';

export function useTranslation() {
  const t = useTranslations();

  return {
    t: (key: string) => t(key),
    
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
