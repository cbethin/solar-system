import React, { useRef, useState, useMemo, useContext } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { Calc } from "./utils/planetCalculations";
import { BackSide } from "three";

const PlanetContext = React.createContext(null);

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

	const { setHoveredPlanet } = useContext(PlanetContext);

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
				onPointerEnter={() => {
					setHoveredPlanet(name);
					setIsHovered(true);
				}}
				onPointerLeave={() => {
					setHoveredPlanet(null);
					setIsHovered(false);
				}}
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
					opacity={isHovered ? 0.8 : 0.3}
					transparent
					depthWrite={false}
					side={THREE.DoubleSide}
				/>
			</mesh>

			{/* Glow effect line (only visible on hover) */}
			<mesh>
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
			<mesh ref={meshRef}>
				<sphereGeometry args={[size, 32, 32]} />
				<meshBasicMaterial color={color} />
			</mesh>
		</group>
	);
};

const StarField = () => {
	const count = 500; // reduced from 2000 to 500
	const positions = useMemo(() => {
		const temp = new Float32Array(count * 3);
		for (let i = 0; i < count; i++) {
			const radius = 500;
			const theta = Math.random() * Math.PI * 2;
			const phi = Math.acos(2 * Math.random() - 1);

			temp[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
			temp[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
			temp[i * 3 + 2] = radius * Math.cos(phi);
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
			<pointsMaterial size={2} color="#ffffff" sizeAttenuation={false} />
		</points>
	);
};

const Sun = () => (
	<mesh>
		<sphereGeometry args={[20, 32, 32]} />
		<meshBasicMaterial color="#FFE03D" />
		<pointLight intensity={0.8} distance={2000} decay={0} />
	</mesh>
);

const Tooltip = ({ hoveredPlanet }) => {
	if (!hoveredPlanet) return null;

	return (
		<div className="absolute bottom-4 left-4 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
			{hoveredPlanet}
		</div>
	);
};

const SolarSystem = () => {
	const [hoveredPlanet, setHoveredPlanet] = useState(null);
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
		<PlanetContext.Provider value={{ setHoveredPlanet }}>
			<div className="w-full h-screen relative">
				<Canvas
					camera={{ position: [0, 200, 400], fov: 70 }}
					gl={{
						antialias: true,
						toneMapping: THREE.ACESFilmicToneMapping,
						outputEncoding: THREE.sRGBEncoding,
						powerPreference: "high-performance",
						alpha: false,
						webgl2: true,
					}}
				>
					<color attach="background" args={["#000010"]} />
					<fog attach="fog" args={["#000010", 500, 1000]} />
					<StarField />
					<mesh>
						<sphereGeometry args={[495, 32, 32]} />
						<meshBasicMaterial
							color="#000020"
							side={BackSide}
							transparent
							opacity={0.5}
						/>
					</mesh>
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
				<Tooltip hoveredPlanet={hoveredPlanet} />
			</div>
		</PlanetContext.Provider>
	);
};

export default SolarSystem;
