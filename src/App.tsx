import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

const PLANET_INFO = {
	mercury: {
		name: "Mercury",
		distanceFromSun: "57.9 million km",
		diameter: "4,879 km",
		dayLength: "176 Earth days",
		yearLength: "88 Earth days",
		temperature: "-180°C to 430°C",
		funFact:
			"Mercury's surface resembles our Moon with numerous impact craters.",
	},
	venus: {
		name: "Venus",
		distanceFromSun: "108.2 million km",
		diameter: "12,104 km",
		dayLength: "243 Earth days",
		yearLength: "225 Earth days",
		temperature: "462°C",
		funFact: "Venus spins backwards compared to most other planets.",
	},
	earth: {
		name: "Earth",
		distanceFromSun: "149.6 million km",
		diameter: "12,742 km",
		dayLength: "24 hours",
		yearLength: "365.25 days",
		temperature: "-88°C to 58°C",
		funFact: "Earth is the only known planet to support life.",
	},
	mars: {
		name: "Mars",
		distanceFromSun: "227.9 million km",
		diameter: "6,779 km",
		dayLength: "24 hours 37 minutes",
		yearLength: "687 Earth days",
		temperature: "-140°C to 20°C",
		funFact: "Mars has the largest volcano in the solar system, Olympus Mons.",
	},
	jupiter: {
		name: "Jupiter",
		distanceFromSun: "778.5 million km",
		diameter: "139,820 km",
		dayLength: "10 Earth hours",
		yearLength: "12 Earth years",
		temperature: "-110°C",
		funFact:
			"Jupiter's Great Red Spot is a storm that has lasted over 400 years.",
	},
	saturn: {
		name: "Saturn",
		distanceFromSun: "1.4 billion km",
		diameter: "116,460 km",
		dayLength: "10.7 Earth hours",
		yearLength: "29.5 Earth years",
		temperature: "-140°C",
		funFact: "Saturn's rings are mostly made of ice and rock.",
	},
	uranus: {
		name: "Uranus",
		distanceFromSun: "2.9 billion km",
		diameter: "50,724 km",
		dayLength: "17 Earth hours",
		yearLength: "84 Earth years",
		temperature: "-195°C",
		funFact: "Uranus rotates on its side, like a rolling ball.",
	},
	neptune: {
		name: "Neptune",
		distanceFromSun: "4.5 billion km",
		diameter: "49,244 km",
		dayLength: "16 Earth hours",
		yearLength: "165 Earth years",
		temperature: "-200°C",
		funFact: "Neptune has the strongest winds in the solar system.",
	},
};

const Planet = ({
	orbitRadius,
	period,
	size,
	color,
	rotationX,
	planetIndex,
	onHover,
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

	const baseX = Math.cos((angle * Math.PI) / 180) * orbitRadius;
	const baseY = Math.sin((angle * Math.PI) / 180) * orbitRadius;
	const baseZ = 0;

	const rotX = (rotationX * Math.PI) / 180;

	const finalX = baseX;
	const finalY = baseY * Math.cos(rotX);
	const finalZ = baseY * Math.sin(rotX);

	const perspectiveFactor = 1000;
	const scale = perspectiveFactor / (perspectiveFactor + finalZ);

	const x = finalX * scale;
	const y = finalY * scale;
	const scaledSize = size * scale;
	const opacity = Math.min(1, Math.max(0.5, (finalZ + 1000) / 1500));

	return (
		<>
			<ellipse
				cx={0}
				cy={0}
				rx={orbitRadius}
				ry={orbitRadius * Math.cos(rotX)}
				fill="none"
				stroke="#666"
				strokeWidth="1"
				opacity="0.6"
			/>

			<circle
				cx={x}
				cy={y}
				r={scaledSize}
				fill={color}
				className="planet cursor-pointer transition-all hover:brightness-125"
				style={{
					opacity,
					filter: "saturate(1.2) brightness(1.1)",
				}}
				onMouseEnter={() => onHover(planetIndex)}
				onMouseLeave={() => onHover(null)}
			/>
		</>
	);
};

// RotationIndicator component stays the same
const RotationIndicator = ({ rotation }) => {
	// ... same code as before ...
};

const InfoCard = ({ planetInfo }) => {
	if (!planetInfo) return null;

	return (
		<Card className="absolute right-6 top-1/2 -translate-y-1/2 w-72 bg-gray-800/90 backdrop-blur border-gray-700">
			<CardContent className="p-4 space-y-3">
				<h3 className="text-xl font-bold text-white">{planetInfo.name}</h3>
				<div className="space-y-2">
					<div className="space-y-1">
						<div className="text-sm font-medium text-gray-400">
							Distance from Sun
						</div>
						<div className="text-sm text-white">
							{planetInfo.distanceFromSun}
						</div>
					</div>
					<div className="space-y-1">
						<div className="text-sm font-medium text-gray-400">Diameter</div>
						<div className="text-sm text-white">{planetInfo.diameter}</div>
					</div>
					<div className="space-y-1">
						<div className="text-sm font-medium text-gray-400">Day Length</div>
						<div className="text-sm text-white">{planetInfo.dayLength}</div>
					</div>
					<div className="space-y-1">
						<div className="text-sm font-medium text-gray-400">Year Length</div>
						<div className="text-sm text-white">{planetInfo.yearLength}</div>
					</div>
					<div className="space-y-1">
						<div className="text-sm font-medium text-gray-400">Temperature</div>
						<div className="text-sm text-white">{planetInfo.temperature}</div>
					</div>
					<div className="pt-2 text-sm text-blue-300 italic">
						{planetInfo.funFact}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

const SolarSystem = () => {
	const [rotationX, setRotationX] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const [lastY, setLastY] = useState(0);
	const [hoveredPlanet, setHoveredPlanet] = useState(null);

	const planetOrder = [
		"mercury",
		"venus",
		"earth",
		"mars",
		"jupiter",
		"saturn",
		"uranus",
		"neptune",
	];

	const planets = [
		{ orbitRadius: 50, period: 1, size: 3, color: "#FF6B4A" },
		{ orbitRadius: 75, period: 1.5, size: 6, color: "#FFB74A" },
		{ orbitRadius: 100, period: 2, size: 6, color: "#4A9BFF" },
		{ orbitRadius: 125, period: 2.5, size: 4, color: "#FF4A4A" },
		{ orbitRadius: 170, period: 3, size: 15, color: "#FFD700" },
		{ orbitRadius: 210, period: 3.5, size: 12, color: "#FFA54A" },
		{ orbitRadius: 250, period: 4, size: 8, color: "#4AE1FF" },
		{ orbitRadius: 290, period: 4.5, size: 8, color: "#4A4AFF" },
	];

	const handleMouseDown = (e) => {
		setIsDragging(true);
		setLastY(e.clientY);
	};

	const handleMouseMove = (e) => {
		if (!isDragging) return;
		const deltaY = e.clientY - lastY;

		setRotationX((prev) => {
			const newRotation = prev - deltaY * 0.5;
			return Math.min(90, Math.max(0, newRotation));
		});

		setLastY(e.clientY);
	};

	const handleMouseUp = () => {
		setIsDragging(false);

		if (rotationX < 15) {
			setRotationX(0);
		} else if (rotationX > 75) {
			setRotationX(90);
		}
	};

	const rotationProgress = (rotationX / 90) * 100;

	return (
		<div className="w-full max-w-4xl bg-gray-900 rounded-lg p-6 relative">
			<div
				className="aspect-square cursor-ns-resize"
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onMouseLeave={handleMouseUp}
			>
				<svg viewBox="-300 -300 600 600">
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
						<Planet
							key={index}
							{...planet}
							rotationX={rotationX}
							planetIndex={index}
							onHover={setHoveredPlanet}
						/>
					))}

					<RotationIndicator rotation={rotationProgress} />
				</svg>

				{hoveredPlanet !== null && (
					<InfoCard planetInfo={PLANET_INFO[planetOrder[hoveredPlanet]]} />
				)}
			</div>

			<div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-200 text-sm bg-gray-800/90 backdrop-blur rounded-xl px-4 py-2 shadow-lg border border-gray-700">
				Drag vertically to switch between views
			</div>
		</div>
	);
};

export default SolarSystem;
