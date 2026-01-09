"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Spinner } from "@/components/ui/spinner"
import { Search, Plus, Trash2, Edit, Eye, Package, Check, X, Filter, Grid3x3, List } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Model } from "@/types"

interface AssetLibraryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  uploadedModels: Model[]
  onModelSelect: (url: string) => void
  onDeleteModel: (id: string, fileUrl: string) => Promise<void>
  onRenameModel: (id: string, newName: string) => Promise<void>
  onUploadClick: () => void
  isLoading?: boolean
  activeModelUrl?: string
}

type ViewMode = "grid" | "list"
type CategoryFilter = "all" | "character" | "clothing" | "accessories" | "uploaded"

export function AssetLibraryModal({
  open,
  onOpenChange,
  uploadedModels,
  onModelSelect,
  onDeleteModel,
  onRenameModel,
  onUploadClick,
  isLoading,
  activeModelUrl,
}: AssetLibraryModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Filter models based on search and category
  const filteredModels = uploadedModels.filter((model) => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase())

    if (categoryFilter === "all") return matchesSearch

    const modelName = model.name.toLowerCase()
    const modelCategory = model.category?.toLowerCase() || ""

    if (categoryFilter === "character") {
      return matchesSearch && (modelCategory === "character" || modelName.includes("body"))
    }
    if (categoryFilter === "clothing") {
      return (
        matchesSearch &&
        (modelCategory === "shoes" ||
          modelCategory === "pants" ||
          modelCategory === "shirt" ||
          modelCategory === "tshirt" ||
          modelName.includes("shirt") ||
          modelName.includes("pants") ||
          modelName.includes("dress") ||
          modelName.includes("shoes"))
      )
    }
    if (categoryFilter === "uploaded") {
      return matchesSearch && !model.isPermanent
    }

    return matchesSearch
  })

  const handleStartEdit = async (model: Model) => {
    setEditingId(model.id)
    setEditingName(model.name)
  }

  const handleSaveEdit = async () => {
    if (editingId && editingName.trim()) {
      await onRenameModel(editingId, editingName.trim())
      setEditingId(null)
      setEditingName("")
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingName("")
  }

  const handleDelete = async (id: string, fileUrl: string) => {
    setDeletingId(id)
    await onDeleteModel(id, fileUrl)
    setDeletingId(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "N/A"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
  }

  const categoryOptions: { value: CategoryFilter; label: string; count: number }[] = [
    { value: "all", label: "All Assets", count: uploadedModels.length },
    {
      value: "character",
      label: "Characters",
      count: uploadedModels.filter((m) => {
        const cat = m.category?.toLowerCase() || ""
        const name = m.name.toLowerCase()
        return cat === "character" || name.includes("body")
      }).length,
    },
    {
      value: "clothing",
      label: "Clothing",
      count: uploadedModels.filter((m) => {
        const cat = m.category?.toLowerCase() || ""
        const name = m.name.toLowerCase()
        return (
          cat === "shoes" ||
          cat === "pants" ||
          cat === "shirt" ||
          cat === "tshirt" ||
          name.includes("shirt") ||
          name.includes("pants") ||
          name.includes("dress") ||
          name.includes("shoes")
        )
      }).length,
    },
    {
      value: "uploaded",
      label: "My Uploads",
      count: uploadedModels.filter((m) => !m.isPermanent).length,
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 gap-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">Asset Library</DialogTitle>
              <DialogDescription className="mt-1.5 text-base">
                Browse, manage, and organize your 3D models and assets
              </DialogDescription>
            </div>
            <Button onClick={onUploadClick} size="sm" className="gap-2 shadow-sm">
              <Plus className="h-4 w-4" />
              Upload New
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-col flex-1 min-h-0">
          <div className="px-6 py-4 border-b space-y-4 shrink-0 bg-background">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search assets by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10"
                />
              </div>
              <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 px-3"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-4 w-4 text-muted-foreground" />
              {categoryOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={categoryFilter === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategoryFilter(option.value)}
                  className="gap-2 h-9"
                >
                  {option.label}
                  <Badge
                    variant={categoryFilter === option.value ? "secondary" : "outline"}
                    className="ml-1 px-2 py-0.5 text-xs font-medium"
                  >
                    {option.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="px-6 py-4">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <Spinner className="h-8 w-8" />
                    <p className="text-sm text-muted-foreground">Loading assets...</p>
                  </div>
                ) : filteredModels.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <Package className="h-16 w-16 text-muted-foreground/50" />
                    <div className="text-center">
                      <p className="text-lg font-semibold">No assets found</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {searchQuery
                          ? "Try adjusting your search or filter"
                          : "Upload your first 3D model or seed default models to get started"}
                      </p>
                    </div>
                    {!searchQuery && (
                      <Button onClick={onUploadClick} className="gap-2 mt-2">
                        <Plus className="h-4 w-4" />
                        Upload Model
                      </Button>
                    )}
                  </div>
                ) : viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
                    {filteredModels.map((model) => (
                      <div
                        key={model.id}
                        className={`group relative rounded-xl border-2 bg-card overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02] ${
                          activeModelUrl === model.file_url
                            ? "ring-2 ring-primary shadow-lg border-primary"
                            : "hover:border-primary/50"
                        }`}
                      >
                        <div className="aspect-square bg-gradient-to-br from-muted/80 to-muted/40 relative overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px]">
                            <Package className="h-20 w-20 text-muted-foreground/40 drop-shadow-sm" />
                          </div>
                          {activeModelUrl === model.file_url && (
                            <div className="absolute top-3 left-3">
                              <Badge variant="default" className="gap-1.5 shadow-md font-semibold px-3 py-1">
                                <Eye className="h-3.5 w-3.5" />
                                Active
                              </Badge>
                            </div>
                          )}
                          {model.isPermanent && (
                            <div className="absolute top-3 right-3">
                              <Badge variant="secondary" className="shadow-md font-medium px-2.5 py-1">
                                Default
                              </Badge>
                            </div>
                          )}
                          {model.category && (
                            <div className="absolute bottom-3 left-3">
                              <Badge
                                variant="outline"
                                className="text-xs capitalize bg-background/90 backdrop-blur-sm shadow-sm font-medium px-2.5 py-1"
                              >
                                {model.category}
                              </Badge>
                            </div>
                          )}
                        </div>

                        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 bg-card">
                          {editingId === model.id ? (
                            <div className="flex items-center gap-1.5">
                              <Input
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                className="h-9 text-sm font-medium"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveEdit()
                                  if (e.key === "Escape") handleCancelEdit()
                                }}
                              />
                              <Button size="icon" variant="ghost" className="h-9 w-9 shrink-0" onClick={handleSaveEdit}>
                                <Check className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-9 w-9 shrink-0"
                                onClick={handleCancelEdit}
                              >
                                <X className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          ) : (
                            <h3
                              className="font-semibold text-xs sm:text-sm line-clamp-2 leading-tight min-h-[2.5rem] break-words"
                              title={model.name}
                            >
                              {model.name}
                            </h3>
                          )}

                          <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                            {formatFileSize(model.file_size)}
                          </p>

                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 pt-1">
                            <Button
                              size="sm"
                              variant="default"
                              className="flex-1 h-9 text-xs font-medium shadow-sm w-full sm:w-auto"
                              onClick={() => onModelSelect(model.file_url)}
                            >
                              <Eye className="h-3.5 w-3.5 mr-1.5" />
                              Load
                            </Button>
                            <div className="flex items-center gap-1.5">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-9 w-9 flex-1 sm:flex-none shrink-0 hover:bg-primary hover:text-primary-foreground bg-transparent"
                                onClick={() => handleStartEdit(model)}
                                disabled={model.isPermanent}
                                title={model.isPermanent ? "Cannot edit default models" : "Rename model"}
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-9 w-9 flex-1 sm:flex-none shrink-0 hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                                onClick={() => handleDelete(model.id, model.file_url)}
                                disabled={model.isPermanent || deletingId === model.id}
                                title={model.isPermanent ? "Cannot delete default models" : "Delete model"}
                              >
                                {deletingId === model.id ? (
                                  <Spinner className="h-3.5 w-3.5" />
                                ) : (
                                  <Trash2 className="h-3.5 w-3.5" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3 pb-4">
                    {filteredModels.map((model) => (
                      <div
                        key={model.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 bg-card hover:shadow-lg transition-all ${
                          activeModelUrl === model.file_url
                            ? "ring-2 ring-primary shadow-md border-primary"
                            : "hover:border-primary/50"
                        }`}
                      >
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-muted/80 to-muted/40 border">
                          <Package className="h-10 w-10 text-muted-foreground/50" />
                        </div>

                        <div className="flex-1 min-w-0">
                          {editingId === model.id ? (
                            <div className="flex items-center gap-2">
                              <Input
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                className="h-10 font-medium"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveEdit()
                                  if (e.key === "Escape") handleCancelEdit()
                                }}
                              />
                              <Button size="icon" variant="ghost" className="shrink-0" onClick={handleSaveEdit}>
                                <Check className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button size="icon" variant="ghost" className="shrink-0" onClick={handleCancelEdit}>
                                <X className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-2 flex-wrap mb-2">
                                <h3 className="font-semibold text-base truncate">{model.name}</h3>
                                {activeModelUrl === model.file_url && (
                                  <Badge variant="default" className="gap-1 shadow-sm font-medium">
                                    <Eye className="h-3 w-3" />
                                    Active
                                  </Badge>
                                )}
                                {model.isPermanent && (
                                  <Badge variant="secondary" className="font-medium">
                                    Default
                                  </Badge>
                                )}
                                {model.category && (
                                  <Badge variant="outline" className="text-xs capitalize font-medium">
                                    {model.category}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground font-medium">
                                {formatFileSize(model.file_size)}
                              </p>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            variant="default"
                            onClick={() => onModelSelect(model.file_url)}
                            className="shadow-sm font-medium"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Load
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleStartEdit(model)}
                            disabled={model.isPermanent}
                            className="hover:bg-primary hover:text-primary-foreground"
                            title={model.isPermanent ? "Cannot edit default models" : "Rename model"}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                            onClick={() => handleDelete(model.id, model.file_url)}
                            disabled={model.isPermanent || deletingId === model.id}
                            title={model.isPermanent ? "Cannot delete default models" : "Delete model"}
                          >
                            {deletingId === model.id ? <Spinner className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="px-6 py-3.5 border-t bg-muted/30 shrink-0">
            <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              <span>
                Showing <span className="font-semibold text-foreground">{filteredModels.length}</span> of{" "}
                <span className="font-semibold text-foreground">{uploadedModels.length}</span> assets
                {searchQuery && " matching search"}
              </span>
              <span>
                Total:{" "}
                <span className="font-semibold text-foreground">
                  {formatFileSize(uploadedModels.reduce((acc, m) => acc + m.file_size, 0))}
                </span>
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
