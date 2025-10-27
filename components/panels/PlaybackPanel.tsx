'use client';

import { useSimulation } from '@/contexts/SimulationContext';
import { useUI } from '@/contexts/UiContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useTranslation } from '@/hooks/useTranslation';
import DraggablePanel from '../ui/DraggablePanel';
import Slider from '../ui/Slider';

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
      initialSize={{ width: 280, height: 240 }}
      minSize={{ width: 260, height: 220 }}
      maxSize={{ width: 420, height: 340 }}
      isMinimized={uiState.playbackPanelState.isMinimized}
      onToggleMinimize={togglePlaybackMinimized}
      onPositionChange={(position) => updatePlaybackPanelState({ position })}
      onSizeChange={(size) => updatePlaybackPanelState({ size })}
      resizable={true}
    >
      <div className="space-y-2.5">
        {/* Compact Button Group */}
        <div className="flex gap-1.5">
          <button 
            onClick={handlePlay} 
            disabled={simulationState.isPlaying} 
            className="flex-1 px-2 py-1.5 rounded-lg font-semibold text-xs transition-all duration-300 
              bg-gradient-to-br from-green-500 to-green-600 hover:from-green-400 hover:to-green-500
              text-white border border-green-700/50
              shadow-[0_4px_12px_rgba(34,197,94,0.25)] hover:shadow-[0_6px_20px_rgba(34,197,94,0.4)]
              hover:-translate-y-0.5 active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
              flex items-center justify-center gap-2"
          >
            <i className="fas fa-play text-xs" />
            <span>{playback('play')}</span>
          </button>
          <button 
            onClick={handlePause} 
            disabled={!simulationState.isPlaying} 
            className="flex-1 px-2 py-1.5 rounded-lg font-semibold text-xs transition-all duration-300
              bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500
              text-white border border-amber-700/50
              shadow-[0_4px_12px_rgba(245,158,11,0.25)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.4)]
              hover:-translate-y-0.5 active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
              flex items-center justify-center gap-2"
          >
            <i className="fas fa-pause text-xs" />
            <span>{playback('pause')}</span>
          </button>
          <button 
            onClick={handleReset} 
            className="flex-1 px-2 py-1.5 rounded-lg font-semibold text-xs transition-all duration-300
              bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500
              text-white border border-red-700/50
              shadow-[0_4px_12px_rgba(239,68,68,0.25)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.4)]
              hover:-translate-y-0.5 active:scale-95
              flex items-center justify-center gap-2"
          >
            <i className="fas fa-stop text-xs" />
            <span>{playback('reset')}</span>
          </button>
        </div>

        {/* Speed Slider */}
        <Slider
          label={s('playbackSpeed')}
          value={settings.playbackSpeed}
          onChange={handleSpeedChange}
          min={0.05}
          max={4}
          step={0.05}
          showValue={true}
          unit="x"
          valueFormatter={(val) => val.toFixed(2)}
        />

        {/* Tool Position Display */}
        <div>
          <h4 className="text-[10px] font-bold text-dark-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <i className="fas fa-crosshairs text-primary-400 text-[10px]" />
            {playback('toolPosition')}
          </h4>
          <div className="relative bg-gradient-to-br from-dark-800/70 to-dark-900/60 rounded-lg p-2 border border-dark-700/60 
            shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] overflow-hidden">
            {/* Subtle glow effect */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-primary-500/5 to-transparent pointer-events-none" />
            
            {/* Position values */}
            <div className="relative space-y-1">
              <div className="flex items-center gap-2 font-mono text-[10px]">
                <span className="text-red-400 font-bold min-w-[16px]">X:</span>
                <span className="text-gray-100 font-semibold tabular-nums">{toolPosition.x.toFixed(3)}</span>
                <span className="text-green-400 font-bold min-w-[16px]">Y:</span>
                <span className="text-gray-100 font-semibold tabular-nums">{toolPosition.y.toFixed(3)}</span>
                <span className="text-blue-400 font-bold min-w-[16px]">Z:</span>
                <span className="text-gray-100 font-semibold tabular-nums">{toolPosition.z.toFixed(3)}</span>
              </div>
              
              {/* Separator */}
              <div className="h-px bg-gradient-to-r from-transparent via-dark-600 to-transparent" />
              
              {/* Feed and Spindle */}
              <div className="flex items-center gap-3 font-mono text-[10px]">
                <div className="flex items-center gap-1">
                  <i className="fas fa-tachometer-alt text-amber-400 text-[9px]" />
                  <span className="text-dark-400">Feed:</span>
                  <span className="text-gray-100 font-semibold">
                    {toolPosition.feed > 0 ? `${toolPosition.feed} mm/min` : '-'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <i className="fas fa-cog text-primary-400 text-[9px]" />
                  <span className="text-dark-400">Spindle:</span>
                  <span className={`font-semibold ${toolPosition.spindle === 'ON' ? 'text-green-400' : 'text-gray-500'}`}>
                    {toolPosition.spindle}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DraggablePanel>
  );
}
