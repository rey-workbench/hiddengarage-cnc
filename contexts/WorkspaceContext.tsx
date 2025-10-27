'use client';

import { createContext, useContext, useState, useMemo, ReactNode } from 'react';

interface WorkspaceContextType {
  sceneManagers: any;
  setSceneManagers: (managers: any) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [sceneManagers, setSceneManagers] = useState<any>(null);

  const value = useMemo(() => ({ 
    sceneManagers, 
    setSceneManagers 
  }), [sceneManagers]);

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within WorkspaceProvider');
  }
  return context;
}