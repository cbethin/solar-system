import React, { createContext } from 'react';
import { PlanetData } from '../types/types';

interface PlanetContextType {
    hoveredPlanet: PlanetData | null;
    setHoveredPlanet: (planet: PlanetData | null) => void;
}

const defaultContext: PlanetContextType = {
    hoveredPlanet: null,
    setHoveredPlanet: () => undefined,
};

export const PlanetContext = createContext<PlanetContextType>(defaultContext);