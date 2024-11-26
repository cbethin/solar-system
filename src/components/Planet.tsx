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
    // Remove moons parameter
}) => {
    const SIZE_MULTIPLIER = 5; // Add this constant
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
    
    // Add spring animation for both size and orbit line thickness
    const springs = useSpring({
        scale: [size * planetScale, size * planetScale, size * planetScale],
        lineThickness: Math.max(2, size * planetScale * LINE_THICKNESS_FACTOR),
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
    const planetMaterial = useMemo(() => new THREE.MeshStandardMaterial(), []);
    const glowMaterial = useMemo(() => new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
    }), []);

    useFrame((state, delta) => {
        if (!meshRef.current) return;
        
        // Optimize angle calculation
        setAngle(angle => (angle + (6 / scaledPeriod) * speedMultiplier) % 360);
        const position = Calc.getOrbitPosition(angle, orbitRadius, eccentricity);
        meshRef.current.position.copy(position);
    });

    const planetData = {
        name,
        period,
        eccentricity,
        distanceFromSun,
        orbitRadius,
        size,
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
                    object={Calc.createOrbitLineGeometry(orbitRadius, eccentricity, springs.lineThickness.get() * 2)}
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
                    object={Calc.createOrbitLineGeometry(orbitRadius, eccentricity, springs.lineThickness.get())}
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
                    object={Calc.createOrbitLineGeometry(orbitRadius, eccentricity, springs.lineThickness.get() * 3)}
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