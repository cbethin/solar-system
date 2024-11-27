import React, { useRef, useState, useContext, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PlanetContext } from "../context/PlanetContext";
import { Calc } from "../utils/planetCalculations";
import { PlanetData } from "../types/types";
import { useSpring, animated as a } from '@react-spring/three';  // Update this import
import { useSimulationStore } from '../store/simulationStore';
// Remove Moon import

export const Planet: React.FC<PlanetData & { onClick: (mesh: THREE.Mesh) => void }> = ({
    orbitRadius,
    period,
    size,
    color,
    name,
    eccentricity,
    distanceFromSun,
    onClick,
    albedo,
    // Remove moons parameter
}) => {
    // Modify size multiplier to maintain astronomical scale
    const SIZE_MULTIPLIER = 1; // Changed from 5 to 1 to respect provided scales
    const LINE_THICKNESS_FACTOR = 0.4; // Add this constant
    const orbitLineThickness = Math.max(2, size * SIZE_MULTIPLIER * LINE_THICKNESS_FACTOR); // Add this calculation
    const [angle, setAngle] = useState(Math.random() * 360);
    const [isHovered, setIsHovered] = useState(false);
    const meshRef = useRef<THREE.Mesh>(null);
    const geometryRef = useRef<THREE.BufferGeometry | null>(null);
    const materialRef = useRef<THREE.Material | null>(null);
    const scaledPeriod = period * 8;
    const speedMultiplier = 3;

    const context = useContext(PlanetContext);
    if (!context) throw new Error("Planet must be used within PlanetContext");
    const { setHoveredPlanet } = context;

    const planetScale = useSimulationStore(state => state.planetScale);
    const orbitSpeed = useSimulationStore(state => state.orbitSpeed);
    const isRealisticRadius = useSimulationStore(state => state.isRealisticRadius);
    const radiusScale = useSimulationStore(state => state.radiusScale);
    
    // Modify the spring to include orbit radius
    const springs = useSpring({
        scale: [
            size * planetScale * SIZE_MULTIPLIER, 
            size * planetScale * SIZE_MULTIPLIER, 
            size * planetScale * SIZE_MULTIPLIER
        ],
        lineThickness: Math.max(2, size * planetScale * LINE_THICKNESS_FACTOR),
        orbitRadius: orbitRadius * radiusScale, // Add this
        config: { 
            mass: 2,           // Increased mass
            tension: 120,      // Reduced tension
            friction: 14,      // Reduced friction
            bounce: 0.3        // Added bounce
        }
    });

    useEffect(() => {
        return () => {
            // Cleanup geometries and materials on unmount
            if (geometryRef.current) {
                geometryRef.current.dispose();
            }
            if (materialRef.current) {
                materialRef.current.dispose();
            }
        };
    }, []);

    // Store refs to geometries and materials
    const orbitGeometry = useMemo(() => {
        const geometry = Calc.createOrbitLineGeometry(orbitRadius, eccentricity, 8);
        geometryRef.current = geometry;
        return geometry;
    }, [orbitRadius, eccentricity]);

    // Cache geometries and materials at module level
    const sphereGeometry = useMemo(() => new THREE.SphereGeometry(1, 32, 32), []); // Base size of 1
    const glowGeometry = useMemo(() => new THREE.SphereGeometry(1.2, 32, 32), []); // Base size of 1.2
    
    // Use instances for better performance
    const planetMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        metalness: 0.1,
        roughness: 1 - albedo, // Convert albedo to roughness
        envMapIntensity: albedo * 0.5 // Use albedo to affect environment map intensity
    }), [albedo]);

    const glowMaterial = useMemo(() => new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
    }), []);

    // Update orbit geometry creation to use the spring value
    const createScaledOrbitGeometry = (radius: number, thickness: number) => {
        return Calc.createOrbitLineGeometry(radius, eccentricity, thickness);
    };

    useFrame((state, delta) => {
        if (!meshRef.current) return;
        
        // Use the spring value for position calculation
        const effectiveRadius = springs.orbitRadius.get();
        setAngle(angle => (angle + (6 / scaledPeriod) * speedMultiplier * orbitSpeed) % 360);
        const position = Calc.getOrbitPosition(angle, effectiveRadius, eccentricity);
        meshRef.current.position.copy(position);
    });

    const planetData: PlanetData = {
        type: 'planet',  // Add missing type field
        name,
        period,
        eccentricity,
        distanceFromSun,
        orbitRadius,
        size,
        color,          // Add missing required fields
        albedo,
    };

    return (
        <group>
            {/* Touch detection area */}
            <mesh
                onPointerEnter={() => {
                    setHoveredPlanet(planetData);
                    setIsHovered(true);
                }}
                onPointerLeave={() => {
                    setHoveredPlanet(null);
                    setIsHovered(false);
                }}
                onClick={() => onClick(meshRef.current!)}
                layers={0}  // Changed to default layer for interaction
            >
                <primitive
                    object={createScaledOrbitGeometry(
                        springs.orbitRadius.get(),
                        springs.lineThickness.get() * 2
                    )}
                />
                <meshBasicMaterial
                    color="#ffffff"
                    opacity={0}
                    transparent
                    depthWrite={false}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Visible orbit line */}
            <mesh onClick={() => onClick(meshRef.current!)} layers={0}>  // Changed to default layer for interaction
                <primitive
                    object={createScaledOrbitGeometry(
                        springs.orbitRadius.get(),
                        springs.lineThickness.get()
                    )}
                />
                <meshBasicMaterial
                    color={isHovered ? "#ffffff" : "#666666"}
                    opacity={isHovered ? 0.8 : 0.3}
                    transparent
                    depthWrite={false}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Glow effect line (only visible on hover) */}
            <mesh onClick={() => onClick(meshRef.current!)} layers={1}>
                <primitive
                    object={createScaledOrbitGeometry(
                        springs.orbitRadius.get(),
                        springs.lineThickness.get() * 3
                    )}
                />
                <meshBasicMaterial
                    color="#ffffff"
                    opacity={isHovered ? 0.2 : 0}
                    transparent
                    depthWrite={false}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Update Planet Sphere */}
            <a.mesh 
                ref={meshRef} 
                onClick={() => onClick(meshRef.current!)} 
                layers={0}
                scale={springs.scale}
            >
                <primitive object={sphereGeometry} />
                <primitive object={planetMaterial} color={color} />
            </a.mesh>

            {/* Update Planet Glow */}
            <a.mesh 
                layers={0}
                scale={springs.scale}
            >
                <primitive object={glowGeometry} />
                <primitive object={glowMaterial} color={color} />
            </a.mesh>

            {/* Remove moons mapping section */}
        </group>
    );
};