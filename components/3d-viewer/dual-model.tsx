"use client"

import { useEffect, useRef, useState } from "react"
import { useGLTF, useAnimations } from "@react-three/drei"
import type * as THREE from "three"
import type { ModelProps } from "@/types"
import { calculateModelTransform, validateModel, validateAndLogMaterials } from "@/lib/model-utils"

const DEFAULT_BODY_MODEL_URL =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/just_body-rcOZSRE7s6nyArblYSi6fF9yertTgD.glb"
const SHIRT_MODEL_URL =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/just_shirt-KiWazVV6pBTrQh3ibHOgJuq7nQchd7.glb"

export function DualModel({
  onFacePositionCalculated,
  onError,
  onAnimationsDetected,
  currentAnimation,
  animationSpeed = 1,
  isPlaying = true,
  shirtColor,
  showShirt = true,
  bodyModelUrl,
}: Omit<ModelProps, "modelUrl" | "color" | "fileType"> & { bodyModelUrl?: string }) {
  const [loadError, setLoadError] = useState<string | null>(null)
  const bodyRef = useRef<THREE.Group>(null)
  const shirtRef = useRef<THREE.Group>(null)
  const processedRef = useRef<boolean>(false)
  const previousShirtColorRef = useRef<string>(shirtColor || "#4a90e2")

  const BODY_MODEL_URL = bodyModelUrl || DEFAULT_BODY_MODEL_URL

  const bodyGltf = useGLTF(BODY_MODEL_URL)
  const shirtGltf = useGLTF(SHIRT_MODEL_URL)

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
    if (!bodyGltf || !shirtGltf) return

    try {
      console.log("[v0] Dual model system initialized")
      console.log("[v0] Body model URL:", BODY_MODEL_URL)
      console.log("[v0] Shirt model URL:", SHIRT_MODEL_URL)

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

      const shirtValidation = validateModel(shirtGltf.scene)
      if (!shirtValidation.valid) {
        console.error("[v0] Shirt model validation failed:", shirtValidation.error)
        setLoadError(shirtValidation.error!)
        onError?.(shirtValidation.error!)
        return
      }

      validateAndLogMaterials(bodyGltf.scene)
      validateAndLogMaterials(shirtGltf.scene)

      const transform = calculateModelTransform(bodyGltf.scene, BODY_MODEL_URL)

      if (bodyRef.current) {
        bodyRef.current.scale.setScalar(transform.scale)
        bodyRef.current.position.copy(transform.position)
        console.log("[v0] Body model positioned")
      }

      if (shirtRef.current) {
        shirtRef.current.scale.setScalar(transform.scale)
        shirtRef.current.position.copy(transform.position)
        console.log("[v0] Shirt model positioned (aligned with body)")
      }

      console.log("[v0] Models normalized to 1.8m height")
      console.log("[v0] Applied scale:", transform.scale)
      console.log("[v0] Applied position:", {
        x: transform.position.x,
        y: transform.position.y,
        z: transform.position.z,
      })

      onFacePositionCalculated(transform.facePosition)
      processedRef.current = true
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error processing models"
      console.error("[v0] ERROR processing models:", error)
      setLoadError(errorMsg)
      onError?.(errorMsg)
    }
  }, [bodyGltf, shirtGltf, onFacePositionCalculated, onError])

  useEffect(() => {
    if (!shirtGltf || !shirtColor) return

    try {
      const shirtColorChanged = shirtColor !== previousShirtColorRef.current
      previousShirtColorRef.current = shirtColor

      if (shirtColorChanged) {
        console.log("[v0] Applying shirt color:", shirtColor)

        // Traverse the shirt model and update all materials
        let materialFound = false
        shirtGltf.scene.traverse((child: any) => {
          if (child.isMesh && child.material) {
            // Update the material color directly
            if (Array.isArray(child.material)) {
              child.material.forEach((mat: any) => {
                if (mat.color) {
                  mat.color.set(shirtColor)
                  mat.needsUpdate = true
                  materialFound = true
                  console.log("[v0] Updated shirt material color:", mat.name || "unnamed")
                }
              })
            } else if (child.material.color) {
              child.material.color.set(shirtColor)
              child.material.needsUpdate = true
              materialFound = true
              console.log("[v0] Updated shirt material color:", child.material.name || "unnamed")
            }
          }
        })

        if (!materialFound) {
          console.warn("[v0] WARNING: No materials found in shirt model to update color")
        }
      }
    } catch (error) {
      console.error("[v0] ERROR updating shirt color:", error)
    }
  }, [shirtColor, shirtGltf])

  useEffect(() => {
    if (!shirtRef.current) return

    console.log("[v0] Toggling shirt visibility:", showShirt ? "VISIBLE" : "HIDDEN")
    shirtRef.current.visible = showShirt
  }, [showShirt])

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

  if (!bodyGltf || !bodyGltf.scene || !shirtGltf || !shirtGltf.scene) {
    return null
  }

  return (
    <>
      <group ref={bodyRef}>
        <primitive object={bodyGltf.scene} />
      </group>

      <group ref={shirtRef}>
        <primitive object={shirtGltf.scene} />
      </group>
    </>
  )
}
