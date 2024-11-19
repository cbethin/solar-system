import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { Calc } from "./utils/planetCalculations";

const Planet = ({
	orbitRadius,
	period,
	size,
	color,
	name,
	eccentricity,
	distanceFromSun,
}) => {
	const [angle, setAngle] = useState(Math.random() * 360);
	const [isHovered, setIsHovered] = useState(false);
	const meshRef = useRef();
	const scaledPeriod = period * 8;
	const speedMultiplier = 3;

	useFrame((state, delta) => {
		setAngle(
			(prev) => (prev + (360 / scaledPeriod / 60) * speedMultiplier) % 360,
		);
		if (meshRef.current) {
			const position = Calc.getOrbitPosition(angle, orbitRadius, eccentricity);
			meshRef.current.position.copy(position);
		}
	});

	return (
		<group>
			{/* Touch detection area */}
			<mesh
				onPointerEnter={() => setIsHovered(true)}
				onPointerLeave={() => setIsHovered(false)}
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
			<mesh>
				<primitive
					object={Calc.createOrbitLineGeometry(orbitRadius, eccentricity, 1.5)}
				/>
				<meshBasicMaterial
					color={isHovered ? "#ffffff" : "#666666"}
					opacity={isHovered ? 0.9 : 0.3}
					transparent
					depthWrite={false}
					side={THREE.DoubleSide}
				/>
			</mesh>

			{/* Planet Sphere */}
			<mesh ref={meshRef}>
				<sphereGeometry args={[size, 32, 32]} />
				<meshBasicMaterial color={color} />
				{isHovered && (
					<Html
						style={{
							pointerEvents: "none",
							userSelect: "none",
						}}
						position={[0, size + 5, 0]}
						center
					>
						<div className="bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
							{name}
						</div>
					</Html>
				)}
			</mesh>
		</group>
	);
};

const Star = ({ position, size = 1 }) => {
	return (
		<group position={position}>
			<mesh>
				<sphereGeometry args={[0.35 * size, 4, 4]} />
				<meshBasicMaterial color="#ffffff" />
			</mesh>
			<mesh>
				<sphereGeometry args={[0.8 * size, 4, 4]} />
				<meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
			</mesh>
			<pointLight distance={50} intensity={0.03} decay={2} />
		</group>
	);
};

const Stars = () => {
	const count = 3000;
	const stars = useMemo(() => {
		const positions = [];
		for (let i = 0; i < count; i++) {
			positions.push({
				position: [
					(Math.random() - 0.5) * 2000,
					(Math.random() - 0.5) * 2000,
					(Math.random() - 0.5) * 2000,
				],
				size: Math.random() * 0.5 + 0.5, // Random size between 0.5 and 1
			});
		}
		return positions;
	}, []);

	return (
		<group>
			{stars.map((star, i) => (
				<Star key={i} position={star.position} size={star.size} />
			))}
		</group>
	);
};

const Sun = () => (
	<mesh>
		<sphereGeometry args={[20, 32, 32]} />
		<meshBasicMaterial color="#FFE03D" />
		<pointLight intensity={0.8} distance={2000} decay={0} />
	</mesh>
);

const SolarSystem = () => {
	const planets = [
		{
			orbitRadius: 40,
			period: 0.24,
			size: 3,
			color: "#A0522D",
			name: "Mercury",
			distanceFromSun: 0.39,
			eccentricity: 0.206, // Most eccentric orbit in solar system
		},
		{
			orbitRadius: 60,
			period: 0.62,
			size: 6,
			color: "#DEB887",
			name: "Venus",
			distanceFromSun: 0.72,
			eccentricity: 0.007, // Nearly circular orbit
		},
		{
			orbitRadius: 80,
			period: 1,
			size: 6.4,
			color: "#4169E1",
			name: "Earth",
			distanceFromSun: 1,
			eccentricity: 0.0167, // Reference for scale
		},
		{
			orbitRadius: 100,
			period: 1.88,
			size: 4,
			color: "#CD853F",
			name: "Mars",
			distanceFromSun: 1.52,
			eccentricity: 0.0934, // Notably eccentric
		},
		{
			orbitRadius: 140,
			period: 11.86,
			size: 12,
			color: "#DAA520",
			name: "Jupiter",
			distanceFromSun: 5.2,
			eccentricity: 0.0489,
		},
		{
			orbitRadius: 180,
			period: 29.46,
			size: 10,
			color: "#F4C430",
			name: "Saturn",
			distanceFromSun: 9.54,
			eccentricity: 0.0542,
		},
		{
			orbitRadius: 220,
			period: 84.01,
			size: 8,
			color: "#87CEEB",
			name: "Uranus",
			distanceFromSun: 19.18,
			eccentricity: 0.0472,
		},
		{
			orbitRadius: 260,
			period: 164.79,
			size: 7.8,
			color: "#1E90FF",
			name: "Neptune",
			distanceFromSun: 30.06,
			eccentricity: 0.0086, // Almost circular orbit
		},
	];

	return (
		<div className="w-full h-screen">
			<Canvas camera={{ position: [0, 200, 400], fov: 70 }}>
				<color attach="background" args={["#000010"]} />
				<fog attach="fog" args={["#000010", 500, 1000]} />
				<Stars />
				<ambientLight intensity={1} />
				<Sun />
				{planets.map((planet, index) => (
					<Planet key={index} {...planet} />
				))}
				<OrbitControls
					enablePan={true}
					enableZoom={false}
					enableRotate={true}
					minDistance={100}
					maxDistance={1000}
				/>
			</Canvas>
		</div>
	);
};

export default SolarSystem;
