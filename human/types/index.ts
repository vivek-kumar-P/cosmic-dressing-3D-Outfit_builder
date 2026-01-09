import type React from "react"
import type * as THREE from "three"

export interface LightPosition {
  x: number
  y: number
  z: number
}

export interface UploadedModel {
  id: string
  name: string
  url: string
  uploadedAt: Date
  isPermanent?: boolean
  dbId?: string
  fileSize?: number
  gltfContent?: string
  originalFile?: File
  vercelBlobUrl?: string
  fileType?: string
}

export interface Model {
  id: string
  name: string
  file_url: string
  file_size: number
  created_at: string
  is_permanent?: boolean
  isPermanent?: boolean
  category?: string
}

export interface ModelProps {
  modelUrl: string
  onFacePositionCalculated: (pos: THREE.Vector3) => void
  color: string
  onError?: (error: string) => void
  onAnimationsDetected?: (animations: string[]) => void
  currentAnimation?: string
  animationSpeed?: number
  isPlaying?: boolean
  shirtColor?: string
  showShirt?: boolean
  fileType?: string
}

export interface SceneProps {
  modelUrl: string
  mainLight: LightPosition
  modelColor: string
  onModelError?: (error: string) => void
  shirtColor: string
  showShirt: boolean
  onAnimationsDetected?: (animations: string[]) => void
  currentAnimation?: string
  animationSpeed?: number
  isPlaying?: boolean
}

export interface LightControlProps {
  label: string
  position: LightPosition
  onChange: (pos: LightPosition) => void
}

export interface SidebarProps {
  uploadedModels: UploadedModel[]
  activeModelUrl: string
  onModelSelect: (url: string) => void
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  fileInputRef: React.RefObject<HTMLInputElement>
  showSidebar: boolean
  onClose: () => void
  onSaveModel?: (model: UploadedModel) => Promise<void>
  onDeleteModel?: (model: UploadedModel) => Promise<void>
  onRenameModel?: (model: UploadedModel, newName: string) => Promise<void>
  onResetDatabase?: () => Promise<void>
}

export interface ControlsPanelProps {
  showControls: boolean
  onClose: () => void
  mainLight: LightPosition
  onMainLightChange: (pos: LightPosition) => void
  modelColor: string
  onColorChange: (color: string) => void
  shirtColor: string
  onShirtColorChange: (color: string) => void
  showShirt: boolean
  onShowShirtChange: (show: boolean) => void
  availableAnimations: string[]
  currentAnimation: string
  onAnimationChange: (animation: string) => void
  animationSpeed: number
  onAnimationSpeedChange: (speed: number) => void
  isPlaying: boolean
  onPlayPauseChange: (playing: boolean) => void
}
