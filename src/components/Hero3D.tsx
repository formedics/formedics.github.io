import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, ContactShadows, Environment, Float, Lightformer } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { BALTICS, type Baltic } from "@/lib/baltics";

/** Brand accents mirrored from src/styles.css; WebGL materials need literal hex. */
const TEAL = "#22b8c4";
const BLUE = "#2f56c9";
const MINT = "#8ee8df";
const NAVY = "#16233f";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Soft radial halo used to make the sealed cross read as glowing. */
function useGlowTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d");
    if (!ctx) return null;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(150,255,248,0.95)");
    g.addColorStop(0.3, "rgba(34,184,196,0.5)");
    g.addColorStop(1, "rgba(34,184,196,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
}

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

/** Fresnel rim: capsule edges catch light, so the shell reads as real glass. */
function GlassRim() {
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(TEAL) },
      uPower: { value: 2.6 },
      uStrength: { value: 0.85 },
    }),
    [],
  );

  return (
    <mesh scale={[1.012, 1.012, 1.012]}>
      <capsuleGeometry args={[0.62, 1.15, 16, 64]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={/* glsl */ `
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            vec4 wp = modelMatrix * vec4(position, 1.0);
            vNormal = normalize(mat3(modelMatrix) * normal);
            vView = normalize(cameraPosition - wp.xyz);
            gl_Position = projectionMatrix * viewMatrix * wp;
          }
        `}
        fragmentShader={/* glsl */ `
          uniform vec3 uColor;
          uniform float uPower;
          uniform float uStrength;
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            float f = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), uPower);
            gl_FragColor = vec4(uColor, f * uStrength);
          }
        `}
      />
    </mesh>
  );
}

/** Frosted capsule shell with a glowing medical cross sealed inside. */
function Capsule() {
  const cross = useRef<THREE.Group>(null);
  const glow = useGlowTexture();

  useFrame(({ clock }) => {
    if (!cross.current) return;
    // gentle breathing so the sealed emblem feels alive
    cross.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * 1.6) * 0.06);
  });

  return (
    <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.7}>
      <group rotation-z={-0.5}>
        {/* shell: translucent so the cross stays readable, clearcoat for the wet glass highlight */}
        <mesh castShadow>
          <capsuleGeometry args={[0.62, 1.15, 16, 64]} />
          <meshPhysicalMaterial
            color="#a9e9e6"
            transparent
            opacity={0.3}
            roughness={0.08}
            metalness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.06}
            depthWrite={false}
            envMapIntensity={1.8}
          />
        </mesh>
        <GlassRim />


        {/* sealed glowing cross, kept facing the viewer */}
        <Billboard>
          <group ref={cross}>
            <mesh>
              <boxGeometry args={[0.26, 0.94, 0.26]} />
              <meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={3.4} toneMapped={false} />
            </mesh>
            <mesh>
              <boxGeometry args={[0.94, 0.26, 0.26]} />
              <meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={3.4} toneMapped={false} />
            </mesh>
            {glow && (
              <sprite scale={[3.1, 3.1, 1]}>
                <spriteMaterial
                  map={glow}
                  blending={THREE.AdditiveBlending}
                  transparent
                  depthWrite={false}
                  opacity={0.85}
                />
              </sprite>
            )}
            <pointLight intensity={6} distance={3.5} color={TEAL} />
          </group>
        </Billboard>

        {/* fill line hinting at the liquid level, kept below the emblem */}
        <mesh rotation-z={0.5} position={[0.02, -0.66, 0]}>
          <torusGeometry args={[0.5, 0.012, 8, 64]} />
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
    if (spinner.current) spinner.current.rotation.z += delta * country.speed;
    if (node.current) {
      const pulse = 1 + Math.sin(performance.now() * 0.0022 + country.radius) * 0.14;
      node.current.scale.setScalar(pulse);
    }
  });

  return (
    <group rotation={[country.tiltX, 0, country.tiltZ]}>
      <mesh>
        <torusGeometry args={[country.radius, 0.022, 16, 256]} />

        <meshBasicMaterial color={country.color} transparent opacity={0.5} depthWrite={false} />
      </mesh>

      <group ref={spinner}>
        <group position={[country.radius, 0, 0]}>
          <mesh ref={node}>
            <sphereGeometry args={[0.1, 32, 32]} />
            <meshPhysicalMaterial
              color={country.color}
              emissive={country.color}
              emissiveIntensity={1.1}
              roughness={0.12}
              metalness={0.35}
              clearcoat={1}
              clearcoatRoughness={0.1}
              envMapIntensity={1.6}
            />
          </mesh>
          <mesh rotation-x={Math.PI / 2}>
            <torusGeometry args={[0.19, 0.014, 12, 96]} />
            <meshBasicMaterial color={country.color} transparent opacity={0.7} depthWrite={false} />
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
        <meshBasicMaterial color={TEAL} transparent opacity={0.4} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh ref={b}>
        <ringGeometry args={[0.98, 1, 96]} />
        <meshBasicMaterial color={BLUE} transparent opacity={0.4} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

/** Drifting dust for depth. */
function Dust() {
  const points = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(140 * 3);
    for (let i = 0; i < 140; i++) {
      const r = 2.6 + Math.random() * 2.4;
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
      <pointsMaterial size={0.022} color={TEAL} transparent opacity={0.4} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 7, 6]}
        intensity={1.4}
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
        <Lightformer intensity={2.4} position={[0, 5, 0]} scale={[10, 10, 1]} rotation-x={Math.PI / 2} />
        <Lightformer intensity={1.6} color="#bff4ef" position={[-6, 1, -1]} rotation-y={Math.PI / 2} scale={[14, 3, 1]} />
        <Lightformer intensity={1.3} color="#c3d2ff" position={[6, -1, 1]} rotation-y={-Math.PI / 2} scale={[14, 3, 1]} />
        <Lightformer intensity={1} color="#ffffff" position={[0, -4, 4]} scale={[12, 4, 1]} />
      </Environment>
    </>
  );
}

export function Hero3D() {
  return (
    <div className="aspect-square w-full">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0.5, 9.2], fov: 30 }} gl={{ antialias: true, alpha: true }} shadows>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
