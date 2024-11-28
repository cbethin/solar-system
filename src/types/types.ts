export interface MoonData {
    name: string;    // Add name property
    size: number;
    color: string;
    orbitRadius: number;
    period: number;
}

export interface PlanetData {
    type: 'planet';  // Add this
    orbitRadius: number;
    period: number;
    size: number;
    color: string;
    name: string;
    eccentricity: number;
    distanceFromSun: number;
    moons?: MoonData[];
    albedo: number;  // Value between 0 and 1 representing reflectivity
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

export interface SolarSystemObject extends PlanetData {
    // Remove duplicated fields since we're extending PlanetData
}

export type CelestialObject = SolarSystemObject | AsteroidBeltData;

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
    objects: Array<PlanetData | AsteroidBeltData>;
    fog: {
        color: string;
        near: number;
        far: number;
    };
    starField?: {
        count: number;
        depth: number;
        radius: number;
    };
    camera?: {
        position: [number, number, number];
        fov: number;
        near: number;
        far: number;
    };
    fog?: {
        color: string;
        near: number;
        far: number;
    };
}

export interface ScaledSolarSystemLayout extends SolarSystemLayout {
    scalingFactors?: {
        size: number;
        distance: number;
    };
}


export interface SimulationConfig {
    solarSystem: {
        objects: Array<PlanetData | AsteroidBeltData>;  // Replace 'any' with proper planet/asteroid types
        starField: {
            count: number;
            depth: number;
            radius: number;
        };
    };
    visualOptions: {
        size: number;
        distance: number;
        minPlanetSize: number;
        maxPlanetSize: number;
        minOrbitRadius: number;
        maxOrbitRadius: number;
    };
    cameraOptions: {
        position: [number, number, number];
        fov: number;
        near: number;
        far: number;
        fog: {
            color: string;
            near: number;
            far: number;
        };
    };
}