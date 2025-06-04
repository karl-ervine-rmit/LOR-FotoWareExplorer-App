import { create } from 'zustand';

interface UIState {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: UIState['theme']) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isFilterPanelOpen: boolean;
  setFilterPanelOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'system',
  setTheme: (theme) => set({ theme }),
  fontSize: 100,
  setFontSize: (fontSize) => set({ fontSize }),
  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  isFilterPanelOpen: false,
  setFilterPanelOpen: (isFilterPanelOpen) => set({ isFilterPanelOpen }),
}));