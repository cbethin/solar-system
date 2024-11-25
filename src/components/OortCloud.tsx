import { useRef } from 'react';
import { Points, PointMaterial } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { 
  OORT_CLOUD_PARTICLES, 
  OORT_CLOUD_SIZE, 
  OORT_CLOUD_ROTATION_SPEED,
  OORT_CLOUD_INNER_RADIUS,
  OORT_CLOUD_OUTER_RADIUS 
} from '../utils/constants';

export const OortCloud = () => {
  const points = useRef();
  const positions = new Float32Array(OORT_CLOUD_PARTICLES * 3);
  
  for(let i = 0; i < OORT_CLOUD_PARTICLES; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 2;
    // Cubic root for more uniform volume distribution
    const r = Math.pow(Math.random(), 1/3) * 
      (OORT_CLOUD_OUTER_RADIUS - OORT_CLOUD_INNER_RADIUS) + 
      OORT_CLOUD_INNER_RADIUS;
    
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }

  useFrame(() => {
    if (points.current) {
      points.current.rotation.y += OORT_CLOUD_ROTATION_SPEED;
    }
  });

  return (
    <Points ref={points} positions={positions}>
      <PointMaterial
        transparent
        color="#b0c4de"
        size={OORT_CLOUD_SIZE}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.15}
        blending={2}
        fog={true}
      />
    </Points>
  );
};