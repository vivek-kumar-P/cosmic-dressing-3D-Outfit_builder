"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import { PerspectiveCamera, OrbitControls, Environment } from "@react-three/drei"
import * as THREE from "three"
import type { SceneProps } from "@/types"
import { Model } from "./model"
import { DualModel } from "./dual-model"
import { MultiModel } from "./multi-model"

export function Scene({
  modelUrl,
  mainLight,
  modelColor,
  onModelError,
  shirtColor,
  showShirt,
  onAnimationsDetected,
  currentAnimation,
  animationSpeed,
  isPlaying,
  bodyModelUrl,
  shoesUrl,
  showShoes,
  shoesColor,
  pantsUrl,
  showPants,
  pantsColor,
  shirtUrl,
  shirtScale,
  shoesScale,
  pantsScale,
}: SceneProps & {
  bodyModelUrl?: string
  shoesUrl?: string
  showShoes?: boolean
  shoesColor?: string
  pantsUrl?: string
  showPants?: boolean
  pantsColor?: string
  shirtUrl?: string
  shirtScale?: number
  shoesScale?: number
  pantsScale?: number
}) {
  const [facePosition, setFacePosition] = useState<THREE.Vector3>(new THREE.Vector3(0, 1.53, 0))
  const controlsRef = useRef<any>(null)

  useEffect(() => {
    if (controlsRef.current && facePosition) {
      controlsRef.current.target.copy(facePosition)
      controlsRef.current.update()
    }
  }, [facePosition])

  const getFileType = (url: string): string => {
    if (!url || url.trim() === "") {
      return "glb" // Default to glb if no URL provided
    }
    const urlParts = url.split("?")[0].split(".")
    const extension = urlParts[urlParts.length - 1]?.toLowerCase()

    if (extension === "glb" || extension === "gltf") {
      return extension
    }

    return "glb"
  }

  const fileType = modelUrl ? getFileType(modelUrl) : "glb"

  const isDefaultModel = modelUrl ? modelUrl.includes("just_body") || modelUrl.includes("girl_body") : false

  const hasClothingItems = shirtUrl || shoesUrl || pantsUrl

  console.log("[v0] Scene render decision:", {
    hasModelUrl: !!modelUrl,
    modelUrl,
    isDefaultModel,
    hasClothingItems,
    willRenderMultiModel: isDefaultModel && hasClothingItems,
    willRenderDualModel: isDefaultModel && !hasClothingItems,
    willRenderRegularModel: !isDefaultModel,
  })

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1.5, 3]} fov={75} near={0.1} far={1000} />

      <hemisphereLight intensity={0.5} color="#ffffff" groundColor="#444444" />

      <directionalLight
        position={[mainLight.x, mainLight.y, mainLight.z]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <directionalLight position={[-2, 1, 2]} intensity={0.4} />
      <directionalLight position={[2, 1, -2]} intensity={0.4} />

      <directionalLight position={[0, 2, -3]} intensity={0.3} />

      <Environment preset="studio" />

      <gridHelper args={[20, 20, 0x444444, 0x222222]} />

      {modelUrl && modelUrl.trim() !== "" && (
        <Suspense fallback={null}>
          {isDefaultModel && hasClothingItems ? (
            <MultiModel
              bodyModelUrl={bodyModelUrl || modelUrl}
              shirt={shirtUrl ? { url: shirtUrl, visible: showShirt, color: shirtColor, scale: shirtScale } : undefined}
              shoes={
                shoesUrl
                  ? { url: shoesUrl, visible: showShoes ?? false, color: shoesColor, scale: shoesScale }
                  : undefined
              }
              pants={
                pantsUrl
                  ? { url: pantsUrl, visible: showPants ?? false, color: pantsColor, scale: pantsScale }
                  : undefined
              }
              onFacePositionCalculated={setFacePosition}
              onError={onModelError}
              onAnimationsDetected={onAnimationsDetected}
              currentAnimation={currentAnimation}
              animationSpeed={animationSpeed}
              isPlaying={isPlaying}
            />
          ) : isDefaultModel ? (
            <DualModel
              onFacePositionCalculated={setFacePosition}
              onError={onModelError}
              onAnimationsDetected={onAnimationsDetected}
              currentAnimation={currentAnimation}
              animationSpeed={animationSpeed}
              isPlaying={isPlaying}
              shirtColor={shirtColor}
              showShirt={showShirt}
              bodyModelUrl={bodyModelUrl}
            />
          ) : (
            <Model
              modelUrl={modelUrl}
              onFacePositionCalculated={setFacePosition}
              color={modelColor}
              onError={onModelError}
              onAnimationsDetected={onAnimationsDetected}
              currentAnimation={currentAnimation}
              animationSpeed={animationSpeed}
              isPlaying={isPlaying}
              shirtColor={shirtColor}
              showShirt={showShirt}
              fileType={fileType}
            />
          )}
        </Suspense>
      )}

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        zoomSpeed={0.5}
        minDistance={0.3}
        maxDistance={20}
        target={facePosition}
        enableRotate={true}
        enablePan={true}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
      />
    </>
  )
}
