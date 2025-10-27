import { useUI } from '@/contexts/UiContext';
import type { TabType } from '@/lib/Constants';

export function useActiveTab() {
  const { uiState, setActiveTab } = useUI();

  return {
    activeTab: uiState.activeTab as TabType,
    setActiveTab: (tab: TabType) => setActiveTab(tab),
  };
}
