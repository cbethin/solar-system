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
    setSelectedPlanet: (planet: PlanetData | null) => void;
}

export const Scene: React.FC<SceneProps> = ({ hoveredPlanet, setSelectedPlanet }) => {
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
            <SceneContent hoveredPlanet={hoveredPlanet} setSelectedPlanet={setSelectedPlanet} />
        </Canvas>
    );
};

const SceneContent: React.FC<SceneProps> = ({ hoveredPlanet, setSelectedPlanet }) => {
    const { camera } = useThree();
    const { cameraRef, jumpToPlanet, resetCamera, targetPlanet, isFollowing } = useCameraControls();

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key.toLowerCase() === 'x' && targetPlanet) {
                resetCamera();
                setSelectedPlanet(null);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            // Cleanup camera state when component unmounts
            if (targetPlanet) {
                resetCamera();
                setSelectedPlanet(null);
            }
        };
    }, [targetPlanet, resetCamera, setSelectedPlanet]);

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
                    onClick={(mesh) => {
                        jumpToPlanet(planet, mesh);
                        setSelectedPlanet(planet);
                    }}
                />
            ))}
            <OrbitControls
                enabled={!targetPlanet && !isFollowing}
                enablePan={true}
                enableZoom={false}
                enableRotate={true}
                minDistance={100}
                maxDistance={1000}
            />
        </>
    );
};