'use client';

import { useEffect } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import GCodeTab from '@/components/tabs/GCodeTab';

export default function GCodePage() {
  const { sceneManagers } = useWorkspace();

  // Auto-load generated gcode from sessionStorage
  useEffect(() => {
    const generatedGCode = sessionStorage.getItem('generated-gcode');
    if (generatedGCode) {
      setTimeout(() => {
        const textarea = document.querySelector('textarea[placeholder*="G-code"]') as HTMLTextAreaElement;
        if (textarea) {
          textarea.value = generatedGCode;
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
          textarea.dispatchEvent(new Event('change', { bubbles: true }));
          textarea.focus();
          console.log('✓ Auto-loaded generated G-Code');
        }
        sessionStorage.removeItem('generated-gcode');
      }, 100);
    }
  }, []);

  return (
    <div className="ribbon-tab-content">
      {sceneManagers ? (
        <GCodeTab 
          pathRenderer={sceneManagers.pathRenderer} 
          sceneManager={sceneManagers.sceneManager} 
          toolhead={sceneManagers.toolhead} 
        />
      ) : (
        <div className="text-center text-dark-400 py-8">
          Initializing 3D scene...
        </div>
      )}
    </div>
  );
}
