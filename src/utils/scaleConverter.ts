import { PlanetData, SimulationConfig } from '@/types/types';

interface ScaleFactors {
    size: number;
    distance: number;
    minPlanetSize: number;
    maxPlanetSize: number;
    minOrbitRadius: number;
    maxOrbitRadius: number;
}

export const DEFAULT_SCALE_FACTORS: ScaleFactors = {
    size: 3.5,
    distance: 2.0,
    minPlanetSize: 6,
    maxPlanetSize: 45,
    minOrbitRadius: 250,
    maxOrbitRadius: 2000
};

export function createVisualLayout(
    config: SimulationConfig | SimulationConfig['solarSystem'],
    customVisualOptions?: SimulationConfig['visualOptions']
): SimulationConfig {
    const solarSystem = 'solarSystem' in config ? config.solarSystem : config;
    const factors = customVisualOptions || ('visualOptions' in config ? config.visualOptions : DEFAULT_SCALE_FACTORS);

    const planets = solarSystem.objects.filter(obj => obj.type === 'planet') as any[];
    const realMinDistance = Math.min(...planets.map(p => p.distanceFromSun));
    const realMaxDistance = Math.max(...planets.map(p => p.distanceFromSun));
    const realMinSize = Math.min(...planets.map(p => p.size));
    const realMaxSize = Math.max(...planets.map(p => p.size));

    const MINIMUM_ORBIT_SPACING = 100;

    const scaleDistance = (value: number, index: number) => {
        if (value === solarSystem.objects.find(obj => obj.type === 'asteroidBelt')?.orbitRadius) {
            const mars = solarSystem.objects.find(obj => obj.type === 'planet' && obj.name === 'Mars');
            const jupiter = solarSystem.objects.find(obj => obj.type === 'planet' && obj.name === 'Jupiter');
            
            if (mars && jupiter) {
                const marsRadius = scaleDistance(mars.distanceFromSun, index);
                const jupiterRadius = scaleDistance(jupiter.distanceFromSun, index);
                return marsRadius + (jupiterRadius - marsRadius) * 0.3;
            }
        }

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

    const scaledObjects = solarSystem.objects.map((obj, index) => {
        if (obj.type === 'planet') {
            const planet = obj as PlanetData;
            const scaledSize = scaleSize(planet.size);
            
            return {
                ...planet,
                size: scaledSize,
                orbitRadius: scaleDistance(planet.distanceFromSun, index)
            };
        } else if (obj.type === 'asteroidBelt') {
            const mars = solarSystem.objects.find(obj => obj.type === 'planet' && obj.name === 'Mars');
            const jupiter = solarSystem.objects.find(obj => obj.type === 'planet' && obj.name === 'Jupiter');
            
            if (mars && jupiter) {
                const beltDistance = mars.distanceFromSun + 
                    (jupiter.distanceFromSun - mars.distanceFromSun) * 0.4;
                
                const scaledWidth = mapRange(
                    obj.width,
                    realMinDistance,
                    realMaxDistance,
                    factors.minOrbitRadius,
                    factors.maxOrbitRadius
                ) * 0.2;
                
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
        solarSystem: {
            objects: scaledObjects,
            starField: solarSystem.starField
        },
        visualOptions: factors,
        cameraOptions: {
            position: [0, factors.maxOrbitRadius * 0.3, factors.maxOrbitRadius * 0.6],
            fov: 60,
            near: 0.1,
            far: factors.maxOrbitRadius * 3,
            fog: {
                color: "#1c1f22",
                near: factors.maxOrbitRadius * 0.5,
                far: factors.maxOrbitRadius * 2
            }
        }
    };
}

function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}