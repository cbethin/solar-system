import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Sun } from './Sun';
import { Planet } from './Planet';
import { OortCloud } from './OortCloud';
import React = require('react');

export const SolarSystem = () => {
  return (
    <Canvas camera={{ position: [0, 100, 400], fov: 60, far: 10000 }}>
      <color attach="background" args={['#000000']} />
      <Stars radius={300} depth={60} count={20000} factor={6} />
      
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 0]} intensity={2} />
      
      <Sun />

      {/* Inner Planets */}
      <Planet name="Mercury" distance={60} size={3.8} rotationSpeed={0.04} />
      <Planet name="Venus" distance={80} size={9.5} rotationSpeed={0.015} />
      <Planet name="Earth" distance={110} size={10} rotationSpeed={0.01} />
      <Planet name="Mars" distance={140} size={5.3} rotationSpeed={0.008} />

      {/* Outer Planets */}
      <Planet name="Jupiter" distance={200} size={30} rotationSpeed={0.002} />
      <Planet name="Saturn" distance={250} size={25} rotationSpeed={0.0009} />
      <Planet name="Uranus" distance={300} size={15} rotationSpeed={0.0004} />
      <Planet name="Neptune" distance={350} size={14} rotationSpeed={0.0001} />

      {/* <OortCloud /> */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={150}
        maxDistance={5000}
      />
    </Canvas>
  );
};