'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { BookOpen, UtensilsCrossed, QrCode, Plus, Eye } from 'lucide-react'
import StatsCard from '@/components/dashboard/dashboard/StatsCard'
import QuickActionCard from '@/components/dashboard/dashboard/QuickActionCard'
import RecentActivityList from '@/components/dashboard/dashboard/RecentActivityList'
import GettingStarted from '@/components/dashboard/dashboard/GettingStarted'


interface DashboardStats {
  totalCategories: number
  activeCategories: number
  totalDishes: number
  totalViews: number
  availableDishes: number
}

interface RecentActivity {
  _id: string
  type: 'dish' | 'menu' | 'view' | 'qr'
  action: string
  createdAt: string
}

interface DashboardData {
  stats: DashboardStats
  recentActivity: RecentActivity[]
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [data, setData] = useState<DashboardData>({
    stats: {
      totalCategories: 0,
      activeCategories: 0,
      totalDishes: 0,
      totalViews: 0,
      availableDishes: 0,
    },
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/dashboard/stats')
        if (!response.ok) throw new Error('Failed to fetch dashboard stats')
        const result = await response.json()
        setData({
          stats: result.stats,
          recentActivity: result.recentActivity?.slice(0, itemsPerPage) || []
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const quickActions = [
    {
      title: 'Ajouter un Plat',
      description: 'Créer un nouveau plat pour vos menus',
      icon: UtensilsCrossed,
      href: '/dashboard/plats',
      color: 'bg-blue-500'
    },
    {
      title: 'Nouveau Categorie',
      description: 'Créer une nouvelle categorie pour votre restaurant',
      icon: BookOpen,
      href: '/dashboard/categories',
      color: 'bg-green-500'
    },
    {
      title: 'Générer QR Code',
      description: 'Créer un QR code pour vos menus',
      icon: QrCode,
      href: '/dashboard/qrcode',
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Bonjour, {session?.user?.name?.split(' ')[0] || 'Restaurateur'} !
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Voici un aperçu de votre restaurant aujourd&apos;hui.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 text-right flex items-center space-x-2 sm:flex-col">
            <p className="text-sm text-gray-500 dark:text-gray-400">Aujourd&apos;hui</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {new Date().toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Categories"
          value={data.stats.totalCategories}
          subValue={`${data.stats.activeCategories} actifs`}
          icon={BookOpen}
          iconColor="text-blue-600"
          bgColor="bg-blue-100"
        />
        <StatsCard
          title="Total Plats"
          value={data.stats.totalDishes}
          subValue={`${data.stats.availableDishes} disponibles`}
          icon={UtensilsCrossed}
          iconColor="text-green-600"
          bgColor="bg-green-100"
        />
        <StatsCard
          title="Vues Totales"
          value={data.stats.totalViews.toLocaleString()}
          subValue="Cette semaine"
          icon={Eye}
          iconColor="text-purple-600"
          bgColor="bg-purple-100"
        />
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="flex flex-col gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Actions Rapides</h2>
              <Plus className="h-5 w-5 text-gray-400 dark:text-gray-300" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <QuickActionCard key={index} {...action} />
              ))}
            </div>
          </div>
        </div>

        <RecentActivityList
          activities={data.recentActivity}
          loading={loading}
        />
      </div>

      {/* Getting Started */}
      {data.stats.totalCategories === 0 && data.stats.totalDishes === 0 && (
        <GettingStarted />
      )}
    </div>
  )
}