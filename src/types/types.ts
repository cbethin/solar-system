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

export interface AsteroidBeltData {
    type: 'asteroidBelt';
    orbitRadius: number;
    width: number;
    asteroidCount: number;
    color: string;
    name: string;
}

export interface SolarSystemObject {
    type: 'planet';
    orbitRadius: number;
    period: number;
    size: number;
    color: string;
    name: string;
    eccentricity: number;
    distanceFromSun: number;
}

export interface OortCloud {
    type: 'oortCloud';
    name: string;
    innerRadius: number;
    outerRadius: number;
    particleCount: number;
}

export type CelestialObject = SolarSystemObject | AsteroidBeltData | OortCloud;

export interface StarLightProperties {
    intensity: number;      // brightness of the point light
    decay: number;         // how quickly the light fades with distance
    distance: number;      // maximum range of light effect
    color: string;        // color of the star light
}

export interface StarFieldConfiguration {
    sphereRadius: number;     // radius of the star field sphere
    starCount: number;        // number of stars to render
    starBrightness: number;  // overall brightness multiplier for all stars
    minDistanceFromNeptune: number;
    scaleMultiplier: number;
    lightProperties: StarLightProperties; // configuration for star point lights
}

export interface CameraConfiguration {
    fov: number;             // field of view in degrees
    near: number;            // near clipping plane
    far: number;             // far clipping plane
    position: [number, number, number]; // initial camera position
}

export interface FogConfiguration {
    enabled: boolean;
    color: string;
    near: number;
    far: number;
}

export interface SolarSystemLayout {
    objects: CelestialObject[];
    starField: StarFieldConfiguration;
    camera: CameraConfiguration;
    fog: FogConfiguration;
}