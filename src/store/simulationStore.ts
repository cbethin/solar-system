import { create } from 'zustand';

interface SimulationState {
    planetScale: number;
    setPlanetScale: (scale: number) => void;
    isRealisticSize: boolean;
    toggleSizeMode: () => void;
}

export const useSimulationStore = create<SimulationState>()((set) => ({
    planetScale: 5,
    setPlanetScale: (scale) => set({ planetScale: scale }),
    isRealisticSize: false,
    toggleSizeMode: () => set((state) => ({ isRealisticSize: !state.isRealisticSize })),
}));
