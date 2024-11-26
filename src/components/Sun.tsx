import React, { useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { SUN_SIZE } from "../utils/constants";
import { useSimulationStore } from '../store/simulationStore';
import { useSpring, animated } from "@react-spring/three";

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
        
        // More efficient noise calculation
        float noise(vec3 p) {
            return fract(sin(dot(p, vec3(12.9898, 78.233, 45.543))) * 43758.5453);
        }
        
        void main() {
            float n = noise(vWorldPosition * 2.0 + time);
            
            vec3 baseColor = vec3(1.0, 0.95, 0.8);
            vec3 highlight = vec3(1.0, 1.0, 0.9);
            
            float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            vec3 finalColor = mix(baseColor, highlight, fresnel + n * 0.15);
            
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `
};

export const Sun: React.FC = () => {
    const radiusScale = useSimulationStore(state => state.radiusScale);
    
    // Scale the sun proportionally but with a damping factor
    const sunScale = 1 + (radiusScale - 1) * 0.5; // dampened scaling
    
    const springs = useSpring({
        scale: [sunScale, sunScale, sunScale],
        config: {
            mass: 2,
            tension: 120,
            friction: 14
        }
    });

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
        <animated.mesh scale={springs.scale}>
            <group>
                <mesh>
                    <sphereGeometry args={[SUN_SIZE, 128, 128]} />
                    <primitive object={sunMaterial} attach="material" />
                    <pointLight intensity={12} distance={5000} decay={0.5} />
                </mesh>

                {Array.from({ length: 18 }).map((_, index) => {
                    const size = Math.pow(1.48, index + 1) * 2;
                    const opacity = 0.15 / Math.pow(index + 1, 0.5);
                    return (
                        <mesh key={index}>
                            <sphereGeometry args={[SUN_SIZE - 5 + size, 32, 32]} />
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

                <pointLight position={[0, 0, 0]} color="#FFFBF0" intensity={30} distance={4000} decay={1.0} />
                <pointLight position={[0, 0, 0]} color="#FFF5E0" intensity={25} distance={4500} decay={0.8} />
                <pointLight position={[0, 0, 0]} color="#FFE0A3" intensity={15} distance={4500} decay={0.6} />
                <pointLight position={[0, 0, 0]} color="#FFFAF0" intensity={10} distance={5000} decay={0.4} />
                <pointLight position={[0, 0, 0]} color="#FFFFFF" intensity={5} distance={6000} decay={0.3} />

                <mesh>
                    <sphereGeometry args={[450, 32, 32]} />
                    <meshBasicMaterial
                        color={new THREE.Color(1, 0.98, 0.9)}
                        transparent
                        opacity={0.02}
                        blending={THREE.AdditiveBlending}
                        side={THREE.BackSide}
                        depthWrite={false}
                    />
                </mesh>
            </group>
        </animated.mesh>
    );
};