import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PlanetData } from "../types/types";
import * as THREE from "three";

export const useCameraControls = () => {
    const { camera } = useThree();
    const targetPlanet = useRef<PlanetData | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const rotationAngle = useRef(0);
    const meshRef = useRef<THREE.Mesh | null>(null);
    
    useFrame((state, delta) => {
        if (isFollowing && targetPlanet.current && meshRef.current) {
            const radius = targetPlanet.current.size * 4;
            rotationAngle.current += delta * 0.2;
            
            // Update camera position to orbit the planet
            camera.position.set(
                meshRef.current.position.x + Math.cos(rotationAngle.current) * radius,
                meshRef.current.position.y + radius * 0.3,
                meshRef.current.position.z + Math.sin(rotationAngle.current) * radius
            );
            
            camera.lookAt(meshRef.current.position);
        }
    });

    const jumpToPlanet = (planet: PlanetData, mesh: THREE.Mesh) => {
        targetPlanet.current = planet;
        meshRef.current = mesh;
        setIsFollowing(true);
    };

    const resetCamera = () => {
        setIsFollowing(false);
        camera.position.set(0, 100, 200); // Higher and further back for better overview
        camera.lookAt(0, 0, 0);
        targetPlanet.current = null;
    };

    return { jumpToPlanet, resetCamera, targetPlanet: targetPlanet.current, isFollowing };
};