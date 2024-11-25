import React, { useMemo } from "react";
import * as THREE from "three";

export const StarField: React.FC = () => {
    const count = 2500; // More stars
    const positions = useMemo(() => {
        const temp = new Float32Array(count * 3);
        const minDistance = 1200; // Minimum distance for stars from center
        let validPoints = 0;

        while (validPoints < count) {
            const radius = 1000 + Math.random() * 1000;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);

            // Calculate distance from origin
            const distance = Math.sqrt(x * x + y * y + z * z);
            
            // Only add stars beyond our minimum distance
            if (distance > minDistance) {
                temp[validPoints * 3] = x;
                temp[validPoints * 3 + 1] = y;
                temp[validPoints * 3 + 2] = z;
                validPoints++;
            }
        }
        return temp;
    }, []);

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial 
                size={2.0} // Slightly larger stars
                color="#ffffff" 
                sizeAttenuation={true} // Enable size attenuation for depth effect
                transparent
                opacity={0.9} // Increased brightness
            />
        </points>
    );
};