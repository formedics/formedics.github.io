import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { BALTICS, type Baltic } from "@/lib/baltics";

/** Brand accents mirrored from src/styles.css; WebGL materials need literal hex. */
const TEAL = "#22b8c4";
const BLUE = "#2f56c9";
const MINT = "#8ee8df";
const NAVY = "#16233f";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Holds the whole assembly: auto-spin + pointer drag with inertia + mouse parallax. */
function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const { gl } = useThree();

  const state = useRef({
    targetX: -0.12,
    targetY: 0.4,
    currentX: -0.12,
    currentY: 0.4,
    velX: 0,
    velY: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
    pointerX: 0,
    pointerY: 0,
  });

  useMemo(() => {
    const el = gl.domElement;
    const s = state.current;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return; // touch keeps scrolling the page
      s.dragging = true;
      s.lastX = e.clientX;
      s.lastY = e.clientY;
      s.velX = 0;
      s.velY = 0;
      el.style.cursor = "grabbing";
    };

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      s.pointerX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      s.pointerY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      if (!s.dragging) return;
      const dx = e.clientX - s.lastX;
      const dy = e.clientY - s.lastY;
      s.targetY += dx * 0.007;
      s.targetX = clamp(s.targetX + dy * 0.006, -0.75, 0.75);
      s.velY = dx * 0.007;
      s.velX = dy * 0.006;
      s.lastX = e.clientX;
      s.lastY = e.clientY;
    };

    const onUp = () => {
      s.dragging = false;
      el.style.cursor = "grab";
    };

    const onLeave = () => {
      s.dragging = false;
      s.pointerX = 0;
      s.pointerY = 0;
      el.style.cursor = "grab";
    };

    el.style.cursor = "grab";
    el.style.touchAction = "pan-y"; // vertical page scroll stays available on phones
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.style.cursor = "";
      el.style.touchAction = "";
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [gl]);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const s = state.current;

    if (!s.dragging) {
      // inertia after release, then settle back into a slow idle spin
      s.targetY += s.velY;
      s.targetX = clamp(s.targetX + s.velX, -0.75, 0.75);
      const decay = Math.exp(-3.5 * delta);
      s.velY *= decay;
      s.velX *= decay;
      if (Math.abs(s.velY) < 0.0016) s.targetY += delta * 0.16;
    }

    const ease = 1 - Math.exp(-6 * delta);
    s.currentX += (s.targetX + s.pointerY * 0.12 - s.currentX) * ease;
    s.currentY += (s.targetY - s.pointerX * 0.18 - s.currentY) * ease;

    if (group.current) {
      group.current.rotation.x = s.currentX;
      group.current.rotation.y = s.currentY;
    }
  });

  return <group ref={group}>{children}</group>;
}

/** Glass capsule with a glowing cross sealed inside. */
function Capsule() {
  const cross = useRef<THREE.Group>(null);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    if (cross.current) cross.current.rotation.y += delta * 0.5;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.7}>
      <group rotation-z={-0.5}>
        <mesh castShadow>
          <capsuleGeometry args={[0.62, 1.15, 12, 48]} />
          <meshPhysicalMaterial
            transmission={1}
            thickness={1.4}
            roughness={0.08}
            ior={1.45}
            clearcoat={1}
            clearcoatRoughness={0.06}
            attenuationColor={TEAL}
            attenuationDistance={2.2}
            color="#e6fbfb"
          />
        </mesh>

        {/* sealed glowing cross */}
        <group ref={cross}>
          <mesh>
            <boxGeometry args={[0.22, 0.86, 0.22]} />
            <meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={4.5} toneMapped={false} />
          </mesh>
          <mesh>
            <boxGeometry args={[0.86, 0.22, 0.22]} />
            <meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={4.5} toneMapped={false} />
          </mesh>
          <pointLight intensity={6} distance={3.2} color={TEAL} />
        </group>


        {/* fill line hinting at the liquid level */}
        <mesh rotation-z={0.5} position={[0.02, -0.18, 0]}>
          <torusGeometry args={[0.58, 0.014, 8, 64]} />
          <meshStandardMaterial color={MINT} emissive={MINT} emissiveIntensity={1.6} toneMapped={false} />
        </mesh>
      </group>
    </Float>
  );
}

/** One tilted orbit ring carrying a country node. */
function Orbit({ country }: { country: Baltic }) {
  const spinner = useRef<THREE.Group>(null);
  const node = useRef<THREE.Mesh>(null);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    if (spinner.current) spinner.current.rotation.y += delta * country.speed;
    if (node.current) {
      const pulse = 1 + Math.sin(performance.now() * 0.0022 + country.radius) * 0.14;
      node.current.scale.setScalar(pulse);
    }
  });

  return (
    <group rotation={[country.tiltX, 0, country.tiltZ]}>
      <mesh rotation-x={Math.PI / 2}>
        <torusGeometry args={[country.radius, 0.009, 6, 160]} />
        <meshBasicMaterial color={country.color} transparent opacity={0.4} />
      </mesh>

      <group ref={spinner}>
        <group position={[country.radius, 0, 0]}>
          <mesh ref={node}>
            <sphereGeometry args={[0.1, 24, 24]} />
            <meshStandardMaterial
              color={country.color}
              emissive={country.color}
              emissiveIntensity={2}
              toneMapped={false}
            />
          </mesh>
          <mesh rotation-x={Math.PI / 2}>
            <torusGeometry args={[0.19, 0.007, 6, 48]} />
            <meshBasicMaterial color={country.color} transparent opacity={0.65} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/** Expanding scan rings, like a pulse on a monitor. */
function Pulse() {
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const cycle = (mesh: THREE.Mesh | null, offset: number) => {
      if (!mesh) return;
      const p = (t * 0.34 + offset) % 1;
      mesh.scale.setScalar(0.7 + p * 3.4);
      (mesh.material as THREE.MeshBasicMaterial).opacity = (1 - p) * 0.4;
    };
    cycle(a.current, 0);
    cycle(b.current, 0.5);
  });

  return (
    <group rotation-x={-Math.PI / 2} position-y={-1.35}>
      <mesh ref={a}>
        <ringGeometry args={[0.98, 1, 96]} />
        <meshBasicMaterial color={TEAL} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={b}>
        <ringGeometry args={[0.98, 1, 96]} />
        <meshBasicMaterial color={BLUE} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/** Drifting dust for depth. */
function Dust() {
  const points = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(260 * 3);
    for (let i = 0; i < 260; i++) {
      const r = 2.4 + Math.random() * 2.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.cos(phi) * 0.6;
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, []);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    if (points.current) points.current.rotation.y += delta * 0.04;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color={TEAL} transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[5, 7, 6]}
        intensity={1.35}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-3.5, 1.5, 2]} intensity={12} color={TEAL} />
      <pointLight position={[3.5, -1.5, -2]} intensity={9} color={BLUE} />

      <Rig>
        <Capsule />
        {BALTICS.map((c) => (
          <Orbit key={c.code} country={c} />
        ))}
        <Pulse />
        <Dust />
      </Rig>

      <ContactShadows position={[0, -1.7, 0]} opacity={0.32} scale={11} blur={2.6} far={4} color={NAVY} />

      <Environment resolution={256}>
        <Lightformer intensity={2.2} position={[0, 5, 0]} scale={[10, 10, 1]} rotation-x={Math.PI / 2} />
        <Lightformer intensity={1.4} color="#bff4ef" position={[-6, 1, -1]} rotation-y={Math.PI / 2} scale={[14, 3, 1]} />
        <Lightformer intensity={1.1} color="#c3d2ff" position={[6, -1, 1]} rotation-y={-Math.PI / 2} scale={[14, 3, 1]} />
        <Lightformer intensity={0.8} color="#ffffff" position={[0, -4, 4]} scale={[12, 4, 1]} />
      </Environment>
    </>
  );
}

export function Hero3D() {
  return (
    <div className="aspect-square w-full">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0.5, 7.4], fov: 40 }} gl={{ antialias: true, alpha: true }} shadows>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
