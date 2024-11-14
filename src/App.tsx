import React, { useState, useEffect } from "react";
import { useSpring, animated, SpringValue } from "react-spring";

const Planet = ({
	orbitRadius,
	period,
	size,
	color,
	rotationX,
}: {
	rotationX: SpringValue<number>;
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
		<>
			<animated.path
				d={rotationX.to((rot) => {
					const rotX = (rot * Math.PI) / 180;
					const points = [];
					for (let i = 0; i <= 360; i += 5) {
						const angleRad = (i * Math.PI) / 180;
						const x = Math.cos(angleRad) * orbitRadius;
						const y = Math.sin(angleRad) * orbitRadius * Math.cos(rotX);
						const z = Math.sin(angleRad) * orbitRadius * Math.sin(rotX);
						const scale = 1000 / (1000 + z);
						points.push(`${x * scale},${y * scale}`);
					}
					return `M ${points.join(" L ")} Z`;
				})}
				fill="none"
				stroke="#666"
				strokeWidth="1"
				opacity="0.6"
			/>

			<animated.circle
				cx={rotationX.to((rot) => {
					const rotX = (rot * Math.PI) / 180;
					const x = Math.cos((angle * Math.PI) / 180) * orbitRadius;
					const y =
						Math.sin((angle * Math.PI) / 180) * orbitRadius * Math.cos(rotX);
					const z =
						Math.sin((angle * Math.PI) / 180) * orbitRadius * Math.sin(rotX);
					const scale = 1000 / (1000 + z);
					return x * scale;
				})}
				cy={rotationX.to((rot) => {
					const rotX = (rot * Math.PI) / 180;
					const y =
						Math.sin((angle * Math.PI) / 180) * orbitRadius * Math.cos(rotX);
					const z =
						Math.sin((angle * Math.PI) / 180) * orbitRadius * Math.sin(rotX);
					const scale = 1000 / (1000 + z);
					return y * scale;
				})}
				r={rotationX.to((rot) => {
					const rotX = (rot * Math.PI) / 180;
					const z =
						Math.sin((angle * Math.PI) / 180) * orbitRadius * Math.sin(rotX);
					const scale = 1000 / (1000 + z);
					return size * scale;
				})}
				fill={color}
				className="planet"
				style={{
					filter: "saturate(1.2) brightness(1.1)",
					opacity: rotationX.to((rot) => {
						const rotX = (rot * Math.PI) / 180;
						const z =
							Math.sin((angle * Math.PI) / 180) * orbitRadius * Math.sin(rotX);
						return Math.min(1, Math.max(0.5, (z + 1000) / 1500));
					}),
				}}
			/>
		</>
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

	const [{ rotationX }, setSpring] = useSpring(() => ({
		rotationX: 0,
		config: { tension: 180, friction: 12 },
	}));

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
			<div className="w-full max-w-4xl h-[80vh] bg-gray-900 rounded-lg relative flex items-center justify-center">
				<div
					className="w-[80vh] h-[80vh] cursor-ns-resize"
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
					onMouseLeave={handleMouseUp}
				>
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
							<Planet key={index} {...planet} rotationX={rotationX} />
						))}

						<RotationIndicator rotation={rotationProgress} />
					</svg>
				</div>
			</div>
		</div>
	);
};

export default SolarSystem;
