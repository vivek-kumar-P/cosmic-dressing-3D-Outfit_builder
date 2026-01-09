"use client"

import { useMemo } from "react"
import * as THREE from "three"

interface ShirtProps {
  color: string
  visible: boolean
}

export function Shirt({ color, visible }: ShirtProps) {
  const shirtGeometry = useMemo(() => {
    // Create a simple shirt shape using a cylinder for the torso and smaller cylinders for sleeves
    const torso = new THREE.CylinderGeometry(0.25, 0.3, 0.7, 16)
    const leftSleeve = new THREE.CylinderGeometry(0.08, 0.1, 0.4, 12)
    const rightSleeve = new THREE.CylinderGeometry(0.08, 0.1, 0.4, 12)

    // Position sleeves
    leftSleeve.translate(-0.33, 0.15, 0)
    leftSleeve.rotateZ(Math.PI / 2.5)
    rightSleeve.translate(0.33, 0.15, 0)
    rightSleeve.rotateZ(-Math.PI / 2.5)

    // Merge geometries
    const mergedGeometry = new THREE.BufferGeometry()
    const geometries = [torso, leftSleeve, rightSleeve]

    return torso
  }, [])

  if (!visible) return null

  return (
    <group position={[0, 1.2, 0]}>
      {/* Torso */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.7, 16]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Left Sleeve */}
      <mesh position={[-0.33, 0.15, 0]} rotation={[0, 0, Math.PI / 2.5]}>
        <cylinderGeometry args={[0.08, 0.1, 0.4, 12]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Right Sleeve */}
      <mesh position={[0.33, 0.15, 0]} rotation={[0, 0, -Math.PI / 2.5]}>
        <cylinderGeometry args={[0.08, 0.1, 0.4, 12]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
      </mesh>
    </group>
  )
}
