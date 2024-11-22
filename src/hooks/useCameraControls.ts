import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PlanetData } from "../types/types";
import * as THREE from "three";
import gsap from "gsap";

export const useCameraControls = () => {
    const { camera } = useThree();
    const targetPlanet = useRef<PlanetData | null>(null);
    const previousPosition = useRef<THREE.Vector3 | null>(null);
    const previousRotation = useRef<THREE.Euler | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const rotationAngle = useRef(0);
    const targetPosition = useRef(new THREE.Vector3());
    const meshRef = useRef<THREE.Mesh | null>(null);
    const travelProgress = useRef(0);
    const ROTATION_SPEED = 0.2;
    const TRAVEL_DURATION = 4.5; // Increased from 2.5 to 4.5

    useFrame((state, delta) => {
        if (isFollowing && targetPlanet.current && meshRef.current) {
            meshRef.current.getWorldPosition(targetPosition.current);
            
            if (travelProgress.current < 1) {
                travelProgress.current = Math.min(travelProgress.current + delta / TRAVEL_DURATION, 1);
                
                // Calculate destination point to the side of the planet
                const radius = targetPlanet.current.size * 4;
                const destPosition = new THREE.Vector3(
                    targetPosition.current.x + radius,
                    targetPosition.current.y + (radius * 0.3), // Slight upward offset
                    targetPosition.current.z
                );

                // Added smoother easing function
                const easing = 1 - Math.pow(1 - travelProgress.current, 4); // Changed from cubic to quartic easing
                camera.position.lerp(destPosition, easing);
                camera.lookAt(targetPosition.current);
            } else {
                // Rotate camera position around the planet horizontally
                rotationAngle.current += delta * ROTATION_SPEED;
                const radius = targetPlanet.current.size * 4;
                
                camera.position.set(
                    targetPosition.current.x + Math.cos(rotationAngle.current) * radius,
                    targetPosition.current.y + (radius * 0.3), // Maintain slight upward offset
                    targetPosition.current.z + Math.sin(rotationAngle.current) * radius
                );
            }
            
            // Always look at the planet
            camera.lookAt(targetPosition.current);
        }
    });

    const jumpToPlanet = (planet: PlanetData, mesh: THREE.Mesh) => {
        previousPosition.current = camera.position.clone();
        previousRotation.current = camera.rotation.clone();
        targetPlanet.current = planet;
        meshRef.current = mesh;
        
        rotationAngle.current = 0;
        travelProgress.current = 0;
        setIsFollowing(true);
    };

    const resetCamera = () => {
        if (!previousPosition.current || !previousRotation.current) return;
        setIsFollowing(false);
        
        gsap.to(camera.position, {
            x: previousPosition.current.x,
            y: previousPosition.current.y,
            z: previousPosition.current.z,
            duration: 2,
            ease: "power2.inOut"
        });

        gsap.to(camera.rotation, {
            x: previousRotation.current.x,
            y: previousRotation.current.y,
            z: previousRotation.current.z,
            duration: 2,
            ease: "power2.inOut",
            onComplete: () => {
                targetPlanet.current = null;
                previousPosition.current = null;
                previousRotation.current = null;
            }
        });
    };

    return { 
        jumpToPlanet, 
        resetCamera, 
        targetPlanet: targetPlanet.current,
        isFollowing 
    };
};