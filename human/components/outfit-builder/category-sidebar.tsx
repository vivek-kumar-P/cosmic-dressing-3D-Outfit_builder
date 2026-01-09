"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { User, ShoppingBag, Shirt, X, ChevronDown, ChevronUp, Search, Sparkles } from "lucide-react"
import { ColorPicker } from "@/components/3d-viewer/color-picker"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface CategorySidebarProps {
  show: boolean
  onClose: () => void
  shirtColor: string
  onShirtColorChange: (color: string) => void
  showShirt: boolean
  onShowShirtChange: (show: boolean) => void
  selectedItems: Record<string, string>
  onSelectedItemsChange: (items: Record<string, string>) => void
  categoryColors: Record<string, string>
  onCategoryColorsChange: (colors: Record<string, string>) => void
  onDefaultBodyClick?: () => void
  onDefaultShirtClick?: () => void
  onWomanDefaultClick?: () => void
  onLadiesShirtClick?: () => void
  onLadiesShoesClick?: () => void
  onLadiesPantsClick?: () => void
  shoesColor?: string
  onShoesColorChange?: (color: string) => void
  showShoes?: boolean
  onShowShoesChange?: (show: boolean) => void
  pantsColor?: string
  onPantsColorChange?: (color: string) => void
  showPants?: boolean
  onShowPantsChange?: (show: boolean) => void
  onPrintedShoesClick?: () => void
  onLeatherDressClick?: () => void
}

export function CategorySidebar({
  show,
  onClose,
  shirtColor,
  onShirtColorChange,
  showShirt,
  onShowShirtChange,
  selectedItems,
  onSelectedItemsChange,
  categoryColors,
  onCategoryColorsChange,
  onDefaultBodyClick,
  onDefaultShirtClick,
  onWomanDefaultClick,
  onLadiesShirtClick,
  onLadiesShoesClick,
  onLadiesPantsClick,
  onPrintedShoesClick,
  onLeatherDressClick,
  shoesColor = "#2c3e50",
  onShoesColorChange,
  showShoes = false,
  onShowShoesChange,
  pantsColor = "#34495e",
  onPantsColorChange,
  showPants = false,
  onShowPantsChange,
}: CategorySidebarProps) {
  const [openCategories, setOpenCategories] = useState<string[]>(["shirt"])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (Object.keys(categoryColors).length === 0) {
      onCategoryColorsChange({
        character: "#f5d5c8",
        shoes: "#2c3e50",
        pants: "#34495e",
        tshirt: "#ffffff",
        shirt: shirtColor,
        accessories: "#95a5a6",
      })
    }
  }, [])

  const categories = [
    {
      id: "character",
      name: "Character",
      icon: User,
      hasColorPicker: true,
      items: [
        { id: "default-body", name: "Default Body" },
        { id: "woman-default", name: "Woman Default" },
        { id: "athletic-body", name: "Athletic Body" },
        { id: "casual-body", name: "Casual Body" },
      ],
    },
    {
      id: "shoes",
      name: "Shoes",
      icon: ShoppingBag,
      hasColorPicker: true,
      items: [
        { id: "ladies-full-shoes", name: "Ladies Full Shoes" },
        { id: "printed-shoes-ladies", name: "Printed Shoes" },
        { id: "sneakers", name: "Sneakers" },
        { id: "boots", name: "Boots" },
        { id: "sandals", name: "Sandals" },
      ],
    },
    {
      id: "pants",
      name: "Pants",
      icon: ShoppingBag,
      hasColorPicker: true,
      items: [
        { id: "ladies-black-pants", name: "Ladies Black Pants" },
        { id: "jeans", name: "Jeans" },
        { id: "chinos", name: "Chinos" },
        { id: "shorts", name: "Shorts" },
      ],
    },
    {
      id: "tshirt",
      name: "T-Shirt",
      icon: Shirt,
      hasColorPicker: true,
      items: [
        { id: "leather-dress-ladies", name: "Leather Full Dress" },
        { id: "basic-tee", name: "Basic Tee" },
        { id: "v-neck", name: "V-Neck" },
        { id: "polo", name: "Polo" },
      ],
    },
    {
      id: "shirt",
      name: "Shirt",
      icon: Shirt,
      hasColorPicker: true,
      items: [
        { id: "ladies-turtle-neck", name: "Ladies Turtle Neck" },
        { id: "default-shirt", name: "Default Shirt" },
        { id: "dress-shirt", name: "Dress Shirt" },
        { id: "casual-shirt", name: "Casual Shirt" },
      ],
    },
    {
      id: "accessories",
      name: "Accessories",
      icon: ShoppingBag,
      hasColorPicker: true,
      items: [
        { id: "watch", name: "Watch" },
        { id: "glasses", name: "Glasses" },
        { id: "hat", name: "Hat" },
      ],
    },
  ]

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const selectItem = (categoryId: string, itemId: string) => {
    if (categoryId === "character" && itemId === "default-body" && onDefaultBodyClick) {
      onDefaultBodyClick()
      onSelectedItemsChange({ ...selectedItems, [categoryId]: itemId })
      return
    }

    if (categoryId === "character" && itemId === "woman-default" && onWomanDefaultClick) {
      onWomanDefaultClick()
      onSelectedItemsChange({ ...selectedItems, [categoryId]: itemId })
      return
    }

    if (categoryId === "shirt" && itemId === "default-shirt" && onDefaultShirtClick) {
      onDefaultShirtClick()
      onSelectedItemsChange({ ...selectedItems, [categoryId]: itemId })
      return
    }

    if (categoryId === "shirt" && itemId === "ladies-turtle-neck" && onLadiesShirtClick) {
      onLadiesShirtClick()
      onSelectedItemsChange({ ...selectedItems, [categoryId]: itemId })
      return
    }

    if (categoryId === "shoes" && itemId === "ladies-full-shoes" && onLadiesShoesClick) {
      onLadiesShoesClick()
      onSelectedItemsChange({ ...selectedItems, [categoryId]: itemId })
      return
    }

    if (categoryId === "shoes" && itemId === "printed-shoes-ladies" && onPrintedShoesClick) {
      onPrintedShoesClick()
      onSelectedItemsChange({ ...selectedItems, [categoryId]: itemId })
      return
    }

    if (categoryId === "tshirt" && itemId === "leather-dress-ladies" && onLeatherDressClick) {
      onLeatherDressClick()
      onSelectedItemsChange({ ...selectedItems, [categoryId]: itemId })
      return
    }

    if (categoryId === "pants" && itemId === "ladies-black-pants" && onLadiesPantsClick) {
      onLadiesPantsClick()
      onSelectedItemsChange({ ...selectedItems, [categoryId]: itemId })
      return
    }

    onSelectedItemsChange({ ...selectedItems, [categoryId]: itemId })
  }

  const handleCategoryColorChange = (categoryId: string, color: string) => {
    onCategoryColorsChange({ ...categoryColors, [categoryId]: color })
    if (categoryId === "shirt") {
      onShirtColorChange(color)
    }
    if (categoryId === "shoes" && onShoesColorChange) {
      onShoesColorChange(color)
    }
    if (categoryId === "pants" && onPantsColorChange) {
      onPantsColorChange(color)
    }
  }

  const clearAll = () => {
    onSelectedItemsChange({})
    onShowShirtChange(false)
    onShowShoesChange?.(false)
    onShowPantsChange?.(false)
    onCategoryColorsChange({
      character: "#f5d5c8",
      shoes: "#2c3e50",
      pants: "#34495e",
      tshirt: "#ffffff",
      shirt: "#4a90e2",
      accessories: "#95a5a6",
    })
  }

  const selectedCount = Object.keys(selectedItems).length

  return (
    <>
      <aside
        className={`fixed left-0 top-0 z-20 h-full w-72 transform border-r border-border bg-card transition-transform duration-300 lg:relative lg:translate-x-0 ${
          show ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card/50 px-4 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Categories</h2>
              {selectedCount > 0 && (
                <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                  {selectedCount}
                </Badge>
              )}
            </div>
            <Button onClick={onClose} variant="ghost" size="icon" className="lg:hidden">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="shrink-0 border-b border-border p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="space-y-2 p-3">
              {filteredCategories.map((category) => {
                const isOpen = openCategories.includes(category.id)
                const selectedItem = selectedItems[category.id]

                return (
                  <Collapsible key={category.id} open={isOpen} onOpenChange={() => toggleCategory(category.id)}>
                    <div className="rounded-lg border border-border bg-card transition-all hover:border-primary/50 hover:shadow-sm">
                      <CollapsibleTrigger className="flex w-full items-center justify-between p-3 text-left transition-colors hover:bg-accent/30">
                        <div className="flex items-center gap-3">
                          <div
                            className={`rounded-md p-1.5 transition-colors ${selectedItem ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                          >
                            <category.icon className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">{category.name}</span>
                            {selectedItem && (
                              <span className="text-xs text-muted-foreground">
                                {category.items.find((i) => i.id === selectedItem)?.name}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedItem && <Sparkles className="h-3.5 w-3.5 text-primary" />}
                          {isOpen ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="border-t border-border p-3">
                          {/* Item Grid */}
                          <div className="mb-3 grid grid-cols-2 gap-2">
                            {category.items.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => selectItem(category.id, item.id)}
                                className={`group flex flex-col items-center gap-2 rounded-md border p-2 text-center transition-all hover:scale-105 hover:shadow-md ${
                                  selectedItem === item.id
                                    ? "border-primary bg-primary/10 shadow-sm"
                                    : "border-border bg-card/50 hover:border-primary/30"
                                }`}
                              >
                                <div
                                  className={`flex h-16 w-full items-center justify-center rounded-md transition-colors ${
                                    selectedItem === item.id ? "bg-primary/5" : "bg-muted group-hover:bg-muted/70"
                                  }`}
                                >
                                  <category.icon
                                    className={`h-8 w-8 transition-colors ${
                                      selectedItem === item.id
                                        ? "text-primary"
                                        : "text-muted-foreground/50 group-hover:text-muted-foreground"
                                    }`}
                                  />
                                </div>
                                <span className="text-xs font-medium">{item.name}</span>
                              </button>
                            ))}
                          </div>

                          {selectedItem && category.hasColorPicker && (
                            <div className="space-y-3 rounded-md border border-border bg-muted/30 p-3">
                              {/* Shirt-specific toggle */}
                              {category.id === "shirt" && (
                                <div className="flex items-center justify-between">
                                  <Label htmlFor="show-shirt" className="text-sm font-medium">
                                    Show Shirt
                                  </Label>
                                  <Switch id="show-shirt" checked={showShirt} onCheckedChange={onShowShirtChange} />
                                </div>
                              )}

                              {/* Shoes-specific toggle */}
                              {category.id === "shoes" && onShowShoesChange && (
                                <div className="flex items-center justify-between">
                                  <Label htmlFor="show-shoes" className="text-sm font-medium">
                                    Show Shoes
                                  </Label>
                                  <Switch id="show-shoes" checked={showShoes} onCheckedChange={onShowShoesChange} />
                                </div>
                              )}

                              {/* Pants-specific toggle */}
                              {category.id === "pants" && onShowPantsChange && (
                                <div className="flex items-center justify-between">
                                  <Label htmlFor="show-pants" className="text-sm font-medium">
                                    Show Pants
                                  </Label>
                                  <Switch id="show-pants" checked={showPants} onCheckedChange={onShowPantsChange} />
                                </div>
                              )}

                              {/* Color picker */}
                              {((category.id === "shirt" && showShirt) ||
                                (category.id === "shoes" && showShoes) ||
                                (category.id === "pants" && showPants) ||
                                (category.id !== "shirt" && category.id !== "shoes" && category.id !== "pants")) && (
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">{category.name} Color</Label>
                                  <ColorPicker
                                    color={
                                      category.id === "shoes"
                                        ? shoesColor
                                        : category.id === "pants"
                                          ? pantsColor
                                          : categoryColors[category.id]
                                    }
                                    onChange={(color) => handleCategoryColorChange(category.id, color)}
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                )
              })}

              {filteredCategories.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">No items found</div>
              )}
            </div>
          </ScrollArea>

          <div className="shrink-0 border-t border-border bg-card/50 p-4 backdrop-blur-sm">
            <Button
              onClick={clearAll}
              variant="outline"
              className="w-full transition-all hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 bg-transparent"
              disabled={selectedCount === 0}
            >
              Clear All {selectedCount > 0 && `(${selectedCount})`}
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
