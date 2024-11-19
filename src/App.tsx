import React, { useState, useEffect } from "react";
import { useSpring, animated, type SpringValue } from "react-spring";
import { Calc } from "./utils/planetCalculations";

// Update Tooltip component to be fixed position
const Tooltip = ({ planet }) => (
	<foreignObject
		x={200} // Fixed position in bottom right
		y={200}
		width="160"
		height="80"
		style={{ overflow: "visible" }}
	>
		<div className="bg-gray-800 text-white p-2 rounded-lg text-sm shadow-lg">
			<div className="font-bold">{planet.name}</div>
			<div>Distance from Sun: {planet.distanceFromSun} AU</div>
			<div>Orbital period: {planet.period} Earth years</div>
		</div>
	</foreignObject>
);

const Planet = ({
	orbitRadius,
	period,
	size,
	color,
	rotationX,
	name,
	distanceFromSun,
	eccentricity = 0.2, // Add eccentricity parameter
	isHovered,
}: {
	rotationX: SpringValue<number>;
	eccentricity?: number;
	isHovered: boolean;
	[key: string]: any;
}) => {
	const [angle, setAngle] = useState(Math.random() * 360);
	const scaledPeriod = period * 8;
	const speedMultiplier = 3;

	useEffect(() => {
		const interval = setInterval(() => {
			setAngle(
				(prev) => (prev + (360 / scaledPeriod / 60) * speedMultiplier) % 360,
			);
		}, 16);
		return () => clearInterval(interval);
	}, [scaledPeriod]);

	return (
		<g className="planet-group">
			<animated.path
				d={rotationX.to((rot) => {
					const rotX = (rot * Math.PI) / 180;
					return Calc.getOrbitPath(orbitRadius, eccentricity, rotX);
				})}
				fill="none"
				stroke={isHovered ? "#999" : "#666"}
				strokeWidth={isHovered ? "2" : "1"}
				opacity={isHovered ? "0.8" : "0.6"}
				className="orbit-path"
			/>

			{/* Invisible wider path for better hover detection */}
			<animated.path
				d={rotationX.to((rot) => {
					const rotX = (rot * Math.PI) / 180;
					return Calc.getOrbitPath(orbitRadius, eccentricity, rotX);
				})}
				fill="none"
				stroke="transparent"
				strokeWidth="20"
				className="orbit-hover-area"
				style={{ cursor: "pointer" }}
			/>

			<animated.circle
				cx={rotationX.to((rot) => {
					const rotX = (rot * Math.PI) / 180;
					const pos = Calc.getPosition(angle, orbitRadius, eccentricity, rotX);
					return pos.x;
				})}
				cy={rotationX.to((rot) => {
					const rotX = (rot * Math.PI) / 180;
					const pos = Calc.getPosition(angle, orbitRadius, eccentricity, rotX);
					return pos.y;
				})}
				r={rotationX.to((rot) => {
					const rotX = (rot * Math.PI) / 180;
					const pos = Calc.getPosition(angle, orbitRadius, eccentricity, rotX);
					return size * pos.scale;
				})}
				fill={color}
				className="planet cursor-pointer"
				style={{
					filter: "saturate(1.2) brightness(1.1)",
					opacity: rotationX.to((rot) => {
						const rotX = (rot * Math.PI) / 180;
						const pos = Calc.getPosition(
							angle,
							orbitRadius,
							eccentricity,
							rotX,
						);
						return Calc.getOpacity(pos.z);
					}),
				}}
			/>
			{isHovered && <Tooltip planet={{ name, period, distanceFromSun }} />}
		</g>
	);
};

const RotationIndicator = ({ rotation }) => {
	const radius = 20; // Changed from 30
	const angle = (rotation * 90) / 100 - 90;

	const x = radius * Math.cos((angle * Math.PI) / 180);
	const y = radius * Math.sin((angle * Math.PI) / 180);

	return (
		<g className="rotation-indicator" transform="translate(-250, 250)">
			<path
				d={`M -${radius} 0 A ${radius} ${radius} 0 0 1 0 -${radius}`}
				fill="none"
				stroke="#333"
				strokeWidth="3"
				strokeLinecap="round"
			/>

			<path
				d={`M -${radius} 0 A ${radius} ${radius} 0 0 1 ${x} ${y}`}
				fill="none"
				stroke="#4A9BFF"
				strokeWidth="3"
				strokeLinecap="round"
			/>

			<circle cx={x} cy={y} r="2" fill="#4A9BFF" />

			<text
				x={-radius - 5}
				y="0"
				fill="#888"
				fontSize="10"
				dominantBaseline="middle"
				textAnchor="end"
			>
				F
			</text>
			<text x="0" y={-radius - 5} fill="#888" fontSize="10" textAnchor="middle">
				T
			</text>
		</g>
	);
};

const SolarSystem = () => {
	const [isDragging, setIsDragging] = useState(false);
	const [lastY, setLastY] = useState(0);
	const [hoveredPlanet, setHoveredPlanet] = useState(null);

	const [{ rotationX }, setSpring] = useSpring(() => ({
		rotationX: 0,
		config: { tension: 180, friction: 12 },
	}));

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

	const handleMouseDown = (e) => {
		setIsDragging(true);
		setLastY(e.clientY);
	};

	const handleMouseMove = (e) => {
		if (!isDragging) return;
		const deltaY = e.clientY - lastY;

		setSpring({
			rotationX: Math.min(90, Math.max(0, rotationX.get() - deltaY * 0.5)),
			immediate: true,
		});

		setLastY(e.clientY);
	};

	const handleMouseUp = () => {
		setIsDragging(false);

		const currentRotation = rotationX.get();
		if (currentRotation < 45) {
			// Snap to front view with spring animation
			setSpring({
				rotationX: 0,
				config: { tension: 120, friction: 14 },
			});
		} else {
			// Snap to top view with spring animation
			setSpring({
				rotationX: 90,
				config: { tension: 120, friction: 14 },
			});
		}
	};

	const rotationProgress = (rotationX.get() / 90) * 100;

	return (
		<div className="flex items-center justify-center w-full min-h-screen bg-gray-900">
			<div className="w-full max-w-5xl h-[90vh] bg-gray-900 rounded-lg relative">
				<div className="absolute inset-0 flex items-center justify-center">
					<div
						className="w-[90vh] h-[90vh] cursor-ns-resize relative"
						onMouseDown={handleMouseDown}
						onMouseMove={handleMouseMove}
						onMouseUp={handleMouseUp}
						onMouseLeave={handleMouseUp}
					>
						{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
						<svg viewBox="-300 -300 600 600" className="w-full h-full">
							<circle
								cx={0}
								cy={0}
								r={20}
								fill="#FFE03D"
								className="sun"
								style={{ filter: "brightness(1.2)" }}
							>
								<animate
									attributeName="r"
									values="20;22;20"
									dur="2s"
									repeatCount="indefinite"
								/>
							</circle>

							{planets.map((planet, index) => (
								<g
									key={index}
									onMouseEnter={() => setHoveredPlanet(index)}
									onMouseLeave={() => setHoveredPlanet(null)}
								>
									<Planet
										{...planet}
										rotationX={rotationX}
										isHovered={hoveredPlanet === index}
									/>
								</g>
							))}

							<RotationIndicator rotation={rotationProgress} />
						</svg>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SolarSystem;
