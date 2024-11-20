export interface PlanetData {
    orbitRadius: number;
    period: number;
    size: number;
    color: string;
    name: string;
    eccentricity: number;
    distanceFromSun: number;
}

export interface PlanetContextType {
    hoveredPlanet: PlanetData | null;
    selectedPlanet: PlanetData | null;
    setHoveredPlanet: (planet: PlanetData | null) => void;
    setSelectedPlanet: (planet: PlanetData | null) => void;
}