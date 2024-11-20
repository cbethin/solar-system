import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PlanetData } from "../types/types";
import * as THREE from "three";

export const useCameraControls = () => {
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const { camera } = useThree();
    const [targetPlanet, setTargetPlanet] = useState<PlanetData | null>(null);
    const [planetMesh, setPlanetMesh] = useState<THREE.Mesh | null>(null);

    const jumpToPlanet = (planet: PlanetData, mesh: THREE.Mesh) => {
        setTargetPlanet(planet);
        setPlanetMesh(mesh);
        camera.position.set(planet.orbitRadius, planet.size * 2, planet.orbitRadius);
        camera.lookAt(mesh.position);
    };

    useFrame(() => {
        if (cameraRef.current && targetPlanet && planetMesh) {
            const offset = new THREE.Vector3(0, targetPlanet.size * 2, targetPlanet.orbitRadius);
            camera.position.copy(planetMesh.position.clone().add(offset));
            camera.lookAt(planetMesh.position);
            cameraRef.current.updateProjectionMatrix();
        }
    });

    return { cameraRef, jumpToPlanet };
};