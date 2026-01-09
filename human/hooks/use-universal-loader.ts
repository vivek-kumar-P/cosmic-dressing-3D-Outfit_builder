"use client"

import { useEffect, useState } from "react"
import { useLoader } from "@react-three/fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import type * as THREE from "three"

export type SupportedFormat = "glb" | "gltf" | "fbx" | "obj"

export interface LoadedModel {
  scene: THREE.Group
  animations: THREE.AnimationClip[]
}

/**
 * Universal model loader hook that supports multiple 3D file formats
 * Supports: .glb, .gltf, .fbx, .obj
 */
export function useUniversalLoader(url: string): {
  model: LoadedModel | null
  loading: boolean
  error: string | null
  format: SupportedFormat | null
} {
  const [model, setModel] = useState<LoadedModel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [format, setFormat] = useState<SupportedFormat | null>(null)

  useEffect(() => {
    if (!url) {
      setLoading(false)
      return
    }

    const detectedFormat = detectFormat(url)
    setFormat(detectedFormat)
    console.log("[v0] Detected format:", detectedFormat, "for URL:", url)
  }, [url])

  return { model, loading, error, format }
}

function detectFormat(url: string): SupportedFormat {
  const cleanUrl = url.split("?")[0].toLowerCase()

  if (cleanUrl.endsWith(".glb")) return "glb"
  if (cleanUrl.endsWith(".gltf")) return "gltf"
  if (cleanUrl.endsWith(".fbx")) return "fbx"
  if (cleanUrl.endsWith(".obj")) return "obj"

  // Default to glb if no extension found
  return "glb"
}

export function GLTFModel({ url }: { url: string }) {
  const gltf = useLoader(GLTFLoader, url)
  return { scene: gltf.scene, animations: gltf.animations || [] }
}

export function FBXModel({ url }: { url: string }) {
  const fbx = useLoader(FBXLoader, url)
  return { scene: fbx, animations: fbx.animations || [] }
}

export function OBJModel({ url }: { url: string }) {
  const obj = useLoader(OBJLoader, url)
  return { scene: obj, animations: [] }
}
