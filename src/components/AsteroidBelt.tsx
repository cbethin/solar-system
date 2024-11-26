import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Matrix4 } from 'three';
import { useSimulationStore } from '../store/simulationStore'; // Add this import

interface AsteroidBeltProps {
    radius: number;
    width: number;
    count: number;
    color: string;
}

export const AsteroidBelt: React.FC<AsteroidBeltProps> = ({ 
    radius, 
    width, 
    count, 
    color 
}) => {
    const meshRef = useRef<InstancedMesh>(null);
    const radiusScale = useSimulationStore(state => state.radiusScale); // Add this line
    
    // Scale asteroid count based on radius scale
    const scaledCount = Math.floor(count * Math.sqrt(radiusScale));
    
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const matrix = useMemo(() => new Matrix4(), []);

    // Generate random but stable positions for asteroids
    const positions = useMemo(() => {
        const scaledRadius = radius * radiusScale; // Scale the radius
        const scaledWidth = width * radiusScale;   // Scale the width too
        
        return Array.from({ length: scaledCount }, (_, i) => {
            const angle = Math.random() * Math.PI * 2;
            const orbitRadius = scaledRadius + (Math.random() - 0.5) * scaledWidth;
            const y = (Math.random() - 0.5) * scaledWidth * 0.5;
            
            // Scale the base sizes with radiusScale
            const isLarge = Math.random() < 0.05;
            const baseScale = (isLarge ? 
                2.5 + Math.random() * 2 :  // Large asteroids: 2.5-4.5x
                0.5 + Math.random() * 1.5   // Normal asteroids: 0.5-2x
            ) * Math.sqrt(radiusScale);     // Scale size with sqrt for more balanced scaling
            
            return {
                angle,
                radius: orbitRadius, // Renamed to avoid confusion
                y,
                rotationSpeed: 0.001 + Math.random() * 0.002,
                scale: baseScale
            };
        });
    }, [radius, width, scaledCount, radiusScale]); // Add radiusScale to dependencies

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        positions.forEach((pos, i) => {
            pos.angle += pos.rotationSpeed;
            const x = Math.cos(pos.angle) * pos.radius;
            const z = Math.sin(pos.angle) * pos.radius;
            
            dummy.position.set(x, pos.y, z);
            dummy.rotation.set(Math.random(), pos.angle, Math.random());
            dummy.scale.setScalar(pos.scale);
            dummy.updateMatrix();
            
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, scaledCount]}>
            <dodecahedronGeometry args={[0.8]} />
            <meshStandardMaterial 
                color={color} 
                roughness={0.8}
                metalness={0.2}
            />
        </instancedMesh>
    );
};