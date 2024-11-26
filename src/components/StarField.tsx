import React, { useMemo } from "react";
import * as THREE from "three";

export const StarField: React.FC = () => {
    const count = 5000; // Increased star count
    const positions = useMemo(() => {
        const temp = new Float32Array(count * 3);

        // Sphere parameters
        const radius = 15000; // Much larger radius (10x the solar system size)
        const thickness = 500; // Thickness of the shell where stars can appear

        for (let i = 0; i < count; i++) {
            // Use spherical coordinates for better distribution
            const phi = Math.random() * Math.PI * 2; // Longitude
            const theta = Math.acos(2 * Math.random() - 1); // Latitude
            
            // Random radius within the shell thickness
            const r = radius + (Math.random() - 0.5) * thickness;
            
            // Convert to Cartesian coordinates
            temp[i * 3] = r * Math.sin(theta) * Math.cos(phi);     // x
            temp[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi); // y
            temp[i * 3 + 2] = r * Math.cos(theta);                 // z
        }
        return temp;
    }, []);

    // Calculate sizes for varying star brightness
    const sizes = useMemo(() => {
        const temp = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            temp[i] = Math.random() * 3; // Varying star sizes
        }
        return temp;
    }, [count]);

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-size"
                    count={count}
                    array={sizes}
                    itemSize={1}
                />
            </bufferGeometry>
            <pointsMaterial
                size={4.0}           // Increased size for better visibility
                sizeAttenuation={true}
                color="#ffffff"
                transparent
                opacity={1.0}        // Increased opacity
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};