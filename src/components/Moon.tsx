import React, { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface MoonProps {
    orbitRadius: number;
    size: number;
    color: string;
    period: number;
    planetRef: React.RefObject<THREE.Mesh>;  // Add planetRef prop
}

export const Moon: React.FC<MoonProps> = ({ orbitRadius, size, color, period, planetRef }) => {
    const [angle, setAngle] = useState(Math.random() * 360);
    const moonRef = useRef<THREE.Mesh>(null);
    const speedMultiplier = 5;

    const geometry = useMemo(() => new THREE.SphereGeometry(size, 16, 16), [size]);
    const material = useMemo(() => new THREE.MeshStandardMaterial({ color }), [color]);

    useFrame((_, delta) => {
        if (!moonRef.current || !planetRef.current) return;
        
        // Update moon's orbit angle
        setAngle(angle => (angle + (delta * speedMultiplier) / period) % 360);
        
        // Calculate moon's position relative to its orbit
        const x = Math.cos(angle) * orbitRadius;
        const z = Math.sin(angle) * orbitRadius;
        
        // Get planet's current position
        const planetPos = planetRef.current.position;
        
        // Set moon's position relative to planet
        moonRef.current.position.set(
            planetPos.x + x,
            planetPos.y,
            planetPos.z + z
        );
    });

    return (
        <mesh ref={moonRef}>
            <primitive object={geometry} />
            <primitive object={material} />
        </mesh>
    );
};