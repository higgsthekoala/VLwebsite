import { useRef, useEffect, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { gsap } from 'gsap'

// Particle System Component
function Particles({ count = 200, mouse }: { count?: number; mouse: THREE.Vector2 }) {
  const meshRef = useRef<THREE.Points>(null)
  const velocitiesRef = useRef<Float32Array>()

  const { size } = useThree()

  // Generate particle positions and properties
  const [positions, colors, scales] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const scales = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Random positions
      positions[i3] = (Math.random() - 0.5) * 20
      positions[i3 + 1] = (Math.random() - 0.5) * 20
      positions[i3 + 2] = (Math.random() - 0.5) * 10

      // Sonar Music color palette
      const colorVariant = Math.random()
      if (colorVariant < 0.3) {
        // Accent brown
        colors[i3] = 0.698 // r
        colors[i3 + 1] = 0.518 // g
        colors[i3 + 2] = 0.314 // b
      } else if (colorVariant < 0.6) {
        // Light grey
        colors[i3] = 0.706
        colors[i3 + 1] = 0.722
        colors[i3 + 2] = 0.710
      } else {
        // Foreground white
        colors[i3] = 0.890
        colors[i3 + 1] = 0.890
        colors[i3 + 2] = 0.863
      }

      // Random scales
      scales[i] = Math.random() * 0.5 + 0.1
    }

    return [positions, colors, scales]
  }, [count])

  // Initialize velocities
  useEffect(() => {
    velocitiesRef.current = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i++) {
      velocitiesRef.current[i] = (Math.random() - 0.5) * 0.01
    }
  }, [count])

  // Animation loop
  useFrame((state) => {
    if (!meshRef.current || !velocitiesRef.current) return

    const positions = meshRef.current.geometry.attributes.position.array as Float32Array
    const velocities = velocitiesRef.current
    const time = state.clock.elapsedTime

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Floating animation
      positions[i3] += velocities[i3] + Math.sin(time * 0.5 + i) * 0.001
      positions[i3 + 1] += velocities[i3 + 1] + Math.cos(time * 0.3 + i) * 0.001
      positions[i3 + 2] += velocities[i3 + 2] + Math.sin(time * 0.7 + i) * 0.0005

      // Mouse interaction
      const mouseInfluence = 0.02
      const mouseDistance = Math.sqrt(
        Math.pow((mouse.x * 10) - positions[i3], 2) +
        Math.pow((mouse.y * 10) - positions[i3 + 1], 2)
      )

      if (mouseDistance < 3) {
        const force = (3 - mouseDistance) / 3
        positions[i3] += (positions[i3] - mouse.x * 10) * force * mouseInfluence
        positions[i3 + 1] += (positions[i3 + 1] - mouse.y * 10) * force * mouseInfluence
      }

      // Boundary wrapping
      if (positions[i3] > 10) positions[i3] = -10
      if (positions[i3] < -10) positions[i3] = 10
      if (positions[i3 + 1] > 10) positions[i3 + 1] = -10
      if (positions[i3 + 1] < -10) positions[i3 + 1] = 10
      if (positions[i3 + 2] > 5) positions[i3 + 2] = -5
      if (positions[i3 + 2] < -5) positions[i3 + 2] = 5
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true

    // Rotate the entire particle system slowly
    meshRef.current.rotation.y = time * 0.05
    meshRef.current.rotation.x = Math.sin(time * 0.03) * 0.1
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-scale"
          args={[scales, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        transparent
        opacity={0.6}
        vertexColors
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
      />
    </points>
  )
}

// Floating Geometry Elements
function FloatingElements() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return

    const time = state.clock.elapsedTime
    groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.1
    groupRef.current.rotation.y = time * 0.1
    groupRef.current.rotation.z = Math.cos(time * 0.3) * 0.05
  })

  return (
    <group ref={groupRef}>
      {/* Wireframe Cubes */}
      <mesh position={[4, 2, -2]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshBasicMaterial color="#b28450" wireframe opacity={0.3} transparent />
      </mesh>

      <mesh position={[-3, -1, 1]}>
        <octahedronGeometry args={[0.3]} />
        <meshBasicMaterial color="#e3e2db" wireframe opacity={0.2} transparent />
      </mesh>

      <mesh position={[2, -3, -1]}>
        <tetrahedronGeometry args={[0.4]} />
        <meshBasicMaterial color="#409ea6" wireframe opacity={0.25} transparent />
      </mesh>

      {/* Rings */}
      <mesh position={[-2, 3, 0]} rotation={[Math.PI / 4, 0, Math.PI / 6]}>
        <ringGeometry args={[0.3, 0.5, 16]} />
        <meshBasicMaterial color="#b28450" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

// Interactive Connection Lines
function ConnectionLines({ mouse }: { mouse: THREE.Vector2 }) {
  const linesRef = useRef<THREE.LineSegments>(null)

  const linePositions = useMemo(() => {
    const positions = new Float32Array(100 * 6) // 50 lines, 2 points each, 3 coords per point

    for (let i = 0; i < 50; i++) {
      const i6 = i * 6
      // Start point
      positions[i6] = (Math.random() - 0.5) * 15
      positions[i6 + 1] = (Math.random() - 0.5) * 15
      positions[i6 + 2] = (Math.random() - 0.5) * 8

      // End point
      positions[i6 + 3] = (Math.random() - 0.5) * 15
      positions[i6 + 4] = (Math.random() - 0.5) * 15
      positions[i6 + 5] = (Math.random() - 0.5) * 8
    }

    return positions
  }, [])

  useFrame((state) => {
    if (!linesRef.current) return

    const time = state.clock.elapsedTime
    const positions = linesRef.current.geometry.attributes.position.array as Float32Array

    // Animate line endpoints
    for (let i = 0; i < 50; i++) {
      const i6 = i * 6
      positions[i6] += Math.sin(time + i) * 0.002
      positions[i6 + 1] += Math.cos(time + i) * 0.002
      positions[i6 + 3] += Math.cos(time + i + 1) * 0.002
      positions[i6 + 4] += Math.sin(time + i + 1) * 0.002
    }

    linesRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[linePositions, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#b28450"
        transparent
        opacity={0.1}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  )
}

// Main Particle System Component
interface ParticleSystemProps {
  intensity?: 'low' | 'medium' | 'high'
  interactive?: boolean
  className?: string
}

export default function ParticleSystem({
  intensity = 'medium',
  interactive = true,
  className = ''
}: ParticleSystemProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef(new THREE.Vector2())
  const [isMounted, setIsMounted] = useState(false)

  const particleCount = {
    low: 100,
    medium: 200,
    high: 400
  }[intensity]

  // Mount check
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Mouse tracking
  useEffect(() => {
    if (!interactive) return

    const handleMouseMove = (event: MouseEvent) => {
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [interactive])

  if (!isMounted) return null

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 10]} intensity={0.3} color="#b28450" />

        {/* Particle Effects */}
        <Particles count={particleCount} mouse={mouseRef.current} />
        <FloatingElements />
        <ConnectionLines mouse={mouseRef.current} />

        {/* Fog for depth */}
        <fog attach="fog" args={['#2a2d2f', 8, 25]} />
      </Canvas>
    </div>
  )
}

// Simpler version for backgrounds
export function BackgroundParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      <Canvas
        camera={{ position: [0, 0, 15], fov: 40 }}
        gl={{ antialias: false, alpha: true }}
      >
        <ambientLight intensity={0.05} />
        <Particles count={50} mouse={new THREE.Vector2()} />
        <fog attach="fog" args={['#2a2d2f', 15, 35]} />
      </Canvas>
    </div>
  )
}
