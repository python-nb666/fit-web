import { useRef, useMemo } from 'react'
import { RoundedBox, Float } from '@react-three/drei'
import * as THREE from 'three'

interface BodyModelProps {
  height: number // cm
  weight: number // kg
  muscle: number // kg
  fat: number // kg
}

export function BodyModel({ height, weight, muscle, fat }: BodyModelProps) {
  const groupRef = useRef<THREE.Group>(null)

  // 根据身体数据计算比例
  const bodyMetrics = useMemo(() => {
    const bmi = weight / Math.pow(height / 100, 2)
    const musclePct = (muscle / weight) * 100
    const fatPct = (fat / weight) * 100

    // 身体比例计算
    const scale = height / 170 // 基准身高 170cm

    // 躯干宽度：基于体脂率和骨架
    const baseWidth = 0.32
    // 体脂越高越宽
    const fatWidthMod = (fatPct - 15) / 100 * 0.5
    // 肌肉越高越宽（特别是肩部）
    const muscleWidthMod = (musclePct - 35) / 100 * 0.4

    const torsoWidth = baseWidth * (1 + fatWidthMod + muscleWidthMod)

    // 躯干厚度：基于肌肉率和体脂
    const baseDepth = 0.2
    const fatDepthMod = (fatPct - 15) / 100 * 0.6
    const muscleDepthMod = (musclePct - 35) / 100 * 0.5

    const torsoDepth = baseDepth * (1 + fatDepthMod + muscleDepthMod)

    return {
      scale,
      torsoWidth,
      torsoDepth,
      bmi,
      musclePct,
      fatPct
    }
  }, [height, weight, muscle, fat])

  // 材质配置 - 高端质感
  const materialProps = useMemo(() => {
    return {
      roughness: 0.4,
      metalness: 0.1,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
      reflectivity: 1,
    }
  }, [])

  // 动态颜色 - 更真实的肤色基调
  const skinColor = useMemo(() => {
    // 基础肤色
    return new THREE.Color('#e0ac69').lerp(new THREE.Color('#8d5524'), 0.1)
  }, [])

  return (
    <group ref={groupRef} scale={bodyMetrics.scale} position={[0, -0.5, 0]}>

      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
        <group>
          {/* 头部 */}
          <mesh position={[0, 1.65, 0]} castShadow>
            <sphereGeometry args={[0.14, 64, 64]} />
            <meshPhysicalMaterial color={skinColor} {...materialProps} />
          </mesh>

          {/* 颈部 */}
          <mesh position={[0, 1.45, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 0.15, 32]} />
            <meshPhysicalMaterial color={skinColor} {...materialProps} />
          </mesh>

          {/* 上躯干 (胸部) */}
          <RoundedBox
            args={[bodyMetrics.torsoWidth * 1.2, 0.4, bodyMetrics.torsoDepth * 1.1]}
            radius={0.05}
            smoothness={4}
            position={[0, 1.15, 0]}
            castShadow
          >
            <meshPhysicalMaterial color={skinColor} {...materialProps} />
          </RoundedBox>

          {/* 中躯干 (腹部) */}
          <RoundedBox
            args={[bodyMetrics.torsoWidth * 1.0, 0.35, bodyMetrics.torsoDepth * 1.0]}
            radius={0.05}
            smoothness={4}
            position={[0, 0.8, 0]}
            castShadow
          >
            <meshPhysicalMaterial color={skinColor} {...materialProps} />
          </RoundedBox>

          {/* 下躯干 (腰部/臀部) */}
          <RoundedBox
            args={[bodyMetrics.torsoWidth * 1.1, 0.35, bodyMetrics.torsoDepth * 1.1]}
            radius={0.08}
            smoothness={4}
            position={[0, 0.45, 0]}
            castShadow
          >
            <meshPhysicalMaterial color={skinColor} {...materialProps} />
          </RoundedBox>

          {/* 大腿 (简化展示) */}
          <group position={[0, 0.1, 0]}>
            {/* 左腿根部 */}
            <mesh position={[-0.12, 0, 0]} castShadow>
              <capsuleGeometry args={[0.11 * (1 + (bodyMetrics.musclePct - 30) / 100), 0.4, 4, 16]} />
              <meshPhysicalMaterial color={skinColor} {...materialProps} />
            </mesh>
            {/* 右腿根部 */}
            <mesh position={[0.12, 0, 0]} castShadow>
              <capsuleGeometry args={[0.11 * (1 + (bodyMetrics.musclePct - 30) / 100), 0.4, 4, 16]} />
              <meshPhysicalMaterial color={skinColor} {...materialProps} />
            </mesh>
          </group>

          {/* 肩部关节 */}
          <mesh position={[-bodyMetrics.torsoWidth * 0.65, 1.25, 0]} castShadow>
            <sphereGeometry args={[0.13, 32, 32]} />
            <meshPhysicalMaterial color={skinColor} {...materialProps} />
          </mesh>
          <mesh position={[bodyMetrics.torsoWidth * 0.65, 1.25, 0]} castShadow>
            <sphereGeometry args={[0.13, 32, 32]} />
            <meshPhysicalMaterial color={skinColor} {...materialProps} />
          </mesh>

          {/* 手臂 (上臂) */}
          <mesh position={[-bodyMetrics.torsoWidth * 0.75, 0.9, 0]} rotation={[0, 0, 0.2]} castShadow>
            <capsuleGeometry args={[0.09 * (1 + (bodyMetrics.musclePct - 30) / 100), 0.4, 4, 16]} />
            <meshPhysicalMaterial color={skinColor} {...materialProps} />
          </mesh>
          <mesh position={[bodyMetrics.torsoWidth * 0.75, 0.9, 0]} rotation={[0, 0, -0.2]} castShadow>
            <capsuleGeometry args={[0.09 * (1 + (bodyMetrics.musclePct - 30) / 100), 0.4, 4, 16]} />
            <meshPhysicalMaterial color={skinColor} {...materialProps} />
          </mesh>

          {/* 全息扫描环效果 */}
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.2, 0.005, 16, 100]} />
            <meshBasicMaterial color="#a855f7" transparent opacity={0.3} />
          </mesh>

          <mesh position={[0, 1.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.4, 0.002, 16, 100]} />
            <meshBasicMaterial color="#3b82f6" transparent opacity={0.2} />
          </mesh>

        </group>
      </Float>

      {/* 地面反射 */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[3, 64]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  )
}
