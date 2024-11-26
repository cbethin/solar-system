import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PlanetData } from "../types/types";
import * as THREE from "three";
import { Calc } from "../utils/planetCalculations"; // Add this import
import gsap from "gsap";

export const useCameraControls = () => {
    const { camera } = useThree();
    const targetPlanet = useRef<PlanetData | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const rotationAngle = useRef(0);
    const meshRef = useRef<THREE.Mesh | null>(null);
    const cameraOrbitAngle = useRef(0);  // Add this line to track camera orbit position
    const orbitAngle = useRef(0);  // Track orbital position

    // Add key state tracking
    const [keys, setKeys] = useState({
        w: false,
        a: false,
        s: false,
        d: false,
        x: false  // Add x key
    });
    const MOVEMENT_SPEED = 500; // Units per second
    const moveDirection = new THREE.Vector3();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isFollowing) {
                setKeys(prev => ({
                    ...prev,
                    [e.key.toLowerCase()]: true
                }));
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            setKeys(prev => ({
                ...prev,
                [e.key.toLowerCase()]: false
            }));
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isFollowing]);
    
    useFrame((state, delta) => {
        // Check for x key press first
        if (keys.x) {
            resetCamera();
            // Reset x key state
            setKeys(prev => ({ ...prev, x: false }));
            return;
        }

        if (isFollowing) {
            if (!targetPlanet.current || !meshRef.current) {
                // If we lost our references, stop following
                setIsFollowing(false);
                resetCamera();
                return;
            }
            
            // Get current planet position
            const planetPos = meshRef.current.position;
            
            // Update camera orbit angle
            orbitAngle.current += delta * 0.1;
            
            // Calculate camera position relative to planet
            const cameraOffset = Calc.getOrbitPosition(
                orbitAngle.current,
                targetPlanet.current.orbitRadius * 0.3, // Closer to planet
                0.1 // Slight eccentricity for dynamic view
            );
            
            // Position camera relative to planet's current position
            camera.position.set(
                planetPos.x + cameraOffset.x,
                planetPos.y + cameraOffset.y + (targetPlanet.current.orbitRadius * 0.1),
                planetPos.z + cameraOffset.z
            );
            
            // Look at planet position
            camera.lookAt(planetPos);
            
            // Update camera parameters
            camera.near = targetPlanet.current.size * 0.1;
            camera.far = targetPlanet.current.orbitRadius * 10;
            camera.updateProjectionMatrix();
        } else {
            // Handle WASD movement
            moveDirection.set(0, 0, 0);
            
            if (keys.w) moveDirection.z -= 1;
            if (keys.s) moveDirection.z += 1;
            if (keys.a) moveDirection.x -= 1;
            if (keys.d) moveDirection.x += 1;

            if (moveDirection.length() > 0) {
                moveDirection.normalize();
                moveDirection.multiplyScalar(MOVEMENT_SPEED * delta);
                camera.position.add(moveDirection);
            }
        }
    });

    useEffect(() => {
        const handleScroll = () => {
            console.log('Camera position:', {
                x: camera.position.x.toFixed(2),
                y: camera.position.y.toFixed(2),
                z: camera.position.z.toFixed(2)
            });
        };

        window.addEventListener('wheel', handleScroll);
        return () => window.removeEventListener('wheel', handleScroll);
    }, [camera]);

    // Add initialization effect
    useEffect(() => {
        camera.position.set(0, 3169, 5070);
        camera.lookAt(0, 0, 0);
    }, [camera]);

    const jumpToPlanet = (planet: PlanetData, mesh: THREE.Mesh) => {
        targetPlanet.current = planet;
        meshRef.current = mesh;
        // Start camera from planet's current position
        orbitAngle.current = Math.atan2(mesh.position.z, mesh.position.x);
        setIsFollowing(true);
    };

    // Add new method to jump directly to an orbit
    const jumpToOrbit = (planet: PlanetData) => {
        targetPlanet.current = planet;
        orbitAngle.current = 0; // Start from beginning of orbit
        setIsFollowing(true);
    };

    const resetCamera = () => {
        setIsFollowing(false);
        targetPlanet.current = null;

        // Animate camera to default position
        gsap.to(camera.position, {
            x: 0,
            y: 3169,
            z: 5070,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: () => {
                camera.lookAt(0, 0, 0);
            },
            onComplete: () => {
                camera.near = 0.1;
                camera.far = 200000;
                camera.updateProjectionMatrix();
            }
        });
    };

    return { 
        jumpToPlanet, 
        jumpToOrbit, // Add new method to return object
        resetCamera, 
        targetPlanet: targetPlanet.current, 
        isFollowing 
    };
};