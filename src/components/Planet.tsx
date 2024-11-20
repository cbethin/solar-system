import React, { useRef, useState, useContext } from "react";
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
    const [angle, setAngle] = useState(Math.random() * 360);
    const [isHovered, setIsHovered] = useState(false);
    const meshRef = useRef<THREE.Mesh>(null);
    const scaledPeriod = period * 8;
    const speedMultiplier = 3;

    const context = useContext(PlanetContext);
    if (!context) throw new Error("Planet must be used within PlanetContext");
    const { setHoveredPlanet } = context;

    useFrame((state, delta) => {
        setAngle(
            (prev) => (prev + (360 / scaledPeriod / 60) * speedMultiplier) % 360,
        );
        if (meshRef.current) {
            const position = Calc.getOrbitPosition(angle, orbitRadius, eccentricity);
            meshRef.current.position.copy(position);
        }
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
            <mesh onClick={() => onClick(meshRef.current!)}>
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
            <mesh onClick={() => onClick(meshRef.current!)}>
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
            <mesh ref={meshRef} onClick={() => onClick(meshRef.current!)}>
                <sphereGeometry args={[size, 32, 32]} />
                <meshBasicMaterial color={color} />
            </mesh>
        </group>
    );
};