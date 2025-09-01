'use client'

import { Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { AlertDialogTrigger } from '@radix-ui/react-alert-dialog'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { toast } from 'sonner'

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

interface CategoryTableProps {
  categories: Category[]
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
  setSelectedCategory: (category: Category | null) => void
  setModalMode: (mode: 'create' | 'edit') => void
  setOpen: (open: boolean) => void
  loading: boolean
}

export default function CategoryTable({
  categories,
  setCategories,
  setSelectedCategory,
  setModalMode,
  setOpen,
  loading,
}: CategoryTableProps) {
  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setModalMode('edit')
    setOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c._id !== id))
        toast.success('Catégorie supprimée')
      } else {
        toast.error('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Erreur suppression catégorie:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-900 dark:text-white">Nom</TableHead>
            <TableHead className="text-gray-900 dark:text-white">Description</TableHead>
            <TableHead className="text-gray-900 dark:text-white">Plats</TableHead>
            <TableHead className="text-gray-900 dark:text-white">Actif</TableHead>
            <TableHead className="text-gray-900 dark:text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500 dark:text-gray-400">
                Chargement...
              </TableCell>
            </TableRow>
          ) : categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500 dark:text-gray-400">
                Aucune catégorie trouvée
              </TableCell>
            </TableRow>
          ) : (
            categories.map((c) => (
              <TableRow key={c._id}>
                <TableCell className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white">{c.order}</span> -{' '}
                  {c.image ? (
                    <Image
                      src={urlFor(c.image).url() || c.image}
                      alt={c.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center text-white text-4xl">🍽️</div>
                  )}
                  <span className="text-gray-900 dark:text-white">{c.name}</span>
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-300">{c.description || '-'}</TableCell>
                <TableCell className="text-gray-900 dark:text-white">{c.dishCount ? c.dishCount : '0'}</TableCell>
                <TableCell className="text-gray-900 dark:text-white">{c.isActive ? '✅' : '❌'}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(c)}
                      className="text-orange-500 dark:text-orange-400"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-500 dark:text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white dark:bg-gray-800">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-gray-900 dark:text-white">
                            Supprimer {c.name} ?
                          </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
                            Annuler
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(c._id)}
                            className="bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}