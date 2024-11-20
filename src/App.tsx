import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { BackSide } from "three";
import { Planet } from "./components/Planet";
import { StarField } from "./components/StarField";
import { Sun } from "./components/Sun";
import { Tooltip } from "./components/Tooltip";
import { PlanetContext } from "./context/PlanetContext";
import { PlanetData } from "./types/types";

const SolarSystem = () => {
    const [hoveredPlanet, setHoveredPlanet] = useState<PlanetData | null>(null);
    const planets: PlanetData[] = [
        {
            orbitRadius: 40,
            period: 0.24,
            size: 3,
            color: "#A0522D",
            name: "Mercury",
            distanceFromSun: 0.39,
            eccentricity: 0.206, // Most eccentric orbit in solar system
        },
        {
            orbitRadius: 60,
            period: 0.62,
            size: 6,
            color: "#DEB887",
            name: "Venus",
            distanceFromSun: 0.72,
            eccentricity: 0.007, // Nearly circular orbit
        },
        {
            orbitRadius: 80,
            period: 1,
            size: 6.4,
            color: "#4169E1",
            name: "Earth",
            distanceFromSun: 1,
            eccentricity: 0.0167, // Reference for scale
        },
        {
            orbitRadius: 100,
            period: 1.88,
            size: 4,
            color: "#CD853F",
            name: "Mars",
            distanceFromSun: 1.52,
            eccentricity: 0.0934, // Notably eccentric
        },
        {
            orbitRadius: 140,
            period: 11.86,
            size: 12,
            color: "#DAA520",
            name: "Jupiter",
            distanceFromSun: 5.2,
            eccentricity: 0.0489,
        },
        {
            orbitRadius: 180,
            period: 29.46,
            size: 10,
            color: "#F4C430",
            name: "Saturn",
            distanceFromSun: 9.54,
            eccentricity: 0.0542,
        },
        {
            orbitRadius: 220,
            period: 84.01,
            size: 8,
            color: "#87CEEB",
            name: "Uranus",
            distanceFromSun: 19.18,
            eccentricity: 0.0472,
        },
        {
            orbitRadius: 260,
            period: 164.79,
            size: 7.8,
            color: "#1E90FF",
            name: "Neptune",
            distanceFromSun: 30.06,
            eccentricity: 0.0086, // Almost circular orbit
        },
    ];

    return (
        <PlanetContext.Provider value={{ setHoveredPlanet }}>
            <div className="w-full h-screen relative">
                <Canvas
                    camera={{ position: [0, 200, 400], fov: 70 }}
                    gl={{
                        antialias: true,
                        toneMapping: THREE.ACESFilmicToneMapping,
                        outputEncoding: THREE.sRGBEncoding,
                        powerPreference: "high-performance",
                        alpha: false,
                        webgl2: true,
                    }}
                >
                    <color attach="background" args={["#000010"]} />
                    <fog attach="fog" args={["#000010", 500, 1000]} />
                    <StarField />
                    <mesh>
                        <sphereGeometry args={[495, 32, 32]} />
                        <meshBasicMaterial
                            color="#000020"
                            side={BackSide}
                            transparent
                            opacity={0.5}
                        />
                    </mesh>
                    <ambientLight intensity={1} />
                    <Sun />
                    {planets.map((planet, index) => (
                        <Planet key={index} {...planet} />
                    ))}
                    <OrbitControls
                        enablePan={true}
                        enableZoom={false}
                        enableRotate={true}
                        minDistance={100}
                        maxDistance={1000}
                    />
                </Canvas>
                <Tooltip hoveredPlanet={hoveredPlanet} />
            </div>
        </PlanetContext.Provider>
    );
};

export default SolarSystem;
