import React, { useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const SunShader = {
    uniforms: {
        time: { value: 0 },
        normalSampler: { value: null },
    },
    vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        
        void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        uniform float time;
        
        void main() {
            float noise = sin(vWorldPosition.x * 2.0 + time) * 
                         cos(vWorldPosition.y * 2.0 + time) * 
                         sin(vWorldPosition.z * 2.0 + time);
            
            vec3 baseColor = vec3(1.0, 0.95, 0.8);    // Changed to more white
            vec3 highlight = vec3(1.0, 1.0, 0.9);      // Changed to more yellow-white
            
            float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            vec3 finalColor = mix(baseColor, highlight, fresnel + noise * 0.15);
            
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `
};

export const Sun: React.FC = () => {
    const sunMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: SunShader.uniforms,
            vertexShader: SunShader.vertexShader,
            fragmentShader: SunShader.fragmentShader,
        });
    }, []);

    useEffect(() => {
        return () => {
            sunMaterial.dispose();
        };
    }, [sunMaterial]);

    useFrame((_, delta) => {
        sunMaterial.uniforms.time.value += delta;
    });

    return (
        <group>
            {/* Core sun sphere with custom shader */}
            <mesh>
                <sphereGeometry args={[20, 128, 128]} />
                <primitive object={sunMaterial} attach="material" />
                <pointLight intensity={12} distance={4000} decay={0.5} />
            </mesh>

            {/* Enhanced volumetric corona layers */}
            {Array.from({ length: 25 }).map((_, index) => {
                const size = Math.pow(1.3, index + 1) * 2;
                const opacity = 0.12 / Math.pow(index + 1, 0.8);
                return (
                    <mesh key={index}>
                        <sphereGeometry args={[20 + size, 64, 64]} />
                        <meshBasicMaterial
                            color={new THREE.Color().setHSL(0.12, 0.8, Math.max(0.9 - index * 0.02, 0))}
                            transparent
                            opacity={opacity}
                            blending={THREE.AdditiveBlending}
                            side={THREE.BackSide}
                            depthWrite={false}
                        />
                    </mesh>
                )
            })}

            {/* Atmospheric light sources */}
            <pointLight position={[0, 0, 0]} color="#FFFBF0" intensity={20} distance={2000} decay={1.5} />
            <pointLight position={[0, 0, 0]} color="#FFF5E0" intensity={15} distance={3000} decay={1.2} />
            <pointLight position={[0, 0, 0]} color="#FFE0A3" intensity={10} distance={4000} decay={1.0} />
            <pointLight position={[0, 0, 0]} color="#FFFAF0" intensity={8} distance={5000} decay={0.8} />

            {/* Global volumetric light */}
            <mesh>
                <sphereGeometry args={[200, 32, 32]} />
                <meshBasicMaterial
                    color={new THREE.Color(1, 0.98, 0.9)}
                    transparent
                    opacity={0.03}
                    blending={THREE.AdditiveBlending}
                    side={THREE.BackSide}
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
};