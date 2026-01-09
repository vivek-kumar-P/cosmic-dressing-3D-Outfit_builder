"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Upload, Box, Save, Trash2, Edit2, Check, X, RefreshCw, Database } from "lucide-react"
import type { SidebarProps } from "@/types"
import { useState } from "react"
import { clearModelCache } from "@/lib/model-utils"
import { useGLTF } from "@react-three/drei"

export function Sidebar({
  uploadedModels,
  activeModelUrl,
  onModelSelect,
  onFileUpload,
  fileInputRef,
  showSidebar,
  onClose,
  onSaveModel,
  onDeleteModel,
  onRenameModel,
  onResetDatabase,
}: SidebarProps) {
  const [savingModelId, setSavingModelId] = useState<string | null>(null)
  const [deletingModelId, setDeletingModelId] = useState<string | null>(null)
  const [editingModelId, setEditingModelId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const [renamingModelId, setRenamingModelId] = useState<string | null>(null)
  const [isResettingDb, setIsResettingDb] = useState(false)

  const handleSave = async (model: any, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!onSaveModel) return

    setSavingModelId(model.id)
    try {
      await onSaveModel(model)
    } finally {
      setSavingModelId(null)
    }
  }

  const handleDelete = async (model: any, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!onDeleteModel) return

    if (!confirm(`Are you sure you want to delete "${model.name}"?`)) {
      return
    }

    setDeletingModelId(model.id)
    try {
      await onDeleteModel(model)
    } finally {
      setDeletingModelId(null)
    }
  }

  const startEditing = (model: any, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingModelId(model.id)
    setEditingName(model.name)
  }

  const cancelEditing = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingModelId(null)
    setEditingName("")
  }

  const saveRename = async (model: any, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!onRenameModel || !editingName.trim()) return

    const newName = editingName.trim()
    setEditingModelId(null)
    setEditingName("")

    setRenamingModelId(model.id)
    try {
      await onRenameModel(model, newName)
    } catch (error) {
      console.error("[v0] Failed to rename model:", error)
      // If rename fails, the model list will still show the old name from the database
    } finally {
      setRenamingModelId(null)
    }
  }

  const handleClearCache = () => {
    console.log("[v0] Resetting model sizes - clearing all caches")

    // Clear our custom model transform cache
    clearModelCache()

    // Clear Three.js GLTF cache to force reload from file
    useGLTF.clear()

    // Force reload by re-selecting the current model with a cache-busting parameter
    if (activeModelUrl) {
      const timestamp = Date.now()
      const separator = activeModelUrl.includes("?") ? "&" : "?"
      const urlWithCacheBust = `${activeModelUrl}${separator}_t=${timestamp}`

      console.log("[v0] Forcing model reload with cache-bust URL")

      // First clear the URL to unmount the model
      onModelSelect("")

      // Then reload with the original URL after a brief delay
      setTimeout(() => {
        onModelSelect(activeModelUrl)
      }, 100)
    }
  }

  const handleResetDatabase = async () => {
    if (!onResetDatabase) return

    if (
      !confirm(
        "Are you sure you want to reset the database? This will delete ALL models and restore only the default just_body model. This action cannot be undone.",
      )
    ) {
      return
    }

    setIsResettingDb(true)
    try {
      await onResetDatabase()
    } finally {
      setIsResettingDb(false)
    }
  }

  return (
    <div
      className={`fixed left-0 top-0 z-20 h-full w-72 border-r border-border/50 bg-gradient-to-b from-card/95 to-card/90 shadow-xl backdrop-blur-md transition-transform duration-300 lg:translate-x-0 ${
        showSidebar ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-full flex-col">
        <div className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent p-6">
          <h2 className="mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-xl font-bold text-transparent">
            3D Models
          </h2>

          <div className="mb-3 space-y-2">
            <Button
              onClick={handleClearCache}
              variant="outline"
              size="sm"
              className="w-full bg-transparent"
              title="Clear model cache and reload (fixes sizing issues)"
            >
              <RefreshCw className="mr-2 h-3 w-3" />
              Reset Model Sizes
            </Button>

            {onResetDatabase && (
              <Button
                onClick={handleResetDatabase}
                disabled={isResettingDb}
                variant="outline"
                size="sm"
                className="w-full bg-transparent text-destructive hover:bg-destructive/10 hover:text-destructive"
                title="Delete all models and restore default just_body model"
              >
                <Database className="mr-2 h-3 w-3" />
                {isResettingDb ? "Resetting..." : "Reset Database"}
              </Button>
            )}
          </div>

          <Button
            onClick={() => fileInputRef.current?.click()}
            className="w-full shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
            variant="default"
            size="default"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Model
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".gltf,.glb,.fbx,.bin,.jpg,.jpeg,.png,.webp,.gif"
            multiple
            onChange={onFileUpload}
            className="hidden"
          />
          <p className="mt-3 text-xs text-muted-foreground">Upload .gltf/.glb/.fbx + textures • Max 50MB per file</p>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-3 p-4">
            {uploadedModels.map((model) => (
              <div
                key={model.id}
                className={`group relative rounded-xl border transition-all duration-200 ${
                  activeModelUrl === model.url
                    ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/20"
                    : "border-border/50 bg-card/50 hover:border-primary/50 hover:bg-card/80"
                }`}
              >
                <button
                  onClick={() => {
                    console.log("[v0] Switching to model:", model.name)
                    onModelSelect(model.url)
                    onClose()
                  }}
                  className="flex w-full items-center gap-3 p-4 text-left transition-all duration-200 hover:scale-[1.01]"
                  disabled={editingModelId === model.id}
                >
                  <div
                    className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg border transition-all duration-200 ${
                      activeModelUrl === model.url
                        ? "border-primary bg-primary/20 shadow-sm"
                        : "border-border/50 bg-muted/50 group-hover:border-primary/30 group-hover:bg-muted"
                    }`}
                  >
                    <Box
                      className={`h-7 w-7 transition-all duration-200 ${
                        activeModelUrl === model.url
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-primary/70"
                      }`}
                    />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    {editingModelId === model.id ? (
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value.slice(0, 20))}
                          className="h-7 text-sm"
                          placeholder="Model name"
                          maxLength={20}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              saveRename(model, e as any)
                            } else if (e.key === "Escape") {
                              cancelEditing(e as any)
                            }
                          }}
                        />
                        <Button
                          onClick={(e) => saveRename(model, e)}
                          disabled={renamingModelId === model.id || !editingName.trim()}
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button onClick={cancelEditing} variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <p className="truncate text-sm font-semibold text-foreground">{model.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {model.uploadedAt instanceof Date
                            ? model.uploadedAt.toLocaleTimeString()
                            : new Date(model.uploadedAt).toLocaleTimeString()}
                          {model.isPermanent && " • Saved"}
                        </p>
                      </>
                    )}
                  </div>
                </button>

                <div className="flex gap-1 border-t border-border/30 p-2">
                  {editingModelId !== model.id &&
                    onRenameModel &&
                    !model.isPermanent &&
                    model.id !== "default" &&
                    model.id !== "nathan-animated" && (
                      <Button
                        onClick={(e) => startEditing(model, e)}
                        variant="ghost"
                        size="sm"
                        className="flex-1 text-xs"
                        title="Rename this model (up to 20 characters)"
                      >
                        <Edit2 className="mr-1 h-3 w-3" />
                        Rename
                      </Button>
                    )}
                  {model.id !== "default" &&
                    model.id !== "nathan-animated" &&
                    !model.isPermanent &&
                    onSaveModel &&
                    model.originalFile && (
                      <Button
                        onClick={(e) => handleSave(model, e)}
                        disabled={savingModelId === model.id}
                        variant="ghost"
                        size="sm"
                        className="flex-1 text-xs"
                        title="Store this model permanently in the database"
                      >
                        <Save className="mr-1 h-3 w-3" />
                        {savingModelId === model.id ? "Saving..." : "Store"}
                      </Button>
                    )}
                  {model.id !== "default" && model.id !== "nathan-animated" && !model.isPermanent && onDeleteModel && (
                    <Button
                      onClick={(e) => handleDelete(model, e)}
                      disabled={deletingModelId === model.id}
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                      title="Delete this model"
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      {deletingModelId === model.id ? "Deleting..." : "Delete"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
