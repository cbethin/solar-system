import { SolarSystemLayout, PlanetData, CelestialObject } from '../types/types';

interface ScaleFactors {
    size: number;        // Scale factor for planet/object sizes
    distance: number;    // Scale factor for distances/orbit radii
    minPlanetSize: number;  // Minimum visible planet size
    maxPlanetSize: number;  // Maximum planet size for largest planet (Jupiter)
    minOrbitRadius: number; // Minimum orbit radius (Mercury)
    maxOrbitRadius: number; // Maximum orbit radius (Neptune)
}

// Remove MOON_REFERENCE interface and const

export const DEFAULT_SCALE_FACTORS: ScaleFactors = {
    size: 3.5,           // Increased from 2.5
    distance: 2.0,       // Increased from 1.5
    minPlanetSize: 6,    // Increased from 4
    maxPlanetSize: 45,   // Increased from 40
    minOrbitRadius: 250, // Increased from 180
    maxOrbitRadius: 2000 // Increased from 1500
};

export function createVisualLayout(layout: SolarSystemLayout, factors: ScaleFactors = DEFAULT_SCALE_FACTORS): SolarSystemLayout {
    // Find min/max values from real data
    const planets = layout.objects.filter(obj => obj.type === 'planet') as any[];
    const realMinDistance = Math.min(...planets.map(p => p.distanceFromSun));
    const realMaxDistance = Math.max(...planets.map(p => p.distanceFromSun));
    const realMinSize = Math.min(...planets.map(p => p.size));
    const realMaxSize = Math.max(...planets.map(p => p.size));

    // Add minimum spacing between orbits
    const MINIMUM_ORBIT_SPACING = 100; // minimum pixels between orbits

    // Modified scaleDistance function
    const scaleDistance = (value: number, index: number) => {
        // Special case for asteroid belt - place it between Mars and Jupiter
        if (value === layout.objects.find(obj => obj.type === 'asteroidBelt')?.orbitRadius) {
            const mars = layout.objects.find(obj => obj.type === 'planet' && obj.name === 'Mars');
            const jupiter = layout.objects.find(obj => obj.type === 'planet' && obj.name === 'Jupiter');
            
            if (mars && jupiter) {
                const marsRadius = scaleDistance(mars.distanceFromSun, index);
                const jupiterRadius = scaleDistance(jupiter.distanceFromSun, index);
                return marsRadius + (jupiterRadius - marsRadius) * 0.3; // Place at 30% between Mars and Jupiter
            }
        }

        // Normal scaling for other objects
        const baseRadius = mapRange(
            value,
            realMinDistance,
            realMaxDistance,
            factors.minOrbitRadius,
            factors.maxOrbitRadius
        );
        
        return baseRadius + (index * MINIMUM_ORBIT_SPACING);
    };

    const scaleSize = (value: number) => {
        return mapRange(
            value,
            realMinSize,
            realMaxSize,
            factors.minPlanetSize,
            factors.maxPlanetSize
        );
    };

    // Scale the objects with spacing
    const scaledObjects = layout.objects.map((obj, index) => {
        if (obj.type === 'planet') {
            const planet = obj as PlanetData;
            const scaledSize = scaleSize(planet.size);
            
            return {
                ...planet,
                size: scaledSize,
                orbitRadius: scaleDistance(planet.distanceFromSun, index)
                // Remove moons property
            };
        } else if (obj.type === 'asteroidBelt') {
            const mars = layout.objects.find(obj => obj.type === 'planet' && obj.name === 'Mars');
            const jupiter = layout.objects.find(obj => obj.type === 'planet' && obj.name === 'Jupiter');
            
            if (mars && jupiter) {
                const beltDistance = mars.distanceFromSun + 
                    (jupiter.distanceFromSun - mars.distanceFromSun) * 0.4;
                
                // Scale the width using the same distance scaling
                const scaledWidth = mapRange(
                    obj.width,
                    realMinDistance,
                    realMaxDistance,
                    factors.minOrbitRadius,
                    factors.maxOrbitRadius
                ) * 0.2; // Reduce by 20% for visual clarity
                
                return {
                    ...obj,
                    orbitRadius: scaleDistance(beltDistance, index),
                    width: scaledWidth
                };
            }
            return obj;
        } else if (obj.type === 'oortCloud') {
            return {
                ...obj,
                innerRadius: factors.maxOrbitRadius * 1.5,
                outerRadius: factors.maxOrbitRadius * 2
            };
        }
        return obj;
    });

    return {
        ...layout,
        objects: scaledObjects,
        // Adjust camera and other configurations
        camera: {
            ...layout.camera,
            far: factors.maxOrbitRadius * 3,
            position: [0, factors.maxOrbitRadius * 0.3, factors.maxOrbitRadius * 0.6]
        }
    };
}

// Utility function to map a value from one range to another
function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}