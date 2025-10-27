'use client';

import { useSimulation } from '@/contexts/simulation-context';
import { useUI } from '@/contexts/ui-context';
import { useSettings } from '@/contexts/settings-context';
import { TRANSLATIONS } from '@/lib/constants';

interface PlaybackPanelProps {
  playbackController: any;
}

export default function PlaybackPanel({ playbackController }: PlaybackPanelProps) {
  const { toolPosition, simulationState } = useSimulation();
  const { togglePlaybackMinimized, uiState } = useUI();
  const { settings } = useSettings();
  const t = TRANSLATIONS[settings.language];

  const handlePlay = () => {
    if (playbackController) {
      playbackController.play();
    }
  };

  const handlePause = () => {
    if (playbackController) {
      playbackController.pause();
    }
  };

  const handleReset = () => {
    if (playbackController) {
      playbackController.reset();
    }
  };

  return (
    <div className="fixed right-5 bottom-5 w-80 panel z-10 transition-all duration-300">
      <div className="flex items-center justify-between p-3 bg-dark-800/70 border-b border-dark-700 rounded-t-xl cursor-move">
        <div className="flex items-center gap-2">
          <i className="fas fa-play-circle text-dark-500 text-xs" />
          <h3 className="text-sm font-semibold text-gray-100">{t.playback.title}</h3>
        </div>
        <button
          onClick={togglePlaybackMinimized}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-dark-700/30 hover:bg-dark-600/50 border border-dark-600 transition-all"
        >
          <i className={`fas fa-chevron-${uiState.isPlaybackMinimized ? 'up' : 'down'} text-xs text-dark-400`} />
        </button>
      </div>

      {!uiState.isPlaybackMinimized && (
        <div className="p-3.5 space-y-3">
          <div className="flex gap-2">
            <button onClick={handlePlay} disabled={simulationState.isPlaying} className="btn btn-success flex-1 flex items-center justify-center gap-2">
              <i className="fas fa-play text-xs" />
              <span className="text-sm">{t.playback.play}</span>
            </button>
            <button onClick={handlePause} disabled={!simulationState.isPlaying} className="btn btn-warning flex-1 flex items-center justify-center gap-2">
              <i className="fas fa-pause text-xs" />
              <span className="text-sm">{t.playback.pause}</span>
            </button>
            <button onClick={handleReset} className="btn btn-danger flex-1 flex items-center justify-center gap-2">
              <i className="fas fa-stop text-xs" />
              <span className="text-sm">{t.playback.reset}</span>
            </button>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">
              {t.playback.toolPosition}
            </h4>
            <div className="bg-dark-800/60 rounded-lg p-2.5 font-mono text-xs text-gray-100 leading-relaxed">
              <div>X: {toolPosition.x.toFixed(3)} | Y: {toolPosition.y.toFixed(3)} | Z: {toolPosition.z.toFixed(3)}</div>
              <div className="mt-1">
                Feed: {toolPosition.feed > 0 ? `${toolPosition.feed} mm/min` : '-'} | Spindle: {toolPosition.spindle}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
