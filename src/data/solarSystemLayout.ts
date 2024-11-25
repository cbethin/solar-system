import { SolarSystemLayout } from "../types/types";
import { BASE_SCALE } from "../utils/constants";

export const solarSystemLayout: SolarSystemLayout = {
    objects: [
        {
            type: 'planet',
            name: "Mercury",
            orbitRadius: 180,
            period: 0.24,
            size: 1.7 * BASE_SCALE,
            color: "#A0522D",
            eccentricity: 0.205,
            distanceFromSun: 0.387,
        },
        {
            type: 'planet',
            name: "Venus",
            orbitRadius: 250,
            period: 0.62,
            size: 4.2 * BASE_SCALE,
            color: "#DEB887",
            eccentricity: 0.007,
            distanceFromSun: 0.723,
        },
        {
            type: 'planet',
            name: "Earth",
            orbitRadius: 320,
            period: 1,
            size: 4.4 * BASE_SCALE,
            color: "#4169E1",
            eccentricity: 0.017,
            distanceFromSun: 1,
        },
        {
            type: 'planet',
            name: "Mars",
            orbitRadius: 400,
            period: 1.88,
            size: 2.4 * BASE_SCALE,
            color: "#CD853F",
            eccentricity: 0.093,
            distanceFromSun: 1.524,
        },
        {
            type: 'asteroidBelt',
            name: "Main Asteroid Belt",
            orbitRadius: 500,
            width: 50,
            asteroidCount: 2000,
            color: "#666666"
        },
        {
            type: 'planet',
            name: "Jupiter",
            orbitRadius: 600,
            period: 11.86,
            size: 48.2 * BASE_SCALE,
            color: "#DEB887",
            eccentricity: 0.048,
            distanceFromSun: 5.203,
        },
        {
            type: 'planet',
            name: "Saturn",
            orbitRadius: 700,
            period: 29.46,
            size: 40.3 * BASE_SCALE,
            color: "#F4A460",
            eccentricity: 0.054,
            distanceFromSun: 9.537,
        },
        {
            type: 'planet',
            name: "Uranus",
            orbitRadius: 800,
            period: 84.01,
            size: 17.1 * BASE_SCALE,
            color: "#87CEEB",
            eccentricity: 0.047,
            distanceFromSun: 19.191,
        },
        {
            type: 'planet',
            name: "Neptune",
            orbitRadius: 900,
            period: 164.79,
            size: 16.6 * BASE_SCALE,
            color: "#1E90FF",
            eccentricity: 0.009,
            distanceFromSun: 30.069,
        },
        {
            type: 'oortCloud',
            name: "Oort Cloud",
            innerRadius: 3500,
            outerRadius: 4500,
            particleCount: 10000
        }
    ]
};