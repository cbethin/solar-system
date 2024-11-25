import React, { useEffect, useRef } from "react";
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
                logarithmicDepthBuffer: false, // Disable unless needed
            }}
            performance={{ min: 0.5 }} // Allow frame rate to drop to maintain smoothness
        >
            <React.Suspense fallback={null}>
                <SceneContent hoveredPlanet={hoveredPlanet} setSelectedPlanet={setSelectedPlanet} />
            </React.Suspense>
        </Canvas>
    );
};

const SceneContent: React.FC<SceneProps> = ({ hoveredPlanet, setSelectedPlanet }) => {
    const { camera } = useThree();
    const { jumpToPlanet, resetCamera, targetPlanet, isFollowing } = useCameraControls();
    const orbitControlsRef = useRef<any>(null);

    // Simplify camera layer setup
    useEffect(() => {
        camera.layers.enable(0);  // Default layer only
    }, [camera]);

    // Disable orbit controls when following a planet
    useEffect(() => {
        if (orbitControlsRef.current) {
            orbitControlsRef.current.enabled = !isFollowing;
        }
    }, [isFollowing]);

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
                ref={orbitControlsRef}
                enabled={!isFollowing}  // Only disable controls when following a planet
                enablePan={true}
                enableZoom={true}       // Changed to true to allow zooming
                enableRotate={true}
                minDistance={100}
                maxDistance={1000}
                makeDefault            // Add this to make it the default controls
                target={[0, 0, 0]}
                // Add these to prevent automatic camera movements
                enableDamping={false}
                autoRotate={false}
                // Remove layers prop to allow interaction with all visible objects
                screenSpacePanning={true}
                mouseButtons={{
                    LEFT: THREE.MOUSE.ROTATE,
                    MIDDLE: THREE.MOUSE.DOLLY,
                    RIGHT: THREE.MOUSE.PAN
                }}
            />
        </>
    );
};