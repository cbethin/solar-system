import { create } from 'zustand';

interface SimulationState {
    planetScale: number;
    setPlanetScale: (scale: number) => void;
    isRealisticSize: boolean;
    toggleSizeMode: () => void;
    orbitSpeed: number;
    setOrbitSpeed: (speed: number) => void;
    radiusScale: number;
    setRadiusScale: (scale: number) => void;
}

export const useSimulationStore = create<SimulationState>()((set) => ({
    planetScale: 5,
    setPlanetScale: (scale) => set({ planetScale: scale }),
    isRealisticSize: false,
    toggleSizeMode: () => set((state) => ({ isRealisticSize: !state.isRealisticSize })),
    orbitSpeed: 1,
    setOrbitSpeed: (speed) => set({ orbitSpeed: speed }),
    radiusScale: 1,
    setRadiusScale: (scale) => set({ radiusScale: scale }),
}));
