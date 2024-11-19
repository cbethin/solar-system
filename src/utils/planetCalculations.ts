export const Calc = {
	getSemiMinor(orbitRadius: number, eccentricity: number): number {
		return orbitRadius * Math.sqrt(1 - eccentricity * eccentricity);
	},

	getPosition(
		angle: number,
		orbitRadius: number,
		eccentricity: number,
		rotX: number,
	) {
		const angleRad = (angle * Math.PI) / 180;
		const rotationScale = Math.cos((rotX * Math.PI) / 180);
		const semiMajor = orbitRadius;
		const semiMinor = this.getSemiMinor(orbitRadius, eccentricity);
		const c = semiMajor * eccentricity;

		// Calculate elliptical position
		const x = semiMajor * Math.cos(angleRad) - c;
		const y = semiMinor * Math.sin(angleRad) * rotationScale;

		return {
			x,
			y,
			scale: 1, // No more perspective scaling needed
		};
	},

	getOrbitPath(
		orbitRadius: number,
		eccentricity: number,
		rotX: number,
	): string {
		const points = [];
		for (let i = 0; i <= 360; i += 5) {
			const pos = this.getPosition(i, orbitRadius, eccentricity, rotX);
			points.push(`${pos.x},${pos.y}`);
		}
		return `M ${points.join(" L ")} Z`;
	},
};
