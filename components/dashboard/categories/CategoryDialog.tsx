'use client'

import { useState, useEffect } from 'react'
import { Plus, Upload, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { toast } from 'sonner'
import imageCompression from 'browser-image-compression'

interface Category {
  _id: string
  name: string
  slug: { current: string }
  description?: string
  createdAt: string
  updatedAt: string
  dishCount?: number
  image?: string
  isActive: boolean
  order: number
}

interface CategoryDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  modalMode: 'create' | 'edit'
  setModalMode: (mode: 'create' | 'edit') => void
  selectedCategory: Category | null
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
  resetForm: () => void
}

export default function CategoryDialog({
  open,
  setOpen,
  modalMode,
  setModalMode,
  selectedCategory,
  setCategories,
  resetForm,
}: CategoryDialogProps) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    image: '',
    isActive: true,
    order: 0,
  })
  const [saving, setSaving] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)

  // Update form state when selectedCategory changes
  useEffect(() => {
    if (selectedCategory && modalMode === 'edit') {
      setForm({
        name: selectedCategory.name || '',
        description: selectedCategory.description || '',
        image: selectedCategory.image || '',
        isActive: selectedCategory.isActive ?? true,
        order: selectedCategory.order || 0,
      })
    } else {
      setForm({
        name: '',
        description: '',
        image: '',
        isActive: true,
        order: 0,
      })
    }
  }, [selectedCategory, modalMode])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      const url = modalMode === 'create' ? '/api/categories' : `/api/categories/${selectedCategory?._id}`
      const method = modalMode === 'create' ? 'POST' : 'PATCH'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (response.ok) {
        const result = await response.json()
        setCategories((prev) =>
          modalMode === 'create'
            ? [...prev, result.category]
            : prev.map((c) => (c._id === result.category._id ? result.category : c))
        )
        toast.success(modalMode === 'create' ? 'Catégorie créée' : 'Catégorie mise à jour')
        setOpen(false)
        resetForm()
      } else {
        toast.error('Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur sauvegarde catégorie:', error)
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setImageLoading(true)
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      })

      const formData = new FormData()
      formData.append('file', compressedFile)

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const imageData = await response.json()
        setForm((prev) => ({ ...prev, image: imageData }))
        toast.success('Image téléchargée avec succès')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Erreur lors du téléchargement de l'image")
      }
    } catch (error) {
      console.error(error)
      toast.error("Erreur lors du téléchargement de l'image")
    } finally {
      setImageLoading(false)
    }
  }

  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, image: '' }))
    toast.success('Image supprimée')
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen)
      if (!isOpen) resetForm()
    }}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            resetForm()
            setModalMode('create')
          }}
          className="mt-4 sm:mt-0 bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
        >
          <Plus className="h-4 w-4 mr-2" /> Nouvelle Catégorie
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-hidden flex flex-col bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">
            {modalMode === 'create' ? 'Créer une catégorie' : 'Modifier la catégorie'}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-1">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label className="text-gray-900 dark:text-white">Nom</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="Entrez le nom de la catégorie..."
                className="mt-2 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <Label className="text-gray-900 dark:text-white">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="resize-none min-h-[80px] max-h-[120px] w-full mt-2 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                placeholder="Entrez la description de la catégorie..."
                rows={3}
                style={{
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'break-word',
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ImageInput" className="text-gray-900 dark:text-white">Image</Label>
              {form.image ? (
                <div className="space-y-3">
                  <div className="relative h-24 w-24 mx-auto overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600">
                    {imageLoading ? (
                      <span className="animate-spin h-full flex justify-center items-center text-4xl">⏳</span>
                    ) : (
                      <div>
                        <Image
                          src={urlFor(form.image).url() || form.image}
                          alt="Image preview"
                          fill
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1"
                          onClick={handleRemoveImage}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <Label
                    htmlFor="ImageInput"
                    className="flex items-center justify-center p-2 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-900 dark:text-white"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    <span>Changer l&apos;image</span>
                  </Label>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                  <Upload className="h-8 w-8 text-gray-400 dark:text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Aucune image</p>
                  <Label
                    htmlFor="ImageInput"
                    className="flex items-center justify-center px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm text-gray-900 dark:text-white"
                  >
                    {imageLoading ? (
                      <span className="animate-spin mr-2">⏳</span>
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    <span>{imageLoading ? 'Téléchargement...' : "Choisir une image"}</span>
                  </Label>
                </div>
              )}
              <input
                id="ImageInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            <div className="flex justify-between items-center gap-6">
              <div className="flex flex-col gap-3">
                <Label className="text-gray-900 dark:text-white">Ordre d&apos;affichage</Label>
                <Input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                  className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <Label className="text-gray-900 dark:text-white">Active</Label>
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(v) => setForm({ ...form, isActive: v })}
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="submit"
                className="bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 w-full"
                disabled={saving || imageLoading}
              >
                {saving ? 'Enregistrement...' : modalMode === 'create' ? 'Créer' : 'Mettre à jour'}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}