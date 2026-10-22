import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { BALTICS } from "@/lib/baltics";
import { MAP_CITIES, MAP_DOTS } from "@/lib/baltic-map";

/**
 * "Baltic network": a tilted dot-matrix map of Lithuania, Latvia and Estonia.
 * Capitals glow and send light packets to each other along arcs, regional hubs
 * feed into their capital, and ripples roll out from each capital through the
 * dots. The whole plate can be dragged (mouse) and sways with the pointer.
 */

const SCALE = 2.45; // map units (normalised to 1) -> scene units
const WHITE = new THREE.Color("#ffffff");
const COLORS = BALTICS.map((b) => new THREE.Color(b.color));
const CAPITALS = ["Vilnius", "Riga", "Tallinn"] as const;
const HUBS = ["Kaunas", "Klaipėda", "Daugavpils", "Liepāja", "Tartu", "Pärnu"] as const;

type CityName = keyof typeof MAP_CITIES;

/** Map coordinates (x east, y north) -> scene (x east, y up, z south). */
function cityPos(name: CityName) {
  const [x, y] = MAP_CITIES[name];
  return new THREE.Vector3(x * SCALE, 0, -y * SCALE);
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Soft radial halo sprite texture. */
function useGlowTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d");
    if (!ctx) return null;
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, "rgba(255,255,255,0.9)");
    g.addColorStop(0.25, "rgba(255,255,255,0.35)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
}

/** Shared "which country is hovered" state, read inside useFrame without re-renders. */
type Hover = React.MutableRefObject<number>;
/** DOM pills rendered outside the canvas; the scene projects capital positions onto them each frame. */
type LabelRefs = React.MutableRefObject<(HTMLDivElement | null)[]>;

/** Tilted plate: idle sway, pointer parallax, mouse drag with inertia. */
function Rig({ children }: { children: React.ReactNode }) {
  const tiltGroup = useRef<THREE.Group>(null);
  const yawGroup = useRef<THREE.Group>(null);
  const { gl } = useThree();

  const s = useRef({
    tilt: 1.0,
    tiltTarget: 1.0,
    yaw: 0,
    yawTarget: 0,
    velYaw: 0,
    velTilt: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
    px: 0,
    py: 0,
  });

  useEffect(() => {
    const el = gl.domElement;
    const st = s.current;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return; // touch keeps scrolling the page
      st.dragging = true;
      st.lastX = e.clientX;
      st.lastY = e.clientY;
      st.velYaw = 0;
      st.velTilt = 0;
      el.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      st.px = ((e.clientX - r.left) / r.width) * 2 - 1;
      st.py = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (!st.dragging) return;
      const dx = e.clientX - st.lastX;
      const dy = e.clientY - st.lastY;
      st.yawTarget += dx * 0.006;
      st.tiltTarget = clamp(st.tiltTarget + dy * 0.005, 0.45, 1.4);
      st.velYaw = dx * 0.006;
      st.velTilt = dy * 0.005;
      st.lastX = e.clientX;
      st.lastY = e.clientY;
    };
    const onUp = () => {
      st.dragging = false;
      el.style.cursor = "grab";
    };
    const onLeave = () => {
      st.dragging = false;
      st.px = 0;
      st.py = 0;
      el.style.cursor = "grab";
    };

    el.style.cursor = "grab";
    el.style.touchAction = "pan-y";
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

  useFrame(({ clock }, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const st = s.current;
    const t = clock.getElapsedTime();

    if (!st.dragging) {
      st.yawTarget += st.velYaw;
      st.tiltTarget = clamp(st.tiltTarget + st.velTilt, 0.45, 1.4);
      const decay = Math.exp(-3.5 * delta);
      st.velYaw *= decay;
      st.velTilt *= decay;
      // drift back toward a gentle idle sway
      st.yawTarget += (Math.sin(t * 0.22) * 0.22 - st.yawTarget) * (1 - Math.exp(-0.35 * delta));
      st.tiltTarget += (1.0 - st.tiltTarget) * (1 - Math.exp(-0.25 * delta));
    }

    const ease = 1 - Math.exp(-6 * delta);
    st.yaw += (st.yawTarget - st.px * 0.16 - st.yaw) * ease;
    st.tilt += (st.tiltTarget + st.py * 0.1 - st.tilt) * ease;

    if (tiltGroup.current) tiltGroup.current.rotation.x = st.tilt;
    if (yawGroup.current) yawGroup.current.rotation.y = st.yaw;
  });

  return (
    <group ref={tiltGroup} position={[0, -0.12, 0]}>
      <group ref={yawGroup}>{children}</group>
    </group>
  );
}

/** Soft glass plate under the map so the scene reads as grounded without a box. */
function Plate() {
  const uniforms = useMemo(() => ({ uColor: { value: new THREE.Color("#dff6f7") } }), []);
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={-0.04} renderOrder={-2}>
      <circleGeometry args={[3.2, 96]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={/* glsl */ `
          varying vec2 vUv;
          void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
        `}
        fragmentShader={/* glsl */ `
          uniform vec3 uColor;
          varying vec2 vUv;
          void main() {
            float r = length(vUv - 0.5) * 2.0;
            float a = (1.0 - smoothstep(0.35, 1.0, r)) * 0.55;
            // faint latitude rings
            float ring = smoothstep(0.985, 1.0, abs(sin(r * 18.0))) * 0.08 * (1.0 - r);
            gl_FragColor = vec4(uColor + ring, a + ring);
          }
        `}
      />
    </mesh>
  );
}

/** The dot-matrix landmass. Instanced spheres, rippling out from each capital. */
function Dots({ hover }: { hover: Hover }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const count = MAP_DOTS.length / 3;

  const data = useMemo(() => {
    const x = new Float32Array(count);
    const z = new Float32Array(count);
    const country = new Uint8Array(count);
    const dist = new Float32Array(count);
    const capitals = CAPITALS.map(cityPos);
    for (let i = 0; i < count; i++) {
      const px = (MAP_DOTS[i * 3] ?? 0) * SCALE;
      const pz = -(MAP_DOTS[i * 3 + 1] ?? 0) * SCALE;
      const c = MAP_DOTS[i * 3 + 2] ?? 0;
      const cap = capitals[c] ?? capitals[0]!;
      x[i] = px;
      z[i] = pz;
      country[i] = c;
      dist[i] = Math.hypot(px - cap.x, pz - cap.z);
    }
    return { x, z, country, dist };
  }, [count]);

  const palette = useMemo(
    () => ({
      base: COLORS.map((c) => c.clone().lerp(WHITE, 0.42)),
      bright: COLORS.map((c) => c.clone().lerp(WHITE, 0.05)),
    }),
    [],
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tmp = useMemo(() => new THREE.Color(), []);

  useFrame(({ clock }) => {
    const m = mesh.current;
    if (!m) return;
    const t = clock.getElapsedTime();
    const h = hover.current;
    for (let i = 0; i < count; i++) {
      const c = data.country[i] ?? 0;
      const d = data.dist[i] ?? 0;
      const px = data.x[i] ?? 0;
      const pz = data.z[i] ?? 0;
      const wave = Math.sin(d * 5.2 - t * 2.1 + c * 1.7);
      const ripple = (wave > 0 ? wave * wave * wave : 0) * Math.exp(-d * 0.75);
      const swell = Math.sin(px * 1.5 + t * 0.7) * Math.cos(pz * 1.2 - t * 0.5);
      const lift = h === c ? 0.06 : 0;
      dummy.position.set(px, ripple * 0.18 + swell * 0.025 + lift, pz);
      dummy.scale.setScalar(1 + ripple * 0.8 + (h === c ? 0.2 : 0));
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      tmp.copy(palette.base[c]!).lerp(palette.bright[c]!, Math.min(1, ripple * 1.5 + (h === c ? 0.55 : 0)));
      m.setColorAt(i, tmp);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[0.03, 12, 12]} />
      <meshStandardMaterial roughness={0.35} metalness={0.2} envMapIntensity={0.9} />
    </instancedMesh>
  );
}

/** Glowing link with a light segment travelling along it, plus packets in both directions. */
function Link({
  from,
  to,
  countries,
  lift,
  radius,
  speed,
  hover,
}: {
  from: CityName;
  to: CityName;
  countries: [number, number];
  lift: number;
  radius: number;
  speed: number;
  hover: Hover;
}) {
  const curve = useMemo(() => {
    const a = cityPos(from);
    const b = cityPos(to);
    const mid = a.clone().add(b).multiplyScalar(0.5);
    mid.y += a.distanceTo(b) * lift;
    return new THREE.QuadraticBezierCurve3(a, mid, b);
  }, [from, to, lift]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: speed },
      uBoost: { value: 0 },
      uA: { value: COLORS[countries[0]]! },
      uB: { value: COLORS[countries[1]]! },
    }),
    [speed, countries],
  );

  const packets = useRef<THREE.Group>(null);
  const glow = useGlowTexture();

  useFrame(({ clock }, rawDelta) => {
    const t = clock.getElapsedTime();
    uniforms.uTime.value = t;
    const want = hover.current === countries[0] || hover.current === countries[1] ? 1 : 0;
    uniforms.uBoost.value += (want - uniforms.uBoost.value) * Math.min(1, rawDelta * 6);
    const g = packets.current;
    if (!g) return;
    g.children.forEach((child, i) => {
      const dir = i % 2 === 0 ? 1 : -1;
      const u = ((t * speed * 0.85 * dir + i * 0.37) % 1 + 1) % 1;
      curve.getPointAt(u, child.position);
    });
  });

  return (
    <group>
      <mesh renderOrder={2}>
        <tubeGeometry args={[curve, 72, radius, 8, false]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={uniforms}
          vertexShader={/* glsl */ `
            varying vec2 vUv;
            void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
          `}
          fragmentShader={/* glsl */ `
            uniform float uTime, uSpeed, uBoost;
            uniform vec3 uA, uB;
            varying vec2 vUv;
            void main() {
              vec3 col = mix(uA, uB, vUv.x);
              float p = fract(vUv.x - uTime * uSpeed);
              float head = smoothstep(0.0, 0.05, p) * (1.0 - smoothstep(0.05, 0.4, p));
              float a = 0.22 + head * 0.7 + uBoost * 0.35;
              gl_FragColor = vec4(col + head * 0.45 + uBoost * 0.2, a);
            }
          `}
        />
      </mesh>
      <group ref={packets}>
        {[0, 1].map((i) => (
          <group key={i}>
            <mesh>
              <sphereGeometry args={[radius * 2.2, 12, 12]} />
              <meshBasicMaterial color={COLORS[countries[i]!]!.clone().lerp(WHITE, 0.5)} toneMapped={false} />
            </mesh>
            {glow && (
              <sprite scale={[radius * 26, radius * 26, 1]}>
                <spriteMaterial
                  map={glow}
                  color={COLORS[countries[i]!]!}
                  blending={THREE.AdditiveBlending}
                  transparent
                  depthWrite={false}
                  opacity={0.9}
                />
              </sprite>
            )}
          </group>
        ))}
      </group>
    </group>
  );
}

/** Capital: glass core, light pillar, expanding ground rings, HTML label. */
function Capital({ name, country, hover, labels }: { name: CityName; country: number; hover: Hover; labels: LabelRefs }) {
  const pos = useMemo(() => cityPos(name), [name]);
  const color = COLORS[country]!;
  const glow = useGlowTexture();
  const rings = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const anchor = useRef<THREE.Object3D>(null);
  const hot = useRef(false);
  const hotShown = useRef<boolean | null>(null);
  const v = useMemo(() => new THREE.Vector3(), []);

  const pillarUniforms = useMemo(() => ({ uColor: { value: color }, uBoost: { value: 0 } }), [color]);

  useFrame(({ clock, camera, size }, rawDelta) => {
    const t = clock.getElapsedTime();
    const g = rings.current;
    if (g) {
      g.children.forEach((r, i) => {
        const phase = ((t * 0.45 + i * 0.5 + country * 0.17) % 1 + 1) % 1;
        r.scale.setScalar(0.25 + phase * 1.6);
        (r as THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>).material.opacity = (1 - phase) * 0.55;
      });
    }
    const want = hot.current ? 1 : 0;
    pillarUniforms.uBoost.value += (want - pillarUniforms.uBoost.value) * Math.min(1, rawDelta * 6);
    if (core.current) core.current.scale.setScalar(1 + Math.sin(t * 2.4 + country) * 0.08 + pillarUniforms.uBoost.value * 0.25);

    // project the label anchor into the overlay
    const el = labels.current[country];
    if (el && anchor.current) {
      anchor.current.getWorldPosition(v).project(camera);
      const x = (v.x * 0.5 + 0.5) * size.width;
      const y = (-v.y * 0.5 + 0.5) * size.height;
      // whole-pixel offsets keep the pill text crisp (fractional transforms get resampled)
      el.style.transform = `translate(${Math.round(x - el.offsetWidth / 2)}px, ${Math.round(y - el.offsetHeight / 2)}px)`;
      el.style.opacity = v.z < 1 ? "1" : "0";
      if (hot.current !== hotShown.current) {
        hotShown.current = hot.current;
        el.dataset["hot"] = hot.current ? "1" : "0";
      }
    }
  });

  return (
    <group position={pos}>
      {/* hit area */}
      <mesh
        visible={false}
        onPointerOver={() => {
          hover.current = country;
          hot.current = true;
        }}
        onPointerOut={() => {
          if (hover.current === country) hover.current = -1;
          hot.current = false;
        }}
      >
        <sphereGeometry args={[0.42, 8, 8]} />
      </mesh>

      <mesh ref={core} position-y={0.08}>
        <sphereGeometry args={[0.085, 32, 32]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.4}
          roughness={0.1}
          metalness={0.3}
          clearcoat={1}
          clearcoatRoughness={0.1}
          toneMapped={false}
        />
      </mesh>
      {glow && (
        <sprite position-y={0.08} scale={[1.1, 1.1, 1]}>
          <spriteMaterial map={glow} color={color} blending={THREE.AdditiveBlending} transparent depthWrite={false} opacity={0.75} />
        </sprite>
      )}
      <pointLight position-y={0.3} intensity={2.5} distance={2.2} color={color} />

      {/* light pillar */}
      <mesh position-y={0.62} renderOrder={1}>
        <cylinderGeometry args={[0.012, 0.045, 1.1, 16, 1, true]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          uniforms={pillarUniforms}
          vertexShader={/* glsl */ `
            varying vec2 vUv;
            void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
          `}
          fragmentShader={/* glsl */ `
            uniform vec3 uColor; uniform float uBoost;
            varying vec2 vUv;
            void main() {
              float a = pow(1.0 - vUv.y, 1.6) * (0.55 + uBoost * 0.45);
              gl_FragColor = vec4(uColor + uBoost * 0.25, a);
            }
          `}
        />
      </mesh>

      {/* expanding ground rings */}
      <group ref={rings} rotation-x={-Math.PI / 2} position-y={0.005}>
        {[0, 1].map((i) => (
          <mesh key={i}>
            <ringGeometry args={[0.3, 0.325, 64]} />
            <meshBasicMaterial color={color} transparent depthWrite={false} opacity={0.4} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>

      <object3D ref={anchor} position-y={1.2} />
    </group>
  );
}

/** Regional hub: small node tied to its capital. */
function Hub({ name, country }: { name: CityName; country: number }) {
  const pos = useMemo(() => cityPos(name), [name]);
  const color = COLORS[country]!;
  const ring = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>>(null);
  const seed = useMemo(() => name.length * 0.37, [name]);

  useFrame(({ clock }) => {
    const r = ring.current;
    if (!r) return;
    const phase = ((clock.getElapsedTime() * 0.5 + seed) % 1 + 1) % 1;
    r.scale.setScalar(0.3 + phase * 1.1);
    r.material.opacity = (1 - phase) * 0.4;
  });

  return (
    <group position={pos}>
      <mesh position-y={0.04}>
        <sphereGeometry args={[0.045, 20, 20]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} roughness={0.2} toneMapped={false} />
      </mesh>
      <mesh ref={ring} rotation-x={-Math.PI / 2} position-y={0.005}>
        <ringGeometry args={[0.16, 0.175, 48]} />
        <meshBasicMaterial color={color} transparent depthWrite={false} opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/** Slow drifting motes for depth around the plate. */
function Motes() {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const n = 120;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 2.2 + Math.random() * 2.2;
      const a = Math.random() * Math.PI * 2;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = Math.random() * 2.2 - 0.4;
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    return arr;
  }, []);
  useFrame((_, rawDelta) => {
    if (points.current) points.current.rotation.y += Math.min(rawDelta, 0.05) * 0.03;
  });
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#22b8c4" transparent opacity={0.35} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Scene({ labels }: { labels: LabelRefs }) {
  const hover = useRef(-1);
  const hubCountry = (n: CityName): number => MAP_CITIES[n][2];

  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 8, 5]} intensity={1.3} />
      <pointLight position={[-4, 3, 2]} intensity={10} color="#22b8c4" />
      <pointLight position={[4, 2, -3]} intensity={8} color="#2f56c9" />

      <Rig>
        <Plate />
        <Dots hover={hover} />

        {/* capital-to-capital arcs */}
        <Link from="Vilnius" to="Riga" countries={[0, 1]} lift={0.42} radius={0.016} speed={0.22} hover={hover} />
        <Link from="Riga" to="Tallinn" countries={[1, 2]} lift={0.42} radius={0.016} speed={0.19} hover={hover} />
        <Link from="Vilnius" to="Tallinn" countries={[0, 2]} lift={0.5} radius={0.013} speed={0.14} hover={hover} />

        {/* hub feeders */}
        <Link from="Vilnius" to="Kaunas" countries={[0, 0]} lift={0.5} radius={0.008} speed={0.4} hover={hover} />
        <Link from="Vilnius" to="Klaipėda" countries={[0, 0]} lift={0.3} radius={0.008} speed={0.3} hover={hover} />
        <Link from="Riga" to="Daugavpils" countries={[1, 1]} lift={0.3} radius={0.008} speed={0.33} hover={hover} />
        <Link from="Riga" to="Liepāja" countries={[1, 1]} lift={0.3} radius={0.008} speed={0.28} hover={hover} />
        <Link from="Tallinn" to="Tartu" countries={[2, 2]} lift={0.3} radius={0.008} speed={0.31} hover={hover} />
        <Link from="Tallinn" to="Pärnu" countries={[2, 2]} lift={0.4} radius={0.008} speed={0.36} hover={hover} />

        {CAPITALS.map((c, i) => (
          <Capital key={c} name={c} country={i} hover={hover} labels={labels} />
        ))}
        {HUBS.map((h) => (
          <Hub key={h} name={h} country={hubCountry(h)} />
        ))}
        <Motes />
      </Rig>

      <Environment resolution={128}>
        <Lightformer intensity={2} position={[0, 5, 0]} scale={[10, 10, 1]} rotation-x={Math.PI / 2} />
        <Lightformer intensity={1.4} color="#bff4ef" position={[-6, 1, -1]} rotation-y={Math.PI / 2} scale={[14, 3, 1]} />
        <Lightformer intensity={1.2} color="#c3d2ff" position={[6, -1, 1]} rotation-y={-Math.PI / 2} scale={[14, 3, 1]} />
      </Environment>
    </>
  );
}

export function Hero3D({ labels: names }: { labels: Record<"LT" | "LV" | "EE", string> }) {
  const labels = useRef<(HTMLDivElement | null)[]>([]);
  return (
    <div className="relative aspect-square w-full">
      {/* absolutely positioned so the canvas's intrinsic size can never stretch the page column */}
      <div className="absolute inset-0 overflow-hidden">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0.2, 9.2], fov: 30 }} gl={{ antialias: true, alpha: true }}>
          <Suspense fallback={null}>
            <Scene labels={labels} />
          </Suspense>
        </Canvas>
      </div>
      {/* country pills, pinned to the capitals by the scene; may overhang the square */}
      <div className="pointer-events-none absolute inset-0">
        {BALTICS.map((b, i) => (
          <div
            key={b.code}
            ref={(el) => {
              labels.current[i] = el;
            }}
            className="absolute left-0 top-0 flex items-center gap-2 whitespace-nowrap rounded-full border bg-card/95 px-3 py-1.5 text-xs font-semibold text-foreground opacity-0 shadow-lg transition-[border-color,box-shadow] duration-300 data-[hot=1]:border-primary data-[hot=1]:shadow-glow"
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: b.color, boxShadow: `0 0 10px ${b.color}` }} />
            {names[b.code as "LT" | "LV" | "EE"]}
            <span className="text-[10px] font-bold tracking-widest text-primary">{b.code}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
