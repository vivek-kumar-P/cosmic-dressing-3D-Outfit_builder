"use client"

import { useRef, useEffect, useState } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js"
import { calculateModelTransform, validateModel, validateAndLogMaterials } from "@/lib/model-utils"

interface FBXModelProps {
  url: string
  color?: string
  onFacePositionCalculated?: (position: THREE.Vector3) => void
  onAnimationsDetected?: (animationNames: string[]) => void
  currentAnimation?: string
  isPlaying?: boolean
  animationSpeed?: number
  onError?: (error: string) => void
}

export function FBXModel({
  url,
  color = "#cccccc",
  onFacePositionCalculated,
  onAnimationsDetected,
  currentAnimation,
  isPlaying = false,
  animationSpeed = 1,
  onError,
}: FBXModelProps) {
  const modelRef = useRef<THREE.Group>(null!)
  const mixerRef = useRef<THREE.AnimationMixer | null>(null)
  const [fbxScene, setFbxScene] = useState<THREE.Group | null>(null)
  const [animations, setAnimations] = useState<THREE.AnimationClip[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load FBX model
  useEffect(() => {
    console.log("[v0] Loading FBX model from:", url)
    setIsLoading(true)

    const loader = new FBXLoader()

    loader.load(
      url,
      (fbx) => {
        console.log("[v0] FBX model loaded successfully!")
        console.log("[v0] FBX animations:", fbx.animations.length)

        // Validate model
        const validation = validateModel(fbx)
        if (!validation.valid) {
          const errorMsg = validation.error || "Invalid FBX model"
          console.error("[v0] FBX validation failed:", errorMsg)
          onError?.(errorMsg)
          setIsLoading(false)
          return
        }

        // Log materials and textures
        validateAndLogMaterials(fbx)

        // Calculate transform
        const transform = calculateModelTransform(fbx, url)
        fbx.scale.setScalar(transform.scale)
        fbx.position.copy(transform.position)

        console.log("[v0] FBX model normalized to 1.8m height")
        console.log("[v0] Applied scale:", transform.scale)
        console.log("[v0] Applied position:", {
          x: transform.position.x,
          y: transform.position.y,
          z: transform.position.z,
        })

        // Set up animations
        if (fbx.animations && fbx.animations.length > 0) {
          console.log(
            "[v0] Detected animations:",
            fbx.animations.map((a) => a.name),
          )
          setAnimations(fbx.animations)
          onAnimationsDetected?.(fbx.animations.map((a) => a.name))

          // Create animation mixer
          const mixer = new THREE.AnimationMixer(fbx)
          mixerRef.current = mixer
        }

        setFbxScene(fbx)
        onFacePositionCalculated?.(transform.facePosition)
        setIsLoading(false)
      },
      (progress) => {
        const percentComplete = (progress.loaded / progress.total) * 100
        console.log("[v0] FBX loading progress:", percentComplete.toFixed(2) + "%")
      },
      (error) => {
        console.error("[v0] Error loading FBX model:", error)
        const errorMsg = `Failed to load FBX model: ${error instanceof Error ? error.message : "Unknown error"}`
        onError?.(errorMsg)
        setIsLoading(false)
      },
    )

    return () => {
      // Cleanup
      if (mixerRef.current) {
        mixerRef.current.stopAllAction()
        mixerRef.current = null
      }
    }
  }, [url, onFacePositionCalculated, onAnimationsDetected, onError])

  // Handle animation playback
  useEffect(() => {
    if (!mixerRef.current || !currentAnimation || animations.length === 0) return

    console.log("[v0] Animation control:", { currentAnimation, isPlaying, animationSpeed })

    const clip = animations.find((a) => a.name === currentAnimation)
    if (!clip) {
      console.warn("[v0] Animation not found:", currentAnimation)
      return
    }

    const action = mixerRef.current.clipAction(clip)
    action.timeScale = animationSpeed

    if (isPlaying) {
      console.log("[v0] Playing animation:", currentAnimation, "at speed:", animationSpeed)
      action.play()
    } else {
      console.log("[v0] Pausing animation:", currentAnimation)
      action.paused = true
    }

    return () => {
      action.stop()
    }
  }, [currentAnimation, isPlaying, animationSpeed, animations])

  // Update animation mixer
  useFrame((state, delta) => {
    if (mixerRef.current && isPlaying) {
      mixerRef.current.update(delta)
    }
  })

  // Apply color to materials
  useEffect(() => {
    if (!fbxScene || !color) return

    console.log("[v0] Applying color to FBX model:", color)

    fbxScene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat: any) => {
            if (mat.color) {
              mat.color.set(color)
              mat.needsUpdate = true
            }
          })
        } else if (child.material.color) {
          child.material.color.set(color)
          child.material.needsUpdate = true
        }
      }
    })
  }, [fbxScene, color])

  if (isLoading) {
    return (
      <group ref={modelRef}>
        <mesh>
          <boxGeometry args={[0.5, 1.8, 0.5]} />
          <meshStandardMaterial color="#cccccc" wireframe />
        </mesh>
      </group>
    )
  }

  if (!fbxScene) {
    return null
  }

  return (
    <group ref={modelRef}>
      <primitive object={fbxScene} />
    </group>
  )
}
