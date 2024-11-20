import React, { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { BackSide } from "three";
import { Planet } from "./Planet";
import { StarField } from "./StarField";
import { Sun } from "./Sun";
import { planets } from "../data/planetData";
import { useCameraControls } from "../hooks/useCameraControls";
import { PlanetData } from "@/types/types";

interface SceneProps {
    hoveredPlanet: PlanetData | null;
}

export const Scene: React.FC<SceneProps> = ({ hoveredPlanet }) => {
    return (
        <Canvas
            camera={{ position: [0, 200, 300], fov: 70 }}
            gl={{
                antialias: true,
                toneMapping: THREE.ACESFilmicToneMapping,
                outputEncoding: THREE.sRGBEncoding,
                powerPreference: "high-performance",
                alpha: false,
                webgl2: true,
            }}
        >
            <SceneContent hoveredPlanet={hoveredPlanet} />
        </Canvas>
    );
};

const SceneContent: React.FC<SceneProps> = ({ hoveredPlanet }) => {
    const { camera } = useThree();
    const { cameraRef, jumpToPlanet, resetCamera, targetPlanet } = useCameraControls();

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key.toLowerCase() === 'x' && targetPlanet) {
                resetCamera();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [targetPlanet, resetCamera]);

    return (
        <>
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
                <Planet
                    key={index}
                    {...planet}
                    onClick={(mesh) => jumpToPlanet(planet, mesh)}
                />
            ))}
            <OrbitControls
                enabled={!targetPlanet} // Disable controls when following a planet
                enablePan={true}
                enableZoom={false}
                enableRotate={true}
                minDistance={100}
                maxDistance={1000}
            />
        </>
    );
};