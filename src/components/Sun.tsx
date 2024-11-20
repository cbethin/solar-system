
import React from "react";

export const Sun: React.FC = () => (
	<mesh>
		<sphereGeometry args={[20, 32, 32]} />
		<meshBasicMaterial color="#FFE03D" />
		<pointLight intensity={0.8} distance={2000} decay={0} />
	</mesh>
);