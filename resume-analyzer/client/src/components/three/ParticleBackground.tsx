import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count = 120 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
      const t = Math.random();
      col[i * 3] = t * 0.2;
      col[i * 3 + 1] = 0.5 + t * 0.5;
      col[i * 3 + 2] = 0.4 + t * 0.3;
    }
    return [pos, col];
  }, [count]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = clock.getElapsedTime() * 0.04;
    mesh.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.02) * 0.1;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

function FloatingRing() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.x = clock.getElapsedTime() * 0.3;
    ref.current.rotation.z = clock.getElapsedTime() * 0.2;
    ref.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.3;
  });
  return (
    <mesh ref={ref} position={[3, 0, -2]}>
      <torusGeometry args={[1.5, 0.02, 16, 80]} />
      <meshBasicMaterial color="#34d399" transparent opacity={0.15} />
    </mesh>
  );
}

function FloatingRing2() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.25;
    ref.current.rotation.x = clock.getElapsedTime() * 0.15;
    ref.current.position.y = Math.cos(clock.getElapsedTime() * 0.4) * 0.2;
  });
  return (
    <mesh ref={ref} position={[-4, 1, -3]}>
      <torusGeometry args={[2, 0.015, 16, 80]} />
      <meshBasicMaterial color="#6ee7b7" transparent opacity={0.1} />
    </mesh>
  );
}

export default function ParticleBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        <Particles count={150} />
        <FloatingRing />
        <FloatingRing2 />
      </Canvas>
    </div>
  );
}
