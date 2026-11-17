'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';

/* Procedural cricket-ball leather: polished red hide, a raised primary seam
   with six rows of stitching, and the two faint quarter seams. Drawn on an
   equirectangular canvas so it wraps the sphere without visible joins. */
function speckle(ctx: CanvasRenderingContext2D, W: number, H: number, count: number, colours: string[], alphas: number[], size: () => number) {
  const per = Math.ceil(count / (colours.length * alphas.length));
  for (const c of colours) {
    for (const a of alphas) {
      ctx.beginPath();
      for (let i = 0; i < per; i++) {
        const s = size();
        ctx.rect(Math.random() * W, Math.random() * H, s, s);
      }
      ctx.fillStyle = `rgba(${c},${a})`;
      ctx.fill();
    }
  }
}

function makeBallTextures() {
  const W = 2048;
  const H = 1024;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d')!;

  // Base leather with tonal variation.
  const base = g.createLinearGradient(0, 0, 0, H);
  base.addColorStop(0, '#5e0a0d');
  base.addColorStop(0.5, '#9c1519');
  base.addColorStop(1, '#5e0a0d');
  g.fillStyle = base;
  g.fillRect(0, 0, W, H);
  // Speckle in a few batched colour buckets: one path and one fill per bucket, not one per dot.
  speckle(g, W, H, 14000, ['255,220,210', '30,0,0'], [0.01, 0.025, 0.04], () => Math.random() * 3 + 0.5);
  // Scuffs from a long spell.
  for (let i = 0; i < 40; i++) {
    g.strokeStyle = `rgba(255,200,190,${Math.random() * 0.06})`;
    g.lineWidth = Math.random() * 2 + 0.5;
    g.beginPath();
    const x = Math.random() * W;
    const y = Math.random() * H;
    g.moveTo(x, y);
    g.lineTo(x + (Math.random() - 0.5) * 120, y + (Math.random() - 0.5) * 40);
    g.stroke();
  }

  // Bump map drawn in parallel (white = raised).
  const b = document.createElement('canvas');
  b.width = W;
  b.height = H;
  const bg = b.getContext('2d')!;
  bg.fillStyle = '#7a7a7a';
  bg.fillRect(0, 0, W, H);
  speckle(bg, W, H, 30000, ['255,255,255', '0,0,0'], [0.05], () => 2);

  const mid = H / 2;

  // Primary seam: a raised ridge along the equator.
  const seam = g.createLinearGradient(0, mid - 22, 0, mid + 22);
  seam.addColorStop(0, 'rgba(60,5,8,0)');
  seam.addColorStop(0.35, '#4a0709');
  seam.addColorStop(0.5, '#7d1014');
  seam.addColorStop(0.65, '#4a0709');
  seam.addColorStop(1, 'rgba(60,5,8,0)');
  g.fillStyle = seam;
  g.fillRect(0, mid - 22, W, 44);
  bg.fillStyle = '#ffffff';
  bg.fillRect(0, mid - 6, W, 12);

  // Six rows of stitches, three each side of the seam.
  const rows = [-30, -19, -9, 9, 19, 30];
  rows.forEach((offset, r) => {
    const step = 15;
    for (let x = (r % 2) * 7; x < W; x += step) {
      const y = mid + offset;
      const lean = offset < 0 ? -1 : 1;
      g.strokeStyle = '#f3ead6';
      g.lineWidth = 3.2;
      g.lineCap = 'round';
      g.beginPath();
      g.moveTo(x, y - 3 * lean);
      g.lineTo(x + 7, y + 3 * lean);
      g.stroke();
      g.strokeStyle = 'rgba(0,0,0,0.35)';
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(x + 1, y - 1 * lean + 2);
      g.lineTo(x + 8, y + 4 * lean + 2);
      g.stroke();
      bg.strokeStyle = '#ffffff';
      bg.lineWidth = 3;
      bg.beginPath();
      bg.moveTo(x, y - 3 * lean);
      bg.lineTo(x + 7, y + 3 * lean);
      bg.stroke();
    }
  });

  // Quarter seams: faint meridians, one per hemisphere.
  const quarter = (x: number, from: number, to: number) => {
    g.strokeStyle = 'rgba(40,0,0,0.55)';
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(x, from);
    g.lineTo(x, to);
    g.stroke();
    bg.strokeStyle = '#3a3a3a';
    bg.lineWidth = 4;
    bg.beginPath();
    bg.moveTo(x, from);
    bg.lineTo(x, to);
    bg.stroke();
  };
  quarter(W * 0.25, 0, mid - 40);
  quarter(W * 0.75, 0, mid - 40);
  quarter(W * 0.0 + 2, mid + 40, H);
  quarter(W * 0.5, mid + 40, H);

  // Gold maker's stamp.
  g.save();
  g.translate(W * 0.62, mid - 170);
  g.fillStyle = 'rgba(253,185,19,0.75)';
  g.font = '700 54px Arial';
  g.textAlign = 'center';
  g.fillText('MSD  7', 0, 0);
  g.font = '600 26px Arial';
  g.fillText('CAPTAIN COOL · TEST', 0, 40);
  g.restore();

  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  const bump = new THREE.CanvasTexture(b);
  return { map, bump };
}

function Ball({ progress, pointer }: { progress?: MotionValue<number>; pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Mesh>(null);
  const textures = useMemo(() => makeBallTextures(), []);

  useEffect(() => () => {
    textures.map.dispose();
    textures.bump.dispose();
  }, [textures]);

  useFrame((state, delta) => {
    if (!group.current || !spin.current) return;
    const p = progress?.get() ?? 0;
    // Spin about the seam's normal so the seam stays upright, like a seamer's wrist.
    spin.current.rotation.y += delta * (1.4 + p * 7);
    const t = state.clock.elapsedTime;
    const targetX = pointer.current.x * 0.35;
    const targetY = pointer.current.y * 0.25;
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, 0.42 + targetX * 0.4, 0.06);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetX * 0.8, 0.06);
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX * 0.4, 0.05);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, Math.sin(t * 1.2) * 0.06 - targetY * 0.3 - p * 0.6, 0.08);
    // On scroll the delivery comes at the camera.
    // Intro: the ball grows into place over ~1.6s (expo ease-out).
    const intro = 1 - Math.pow(2, -10 * Math.min(1, t / 1.6));
    // 0.55 seats the ball exactly in the O-slot of the headline.
    group.current.scale.setScalar(Math.min(0.55 * (1 + p * 3.2), 2.4) * Math.max(0.001, intro));
  });

  return (
    <group ref={group} rotation={[0.38, 0, 0.42]}>
      <mesh ref={spin} castShadow>
        <sphereGeometry args={[1, 128, 128]} />
        <meshPhysicalMaterial
          map={textures.map}
          bumpMap={textures.bump}
          bumpScale={0.9}
          roughness={0.38}
          metalness={0.05}
          clearcoat={0.85}
          clearcoatRoughness={0.25}
          sheen={0.4}
          sheenColor={new THREE.Color('#ff8a7a')}
        />
      </mesh>
    </group>
  );
}

function makeDust(count: number) {
  {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
      speeds[i] = 0.05 + Math.random() * 0.2;
    }
    return { positions, speeds };
  }
}

function Dust({ count = 420 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);
  const [{ positions, speeds }] = useState(() => makeDust(count));

  useFrame((state, delta) => {
    const geo = points.current?.geometry;
    if (!geo) return;
    const arr = geo.attributes.position.array as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * delta;
      arr[i * 3] += Math.sin(t * 0.3 + i) * delta * 0.05;
      if (arr[i * 3 + 1] > 4) arr[i * 3 + 1] = -4;
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#ffd36b" transparent opacity={0.75} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  );
}

export default function BallScene({ progress, className }: { progress?: MotionValue<number>; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 });
    if (wrap.current) io.observe(wrap.current);
    return () => {
      window.removeEventListener('pointermove', onMove);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={wrap} className={className} aria-hidden>
      <Canvas
        onCreated={({ gl }) => {
          if (process.env.NODE_ENV === 'production') gl.debug.checkShaderErrors = false;
        }}
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 4.2], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        {/* Floodlights: two warm towers and a cool rim from the far stand. */}
        <ambientLight intensity={0.25} />
        <spotLight position={[-5, 6, 4]} angle={0.5} penumbra={0.8} intensity={140} color="#ffe2a8" />
        <spotLight position={[5, 5, 3]} angle={0.5} penumbra={0.9} intensity={70} color="#fff4dc" />
        <pointLight position={[0, -3, -3]} intensity={30} color="#3aa0ee" />
        <pointLight position={[3, -1, 2]} intensity={6} color="#fdb913" />
        <Ball progress={progress} pointer={pointer} />
        <Dust />
      </Canvas>
    </div>
  );
}
