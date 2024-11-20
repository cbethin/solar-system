
import React, { useMemo } from "react";
import * as THREE from "three";

export const StarField: React.FC = () => {
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