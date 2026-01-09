"use client"

import { useEffect, useRef, useState } from "react"
import { useGLTF, useAnimations } from "@react-three/drei"
import type * as THREE from "three"
import type { ModelProps } from "@/types"
import { calculateModelTransform, validateModel, validateAndLogMaterials } from "@/lib/model-utils"

interface ClothingItem {
  url: string
  visible: boolean
  color?: string
  scale?: number
}

interface MultiModelProps extends Omit<ModelProps, "modelUrl" | "color" | "fileType"> {
  bodyModelUrl: string
  shirt?: ClothingItem
  shoes?: ClothingItem
  pants?: ClothingItem
}

function ClothingModel({
  url,
  visible,
  color,
  transform,
  name,
  customScale = 1.0,
}: {
  url: string
  visible: boolean
  color?: string
  transform: { scale: number; position: THREE.Vector3 }
  name: string
  customScale?: number
}) {
  const ref = useRef<THREE.Group>(null)
  const gltf = useGLTF(url)

  useEffect(() => {
    if (ref.current && gltf?.scene) {
      const finalScale = transform.scale * customScale
      ref.current.scale.setScalar(finalScale)
      ref.current.position.copy(transform.position)
      console.log(`[v0] ${name} model positioned (aligned with body) with custom scale: ${customScale.toFixed(2)}x`)

      // Validate and log materials
      validateAndLogMaterials(gltf.scene)
    }
  }, [gltf, transform, name, customScale])

  useEffect(() => {
    if (ref.current) {
      ref.current.visible = visible
      console.log(`[v0] ${name} visibility:`, visible ? "VISIBLE" : "HIDDEN")
    }
  }, [visible, name])

  useEffect(() => {
    if (!gltf || !gltf.scene || !color) return

    try {
      let materialFound = false
      gltf.scene.traverse((child: any) => {
        if (child.isMesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat: any) => {
              if (mat.color) {
                mat.color.set(color)
                // Ensure color is visible even with textures by adjusting emissive
                if (mat.map || mat.normalMap) {
                  // For textured materials, add a subtle emissive to make color more visible
                  if (mat.emissive) {
                    mat.emissive.set(color)
                    mat.emissiveIntensity = 0.2
                  }
                }
                mat.needsUpdate = true
                materialFound = true
              }
            })
          } else if (child.material.color) {
            child.material.color.set(color)
            // Ensure color is visible even with textures by adjusting emissive
            if (child.material.map || child.material.normalMap) {
              // For textured materials, add a subtle emissive to make color more visible
              if (child.material.emissive) {
                child.material.emissive.set(color)
                child.material.emissiveIntensity = 0.2
              }
            }
            child.material.needsUpdate = true
            materialFound = true
          }
        }
      })

      if (materialFound) {
        console.log(`[v0] Applied ${name} color:`, color, "(with enhanced visibility for textured materials)")
      }
    } catch (error) {
      console.error(`[v0] ERROR updating ${name} color:`, error)
    }
  }, [color, gltf, name])

  if (!gltf?.scene) return null

  return (
    <group ref={ref}>
      <primitive object={gltf.scene} />
    </group>
  )
}

export function MultiModel({
  bodyModelUrl,
  shirt,
  shoes,
  pants,
  onFacePositionCalculated,
  onError,
  onAnimationsDetected,
  currentAnimation,
  animationSpeed = 1,
  isPlaying = true,
}: MultiModelProps) {
  const [loadError, setLoadError] = useState<string | null>(null)
  const [transform, setTransform] = useState<{
    scale: number
    position: THREE.Vector3
    facePosition: THREE.Vector3
  } | null>(null)
  const bodyRef = useRef<THREE.Group>(null)
  const processedRef = useRef<boolean>(false)

  const bodyGltf = useGLTF(bodyModelUrl)

  const { actions, names } = useAnimations(bodyGltf?.animations || [], bodyRef)

  useEffect(() => {
    if (names.length > 0 && onAnimationsDetected) {
      console.log("[v0] Detected animations:", names)
      onAnimationsDetected(names)
    }
  }, [names, onAnimationsDetected])

  useEffect(() => {
    if (!actions || !currentAnimation) return

    console.log("[v0] Animation control:", { currentAnimation, isPlaying, animationSpeed })

    Object.values(actions).forEach((action) => {
      if (action) action.stop()
    })

    const action = actions[currentAnimation]
    if (action) {
      action.timeScale = animationSpeed
      action.reset()
      if (isPlaying) {
        action.play()
        console.log("[v0] Playing animation:", currentAnimation, "at speed:", animationSpeed)
      } else {
        action.paused = true
        console.log("[v0] Animation paused:", currentAnimation)
      }
    }

    return () => {
      if (action) {
        action.stop()
      }
    }
  }, [actions, currentAnimation, isPlaying, animationSpeed])

  useEffect(() => {
    if (!bodyGltf) return

    try {
      console.log("[v0] Multi-model system initialized")
      console.log("[v0] Body model URL:", bodyModelUrl)
      if (shirt?.url) console.log("[v0] Shirt model URL:", shirt.url)
      if (shoes?.url) console.log("[v0] Shoes model URL:", shoes.url)
      if (pants?.url) console.log("[v0] Pants model URL:", pants.url)

      if (processedRef.current) {
        console.log("[v0] Models already processed, skipping recalculation")
        return
      }

      const bodyValidation = validateModel(bodyGltf.scene)
      if (!bodyValidation.valid) {
        console.error("[v0] Body model validation failed:", bodyValidation.error)
        setLoadError(bodyValidation.error!)
        onError?.(bodyValidation.error!)
        return
      }

      validateAndLogMaterials(bodyGltf.scene)

      const calculatedTransform = calculateModelTransform(bodyGltf.scene, bodyModelUrl)
      setTransform(calculatedTransform)

      // Apply transform to body
      if (bodyRef.current) {
        bodyRef.current.scale.setScalar(calculatedTransform.scale)
        bodyRef.current.position.copy(calculatedTransform.position)
        console.log("[v0] Body model positioned")
      }

      console.log("[v0] Models normalized to 1.8m height")
      console.log("[v0] Applied scale:", calculatedTransform.scale)
      console.log("[v0] Applied position:", {
        x: calculatedTransform.position.x,
        y: calculatedTransform.position.y,
        z: calculatedTransform.position.z,
      })

      onFacePositionCalculated(calculatedTransform.facePosition)
      processedRef.current = true
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error processing models"
      console.error("[v0] ERROR processing models:", error)
      setLoadError(errorMsg)
      onError?.(errorMsg)
    }
  }, [bodyGltf, onFacePositionCalculated, onError, bodyModelUrl])

  useEffect(() => {
    processedRef.current = false
  }, [bodyModelUrl])

  if (loadError) {
    return (
      <group>
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </group>
    )
  }

  if (!bodyGltf || !bodyGltf.scene || !transform) {
    return null
  }

  return (
    <>
      <group ref={bodyRef}>
        <primitive object={bodyGltf.scene} />
      </group>

      {shirt?.url && (
        <ClothingModel
          url={shirt.url}
          visible={shirt.visible}
          color={shirt.color}
          transform={transform}
          name="Shirt"
          customScale={shirt.scale}
        />
      )}

      {shoes?.url && (
        <ClothingModel
          url={shoes.url}
          visible={shoes.visible}
          color={shoes.color}
          transform={transform}
          name="Shoes"
          customScale={shoes.scale}
        />
      )}

      {pants?.url && (
        <ClothingModel
          url={pants.url}
          visible={pants.visible}
          color={pants.color}
          transform={transform}
          name="Pants"
          customScale={pants.scale}
        />
      )}
    </>
  )
}
