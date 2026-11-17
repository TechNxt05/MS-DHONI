'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

export interface GlobePin {
  id: string;
  lat: number;
  lon: number;
  label: string;
}

const RANCHI = { lat: 23.34, lon: 85.31 };
const R = 1;

function toVec(lat: number, lon: number, r = R) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

/** Rotation (y, x) that brings a lat/lon to face the camera. */
function faceRotation(lat: number, lon: number) {
  return { y: THREE.MathUtils.degToRad(-lon - 90), x: THREE.MathUtils.degToRad(lat) };
}

function LandDots() {
  const [geo, setGeo] = useState<THREE.BufferGeometry | null>(null);
  useEffect(() => {
    let alive = true;
    fetch('/data/land-dots.bin')
      .then((r) => r.arrayBuffer())
      .then((buf) => {
        if (!alive) return;
        const raw = new Int16Array(buf);
        const pos = new Float32Array((raw.length / 2) * 3);
        for (let i = 0; i < raw.length / 2; i++) {
          const v = toVec(raw[i * 2] / 100, raw[i * 2 + 1] / 100, R * 1.001);
          pos.set([v.x, v.y, v.z], i * 3);
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        setGeo(g);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  if (!geo) return null;
  return (
    <points geometry={geo}>
      <pointsMaterial size={0.012} color="#c9c2b0" transparent opacity={0.75} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Arc({ to, delay }: { to: THREE.Vector3; delay: number }) {
  const line = useRef<THREE.Line>(null);
  const { geometry, total } = useMemo(() => {
    const from = toVec(RANCHI.lat, RANCHI.lon);
    const mid = from.clone().add(to).multiplyScalar(0.5);
    const lift = 1 + from.distanceTo(to) * 0.45;
    mid.normalize().multiplyScalar(R * lift);
    const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
    const pts = curve.getPoints(64);
    return { geometry: new THREE.BufferGeometry().setFromPoints(pts), total: pts.length };
  }, [to]);

  useFrame((state) => {
    // Draw the arc out from Ranchi, hold, then fade and repeat.
    const t = ((state.clock.elapsedTime - delay) % 6) / 6;
    const drawn = Math.max(0, Math.min(1, t * 2.2));
    geometry.setDrawRange(0, Math.floor(drawn * total));
    const mat = line.current?.material as THREE.LineBasicMaterial | undefined;
    if (mat) mat.opacity = t > 0.8 ? (1 - t) * 4 : 0.85;
  });

  return (
    // @ts-expect-error: R3F's <line> maps to THREE.Line, not the SVG element.
    <line ref={line} geometry={geometry}>
      <lineBasicMaterial color="#fdb913" transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} />
    </line>
  );
}

function Pin({ p, active }: { p: GlobePin; active: boolean }) {
  const v = useMemo(() => toVec(p.lat, p.lon), [p.lat, p.lon]);
  const ring = useRef<THREE.Mesh>(null);
  const q = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), v.clone().normalize()), [v]);
  useFrame((state) => {
    if (!ring.current) return;
    const s = 1 + ((state.clock.elapsedTime * 0.8 + p.lat) % 1) * 2.5;
    ring.current.scale.setScalar(s);
    (ring.current.material as THREE.MeshBasicMaterial).opacity = 1 - (s - 1) / 2.5;
  });
  return (
    <group position={v} quaternion={q}>
      <mesh>
        <sphereGeometry args={[active ? 0.028 : 0.017, 16, 16]} />
        <meshBasicMaterial color={active ? '#ffffff' : '#fdb913'} />
      </mesh>
      <mesh ref={ring}>
        <ringGeometry args={[0.02, 0.026, 32]} />
        <meshBasicMaterial color="#fdb913" transparent side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

type DragState = { dx: number; dy: number; active: boolean };

function Globe({ pins, focus, takeDrag }: { pins: GlobePin[]; focus: GlobePin | null; takeDrag: () => DragState }) {
  const group = useRef<THREE.Group>(null);
  const target = useRef(faceRotation(RANCHI.lat, RANCHI.lon));
  const arcs = useMemo(() => pins.slice(0, 40).map((p) => toVec(p.lat, p.lon)), [pins]);

  useEffect(() => {
    if (focus) target.current = faceRotation(focus.lat, focus.lon);
  }, [focus]);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const d = takeDrag();
    if (d.active || d.dx || d.dy) {
      target.current.y += d.dx * 0.006;
      target.current.x = THREE.MathUtils.clamp(target.current.x + d.dy * 0.004, -1.2, 1.2);
    } else if (!focus) {
      target.current.y += delta * 0.08;
    }
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, target.current.y, 0.06);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, target.current.x, 0.06);
  });

  const ranchi = useMemo(() => toVec(RANCHI.lat, RANCHI.lon), []);

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[R, 64, 64]} />
        <meshStandardMaterial color="#0c1018" roughness={0.9} metalness={0.1} />
      </mesh>
      <LandDots />
      {/* Ranchi: where it started. */}
      <mesh position={ranchi}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color="#3aa0ee" />
      </mesh>
      {arcs.map((v, i) => (
        <Arc key={i} to={v} delay={i * 0.35} />
      ))}
      {pins.map((p) => (
        <Pin key={p.id} p={p} active={focus?.id === p.id} />
      ))}
    </group>
  );
}

function Atmosphere() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { color: { value: new THREE.Color('#3aa0ee') } },
        vertexShader: `varying vec3 vNormal; void main(){ vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `uniform vec3 color; varying vec3 vNormal; void main(){ float i = pow(0.72 - dot(vNormal, vec3(0.0,0.0,1.0)), 3.0); gl_FragColor = vec4(color, 1.0) * i; }`,
      }),
    [],
  );
  return (
    <mesh scale={1.18}>
      <sphereGeometry args={[R, 64, 64]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

export default function FanGlobe({ pins, focus, className }: { pins: GlobePin[]; focus: GlobePin | null; className?: string }) {
  const dragging = useRef({ dx: 0, dy: 0, active: false });
  const last = useRef<{ x: number; y: number } | null>(null);
  // Hands the accumulated drag to the render loop and resets it.
  const takeDrag = useCallback(() => {
    const d = { ...dragging.current };
    dragging.current.dx = 0;
    dragging.current.dy = 0;
    return d;
  }, []);

  // Stop rendering while the globe is scrolled out of view.
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 });
    if (wrap.current) io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrap}
      className={className}
      style={{ touchAction: 'pan-y' }}
      data-cursor="Drag"
      onPointerDown={(e) => {
        last.current = { x: e.clientX, y: e.clientY };
        dragging.current.active = true;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!last.current) return;
        dragging.current.dx += e.clientX - last.current.x;
        dragging.current.dy += e.clientY - last.current.y;
        last.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={() => {
        last.current = null;
        dragging.current.active = false;
      }}
      onPointerCancel={() => {
        last.current = null;
        dragging.current.active = false;
      }}
    >
      <Canvas
        onCreated={({ gl }) => {
          if (process.env.NODE_ENV === 'production') gl.debug.checkShaderErrors = false;
        }} frameloop={visible ? 'always' : 'never'} dpr={[1, 1.75]} camera={{ position: [0, 0, 3.1], fov: 40 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[-3, 2, 3]} intensity={1.2} color="#ffe2a8" />
        <Atmosphere />
        <Globe pins={pins} focus={focus} takeDrag={takeDrag} />
      </Canvas>
    </div>
  );
}
