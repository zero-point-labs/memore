'use client';

import * as THREE from 'three';
import { extend, useFrame } from '@react-three/fiber';
import { shaderMaterial, Sparkles } from '@react-three/drei';
import { useRef } from 'react';

// Remove global namespace declaration - not needed with primitive approach

const PortalMaterial = shaderMaterial(
  // Uniforms
  {
    uTime: 0,
    uColorStart: new THREE.Color('#ec4899'), // pink
    uColorEnd: new THREE.Color('#8b5cf6'), // purple
  },
  // Vertex Shader
  `
  varying vec2 vUv;
  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;
    vUv = uv;
  }
  `,
  // Fragment Shader
  `
  uniform float uTime;
  uniform vec3 uColorStart;
  uniform vec3 uColorEnd;
  varying vec2 vUv;

  // GLSL noise function from https://github.com/ashima/webgl-noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    float distanceToCenter = distance(vUv, vec2(0.5));

    // Create a sharp inner edge for the portal's "hole"
    float innerEdge = 1.0 - smoothstep(0.38, 0.4, distanceToCenter);

    // Create the main body of the portal ring
    float portalRing = smoothstep(0.4, 0.42, distanceToCenter) - smoothstep(0.48, 0.5, distanceToCenter);

    // Create a swirling noise pattern
    float noise = snoise(vec3(vUv * 5.0 + uTime * 0.5, uTime * 0.2));
    noise = (noise + 1.0) * 0.5; // map from [-1, 1] to [0, 1]

    // Modulate the ring with noise to make it dynamic
    float finalRing = portalRing * noise;

    // Create a soft outer glow
    float outerGlow = (1.0 - smoothstep(0.4, 0.7, distanceToCenter)) * 0.5;

    // Combine the ring and the glow
    float alpha = max(finalRing, outerGlow);

    // Mix colors based on the angle
    vec2 toCenter = vec2(0.5) - vUv;
    float angle = atan(toCenter.y, toCenter.x);
    float colorMix = (angle + 3.14159) / (2.0 * 3.14159);
    vec3 color = mix(uColorStart, uColorEnd, colorMix + noise * 0.2); // Add noise to color for more variation

    gl_FragColor = vec4(color, alpha);
  }
  `
);

// Extend the material to make it available as JSX
extend({ PortalMaterial });

export default function GlowingPortal() {
  const portalMaterialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state, delta) => {
    if (portalMaterialRef.current && portalMaterialRef.current.uniforms) {
      portalMaterialRef.current.uniforms.uTime.value += delta;
    }
  });

  return (
    <group position={[0, -2.0, 0]}>
      {/* Main Portal Disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3, 64]} />
        <primitive 
          object={new PortalMaterial({
            transparent: true,
            uTime: 0,
            uColorStart: new THREE.Color('#ec4899'),
            uColorEnd: new THREE.Color('#8b5cf6')
          })}
          ref={portalMaterialRef}
          attach="material"
        />
      </mesh>
      
      {/* Enhanced Glow Layers */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <circleGeometry args={[3.5, 64]} />
        <meshStandardMaterial
          color="#00ffff"
          transparent
          opacity={0.3}
          emissive="#00ffff"
          emissiveIntensity={0.8}
        />
      </mesh>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <circleGeometry args={[4, 64]} />
        <meshStandardMaterial
          color="#8a2be2"
          transparent
          opacity={0.2}
          emissive="#8a2be2"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Enhanced Sparkles */}
      <Sparkles
        count={80}
        scale={3}
        size={6}
        speed={0.5}
        color="#00ffff"
      />
      <Sparkles
        count={60}
        scale={2.5}
        size={4}
        speed={0.4}
        color="#ec4899"
      />
      
      {/* Stronger Portal Lights */}
      <pointLight color="#00ffff" distance={12} intensity={25} position={[0, 0, 0]} />
      <pointLight color="#8a2be2" distance={10} intensity={20} position={[0, 0.5, 0]} />
      <pointLight color="#ec4899" distance={8} intensity={15} position={[0, -0.5, 0]} />
    </group>
  );
}