import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const FACTOR_CONFIG = [
  { id: 'roro', label: 'RORO', angle: 0 },
  { id: 'growth', label: 'Growth', angle: Math.PI * 2 / 7 },
  { id: 'inflation', label: 'Inflation', angle: (Math.PI * 2 / 7) * 2 },
  { id: 'rates', label: 'Rates', angle: (Math.PI * 2 / 7) * 3 },
  { id: 'liquidity', label: 'Liquidity', angle: (Math.PI * 2 / 7) * 4 },
  { id: 'usd', label: 'USD', angle: (Math.PI * 2 / 7) * 5 },
  { id: 'oil', label: 'Oil', angle: (Math.PI * 2 / 7) * 6 },
];

function getFactorColor(value, factorId) {
  if (factorId === 'usd' || factorId === 'rates') {
    if (Math.abs(value) < 0.1) return new THREE.Color(0.3, 0.4, 0.5);
    if (value > 0) return new THREE.Color(0.95, 0.6, 0.1);
    return new THREE.Color(0.2, 0.7, 0.9);
  }
  if (Math.abs(value) < 0.1) return new THREE.Color(0.3, 0.4, 0.5);
  if (value > 0) return new THREE.Color(0.15, 0.85, 0.7);
  return new THREE.Color(0.95, 0.25, 0.25);
}

/* ── Fresnel glow shader (adapted from MITBRAIN point/glow shaders) ── */
const fresnelGlowVertex = `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const fresnelGlowFragment = `
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float fresnel = 1.0 - abs(dot(vNormal, vViewDir));
    fresnel = pow(fresnel, 2.5);
    float pulse = 1.0 + sin(uTime * 2.0) * 0.15;
    float alpha = fresnel * uIntensity * 0.5 * pulse;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

/* ── Halo ring shader (adapted from MITBRAIN point/halo shaders) ── */
const haloRingVertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const haloRingFragment = `
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vec2 c = vUv - 0.5;
    float dist = length(c) * 2.0;
    float ring = smoothstep(0.82, 0.90, dist) * smoothstep(1.0, 0.92, dist);
    float spin = 0.08 * sin(atan(c.y, c.x) * 5.0 + uTime * 1.8);
    float alpha = (ring + spin * ring) * uIntensity * 0.7;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

function FresnelGlow({ phase }) {
  const matRef = useRef();
  const orbColor = phase === 'compressing' ? '#f59e0b' : phase === 'resolved' ? '#22c55e' : '#38bdf8';
  const intensity = phase === 'compressing' ? 1.8 : 0.8;

  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color(orbColor) },
    uIntensity: { value: intensity },
    uTime: { value: 0 },
  }), []);

  useFrame((state) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    matRef.current.uniforms.uColor.value.set(orbColor);
    matRef.current.uniforms.uIntensity.value = intensity;
  });

  return (
    <mesh scale={0.55}>
      <sphereGeometry args={[1, 32, 32]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={fresnelGlowVertex}
        fragmentShader={fresnelGlowFragment}
        uniforms={uniforms}
        transparent
        side={THREE.FrontSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function HaloDisc({ phase, radius, speed, rotationOffset }) {
  const matRef = useRef();
  const meshRef = useRef();
  const orbColor = phase === 'compressing' ? '#f59e0b' : phase === 'resolved' ? '#22c55e' : '#38bdf8';
  const intensity = phase === 'compressing' ? 1.5 : 0.6;

  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color(orbColor) },
    uIntensity: { value: intensity },
    uTime: { value: 0 },
  }), []);

  useFrame((state) => {
    if (!matRef.current || !meshRef.current) return;
    const t = state.clock.elapsedTime;
    matRef.current.uniforms.uTime.value = t * speed;
    matRef.current.uniforms.uColor.value.set(orbColor);
    matRef.current.uniforms.uIntensity.value = intensity;
    meshRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.3 + rotationOffset) * 0.2;
    meshRef.current.rotation.z = t * speed * 0.1;
  });

  return (
    <mesh ref={meshRef} scale={radius}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={haloRingVertex}
        fragmentShader={haloRingFragment}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function CentralOrb({ phase }) {
  const ref = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const isCompressing = phase === 'compressing';
    const pulseScale = isCompressing
      ? 1 + Math.sin(t * 4) * 0.08
      : 1 + Math.sin(t * 1.5) * 0.02;
    ref.current.scale.setScalar(pulseScale);
    if (glowRef.current) {
      const glowScale = isCompressing ? 1.6 + Math.sin(t * 3) * 0.2 : 1.4 + Math.sin(t * 1.2) * 0.05;
      glowRef.current.scale.setScalar(glowScale);
      glowRef.current.material.opacity = isCompressing ? 0.12 + Math.sin(t * 4) * 0.06 : 0.06;
    }
  });

  const orbColor = phase === 'compressing' ? '#f59e0b' : phase === 'resolved' ? '#22c55e' : '#38bdf8';

  return (
    <group>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color={orbColor} transparent opacity={0.06} />
      </mesh>
      <FresnelGlow phase={phase} />
      <mesh ref={ref}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <MeshDistortMaterial
          color={orbColor}
          emissive={orbColor}
          emissiveIntensity={phase === 'compressing' ? 1.8 : 0.7}
          distort={phase === 'compressing' ? 0.35 : 0.15}
          speed={phase === 'compressing' ? 4.5 : 1.5}
          roughness={0.15}
          metalness={0.85}
          transparent
          opacity={0.92}
        />
      </mesh>
    </group>
  );
}

function OrbitingNode({ factor, value, angle, phase }) {
  const ref = useRef();
  const radius = 1.6;
  const color = useMemo(() => getFactorColor(value, factor.id), [value, factor.id]);
  const nodeScale = useMemo(() => 0.08 + Math.abs(value) * 0.12, [value]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const speed = phase === 'compressing' ? 0.8 : 0.2;
    const a = angle + t * speed;
    ref.current.position.x = Math.cos(a) * radius;
    ref.current.position.z = Math.sin(a) * radius;
    ref.current.position.y = Math.sin(t * 0.5 + angle) * 0.15;
    // Pulse nodes during compression
    if (phase === 'compressing') {
      const pulse = 1 + Math.sin(t * 6 + angle * 2) * 0.15;
      ref.current.scale.setScalar(pulse);
    } else {
      ref.current.scale.setScalar(1);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[nodeScale, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={phase === 'compressing' ? 2.5 : 0.8}
        transparent
        opacity={Math.abs(value) < 0.1 ? 0.4 : 0.88}
      />
    </mesh>
  );
}

function EnergyLines({ factors, phase }) {
  const ref = useRef();
  const radius = 1.6;

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const speed = phase === 'compressing' ? 0.8 : 0.2;
    const positions = [];
    factors.forEach((_f, i) => {
      const a = FACTOR_CONFIG[i].angle + t * speed;
      const x = Math.cos(a) * radius;
      const z = Math.sin(a) * radius;
      const y = Math.sin(t * 0.5 + FACTOR_CONFIG[i].angle) * 0.15;
      positions.push(x, y, z, 0, 0, 0);
    });
    ref.current.geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    );
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  const lineColor = phase === 'compressing' ? '#f59e0b' : phase === 'resolved' ? '#22c55e' : '#38bdf8';

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={factors.length * 2}
          array={new Float32Array(factors.length * 6)}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={lineColor} transparent opacity={phase === 'compressing' ? 0.2 : 0.1} />
    </lineSegments>
  );
}

function Scene({ factors, phase }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  const factorEntries = useMemo(() =>
    FACTOR_CONFIG.map(fc => ({ ...fc, value: factors[fc.id] || 0 })),
    [factors]
  );

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.25} />
      <pointLight position={[3, 3, 3]} intensity={0.7} color="#38bdf8" />
      <pointLight position={[-3, -2, -3]} intensity={0.35} color="#f59e0b" />
      <pointLight position={[0, -3, 2]} intensity={0.2} color="#22c55e" />

      <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.25}>
        <CentralOrb phase={phase} />
      </Float>

      {/* Shader halo discs — adapted from MITBRAIN halo shader */}
      <HaloDisc phase={phase} radius={0.9} speed={1.2} rotationOffset={0} />
      <HaloDisc phase={phase} radius={1.2} speed={0.8} rotationOffset={Math.PI / 3} />
      <HaloDisc phase={phase} radius={1.5} speed={0.5} rotationOffset={Math.PI * 2 / 3} />

      {factorEntries.map((f) => (
        <OrbitingNode key={f.id} factor={f} value={f.value} angle={f.angle} phase={phase} />
      ))}

      <EnergyLines factors={factorEntries} phase={phase} />
    </group>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    this.props.onError?.();
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export default function ThreeIntelligenceCore({ factors, phase, convictionScore }) {
  const [hasError, setHasError] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) { setHasError(true); return; }
      setIsReady(true);
    } catch { setHasError(true); }
  }, []);

  if (hasError || !isReady) return null;

  return (
    <div className="three-core-container">
      <ErrorBoundary onError={() => setHasError(true)}>
        <Canvas
          camera={{ position: [0, 1.5, 3.5], fov: 45 }}
          style={{ background: 'transparent' }}
          gl={{ alpha: true, antialias: true, powerPreference: 'default' }}
          dpr={[1, 1.5]}
        >
          <Suspense fallback={null}>
            <Scene factors={factors} phase={phase} />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}
