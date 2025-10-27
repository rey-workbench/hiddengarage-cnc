'use client';

import { useSimulation } from '@/contexts/SimulationContext';
import { useUI } from '@/contexts/UiContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useTranslation } from '@/hooks/useTranslation';
import DraggablePanel from '../ui/DraggablePanel';

interface PlaybackPanelProps {
  playbackController: any;
}

export default function PlaybackPanel({ playbackController }: PlaybackPanelProps) {
  const { toolPosition, simulationState } = useSimulation();
  const { togglePlaybackMinimized, uiState, updatePlaybackPanelState } = useUI();
  const { settings, updateSettings } = useSettings();
  const { playback, settings: s } = useTranslation();

  const handleSpeedChange = (speed: number) => {
    updateSettings({ playbackSpeed: speed });
    if (playbackController) {
      playbackController.setSpeed(speed);
    }
  };

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
    <DraggablePanel
      id="playback-panel"
      title={playback('title')}
      icon="fas fa-play-circle"
      initialPosition={uiState.playbackPanelState.position}
      initialSize={uiState.playbackPanelState.size}
      minSize={{ width: 280, height: 200 }}
      maxSize={{ width: 500, height: 400 }}
      isMinimized={uiState.playbackPanelState.isMinimized}
      onToggleMinimize={togglePlaybackMinimized}
      onPositionChange={(position) => updatePlaybackPanelState({ position })}
      onSizeChange={(size) => updatePlaybackPanelState({ size })}
      resizable={true}
    >
      <div className="space-y-3">
        <div className="flex gap-2">
          <button 
            onClick={handlePlay} 
            disabled={simulationState.isPlaying} 
            className="btn btn-success flex-1 flex items-center justify-center gap-2"
          >
            <i className="fas fa-play text-xs" />
            <span className="text-sm">{playback('play')}</span>
          </button>
          <button 
            onClick={handlePause} 
            disabled={!simulationState.isPlaying} 
            className="btn btn-warning flex-1 flex items-center justify-center gap-2"
          >
            <i className="fas fa-pause text-xs" />
            <span className="text-sm">{playback('pause')}</span>
          </button>
          <button 
            onClick={handleReset} 
            className="btn btn-danger flex-1 flex items-center justify-center gap-2"
          >
            <i className="fas fa-stop text-xs" />
            <span className="text-sm">{playback('reset')}</span>
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider">
              {s('playbackSpeed')}
            </label>
            <span className="text-xs text-primary-400 font-mono font-semibold">
              {settings.playbackSpeed.toFixed(2)}x
            </span>
          </div>
          <input 
            type="range" 
            min="0.05" 
            max="4" 
            step="0.05" 
            value={settings.playbackSpeed}
            onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-primary-500" 
          />
        </div>

        <div>
          <h4 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">
            {playback('toolPosition')}
          </h4>
          <div className="bg-dark-800/60 rounded-lg p-2.5 font-mono text-xs text-gray-100 leading-relaxed">
            <div>X: {toolPosition.x.toFixed(3)} | Y: {toolPosition.y.toFixed(3)} | Z: {toolPosition.z.toFixed(3)}</div>
            <div className="mt-1">
              Feed: {toolPosition.feed > 0 ? `${toolPosition.feed} mm/min` : '-'} | Spindle: {toolPosition.spindle}
            </div>
          </div>
        </div>
      </div>
    </DraggablePanel>
  );
}
