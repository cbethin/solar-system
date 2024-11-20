import React from 'react';
import { PlanetContextType } from '../types/types';

const defaultContext: PlanetContextType = {
    setHoveredPlanet: () => undefined,
};

export const PlanetContext = React.createContext<PlanetContextType>(defaultContext);