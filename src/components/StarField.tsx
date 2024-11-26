import React, { useMemo } from "react";
import * as THREE from "three";

export const StarField: React.FC = () => {
    const BRIGHTNESS_MULTIPLIER = 2.0; // Adjust this to control overall star brightness
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

    // Add colors for varying star brightness
    const colors = useMemo(() => {
        const temp = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const intensity = (2 + Math.random() * 8) * BRIGHTNESS_MULTIPLIER; // Super bright: 2.0 to 10.0
            // Add slight color variation for more realistic stars
            temp[i * 3] = intensity * (0.95 + Math.random() * 0.05);     // R slightly higher
            temp[i * 3 + 1] = intensity * (0.85 + Math.random() * 0.15); // G varied
            temp[i * 3 + 2] = intensity * (0.75 + Math.random() * 0.25); // B varied
        }
        return temp;
    }, []);

    // Modify sizes for brighter appearance
    const sizes = useMemo(() => {
        const temp = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            temp[i] = (Math.random() * 15 + 5) * BRIGHTNESS_MULTIPLIER; // Sizes between 5 and 20
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
                <bufferAttribute
                    attach="attributes-color"
                    count={count}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={12.0 * BRIGHTNESS_MULTIPLIER}
                sizeAttenuation={true}
                vertexColors
                transparent
                opacity={1.0}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};