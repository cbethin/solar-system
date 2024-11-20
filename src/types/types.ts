
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
    setHoveredPlanet: (planet: PlanetData | null) => void;
}