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
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { toast } from 'sonner'

interface Dish {
  _id: string
  name: string
  slug: { current: string }
  description?: string
  price: number
  category: { _id: string; name: string }
  image?: any
  isAvailable: boolean
  isPopular: boolean
  createdAt: string
  updatedAt: string
}

interface DishTableProps {
  dishes: Dish[]
  setDishes: React.Dispatch<React.SetStateAction<Dish[]>>
  setSelectedDish: (dish: Dish | null) => void
  setModalMode: (mode: 'create' | 'edit') => void
  setOpen: (open: boolean) => void
  currentPage: number
  totalPages: number
  setCurrentPage: (page: number) => void
}

export default function DishTable({
  dishes,
  setDishes,
  setSelectedDish,
  setModalMode,
  setOpen,
  currentPage,
  totalPages,
  setCurrentPage,
}: DishTableProps) {
  const handleEditDish = (dish: Dish) => {
    setSelectedDish(dish)
    setModalMode('edit')
    setOpen(true)
  }

  const handleDeleteDish = async (dishId: string) => {
    try {
      const response = await fetch(`/api/dishes/${dishId}`, { method: 'DELETE' })
      if (response.ok) {
        setDishes((prev) => prev.filter((dish) => dish._id !== dishId))
        toast.success('Plat supprimé')
      } else {
        toast.error('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Erreur suppression plat:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  const getAvailabilityColor = (isAvailable: boolean) => {
    return isAvailable ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
      <Table className="min-w-[800px]">
        <TableHeader className="bg-gray-50 dark:bg-gray-700">
          <TableRow>
            <TableHead className="text-gray-900 dark:text-white">Nom</TableHead>
            <TableHead className="text-gray-900 dark:text-white">Description</TableHead>
            <TableHead className="text-gray-900 dark:text-white">Prix (fdj)</TableHead>
            <TableHead className="text-gray-900 dark:text-white">Catégorie</TableHead>
            <TableHead className="text-gray-900 dark:text-white">Statut/Populaire</TableHead>
            <TableHead className="text-gray-900 dark:text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dishes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 dark:text-gray-400">
                Aucun plat trouvé
              </TableCell>
            </TableRow>
          ) : (
            dishes.map((dish) => (
              <TableRow key={dish._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <TableCell className="font-medium min-w-56 text-gray-900 dark:text-white">
                  {dish.image && (
                    <div className="flex items-center gap-2">
                      <Image
                        src={urlFor(dish.image).url()}
                        alt={dish.name}
                        width={40}
                        height={40}
                        className="object-cover rounded"
                      />
                      {dish.name}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-300">{dish.description || '-'}</TableCell>
                <TableCell className="text-gray-900 dark:text-white">{dish.price}</TableCell>
                <TableCell className="text-gray-900 dark:text-white">{dish.category.name}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAvailabilityColor(dish.isAvailable)}`}
                  >
                    {dish.isAvailable ? 'Disponible' : 'Indisponible'}
                  </span>
                  {dish.isPopular && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      Populaire
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditDish(dish)}
                      className="text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-500"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white dark:bg-gray-800">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-gray-900 dark:text-white">Supprimer le plat</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                            Êtes-vous sûr de vouloir supprimer le plat &quot;{dish.name}&quot; ? Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteDish(dish._id)}
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
      {totalPages > 1 && (
        <div className="flex justify-between items-center p-4">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Précédent
          </Button>
          <span className="text-gray-900 dark:text-white">
            Page {currentPage} sur {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  )
}