"use client"

import { useEffect, useRef, useState } from "react"
import { useGLTF, useAnimations } from "@react-three/drei"
import * as THREE from "three"
import type { ModelProps } from "@/types"
import {
  calculateModelTransform,
  validateModel,
  applyMaterialColor,
  validateAndLogMaterials,
  restoreOriginalMaterials,
  applyShirtColor,
} from "@/lib/model-utils"

export function Model({
  modelUrl,
  onFacePositionCalculated,
  color,
  onError,
  onAnimationsDetected,
  currentAnimation,
  animationSpeed = 1,
  isPlaying = true,
  shirtColor,
  showShirt = true,
  fileType,
}: ModelProps) {
  const [loadError, setLoadError] = useState<string | null>(null)
  const [materialsValidated, setMaterialsValidated] = useState(false)
  const modelRef = useRef<THREE.Group>(null)
  const processedRef = useRef<boolean>(false)
  const previousColorRef = useRef<string>(color)
  const previousShirtColorRef = useRef<string>(shirtColor || "#4a90e2")

  const cleanUrl = modelUrl.split("?")[0].split("&")[0]
  const fileExtension = fileType || cleanUrl.split(".").pop()?.toLowerCase()
  const isSupported = fileExtension === "glb" || fileExtension === "gltf"
  const gltf = useGLTF(cleanUrl)
  const { actions, names } = useAnimations(gltf?.animations || [], modelRef)

  useEffect(() => {
    if (!isSupported) {
      const errorMsg = `Unsupported file format: .${fileExtension}. Please convert your model to .glb or .gltf format. You can use free online converters or Blender to convert FBX/OBJ files to GLTF/GLB.`
      console.error("[v0] ERROR:", errorMsg)
      setLoadError(errorMsg)
      onError?.(errorMsg)
    }
  }, [isSupported, fileExtension, onError])

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
    if (!isSupported || !gltf) return

    try {
      console.log("[v0] Model component mounted with URL:", cleanUrl)
      processedRef.current = false
      setMaterialsValidated(false)

      if (!gltf || !gltf.scene) {
        const errorMsg = "GLTF scene is null or undefined"
        console.error("[v0] ERROR:", errorMsg)
        setLoadError(errorMsg)
        onError?.(errorMsg)
        return
      }

      console.log("[v0] GLTF scene loaded successfully!")

      if (processedRef.current) {
        console.log("[v0] Model already processed, skipping recalculation")
        return
      }

      const validation = validateModel(gltf.scene)
      if (!validation.valid) {
        console.error("[v0] Model validation failed:", validation.error)
        setLoadError(validation.error!)
        onError?.(validation.error!)
        return
      }

      const materialInfo = validateAndLogMaterials(gltf.scene)
      setMaterialsValidated(true)

      if (!materialInfo.hasMaterials) {
        console.warn("[v0] WARNING: Model has no materials - will use default materials")
      }

      const transform = calculateModelTransform(gltf.scene, cleanUrl)

      if (modelRef.current) {
        modelRef.current.scale.setScalar(transform.scale)
        modelRef.current.position.copy(transform.position)

        console.log("[v0] Model normalized to 1.8m height")
        console.log("[v0] Applied scale:", transform.scale)
        console.log("[v0] Applied position:", {
          x: transform.position.x,
          y: transform.position.y,
          z: transform.position.z,
        })
        console.log("[v0] Model positioned at origin (0,0,0) with feet at ground level")
        console.log("[v0] Face position:", {
          x: transform.facePosition.x,
          y: transform.facePosition.y,
          z: transform.facePosition.z,
        })

        onFacePositionCalculated(transform.facePosition)
        processedRef.current = true
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error processing model"
      console.error("[v0] ERROR processing model:", error)
      console.error("[v0] Model URL:", cleanUrl)
      setLoadError(errorMsg)
      onError?.(errorMsg)
    }
  }, [gltf, onFacePositionCalculated, cleanUrl, onError, isSupported])

  useEffect(() => {
    if (!isSupported || !gltf) return

    try {
      if (gltf && gltf.scene && materialsValidated) {
        const colorChanged = color !== previousColorRef.current
        previousColorRef.current = color

        if (color === "#cccccc" && !colorChanged) {
          console.log("[v0] Preserving original materials from model file")
          restoreOriginalMaterials(gltf.scene)
        } else if (colorChanged) {
          console.log("[v0] Applying custom color:", color)
          applyMaterialColor(gltf.scene, color, true)
        }
      }
    } catch (error) {
      console.error("[v0] ERROR updating material:", error)
    }
  }, [color, gltf, materialsValidated, isSupported])

  useEffect(() => {
    if (!isSupported || !gltf) return

    try {
      if (gltf && gltf.scene && materialsValidated && shirtColor) {
        const shirtColorChanged = shirtColor !== previousShirtColorRef.current
        previousShirtColorRef.current = shirtColor

        if (shirtColorChanged) {
          console.log("[v0] Applying shirt color:", shirtColor)
          applyShirtColor(gltf.scene, shirtColor)
        }
      }
    } catch (error) {
      console.error("[v0] ERROR updating shirt color:", error)
    }
  }, [shirtColor, gltf, materialsValidated, isSupported])

  useEffect(() => {
    console.log("[v0] 🔄 Shirt visibility useEffect triggered")
    console.log("[v0] 📊 State:", {
      showShirt,
      isSupported,
      hasGltf: !!gltf,
      hasScene: !!gltf?.scene,
      hasModelRef: !!modelRef.current,
    })

    if (!isSupported) {
      console.log("[v0] ⚠️ Skipping shirt toggle - unsupported file format")
      return
    }

    if (!gltf || !gltf.scene) {
      console.log("[v0] ⚠️ Skipping shirt toggle - GLTF not loaded yet")
      return
    }

    if (!modelRef.current) {
      console.log("[v0] ⚠️ Skipping shirt toggle - modelRef not ready yet")
      return
    }

    // Use requestAnimationFrame to ensure the scene is fully rendered
    const timeoutId = setTimeout(() => {
      console.log("[v0] ✅ Proceeding with shirt visibility toggle")
      console.log("[v0] 👕 showShirt =", showShirt)

      let shirtFound = false
      let meshesChecked = 0

      try {
        // Traverse the actual rendered scene using modelRef
        modelRef.current?.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            meshesChecked++
            const meshName = child.name.toLowerCase()
            const materialName =
              child.material && "name" in child.material ? (child.material.name || "").toLowerCase() : ""

            console.log(
              `[v0] 🔍 Mesh #${meshesChecked}: "${child.name}" | Material: "${child.material && "name" in child.material ? child.material.name : "none"}"`,
            )

            // Check if this is the shirt mesh
            const isShirtMesh =
              meshName.includes("shirt") || materialName.includes("shirt") || materialName.includes("fabric")

            if (isShirtMesh) {
              child.visible = showShirt
              shirtFound = true
              console.log(
                `[v0] ✨ ${showShirt ? "SHOWING" : "HIDING"} shirt mesh: "${child.name}" (material: "${child.material && "name" in child.material ? child.material.name : "unknown"}")`,
              )
            }
          }
        })

        console.log(`[v0] 📈 Total meshes checked: ${meshesChecked}`)

        if (!shirtFound) {
          console.log("[v0] ⚠️ WARNING: No shirt mesh found in model")
          console.log("[v0] 💡 Tip: Make sure your model has a mesh or material named 'shirt' or 'fabric'")
        } else {
          console.log(`[v0] ✅ Shirt visibility successfully set to: ${showShirt}`)
        }
      } catch (error) {
        console.error("[v0] ❌ ERROR toggling shirt visibility:", error)
      }
    }, 100) // Small delay to ensure scene is fully rendered

    return () => clearTimeout(timeoutId)
  }, [showShirt, gltf, isSupported])

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

  if (!isSupported || !gltf || !gltf.scene) {
    return null
  }

  return (
    <group ref={modelRef}>
      <primitive object={gltf.scene} />
    </group>
  )
}
