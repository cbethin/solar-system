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
import { KeyDisplay } from "./KeyDisplay";
import { useSimulationStore } from "../store/simulationStore"; // Add this import
import { visualSolarSystemLayout } from "@/data/solarSystemLayout";

// Add this utility function at the top of the file
const calculateSystemBounds = (solarSystemLayout: any) => {
    const maxOrbitRadius = Math.max(
        ...solarSystemLayout.objects.map((obj: any) => obj.orbitRadius || 0)
    );
    
    return {
        systemRadius: maxOrbitRadius,
        cameraFar: maxOrbitRadius * 10, // View distance 10x system size
        fog: {
            color: "#1c1f22",
            near: maxOrbitRadius * 0.5,  // Start fog at half system radius
            far: maxOrbitRadius * 20      // End fog at 5x system radius
        }
    };
};

interface SceneProps {
    hoveredPlanet: PlanetData | null;
    setSelectedPlanet: (planet: PlanetData | null) => void;
    solarSystemLayout: typeof visualSolarSystemLayout;  // Add this line
}

export const Scene: React.FC<SceneProps> = ({ 
    hoveredPlanet, 
    setSelectedPlanet,
    solarSystemLayout  // Add this
}) => {
    const [activeKeys, setActiveKeys] = useState({});
    const systemBounds = calculateSystemBounds(solarSystemLayout);

    return (
        <div className="relative w-full h-full">
            <Canvas
                camera={{ 
                    position: [0, 500, 800], // More dramatic starting angle
                    fov: 60, // Narrower FOV for more cinematic look
                    near: 0.1,      // Much closer near plane
                    far: systemBounds.cameraFar
                }}
                gl={{
                    antialias: true,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    outputColorSpace: THREE.SRGBColorSpace,
                    powerPreference: "high-performance",
                    alpha: false,
                    logarithmicDepthBuffer: true // Enable this for better depth precision
                }}
                performance={{ min: 0.5 }} // Allow frame rate to drop to maintain smoothness
            >
                <React.Suspense fallback={null}>
                    <SceneContent 
                        hoveredPlanet={hoveredPlanet} 
                        setSelectedPlanet={setSelectedPlanet}
                        onKeysChange={setActiveKeys} 
                        solarSystemLayout={solarSystemLayout}  // Add this
                        systemBounds={systemBounds}
                    />
                </React.Suspense>
            </Canvas>
            <KeyDisplay activeKeys={activeKeys} />
        </div>
    );
};

interface SceneContentProps extends SceneProps {
    onKeysChange: (keys: any) => void;
    systemBounds: ReturnType<typeof calculateSystemBounds>;
}

const SceneContent: React.FC<SceneContentProps> = ({ 
    hoveredPlanet, 
    setSelectedPlanet,
    onKeysChange,
    solarSystemLayout,  // Add this
    systemBounds
}) => {
    const { camera } = useThree();
    const { jumpToPlanet, resetCamera, targetPlanet, isFollowing, activeKeys } = useCameraControls();
    const orbitControlsRef = useRef<any>(null);
    const setShowTooltip = useSimulationStore(state => state.setShowTooltip);

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

    // Update tooltip visibility when following state or hover changes
    useEffect(() => {
        setShowTooltip(isFollowing || hoveredPlanet !== null);
    }, [isFollowing, hoveredPlanet, setShowTooltip]);

    // Update tooltip visibility on cleanup
    useEffect(() => {
        return () => {
            setShowTooltip(false);
        };
    }, [setShowTooltip]);

    return (
        <>
            <color attach="background" args={["#1c1f22"]} />
            <fog attach="fog" args={[
                systemBounds.fog.color,
                systemBounds.fog.near,
                systemBounds.fog.far
            ]} />
            <StarField />
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