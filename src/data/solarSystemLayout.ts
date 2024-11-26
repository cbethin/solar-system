import { SolarSystemLayout } from "../types/types";
import { BASE_SCALE } from "../utils/constants";
import { createVisualLayout } from '../utils/scaleConverter';

// Light distance scaling
const LIGHT_SECONDS_TO_PIXELS = 180 / 193; // Mercury's 193 light-seconds = 180px
// Scale reference:
// Mercury: 193 ls = 180px
// Venus: 360 ls = 336px
// Earth: 499 ls = 466px
// Mars: 759 ls = 708px
// Jupiter: 2595 ls = 2421px
// Saturn: 4759 ls = 4440px
// Uranus: 9575 ls = 8932px
// Neptune: 15000 ls = 13993px

// Orbit scales:
// orbitRadius: pixels (arbitrary scale, Mercury starts at 180px)
// period: Earth years
// eccentricity: ratio (dimensionless)
// distanceFromSun: Astronomical Units (AU)

// Real diameters in km (for reference)
// Sun: 1,392,700
// Mercury: 4,879
// Venus: 12,104
// Earth: 12,742
// Mars: 6,779
// Jupiter: 139,820
// Saturn: 116,460
// Uranus: 50,724
// Neptune: 49,244

// Convert planet sizes to scale relative to Earth (Earth = 1)
const EARTH_SIZE = 12742; // km
const SIZE_SCALE = (size: number) => (size / EARTH_SIZE) * BASE_SCALE;

export const solarSystemLayout: SolarSystemLayout = {
    objects: [
        {
            type: 'planet',
            name: "Mercury",
            orbitRadius: 193 * LIGHT_SECONDS_TO_PIXELS,    // 193 light-seconds
            period: 0.24,        // years (88 days)
            size: SIZE_SCALE(4879), // Using real diameter
            color: "#A0522D",
            eccentricity: 0.205, // most eccentric of the planets
            distanceFromSun: 0.387, // AU
        },
        {
            type: 'planet',
            name: "Venus",
            orbitRadius: 360 * LIGHT_SECONDS_TO_PIXELS,    // 360 light-seconds
            period: 0.62,        // years
            size: SIZE_SCALE(12104), // Using real diameter
            color: "#DEB887",
            eccentricity: 0.007, // nearly circular orbit
            distanceFromSun: 0.723, // AU
        },
        {
            type: 'planet',
            name: "Earth",
            orbitRadius: 499 * LIGHT_SECONDS_TO_PIXELS,    // 499 light-seconds
            period: 1,           // years
            size: SIZE_SCALE(12742), // Using real diameter
            color: "#4169E1",
            eccentricity: 0.017, // nearly circular orbit
            distanceFromSun: 1  // AU
        },
        {
            type: 'planet',
            name: "Mars",
            orbitRadius: 759 * LIGHT_SECONDS_TO_PIXELS,    // 759 light-seconds
            period: 1.88,        // years
            size: 2.4 * BASE_SCALE,
            color: "#CD853F",
            eccentricity: 0.093, // more eccentric than Earth
            distanceFromSun: 1.524 // AU
        },
        {
            type: 'asteroidBelt',
            name: "Main Asteroid Belt",
            orbitRadius: 1677 * LIGHT_SECONDS_TO_PIXELS, // Between Mars and Jupiter
            // The belt extends roughly from 2.2 AU to 3.2 AU (1 AU difference)
            width: 1 * LIGHT_SECONDS_TO_PIXELS, // 1 AU converted to light-seconds to pixels
            asteroidCount: 10000,
            color: "#666666"
        },
        {
            type: 'planet',
            name: "Jupiter",
            orbitRadius: 2595 * LIGHT_SECONDS_TO_PIXELS,   // 2595 light-seconds
            period: 11.86,       // years
            size: 48.2 * BASE_SCALE,
            color: "#DEB887",
            eccentricity: 0.048, // more eccentric than Earth
            distanceFromSun: 5.203 // AU
        },
        {
            type: 'planet',
            name: "Saturn",
            orbitRadius: 4759 * LIGHT_SECONDS_TO_PIXELS,   // 4759 light-seconds
            period: 29.46,       // years
            size: 40.3 * BASE_SCALE,
            color: "#F4A460",
            eccentricity: 0.054, // more eccentric than Earth
            distanceFromSun: 9.537 // AU
        },
        {
            type: 'planet',
            name: "Uranus",
            orbitRadius: 9575 * LIGHT_SECONDS_TO_PIXELS,   // 9575 light-seconds
            period: 84.01,       // years
            size: 17.1 * BASE_SCALE,
            color: "#87CEEB",
            eccentricity: 0.047, // more eccentric than Earth
            distanceFromSun: 19.191 // AU
        },
        {
            type: 'planet',
            name: "Neptune",
            orbitRadius: 15000 * LIGHT_SECONDS_TO_PIXELS,  // 15000 light-seconds
            period: 164.79,      // years
            size: 16.6 * BASE_SCALE,
            color: "#1E90FF",
            eccentricity: 0.009, // nearly circular orbit
            distanceFromSun: 30.069 // AU
        },
        {
            type: 'oortCloud',
            name: "Oort Cloud",
            innerRadius: 3500,   // px
            outerRadius: 4500,   // px
            particleCount: 10000
        }
    ]
};

// Export both raw and scaled versions
export const rawSolarSystemLayout = solarSystemLayout;
export const visualSolarSystemLayout = createVisualLayout(solarSystemLayout);

// You can also create custom scaled versions
export const dramaticScale = createVisualLayout(solarSystemLayout, {
    size: 4,
    distance: 2.5,
    minPlanetSize: 8,
    maxPlanetSize: 60,
    minOrbitRadius: 300,
    maxOrbitRadius: 2500
});

export const wideScale = createVisualLayout(solarSystemLayout, {
    size: 4,
    distance: 3,
    minPlanetSize: 8,
    maxPlanetSize: 60,
    minOrbitRadius: 400,
    maxOrbitRadius: 3000
});

export const realisticScale = createVisualLayout(solarSystemLayout, {
    size: 3,
    distance: 2,
    minPlanetSize: 6,
    maxPlanetSize: 45,
    minOrbitRadius: 250,
    maxOrbitRadius: 2000
});