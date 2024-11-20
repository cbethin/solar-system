import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PlanetData } from "../types/types";
import * as THREE from "three";
import gsap from "gsap";

export const useCameraControls = () => {
    const { camera } = useThree();
    const targetPlanet = useRef<PlanetData | null>(null);
    const previousPosition = useRef<THREE.Vector3 | null>(null);
    const previousRotation = useRef<THREE.Euler | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const orbitAngle = useRef(0);
    const targetPosition = useRef(new THREE.Vector3());
    const meshRef = useRef<THREE.Mesh | null>(null);
    const curve = useRef<THREE.CubicBezierCurve3 | null>(null);
    const travelProgress = useRef(0);
    const ORBIT_SPEED = 0.25;
    const TRAVEL_DURATION = 2.5;

    const createOrbitEntryPath = (
        startPos: THREE.Vector3,
        planetPos: THREE.Vector3,
        radius: number,
        entryAngle: number
    ) => {
        const endPos = new THREE.Vector3(
            planetPos.x + Math.cos(entryAngle) * radius,
            planetPos.y + radius * 0.5,
            planetPos.z + Math.sin(entryAngle) * radius
        );

        // Calculate control points for smooth entry into orbit
        const midPoint = new THREE.Vector3().addVectors(startPos, endPos).multiplyScalar(0.5);
        const distance = startPos.distanceTo(endPos);
        
        // Lift the curve up for a more dramatic approach
        midPoint.y += distance * 0.3;
        
        // Pull control point towards planet for smoother entry
        const control2 = new THREE.Vector3().addVectors(endPos, planetPos)
            .multiplyScalar(0.5)
            .add(new THREE.Vector3(0, radius * 0.5, 0));

        return new THREE.CubicBezierCurve3(
            startPos,
            midPoint,
            control2,
            endPos
        );
    };

    const calculateOrbitPosition = (
        targetPos: THREE.Vector3,
        angle: number,
        radius: number
    ): THREE.Vector3 => {
        return new THREE.Vector3(
            targetPos.x + Math.cos(angle) * radius,
            targetPos.y + radius * 0.5,
            targetPos.z + Math.sin(angle) * radius
        );
    };

    const updateCameraRotation = (
        camera: THREE.Camera,
        currentPos: THREE.Vector3,
        targetPos: THREE.Vector3,
        lerpFactor: number = 0.1
    ) => {
        const lookAtMatrix = new THREE.Matrix4();
        lookAtMatrix.lookAt(currentPos, targetPos, camera.up);
        const targetQuaternion = new THREE.Quaternion().setFromRotationMatrix(lookAtMatrix);
        camera.quaternion.slerp(targetQuaternion, lerpFactor);
    };

    const moveCameraAlongCurve = (
        camera: THREE.Camera,
        curve: THREE.CubicBezierCurve3,
        progress: number,
        targetPos: THREE.Vector3
    ) => {
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const pos = curve.getPoint(easedProgress);
        camera.position.copy(pos);
        updateCameraRotation(camera, pos, targetPos);
    };

    const updateOrbitPosition = (
        camera: THREE.Camera,
        targetPos: THREE.Vector3,
        angle: number,
        radius: number
    ) => {
        const newPosition = calculateOrbitPosition(targetPos, angle, radius);
        camera.position.lerp(newPosition, 0.1);
        updateCameraRotation(camera, camera.position, targetPos);
    };

    useFrame((state, delta) => {
        if (isFollowing && targetPlanet.current && meshRef.current) {
            meshRef.current.getWorldPosition(targetPosition.current);
            
            if (travelProgress.current < 1) {
                if (curve.current) {
                    travelProgress.current = Math.min(travelProgress.current + delta / TRAVEL_DURATION, 1);
                    moveCameraAlongCurve(camera, curve.current, travelProgress.current, targetPosition.current);

                    if (travelProgress.current === 1) {
                        orbitAngle.current = Math.atan2(
                            camera.position.z - targetPosition.current.z,
                            camera.position.x - targetPosition.current.x
                        );
                    }
                }
            } else {
                orbitAngle.current += delta * ORBIT_SPEED;
                updateOrbitPosition(
                    camera,
                    targetPosition.current,
                    orbitAngle.current,
                    targetPlanet.current.size * 4
                );
            }
        }
    });

    const jumpToPlanet = (planet: PlanetData, mesh: THREE.Mesh) => {
        previousPosition.current = camera.position.clone();
        previousRotation.current = camera.rotation.clone();
        targetPlanet.current = planet;
        meshRef.current = mesh;
        
        mesh.getWorldPosition(targetPosition.current);
        const radius = planet.size * 4;
        
        const entryAngle = Math.atan2(
            camera.position.z - targetPosition.current.z,
            camera.position.x - targetPosition.current.x
        );

        curve.current = createOrbitEntryPath(
            camera.position.clone(),
            targetPosition.current.clone(),
            radius,
            entryAngle
        );

        travelProgress.current = 0;
        setIsFollowing(true);
    };

    const resetCamera = () => {
        if (!previousPosition.current || !previousRotation.current) return;
        setIsFollowing(false);
        
        gsap.to(camera.position, {
            x: previousPosition.current.x,
            y: previousPosition.current.y,
            z: previousPosition.current.z,
            duration: 2,
            ease: "power2.inOut"
        });

        gsap.to(camera.rotation, {
            x: previousRotation.current.x,
            y: previousRotation.current.y,
            z: previousRotation.current.z,
            duration: 2,
            ease: "power2.inOut",
            onComplete: () => {
                targetPlanet.current = null;
                previousPosition.current = null;
                previousRotation.current = null;
            }
        });
    };

    return { 
        jumpToPlanet, 
        resetCamera, 
        targetPlanet: targetPlanet.current,
        isFollowing 
    };
};