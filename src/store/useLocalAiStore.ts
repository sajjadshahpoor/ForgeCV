import { create } from 'zustand';

export type LocalAiStatus = 'idle' | 'loading' | 'ready' | 'error';

interface LocalAiState {
  status: LocalAiStatus;
  progress: number; // 0-100, meaningful only while loading
  error: string;
  setStatus: (status: LocalAiStatus) => void;
  setProgress: (progress: number) => void;
  setError: (error: string) => void;
}

export const useLocalAiStore = create<LocalAiState>((set) => ({
  status: 'idle',
  progress: 0,
  error: '',
  setStatus: (status) => set({ status }),
  setProgress: (progress) => set({ progress }),
  setError: (error) => set({ error, status: 'error' }),
}));
