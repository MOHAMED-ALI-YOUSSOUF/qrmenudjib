'use client'

import { useState, useEffect } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import DishDialog from '@/components/dashboard/dishes/DisheDialog'
import StatsCard from '@/components/dashboard/StatsCard'
import DishTable from '@/components/dashboard/dishes/DishesTable'

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

interface Category {
  _id: string
  name: string
  image?: any
}

export default function DishesPage() {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'price' | 'isAvailable' | 'isPopular'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [open, setOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [dishesResponse, categoriesResponse] = await Promise.all([
          fetch('/api/dishes'),
          fetch('/api/categories'),
        ])

        if (!dishesResponse.ok) throw new Error('Failed to fetch dishes')
        const dishesData = await dishesResponse.json()
        setDishes(dishesData.dishes || [])

        if (!categoriesResponse.ok) throw new Error('Failed to fetch categories')
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData.categories || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const sortDishes = (a: Dish, b: Dish) => {
    let result = 0
    switch (sortBy) {
      case 'name':
        result = a.name.localeCompare(b.name)
        break
      case 'price':
        result = a.price - b.price
        break
      case 'isAvailable':
        result = a.isAvailable === b.isAvailable ? 0 : a.isAvailable ? -1 : 1
        break
      case 'isPopular':
        result = a.isPopular === b.isPopular ? 0 : a.isPopular ? -1 : 1
        break
      case 'createdAt':
      default:
        result = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        break
    }
    return sortOrder === 'asc' ? result : -result
  }

  const filteredDishes = dishes
    .filter((dish) =>
      dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dish.description && dish.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort(sortDishes)

  const paginatedDishes = filteredDishes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredDishes.length / itemsPerPage)

  const resetForm = () => {
    setSelectedDish(null)
    setModalMode('create')
  }

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="mt-4 sm:mt-0 h-10 w-32" />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <Table>
            <TableHeader>
              <TableRow>
                {Array(6).fill(0).map((_, index) => (
                  <TableHead key={index}>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array(3).fill(0).map((_, index) => (
                <TableRow key={index}>
                  {Array(6).fill(0).map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mes Plats</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Gérez vos plats et organisez-les par catégories
          </p>
        </div>
        <DishDialog
          open={open}
          setOpen={setOpen}
          modalMode={modalMode}
          setModalMode={setModalMode}
          selectedDish={selectedDish}
          setDishes={setDishes}
          categories={categories}
          resetForm={resetForm}
        />
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 h-5 w-5" />
          <Input
            placeholder="Rechercher un plat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer"
          >
            <option value="createdAt">Date de création</option>
            <option value="name">Nom</option>
            <option value="price">Prix</option>
            <option value="isAvailable">Disponibilité</option>
            <option value="isPopular">Populaire</option>
          </select>
          <Button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {sortOrder === 'asc' ? '↑ Croissant' : '↓ Décroissant'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Plats"
          value={dishes.length}
          icon={Plus}
          iconColor="text-blue-600 dark:text-blue-400"
          bgColor="bg-blue-100 dark:bg-blue-900"
        />
        <StatsCard
          title="Plats Disponibles"
          value={dishes.filter((d) => d.isAvailable).length}
          icon={Search}
          iconColor="text-green-600 dark:text-green-400"
          bgColor="bg-green-100 dark:bg-green-900"
        />
        <StatsCard
          title="Plats Populaires"
          value={dishes.filter((d) => d.isPopular).length}
          icon={Plus}
          iconColor="text-purple-600 dark:text-purple-400"
          bgColor="bg-purple-100 dark:bg-purple-900"
        />
      </div>

      {/* Dishes Table */}
      <DishTable
        dishes={paginatedDishes}
        setDishes={setDishes}
        setSelectedDish={setSelectedDish}
        setModalMode={setModalMode}
        setOpen={setOpen}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  )
}