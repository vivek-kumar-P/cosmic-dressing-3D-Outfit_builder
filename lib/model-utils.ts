import * as THREE from "three"

const processedModelsCache = new Map<
  string,
  {
    scale: number
    position: THREE.Vector3
    facePosition: THREE.Vector3
    size: THREE.Vector3
  }
>()

export function clearModelCache(modelUrl?: string) {
  if (modelUrl) {
    processedModelsCache.delete(modelUrl)
    console.log("[v0] Cleared cache for:", modelUrl)
  } else {
    processedModelsCache.clear()
    console.log("[v0] Cleared all model cache")
  }
}

/**
 * Calculate model transformation to normalize size and position
 *
 * Standard Size: All models are normalized to 1.8 meters height (standard human height)
 * This matches the "just_body" model's target size and ensures consistency
 * across all uploaded .gltf/.glb files regardless of their original dimensions.
 *
 * Position: Models are positioned at origin (0,0,0) with feet at ground level (y=0)
 *
 * Material Preview: Original materials and textures are preserved by default
 */
export function calculateModelTransform(scene: THREE.Object3D, modelUrl?: string) {
  try {
    if (modelUrl && processedModelsCache.has(modelUrl)) {
      console.log("[v0] Using cached transform for:", modelUrl)
      return processedModelsCache.get(modelUrl)!
    }

    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    console.log("[v0] Model size:", { x: size.x, y: size.y, z: size.z })
    console.log("[v0] Model center:", { x: center.x, y: center.y, z: center.z })

    if (size.x === 0 || size.y === 0 || size.z === 0) {
      const error = "Model has invalid dimensions (zero size)"
      console.error("[v0] ERROR:", error)
      throw new Error(error)
    }

    // All uploaded models are normalized to this standard size while preserving proportions
    const targetHeight = 1.8

    if (size.y > targetHeight * 0.9 && size.y < targetHeight * 1.1) {
      console.log("[v0] Model already at target size (~1.8m), skipping transformation")
      const result = {
        scale: 1,
        position: new THREE.Vector3(0, 0, 0),
        facePosition: new THREE.Vector3(0, targetHeight * 0.85, 0),
        size,
      }
      if (modelUrl) {
        processedModelsCache.set(modelUrl, result)
      }
      return result
    }

    const scale = targetHeight / size.y
    console.log("[v0] Model normalized to 1.8m height")
    console.log("[v0] Applied scale:", scale)

    // Only adjust Y-axis to place feet at ground, keep X and Z at 0 for stable positioning
    const scaledMin = box.min.clone().multiplyScalar(scale)
    const position = new THREE.Vector3(0, -scaledMin.y, 0)

    const scaledHeight = size.y * scale
    const faceHeightRatio = 0.85
    const faceY = scaledHeight * faceHeightRatio
    const facePosition = new THREE.Vector3(0, faceY, 0)

    console.log("[v0] Applied position:", { x: position.x, y: position.y, z: position.z })
    console.log("[v0] Model positioned at origin (0,0,0) with feet at ground level")
    console.log("[v0] Face position:", { x: facePosition.x, y: facePosition.y, z: facePosition.z })

    const result = {
      scale,
      position,
      facePosition,
      size,
    }

    if (modelUrl) {
      processedModelsCache.set(modelUrl, result)
    }

    return result
  } catch (error) {
    console.error("[v0] ERROR in calculateModelTransform:", error)
    console.error("[v0] Failed to calculate transform for model:", modelUrl)

    return {
      scale: 1,
      position: new THREE.Vector3(0, 0, 0),
      facePosition: new THREE.Vector3(0, 1.53, 0), // 85% of 1.8m
      size: new THREE.Vector3(1, 1.8, 1),
    }
  }
}

export function validateModel(scene: THREE.Object3D): { valid: boolean; error?: string; meshCount: number } {
  try {
    let meshCount = 0
    scene.traverse((child: any) => {
      if (child.isMesh) {
        meshCount++
        console.log("[v0] Mesh found:", child.name || "unnamed")
      }
    })

    console.log("[v0] Total meshes found:", meshCount)

    if (meshCount === 0) {
      const error = "Model contains no meshes"
      console.error("[v0] ERROR:", error)
      return { valid: false, error, meshCount: 0 }
    }

    return { valid: true, meshCount }
  } catch (error) {
    console.error("[v0] ERROR in validateModel:", error)
    return { valid: false, error: String(error), meshCount: 0 }
  }
}

export function validateAndLogMaterials(scene: THREE.Object3D): {
  hasMaterials: boolean
  hasTextures: boolean
  materialCount: number
  textureCount: number
} {
  let materialCount = 0
  let textureCount = 0
  const materials = new Set<THREE.Material>()

  scene.traverse((child: any) => {
    if (child.isMesh && child.material) {
      const material = child.material

      if (Array.isArray(material)) {
        material.forEach((mat) => materials.add(mat))
      } else {
        materials.add(material)
      }
    }
  })

  materials.forEach((material: any) => {
    materialCount++
    console.log("[v0] Material found:", {
      name: material.name || "unnamed",
      type: material.type,
      color: material.color ? `#${material.color.getHexString()}` : "none",
      hasMap: !!material.map,
      hasNormalMap: !!material.normalMap,
      hasRoughnessMap: !!material.roughnessMap,
      hasMetalnessMap: !!material.metalnessMap,
      roughness: material.roughness,
      metalness: material.metalness,
    })

    // Count textures
    if (material.map) textureCount++
    if (material.normalMap) textureCount++
    if (material.roughnessMap) textureCount++
    if (material.metalnessMap) textureCount++
    if (material.emissiveMap) textureCount++
    if (material.aoMap) textureCount++
  })

  const result = {
    hasMaterials: materialCount > 0,
    hasTextures: textureCount > 0,
    materialCount,
    textureCount,
  }

  console.log("[v0] Material summary:", result)

  if (materialCount === 0) {
    console.warn("[v0] WARNING: No materials found in model!")
  }

  if (textureCount === 0) {
    console.log("[v0] INFO: No textures found in model (using solid colors)")
  }

  return result
}

export function applyMaterialColor(scene: THREE.Object3D, color: string, forceApply = false) {
  // If color is the default gray and not forced, preserve original materials
  if (!forceApply && color === "#cccccc") {
    console.log("[v0] Preserving original materials (default color)")
    return
  }

  console.log("[v0] Applying custom color to materials:", color)

  scene.traverse((child: any) => {
    if (child.isMesh) {
      // Store original material if not already stored
      if (!child.userData.originalMaterial) {
        child.userData.originalMaterial = child.material
      }

      // Apply new color material
      child.material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness: 0.8,
        metalness: 0.0,
      })
    }
  })
}

export function restoreOriginalMaterials(scene: THREE.Object3D) {
  console.log("[v0] Restoring original materials")

  scene.traverse((child: any) => {
    if (child.isMesh && child.userData.originalMaterial) {
      child.material = child.userData.originalMaterial
    }
  })
}

/**
 * Apply color only to the shirt material, preserving all other materials
 * Targets materials named "Fabric" or meshes named "Shirt"
 */
export function applyShirtColor(scene: THREE.Object3D, shirtColor: string) {
  console.log("[v0] Applying shirt color:", shirtColor)

  let shirtFound = false

  scene.traverse((child: any) => {
    if (child.isMesh) {
      // Check if this is the shirt mesh by name or material name
      const isShirtMesh = child.name.toLowerCase().includes("shirt")
      const hasShirtMaterial =
        child.material?.name?.toLowerCase().includes("fabric") || child.material?.name?.toLowerCase().includes("shirt")

      if (isShirtMesh || hasShirtMaterial) {
        // This preserves depth, alpha, render order, and all other material properties
        if (child.material && child.material.color) {
          child.material.color.set(shirtColor)
          child.material.needsUpdate = true
          shirtFound = true
          console.log("[v0] Updated shirt color for mesh:", child.name || "unnamed")
        }
      }
    }
  })

  if (!shirtFound) {
    console.warn("[v0] WARNING: No shirt mesh or fabric material found in model")
  }
}

/**
 * Restore original shirt material while keeping other materials unchanged
 */
export function restoreOriginalShirtMaterial(scene: THREE.Object3D) {
  console.log("[v0] Restoring original shirt material")

  scene.traverse((child: any) => {
    if (child.isMesh && child.userData.originalShirtMaterial) {
      child.material = child.userData.originalShirtMaterial
    }
  })
}
