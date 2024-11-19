export const Calc = {
	getSemiMinor(orbitRadius: number, eccentricity: number): number {
		return orbitRadius * Math.sqrt(1 - eccentricity * eccentricity);
	},

	getScale(z: number): number {
		return 1000 / (1000 + z);
	},

	getPosition(
		angle: number,
		orbitRadius: number,
		eccentricity: number,
		rotX: number,
	) {
		const angleRad = (angle * Math.PI) / 180;
		const semiMajor = orbitRadius;
		const semiMinor = this.getSemiMinor(orbitRadius, eccentricity);

		const x = Math.cos(angleRad) * semiMajor;
		const y = Math.sin(angleRad) * semiMinor * Math.cos(rotX);
		const z = Math.sin(angleRad) * semiMinor * Math.sin(rotX);
		const scale = this.getScale(z);

		return { x: x * scale, y: y * scale, z, scale };
	},

	getOrbitPath(
		orbitRadius: number,
		eccentricity: number,
		rotX: number,
	): string {
		const points = [];
		const semiMajor = orbitRadius;
		const semiMinor = this.getSemiMinor(orbitRadius, eccentricity);

		for (let i = 0; i <= 360; i += 5) {
			const pos = this.getPosition(i, orbitRadius, eccentricity, rotX);
			points.push(`${pos.x},${pos.y}`);
		}
		return `M ${points.join(" L ")} Z`;
	},

	getOpacity(z: number): number {
		return Math.min(1, Math.max(0.5, (z + 1000) / 1500));
	},
};
