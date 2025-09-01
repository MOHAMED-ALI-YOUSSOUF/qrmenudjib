'use client'

import { useState, useEffect } from 'react'
import { Plus, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import CategoryTable from '@/components/dashboard/categories/CategoryTable'
import StatsCard from '@/components/dashboard/StatsCard'
import CategoryDialog from '@/components/dashboard/categories/CategoryDialog'


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

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [open, setOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/categories')
        if (!response.ok) throw new Error('Failed to fetch categories')
        const data = await response.json()
        setCategories(data.categories || [])
      } catch (error) {
        console.error('Erreur chargement catégories:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  const resetForm = () => {
    setSelectedCategory(null)
    setModalMode('create')
    setOpen(false)
  }

  const filteredCategories = categories
    .filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => a.order - b.order)

  const totalDishes = categories.reduce((sum, c) => sum + (Number(c.dishCount) || 0), 0)

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mes Catégories</h1>
          <p className="text-gray-600 dark:text-gray-300">Gérez vos catégories pour organiser vos plats</p>
        </div>
        <CategoryDialog
          open={open}
          setOpen={setOpen}
          modalMode={modalMode}
          setModalMode={setModalMode}
          selectedCategory={selectedCategory}
          setCategories={setCategories}
          resetForm={resetForm}
        />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 h-5 w-5" />
        <Input
          placeholder="Rechercher une catégorie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard
          title="Total Catégories"
          value={categories.length}
          icon={Plus}
          iconColor="text-blue-600 dark:text-blue-400"
          bgColor="bg-blue-100 dark:bg-blue-900"
        />
        <StatsCard
          title="Total Plats"
          value={totalDishes}
          icon={Search}
          iconColor="text-green-600 dark:text-green-400"
          bgColor="bg-green-100 dark:bg-green-900"
        />
      </div>

      {/* Table */}
      <CategoryTable
        categories={filteredCategories}
        setCategories={setCategories}
        setSelectedCategory={setSelectedCategory}
        setModalMode={setModalMode}
        setOpen={setOpen}
        loading={loading}
      />
    </div>
  )
}