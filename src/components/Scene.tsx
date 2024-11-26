import React, { useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Planet } from "./Planet";
import { StarField } from "./StarField";
import { Sun } from "./Sun";
import { useCameraControls } from "../hooks/useCameraControls";
import { PlanetData } from "@/types/types";
import { AsteroidBelt } from "./AsteroidBelt";
import { visualSolarSystemLayout } from "../data/solarSystemLayout";
import { KeyDisplay } from "./KeyDisplay"; // Add this import

interface SceneProps {
    hoveredPlanet: PlanetData | null;
    setSelectedPlanet: (planet: PlanetData | null) => void;
}

export const Scene: React.FC<SceneProps> = ({ hoveredPlanet, setSelectedPlanet }) => {
    const [activeKeys, setActiveKeys] = useState({}); // Add this state

    return (
        <div className="relative w-full h-full">
            <Canvas
                camera={{ 
                    position: [0, 500, 800], // More dramatic starting angle
                    fov: 60, // Narrower FOV for more cinematic look
                    near: 0.1,      // Much closer near plane
                    far: 200000     // Much further far plane
                }}
                gl={{
                    antialias: true,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    outputEncoding: THREE.sRGBEncoding,
                    powerPreference: "high-performance",
                    alpha: false,
                    webgl2: true,
                    logarithmicDepthBuffer: true, // Enable this for better depth precision
                }}
                performance={{ min: 0.5 }} // Allow frame rate to drop to maintain smoothness
            >
                <React.Suspense fallback={null}>
                    <SceneContent 
                        hoveredPlanet={hoveredPlanet} 
                        setSelectedPlanet={setSelectedPlanet}
                        onKeysChange={setActiveKeys} 
                    />
                </React.Suspense>
            </Canvas>
            <KeyDisplay activeKeys={activeKeys} />
        </div>
    );
};

interface SceneContentProps extends SceneProps {
    onKeysChange: (keys: any) => void;
}

const SceneContent: React.FC<SceneContentProps> = ({ 
    hoveredPlanet, 
    setSelectedPlanet,
    onKeysChange 
}) => {
    const { camera } = useThree();
    const { jumpToPlanet, resetCamera, targetPlanet, isFollowing, activeKeys } = useCameraControls();
    const orbitControlsRef = useRef<any>(null);

    // Simplify camera layer setup
    useEffect(() => {
        camera.layers.enable(0);  // Default layer only
    }, [camera]);

    // Disable orbit controls when following a planet
    useEffect(() => {
        if (orbitControlsRef.current) {
            // Completely disable controls when following
            orbitControlsRef.current.enabled = !isFollowing;
            
            // Reset damping when switching modes
            orbitControlsRef.current.enableDamping = !isFollowing;
            orbitControlsRef.current.dampingFactor = isFollowing ? 0 : 0.05;
        }
    }, [isFollowing]);

    // Keyboard event handler
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key.toLowerCase() === 'x' && targetPlanet) {
                console.log("Resetting camera position");
                resetCamera();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [targetPlanet, resetCamera]);

    // Cleanup on component unmount only
    useEffect(() => {
        return () => {
            if (targetPlanet) {
                resetCamera();
                setSelectedPlanet(null);
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update parent component with active keys
    useEffect(() => {
        onKeysChange(activeKeys);
    }, [activeKeys, onKeysChange]);

    return (
        <>
            <color attach="background" args={["#1c1f22"]} /> {/* Very slightly blue-tinted black */}
            <fog attach="fog" args={["#1c1f22", 3500, 30000]} /> {/* Matching fog color */}
            <StarField />
            <ambientLight intensity={1.5} /> {/* Increased base ambient light */}
            <Sun />
            {visualSolarSystemLayout.objects.map((object, index) => (
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
                enabled={!isFollowing}
                enablePan={false}       // Disable panning
                enableZoom={false}      // Disable zooming
                enableRotate={false}    // Disable rotation
                makeDefault
                target={[0, 0, 0]}
                enableDamping={false}
                autoRotate={false}
                screenSpacePanning={false}
                mouseButtons={{}}        // Empty object to disable all mouse buttons
            />
        </>
    );
};