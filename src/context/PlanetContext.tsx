import React, { createContext } from 'react';
import { PlanetData } from '../types/types';

interface PlanetContextType {
    hoveredPlanet: PlanetData | null;
    selectedPlanet: PlanetData | null;
    setHoveredPlanet: (planet: PlanetData | null) => void;
    setSelectedPlanet: (planet: PlanetData | null) => void;
}

const defaultContext: PlanetContextType = {
    hoveredPlanet: null,
    selectedPlanet: null,
    setHoveredPlanet: () => undefined,
    setSelectedPlanet: () => undefined,
};

export const PlanetContext = createContext<PlanetContextType>(defaultContext);