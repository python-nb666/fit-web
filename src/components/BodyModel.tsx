import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
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
    const torsoWidth = 0.3 + (fatPct / 100) * 0.3 // 躯干宽度
    const limbThickness = 0.08 + (musclePct / 100) * 0.08 // 四肢粗细

    return {
      scale,
      torsoWidth,
      limbThickness,
      bmi,
      musclePct,
      fatPct
    }
  }, [height, weight, muscle, fat])

  // 旋转动画
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3
    }
  })

  // 根据体脂率选择颜色
  const skinColor = useMemo(() => {
    const fatPct = bodyMetrics.fatPct
    if (fatPct < 15) return '#ffd4a3' // 低体脂 - 偏棕
    if (fatPct < 25) return '#ffe0bd' // 中等体脂
    return '#ffebcd' // 高体脂 - 偏白
  }, [bodyMetrics.fatPct])

  const muscleColor = useMemo(() => {
    const musclePct = bodyMetrics.musclePct
    if (musclePct > 40) return '#d4a574' // 高肌肉 - 深色
    if (musclePct > 30) return '#e6b88a' // 中等肌肉
    return '#f5d4b0' // 低肌肉 - 浅色
  }, [bodyMetrics.musclePct])

  return (
    <group ref={groupRef} scale={bodyMetrics.scale}>
      {/* 头部 */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial
          color={skinColor}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* 颈部 */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.15, 16]} />
        <meshStandardMaterial
          color={skinColor}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* 躯干 */}
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[bodyMetrics.torsoWidth, 0.7, 0.2]} />
        <meshStandardMaterial
          color={muscleColor}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>

      {/* 腹部 */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[bodyMetrics.torsoWidth * 0.9, 0.4, 0.18]} />
        <meshStandardMaterial
          color={skinColor}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* 左上臂 */}
      <mesh position={[-bodyMetrics.torsoWidth / 2 - 0.1, 1.1, 0]} rotation={[0, 0, 0.3]} castShadow>
        <cylinderGeometry args={[bodyMetrics.limbThickness, bodyMetrics.limbThickness * 0.9, 0.35, 16]} />
        <meshStandardMaterial
          color={muscleColor}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>

      {/* 左前臂 */}
      <mesh position={[-bodyMetrics.torsoWidth / 2 - 0.25, 0.7, 0]} rotation={[0, 0, 0.2]} castShadow>
        <cylinderGeometry args={[bodyMetrics.limbThickness * 0.9, bodyMetrics.limbThickness * 0.7, 0.35, 16]} />
        <meshStandardMaterial
          color={skinColor}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* 右上臂 */}
      <mesh position={[bodyMetrics.torsoWidth / 2 + 0.1, 1.1, 0]} rotation={[0, 0, -0.3]} castShadow>
        <cylinderGeometry args={[bodyMetrics.limbThickness, bodyMetrics.limbThickness * 0.9, 0.35, 16]} />
        <meshStandardMaterial
          color={muscleColor}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>

      {/* 右前臂 */}
      <mesh position={[bodyMetrics.torsoWidth / 2 + 0.25, 0.7, 0]} rotation={[0, 0, -0.2]} castShadow>
        <cylinderGeometry args={[bodyMetrics.limbThickness * 0.9, bodyMetrics.limbThickness * 0.7, 0.35, 16]} />
        <meshStandardMaterial
          color={skinColor}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* 左大腿 */}
      <mesh position={[-0.1, 0, 0]} castShadow>
        <cylinderGeometry args={[bodyMetrics.limbThickness * 1.3, bodyMetrics.limbThickness * 1.1, 0.5, 16]} />
        <meshStandardMaterial
          color={muscleColor}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>

      {/* 左小腿 */}
      <mesh position={[-0.1, -0.5, 0]} castShadow>
        <cylinderGeometry args={[bodyMetrics.limbThickness * 1.1, bodyMetrics.limbThickness * 0.8, 0.5, 16]} />
        <meshStandardMaterial
          color={skinColor}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* 右大腿 */}
      <mesh position={[0.1, 0, 0]} castShadow>
        <cylinderGeometry args={[bodyMetrics.limbThickness * 1.3, bodyMetrics.limbThickness * 1.1, 0.5, 16]} />
        <meshStandardMaterial
          color={muscleColor}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>

      {/* 右小腿 */}
      <mesh position={[0.1, -0.5, 0]} castShadow>
        <cylinderGeometry args={[bodyMetrics.limbThickness * 1.1, bodyMetrics.limbThickness * 0.8, 0.5, 16]} />
        <meshStandardMaterial
          color={skinColor}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* 左脚 */}
      <mesh position={[-0.1, -0.8, 0.05]} castShadow>
        <boxGeometry args={[0.08, 0.05, 0.15]} />
        <meshStandardMaterial
          color="#666"
          roughness={0.8}
          metalness={0.3}
        />
      </mesh>

      {/* 右脚 */}
      <mesh position={[0.1, -0.8, 0.05]} castShadow>
        <boxGeometry args={[0.08, 0.05, 0.15]} />
        <meshStandardMaterial
          color="#666"
          roughness={0.8}
          metalness={0.3}
        />
      </mesh>

      {/* 地面阴影接收平面 */}
      <mesh position={[0, -0.85, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3, 3]} />
        <shadowMaterial opacity={0.3} />
      </mesh>
    </group>
  )
}
