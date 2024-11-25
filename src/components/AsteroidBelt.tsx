import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Matrix4 } from 'three';

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

    const dummy = useMemo(() => new THREE.Object3D(), []);
    const matrix = useMemo(() => new Matrix4(), []);

    // Generate random but stable positions for asteroids
    const positions = useMemo(() => {
        const beltRadius = radius; // Create local reference to avoid scope issues
        return Array.from({ length: count }, () => {
            const angle = Math.random() * Math.PI * 2;
            const orbitRadius = beltRadius + (Math.random() - 0.5) * width;
            const y = (Math.random() - 0.5) * width * 0.5;
            return {
                angle,
                radius: orbitRadius, // Renamed to avoid confusion
                y,
                rotationSpeed: 0.001 + Math.random() * 0.002,
                scale: 0.5 + Math.random() * 1.5
            };
        });
    }, [radius, width, count]);

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
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <dodecahedronGeometry args={[0.8]} />
            <meshStandardMaterial 
                color={color} 
                roughness={0.8}
                metalness={0.2}
            />
        </instancedMesh>
    );
};