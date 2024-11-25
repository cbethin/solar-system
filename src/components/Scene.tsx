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
import { AsteroidBelt } from "./AsteroidBelt";
import { solarSystemLayout } from "../data/solarSystemLayout";

interface SceneProps {
    hoveredPlanet: PlanetData | null;
    setSelectedPlanet: (planet: PlanetData | null) => void;
}

export const Scene: React.FC<SceneProps> = ({ hoveredPlanet, setSelectedPlanet }) => {
    return (
        <Canvas
            camera={{ 
                position: [0, 500, 800], // More dramatic starting angle
                fov: 60, // Narrower FOV for more cinematic look
                near: 10,
                far: 20000
            }}
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
            <color attach="background" args={["#000005"]} /> {/* Deeper space black */}
            <fog attach="fog" args={["#000010", 3500, 12000]} /> {/* More atmospheric fog */}
            <StarField />
            <mesh>
                <sphereGeometry args={[995, 32, 32]} /> {/* Increased boundary sphere */}
                <meshBasicMaterial
                    color="#000020"
                    side={BackSide}
                    transparent
                    opacity={0.3} /* Reduced opacity */
                />
            </mesh>
            <ambientLight intensity={1.5} /> {/* Increased base ambient light */}
            <Sun />
            {solarSystemLayout.objects.map((object, index) => (
                object.type === 'planet' ? (
                    <Planet
                        key={index}
                        {...object}
                        onClick={(mesh) => {
                            jumpToPlanet(object, mesh);
                            setSelectedPlanet(object);
                        }}
                    />
                ) : (
                    <AsteroidBelt
                        key={index}
                        radius={object.orbitRadius}
                        width={object.width}
                        count={object.asteroidCount}
                        color={object.color}
                    />
                )
            ))}
            <OrbitControls
                ref={orbitControlsRef}
                enabled={!isFollowing}  // Only disable controls when following a planet
                enablePan={true}
                enableZoom={true}       // Changed to true to allow zooming
                enableRotate={true}
                minDistance={100}
                maxDistance={8000} // Increased from 5000
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