"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import type { UploadedModel } from "@/types"
import { useToast } from "@/hooks/use-toast"
import {
  saveModelToDatabase,
  getModelsFromDatabase,
  deleteModelFromDatabase,
  renameModelInDatabase,
  deleteAllModelsFromDatabase,
  initializeDefaultModel,
} from "@/lib/actions/model-actions"

interface FileMapping {
  gltfFile: File
  binFile?: File
  textureFiles: File[]
}

export function useModelUpload() {
  const [uploadedModels, setUploadedModels] = useState<UploadedModel[]>([])
  const [activeModelUrl, setActiveModelUrl] = useState<string>("")
  const [fileMappings, setFileMappings] = useState<Map<string, FileMapping>>(new Map())
  const [isLoadingFromDb, setIsLoadingFromDb] = useState(false)
  const [needsDatabaseSetup, setNeedsDatabaseSetup] = useState(false)
  const [databaseChecked, setDatabaseChecked] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loadFromLocalStorage = () => {
      try {
        const stored = localStorage.getItem("uploaded_models")
        if (stored) {
          const models: UploadedModel[] = JSON.parse(stored)
          const validModels = models.filter((m) => {
            // Skip models with blob URLs as they expire on page reload
            if (m.url.startsWith("blob:")) {
              console.log("[v0] Skipping expired blob URL model:", m.name)
              return false
            }
            return true
          })

          const modelsWithDates = validModels.map((m) => ({
            ...m,
            uploadedAt: new Date(m.uploadedAt),
          }))

          if (modelsWithDates.length > 0) {
            console.log("[v0] Loaded", modelsWithDates.length, "models from localStorage")
            setUploadedModels(modelsWithDates)

            const justBody = modelsWithDates.find(
              (m) => m.name.toLowerCase().includes("just_body") || m.name.toLowerCase().includes("just body"),
            )
            if (justBody && !activeModelUrl) {
              console.log("[v0] Setting just_body as default model")
              setActiveModelUrl(justBody.url)
            } else if (modelsWithDates.length > 0 && !activeModelUrl) {
              // If just_body not found, use the first model
              setActiveModelUrl(modelsWithDates[0].url)
            }
          }

          if (validModels.length !== models.length) {
            localStorage.setItem("uploaded_models", JSON.stringify(validModels))
            console.log("[v0] Cleaned up", models.length - validModels.length, "expired models from localStorage")
          }
        }
      } catch (error) {
        console.error("[v0] Error loading from localStorage:", error)
      }
    }

    loadFromLocalStorage()

    const dbConfirmed = localStorage.getItem("database_confirmed") === "true"
    if (dbConfirmed && !databaseChecked) {
      loadModelsFromDatabase()
    } else {
      setDatabaseChecked(true)
    }
  }, [])

  useEffect(() => {
    try {
      const modelsToSave = uploadedModels.filter((m) => !m.isPermanent)
      if (modelsToSave.length > 0) {
        localStorage.setItem("uploaded_models", JSON.stringify(modelsToSave))
        console.log("[v0] Saved", modelsToSave.length, "models to localStorage")
      }
    } catch (error) {
      console.error("[v0] Error saving to localStorage:", error)
    }
  }, [uploadedModels])

  const loadModelsFromDatabase = async () => {
    try {
      setIsLoadingFromDb(true)
      console.log("[v0] Loading models from database...")
      const result = await getModelsFromDatabase()

      if (result.needsSetup) {
        console.log("[v0] Database needs setup")
        setNeedsDatabaseSetup(true)
        setDatabaseChecked(true)
        localStorage.setItem("database_confirmed", "false")
        setIsLoadingFromDb(false)
        return
      }

      if (result.success && result.data) {
        localStorage.setItem("database_confirmed", "true")
        setNeedsDatabaseSetup(false)

        const dbModels: UploadedModel[] = result.data.map((model: any) => ({
          id: model.id,
          name: model.name,
          url: model.file_url,
          uploadedAt: new Date(model.created_at),
          isPermanent: true,
          dbId: model.id,
          fileSize: model.file_size,
        }))

        console.log("[v0] Loaded", dbModels.length, "models from database")

        const justBody = dbModels.find(
          (m) => m.name.toLowerCase().includes("just_body") || m.name.toLowerCase().includes("just body"),
        )

        if (justBody) {
          // Put just_body first
          setUploadedModels([justBody, ...dbModels.filter((m) => m.id !== justBody.id)])
          if (!activeModelUrl) {
            console.log("[v0] Setting just_body from database as default model")
            setActiveModelUrl(justBody.url)
          }
        } else {
          setUploadedModels(dbModels)
          if (dbModels.length > 0 && !activeModelUrl) {
            setActiveModelUrl(dbModels[0].url)
          }
        }
      }
      setDatabaseChecked(true)
    } catch (error) {
      console.error("[v0] Error loading models from database:", error)
      localStorage.setItem("database_confirmed", "false")
      setNeedsDatabaseSetup(true)
      setDatabaseChecked(true)
    } finally {
      setIsLoadingFromDb(false)
    }
  }

  const saveModel = async (model: UploadedModel) => {
    try {
      console.log("[v0] Saving model to database:", model.name)

      if (!model.originalFile) {
        toast({
          title: "Cannot Save",
          description:
            "This model cannot be saved because the original file is no longer available. Please re-upload the file.",
          variant: "destructive",
        })
        return
      }

      const result = await saveModelToDatabase(model.name, model.originalFile)

      if (result.needsSetup) {
        toast({
          title: "Database Not Set Up",
          description: "Please set up the database first using the 'Check Database' button in the sidebar.",
          variant: "destructive",
        })
        setNeedsDatabaseSetup(true)
        return
      }

      if (result.success && result.data) {
        console.log("[v0] Model saved successfully:", result.data)

        setUploadedModels((prev) =>
          prev.map((m) =>
            m.id === model.id
              ? {
                  ...m,
                  isPermanent: true,
                  dbId: result.data.id,
                  vercelBlobUrl: result.data.file_url, // Store Vercel Blob URL for later use
                }
              : m,
          ),
        )

        toast({
          title: "Model Saved",
          description: `"${model.name}" has been saved permanently to the database.`,
        })
      } else {
        throw new Error(result.error || "Failed to save model")
      }
    } catch (error) {
      console.error("[v0] Error saving model:", error)
      toast({
        title: "Save Failed",
        description: `Failed to save "${model.name}": ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  const deleteModel = async (model: UploadedModel) => {
    try {
      console.log("[v0] Deleting model:", model.name)

      if (model.isPermanent && model.dbId) {
        const result = await deleteModelFromDatabase(model.dbId, model.url)

        if (result.needsSetup) {
          toast({
            title: "Database Not Set Up",
            description: "Cannot delete permanent models without database access.",
            variant: "destructive",
          })
          setNeedsDatabaseSetup(true)
          return
        }

        if (!result.success) {
          throw new Error(result.error || "Failed to delete model")
        }
      }

      setUploadedModels((prev) => prev.filter((m) => m.id !== model.id))

      if (activeModelUrl === model.url) {
        const remainingModels = uploadedModels.filter((m) => m.id !== model.id)
        if (remainingModels.length > 0) {
          setActiveModelUrl(remainingModels[0].url)
        } else {
          setActiveModelUrl("")
        }
      }

      if (!model.isPermanent && model.url.startsWith("blob:")) {
        URL.revokeObjectURL(model.url)
      }

      toast({
        title: "Model Deleted",
        description: `"${model.name}" has been deleted.`,
      })
    } catch (error) {
      console.error("[v0] Error deleting model:", error)
      toast({
        title: "Delete Failed",
        description: `Failed to delete "${model.name}": ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  const renameModel = async (model: UploadedModel, newName: string) => {
    try {
      if (newName.length === 0) {
        toast({
          title: "Invalid Name",
          description: "Model name cannot be empty.",
          variant: "destructive",
        })
        return
      }

      if (newName.length > 20) {
        toast({
          title: "Name Too Long",
          description: "Model name must be 20 characters or less.",
          variant: "destructive",
        })
        return
      }

      const duplicateExists = uploadedModels.some(
        (m) => m.id !== model.id && m.name.toLowerCase() === newName.toLowerCase(),
      )

      if (duplicateExists) {
        toast({
          title: "Duplicate Name",
          description: "A model with this name already exists. Please choose a different name.",
          variant: "destructive",
        })
        return
      }

      console.log("[v0] Renaming model:", model.name, "to", newName)

      // Update local state immediately for better UX
      setUploadedModels((prev) => prev.map((m) => (m.id === model.id ? { ...m, name: newName } : m)))

      // If model is permanent, update in database
      if (model.isPermanent && model.dbId) {
        const result = await renameModelInDatabase(model.dbId, newName)

        if (result.needsSetup) {
          toast({
            title: "Database Not Set Up",
            description: "Cannot rename permanent models without database access.",
            variant: "destructive",
          })
          setNeedsDatabaseSetup(true)
          // Revert the name change
          setUploadedModels((prev) => prev.map((m) => (m.id === model.id ? { ...m, name: model.name } : m)))
          return
        }

        if (!result.success) {
          throw new Error(result.error || "Failed to rename model")
        }
      }

      toast({
        title: "Model Renamed",
        description: `Model renamed to "${newName}".`,
      })
    } catch (error) {
      console.error("[v0] Error renaming model:", error)
      // Revert the name change on error
      setUploadedModels((prev) => prev.map((m) => (m.id === model.id ? { ...m, name: model.name } : m)))
      toast({
        title: "Rename Failed",
        description: `Failed to rename model: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    console.log("[v0] Uploading", files.length, "file(s)")

    const fileArray = Array.from(files)
    const modelFiles = fileArray.filter((f) => {
      const name = f.name.toLowerCase()
      return name.endsWith(".gltf") || name.endsWith(".glb") || name.endsWith(".fbx")
    })
    const binFiles = fileArray.filter((f) => f.name.toLowerCase().endsWith(".bin"))

    const unsupportedFiles = fileArray.filter((f) => {
      const name = f.name.toLowerCase()
      return name.endsWith(".obj") || name.endsWith(".dae") || name.endsWith(".3ds")
    })

    if (unsupportedFiles.length > 0) {
      const fileNames = unsupportedFiles.map((f) => f.name).join(", ")
      toast({
        title: "Unsupported File Format",
        description: `The following files are not supported: ${fileNames}. Please convert them to .glb, .gltf, or .fbx format using Blender or an online converter.`,
        variant: "destructive",
        duration: 10000,
      })
    }

    if (modelFiles.length === 0) {
      toast({
        title: "Invalid File Format",
        description: "Please upload .gltf, .glb, or .fbx files.",
        variant: "destructive",
      })
      console.error("[v0] No supported 3D model files found in upload")
      return
    }

    let successCount = 0
    let errorCount = 0

    for (const modelFile of modelFiles) {
      try {
        console.log("[v0] Processing file:", modelFile.name, "Size:", modelFile.size)

        const maxSize = 50 * 1024 * 1024
        if (modelFile.size > maxSize) {
          console.error("[v0] File too large:", modelFile.name, modelFile.size)
          toast({
            title: "File Too Large",
            description: `"${modelFile.name}" exceeds the 50MB size limit. Please upload a smaller file.`,
            variant: "destructive",
          })
          errorCount++
          continue
        }

        if (modelFile.size === 0) {
          console.error("[v0] Empty file:", modelFile.name)
          toast({
            title: "Empty File",
            description: `"${modelFile.name}" is empty. Please upload a valid file.`,
            variant: "destructive",
          })
          errorCount++
          continue
        }

        const fileName = modelFile.name.toLowerCase()
        const isGlb = fileName.endsWith(".glb")
        const isGltf = fileName.endsWith(".gltf")
        const isFbx = fileName.endsWith(".fbx")

        if (isFbx) {
          console.log("[v0] Processing FBX file...")
          const url = URL.createObjectURL(modelFile)
          console.log("[v0] Blob URL created:", url)

          const newModel: UploadedModel = {
            id: `${Date.now()}-${Math.random()}`,
            name: modelFile.name.replace(/\.fbx$/, ""),
            url,
            uploadedAt: new Date(),
            isPermanent: false,
            fileSize: modelFile.size,
            originalFile: modelFile,
            fileType: "fbx",
          }

          console.log("[v0] Adding FBX model to list:", newModel.name)
          setUploadedModels((prev) => {
            const updated = [...prev, newModel]
            console.log("[v0] Updated model list, total models:", updated.length)
            return updated
          })
          setActiveModelUrl(url)
          console.log("[v0] FBX model added successfully:", newModel.name)

          successCount++
          continue
        }

        if (isGltf) {
          console.log("[v0] Checking GLTF file for external dependencies...")
          const gltfText = await modelFile.text()

          let gltfJson: any
          try {
            gltfJson = JSON.parse(gltfText)
          } catch (e) {
            console.error("[v0] Failed to parse GLTF:", e)
            toast({
              title: "Invalid GLTF File",
              description: `"${modelFile.name}" is not a valid GLTF file.`,
              variant: "destructive",
            })
            errorCount++
            continue
          }

          if (gltfJson.buffers && gltfJson.buffers.length > 0) {
            const bufferUri = gltfJson.buffers[0].uri
            if (bufferUri && !bufferUri.startsWith("data:")) {
              console.log("[v0] GLTF references external binary:", bufferUri)

              const binFile = binFiles.find((f) => f.name === bufferUri)

              if (binFile) {
                console.log("[v0] Found matching binary file, embedding it...")

                const arrayBuffer = await binFile.arrayBuffer()
                const base64 = btoa(
                  new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ""),
                )

                gltfJson.buffers[0].uri = `data:application/octet-stream;base64,${base64}`

                const modifiedGltfText = JSON.stringify(gltfJson)
                const modifiedBlob = new Blob([modifiedGltfText], { type: "model/gltf+json" })
                const url = URL.createObjectURL(modifiedBlob)

                const newModel: UploadedModel = {
                  id: `${Date.now()}-${Math.random()}`,
                  name: modelFile.name.replace(/\.gltf$/, ""),
                  url,
                  uploadedAt: new Date(),
                  isPermanent: false,
                  fileSize: modelFile.size + binFile.size,
                  gltfContent: modifiedGltfText,
                  originalFile: modelFile,
                  fileType: "gltf", // Store the file extension
                }

                console.log("[v0] Adding GLTF model with embedded binary:", newModel.name)
                setUploadedModels((prev) => [...prev, newModel])
                setActiveModelUrl(url)
                successCount++
                continue
              } else {
                console.error("[v0] Binary file not found:", bufferUri)
                toast({
                  title: "Missing Binary File",
                  description: `"${modelFile.name}" requires "${bufferUri}". Please upload both files together, or use a GLB file instead.`,
                  variant: "destructive",
                  duration: 8000,
                })
                errorCount++
                continue
              }
            }
          }

          console.log("[v0] GLTF has embedded data or no external dependencies, creating blob URL...")
          const modifiedBlob = new Blob([gltfText], { type: "model/gltf+json" })
          const url = URL.createObjectURL(modifiedBlob)

          const newModel: UploadedModel = {
            id: `${Date.now()}-${Math.random()}`,
            name: modelFile.name.replace(/\.gltf$/, ""),
            url,
            uploadedAt: new Date(),
            isPermanent: false,
            fileSize: modelFile.size,
            gltfContent: gltfText,
            originalFile: modelFile,
            fileType: "gltf", // Store the file extension
          }

          console.log("[v0] Adding GLTF model to list:", newModel.name)
          setUploadedModels((prev) => {
            const updated = [...prev, newModel]
            console.log("[v0] Updated model list, total models:", updated.length)
            return updated
          })
          setActiveModelUrl(url)
          console.log("[v0] Model added successfully:", newModel.name)

          successCount++
          continue
        }

        console.log("[v0] Processing", fileName.split(".").pop()?.toUpperCase(), "file...")
        const url = URL.createObjectURL(modelFile)
        console.log("[v0] Blob URL created:", url)

        const fileExtension = fileName.split(".").pop() || ""
        const newModel: UploadedModel = {
          id: `${Date.now()}-${Math.random()}`,
          name: modelFile.name.replace(new RegExp(`\\.${fileExtension}$`), ""),
          url,
          uploadedAt: new Date(),
          isPermanent: false,
          fileSize: modelFile.size,
          originalFile: modelFile,
          fileType: fileExtension, // Store the file extension
        }

        console.log("[v0] Adding model to list:", newModel.name)
        setUploadedModels((prev) => {
          const updated = [...prev, newModel]
          console.log("[v0] Updated model list, total models:", updated.length)
          return updated
        })
        setActiveModelUrl(url)
        console.log("[v0] Model added successfully:", newModel.name)

        successCount++
      } catch (error) {
        console.error("[v0] Error processing file:", modelFile.name, error)
        toast({
          title: "Upload Error",
          description: `Failed to upload "${modelFile.name}": ${error instanceof Error ? error.message : "Unknown error"}`,
          variant: "destructive",
        })
        errorCount++
      }
    }

    if (successCount > 0) {
      toast({
        title: "Upload Successful",
        description: `Successfully uploaded ${successCount} model${successCount > 1 ? "s" : ""}. ${localStorage.getItem("database_confirmed") === "true" ? "" : "Saved locally."}`,
      })
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const resetToDefaultModel = async () => {
    try {
      console.log("[v0] Resetting to default model...")

      // Delete all existing models
      const deleteResult = await deleteAllModelsFromDatabase()
      if (!deleteResult.success) {
        throw new Error(deleteResult.error || "Failed to delete existing models")
      }

      console.log("[v0] Deleted", deleteResult.deletedCount, "existing models")

      // Initialize default model
      const initResult = await initializeDefaultModel()
      if (!initResult.success) {
        throw new Error(initResult.error || "Failed to initialize default model")
      }

      console.log("[v0] Default model initialized")

      // Clear local storage
      localStorage.removeItem("uploaded_models")
      setUploadedModels([])

      // Reload from database
      await loadModelsFromDatabase()

      toast({
        title: "Database Reset",
        description: "Database has been reset to the default just_body model.",
      })
    } catch (error) {
      console.error("[v0] Error resetting to default model:", error)
      toast({
        title: "Reset Failed",
        description: `Failed to reset database: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  return {
    uploadedModels,
    activeModelUrl,
    setActiveModelUrl,
    fileInputRef,
    handleFileUpload,
    saveModel,
    deleteModel,
    renameModel,
    isLoadingFromDb,
    needsDatabaseSetup,
    refreshDatabase: loadModelsFromDatabase,
    resetToDefaultModel, // Export new function
  }
}
