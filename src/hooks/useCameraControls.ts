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
        x: false,
        q: false,  // Add q key
        e: false   // Add e key
    });
    const MOVEMENT_SPEED = 1000; // Units per second
    const ROTATION_SPEED = 0.002; // Reduced from 0.5
    const moveDirection = new THREE.Vector3();

    // Add mouse control states
    const isDragging = useRef(false);
    const previousMousePosition = useRef({ x: 0, y: 0 });
    const SCROLL_SPEED = 50;

    // Add touch control states
    const isTouching = useRef(false);
    const previousTouchPosition = useRef({ x: 0, y: 0 });
    const previousTouchDistance = useRef(0);
    const TOUCH_ROTATION_SPEED = 0.004;
    const PINCH_ZOOM_SPEED = 0.05;

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
            // Get current camera position vector from origin
            const currentPos = camera.position.clone();
            const distanceFromCenter = currentPos.length();
            
            // Handle radial movement (W/S)
            if (keys.w) {
                // Move inward
                currentPos.normalize().multiplyScalar(-MOVEMENT_SPEED * delta);
                camera.position.add(currentPos);
            }
            if (keys.s) {
                // Move outward
                currentPos.normalize().multiplyScalar(MOVEMENT_SPEED * delta);
                camera.position.add(currentPos);
            }

            // Handle orbital rotation (A/D)
            if (keys.a || keys.d) {
                const rotationAngle = (keys.a ? 1 : -1) * ROTATION_SPEED;
                const rotationMatrix = new THREE.Matrix4();
                rotationMatrix.makeRotationY(rotationAngle);
                
                // Apply rotation to camera position
                const cameraPosition = camera.position.clone();
                camera.position.applyMatrix4(rotationMatrix);
            }

            // Handle vertical movement (Q/E)
            if (keys.q) {
                camera.position.y -= MOVEMENT_SPEED * delta;
            }
            if (keys.e) {
                camera.position.y += MOVEMENT_SPEED * delta;
            }

            // Always look at center
            camera.lookAt(0, 0, 0);
        }
    });

    useEffect(() => {
        // Existing mouse handlers
        const handleMouseDown = (e: MouseEvent) => {
            isDragging.current = true;
            previousMousePosition.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseUp = () => {
            isDragging.current = false;
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.current || isFollowing) return;

            const deltaX = e.clientX - previousMousePosition.current.x;
            const deltaY = e.clientY - previousMousePosition.current.y;

            handleRotation(deltaX, deltaY, ROTATION_SPEED);
            previousMousePosition.current = { x: e.clientX, y: e.clientY };
        };

        const handleScroll = (e: WheelEvent) => {
            if (isFollowing) return;

            const direction = new THREE.Vector3();
            camera.getWorldDirection(direction);
            direction.multiplyScalar(-e.deltaY * SCROLL_SPEED * 0.01);
            camera.position.add(direction);
        };

        // New touch handlers
        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 1) {
                isTouching.current = true;
                previousTouchPosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            } else if (e.touches.length === 2) {
                previousTouchDistance.current = getTouchDistance(e.touches);
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (isFollowing) return;
            e.preventDefault();

            if (e.touches.length === 1) {
                const deltaX = e.touches[0].clientX - previousTouchPosition.current.x;
                const deltaY = e.touches[0].clientY - previousTouchPosition.current.y;

                handleRotation(deltaX, deltaY, TOUCH_ROTATION_SPEED);
                previousTouchPosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            } else if (e.touches.length === 2) {
                const currentDistance = getTouchDistance(e.touches);
                const delta = currentDistance - previousTouchDistance.current;
                
                // Get current camera position vector from origin
                const currentPos = camera.position.clone();
                // Move inward or outward based on pinch
                currentPos.normalize().multiplyScalar(-delta * PINCH_ZOOM_SPEED * 10);
                camera.position.add(currentPos);

                previousTouchDistance.current = currentDistance;
            }
        };

        const handleTouchEnd = () => {
            isTouching.current = false;
        };

        // Helper function for rotation
        const handleRotation = (deltaX: number, deltaY: number, speed: number) => {
            camera.position.sub(new THREE.Vector3(0, 0, 0));
            camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), -deltaX * speed);
            
            const right = new THREE.Vector3();
            camera.getWorldDirection(right).cross(new THREE.Vector3(0, 1, 0));
            camera.position.applyAxisAngle(right, -deltaY * speed);
            
            camera.position.add(new THREE.Vector3(0, 0, 0));
            camera.lookAt(0, 0, 0);
        };

        // Helper function to calculate touch distance
        const getTouchDistance = (touches: TouchList): number => {
            const dx = touches[0].clientX - touches[1].clientX;
            const dy = touches[0].clientY - touches[1].clientY;
            return Math.sqrt(dx * dx + dy * dy);
        };

        // Add existing mouse event listeners
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('wheel', handleScroll);

        // Add new touch event listeners
        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            // Remove existing mouse event listeners
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('wheel', handleScroll);

            // Remove touch event listeners
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [camera, isFollowing]);

    // Add initialization effect
    useEffect(() => {
        camera.position.set(0, 3169, 5070);
        camera.lookAt(0, 0, 0);
    }, [camera]);

    const jumpToPlanet = (planet: PlanetData, mesh: THREE.Mesh) => {
        targetPlanet.current = planet;
        meshRef.current = mesh;
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
        jumpToOrbit, 
        resetCamera, 
        targetPlanet: targetPlanet.current, 
        isFollowing,
        activeKeys: keys  // Add this to expose the key states
    };
};