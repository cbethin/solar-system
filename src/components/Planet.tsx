import React, { useRef, useState, useContext, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PlanetContext } from "../context/PlanetContext";
import { Calc } from "../utils/planetCalculations";
import { PlanetData } from "../types/types";

export const Planet: React.FC<PlanetData & { onClick: (mesh: THREE.Mesh) => void }> = ({
    orbitRadius,
    period,
    size,
    color,
    name,
    eccentricity,
    distanceFromSun,
    onClick,
}) => {
    const SIZE_MULTIPLIER = 1.2; // Add this constant
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
    const sphereGeometry = useMemo(() => new THREE.SphereGeometry(size, 32, 32), [size]);
    const glowGeometry = useMemo(() => new THREE.SphereGeometry(size * SIZE_MULTIPLIER, 32, 32), [size]);
    
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
                    object={Calc.createOrbitLineGeometry(orbitRadius, eccentricity, 8)}
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
                    object={Calc.createOrbitLineGeometry(orbitRadius, eccentricity, 1.5)}
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
                    object={Calc.createOrbitLineGeometry(orbitRadius, eccentricity, 4)}
                />
                <meshBasicMaterial
                    color="#ffffff"
                    opacity={isHovered ? 0.2 : 0}
                    transparent
                    depthWrite={false}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Planet Sphere */}
            <mesh ref={meshRef} onClick={() => onClick(meshRef.current!)} layers={0}>  // Changed to default layer for interaction
                <primitive object={sphereGeometry} />
                <primitive object={planetMaterial} color={color} />
            </mesh>

            {/* Planet Glow */}
            <mesh layers={0}>  // Keep glow effect in default layer
                <primitive object={glowGeometry} />
                <primitive object={glowMaterial} color={color} />
            </mesh>
        </group>
    );
};