import * as THREE from "three";

export const Calc = {
	getOrbitPosition(
		angle: number,
		orbitRadius: number,
		eccentricity: number,
	): THREE.Vector3 {
		const angleRad = (angle * Math.PI) / 180;
		const semiMajor = orbitRadius;
		const semiMinor = orbitRadius * Math.sqrt(1 - eccentricity * eccentricity);
		const c = semiMajor * eccentricity;

		const x = semiMajor * Math.cos(angleRad) - c;
		const z = semiMinor * Math.sin(angleRad);

		return new THREE.Vector3(x, 0, z);
	},

	createOrbitPoints(
		orbitRadius: number,
		eccentricity: number,
	): THREE.Vector3[] {
		const points = [];
		// Changed from 5 to 1 degree increments for smoother orbits
		for (let i = 0; i <= 360; i += 1) {
			points.push(this.getOrbitPosition(i, orbitRadius, eccentricity));
		}
		return points;
	},

	createOrbitLineGeometry(
		orbitRadius: number,
		eccentricity: number,
		thickness: number = 0.5,
	): THREE.BufferGeometry {
		const points = this.createOrbitPoints(orbitRadius, eccentricity);
		const vertices = [];
		const indices = [];

		for (let i = 0; i < points.length; i++) {
			const current = points[i];
			const next = points[(i + 1) % points.length];
			const direction = next.clone().sub(current).normalize();
			const perpendicular = new THREE.Vector3(
				-direction.z,
				0,
				direction.x,
			).multiplyScalar(thickness / 2);

			vertices.push(
				current.x + perpendicular.x,
				current.y,
				current.z + perpendicular.z,
				current.x - perpendicular.x,
				current.y,
				current.z - perpendicular.z,
			);

			if (i < points.length - 1) {
				const baseIndex = i * 2;
				indices.push(
					baseIndex,
					baseIndex + 1,
					baseIndex + 2,
					baseIndex + 1,
					baseIndex + 3,
					baseIndex + 2,
				);
			}
		}

		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute(
			"position",
			new THREE.Float32BufferAttribute(vertices, 3),
		);
		geometry.setIndex(indices);
		return geometry;
	},
};
