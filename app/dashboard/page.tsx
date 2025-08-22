'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  TrendingUp,
  Users,
  Eye,
  BookOpen,
  UtensilsCrossed,
  QrCode,
  Plus,
  ArrowUpRight,
  Calendar,
  Clock
} from 'lucide-react'

interface DashboardStats {
  totalMenus: number;
  totalDishes: number;
  totalViews: number;
  weeklyViews: number;
  activeMenus: number;
  availableDishes: number;
  popularDishes: number;
  averagePrice: number;
}

interface RecentActivity {
  _id: string;
  type: 'dish' | 'menu' | 'view' | 'qr';
  action: string;
  itemName: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats>({
    totalMenus: 0,
    totalDishes: 0,
    totalViews: 0,
    weeklyViews: 0,
    activeMenus: 0,
    availableDishes: 0,
    popularDishes: 0,
    averagePrice: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setRecentActivity(data.recentActivity || [])
      } else {
        console.error('Failed to fetch dashboard stats')
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: 'Ajouter un Plat',
      description: 'Créer un nouveau plat pour vos menus',
      icon: UtensilsCrossed,
      href: '/dashboard/plats',
      color: 'bg-blue-500'
    },
    {
      title: 'Nouveau Menu',
      description: 'Créer un menu pour votre restaurant',
      icon: BookOpen,
      href: '/dashboard/menus',
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'dish': return <UtensilsCrossed className="h-4 w-4 text-blue-600" />
      case 'view': return <Eye className="h-4 w-4 text-green-600" />
      case 'menu': return <BookOpen className="h-4 w-4 text-purple-600" />
      case 'qr': return <QrCode className="h-4 w-4 text-orange-600" />
      default: return <Plus className="h-4 w-4 text-gray-600" />
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'À l\'instant'
    if (diffInHours < 24) return `${diffInHours}h`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}j`
    return `${Math.floor(diffInDays / 7)}sem`
  }

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return Math.round(((current - previous) / previous) * 100)
  }

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-64">
  //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
  //     </div>
  //   )
  // }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Bonjour, {session?.user?.name?.split(' ')[0] || 'Restaurateur'} !
            </h1>
            <p className="text-gray-600 mt-1">
              Voici un aperçu de votre restaurant aujourd'hui.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Aujourd'hui</p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date().toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Menus Créés</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalMenus}</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stats.activeMenus} actifs
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Plats</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalDishes}</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stats.availableDishes} disponibles
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UtensilsCrossed className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vues Totales</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalViews.toLocaleString()}
              </p>
              <p className="text-xs text-purple-600 flex items-center mt-1">
                <Eye className="h-3 w-3 mr-1" />
                Cette semaine
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Prix Moyen</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.averagePrice.toFixed(2)}€
              </p>
              <p className="text-xs text-orange-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stats.popularDishes} populaires
              </p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-orange-600 font-bold text-lg">€</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Actions Rapides</h2>
              <Plus className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Link
                    key={index}
                    href={action.href}
                    className="group p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className={`h-10 w-10 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                    <ArrowUpRight className="h-4 w-4 text-gray-400 mt-2 group-hover:text-orange-500 transition-colors" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Activité Récente</h2>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <div className="text-center py-6">
                <Clock className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Aucune activité récente</p>
              </div>
            ) : (
              recentActivity.map((activity) => (
                <div key={activity._id} className="flex items-start space-x-3">
                  <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600 truncate">{activity.itemName}</p>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTimeAgo(activity.createdAt)}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6">
            <Link
              href="/dashboard/settings"
              className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center"
            >
              Voir toute l'activité
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Getting Started */}
      {stats.totalMenus === 0 && stats.totalDishes === 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Commencez par créer votre premier menu !
              </h3>
              <p className="text-gray-600 mb-4">
                Ajoutez vos plats, organisez-les en catégories et générez un QR code pour vos clients.
              </p>
              <div className="flex space-x-3">
                <Link
                  href="/dashboard/plats"
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Ajouter un Plat
                </Link>
                <Link
                  href="/dashboard/menus"
                  className="bg-white text-orange-600 px-4 py-2 rounded-lg border border-orange-200 hover:bg-orange-50 transition-colors"
                >
                  Créer un Menu
                </Link>
              </div>
            </div>
            <div className="text-4xl">🚀</div>
          </div>
        </div>
      )}

      {/* Performance Overview */}
      {stats.totalMenus > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Aperçu des performances</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {Math.round((stats.activeMenus / stats.totalMenus) * 100)}%
              </div>
              <p className="text-sm text-gray-600">Menus actifs</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {Math.round((stats.availableDishes / stats.totalDishes) * 100)}%
              </div>
              <p className="text-sm text-gray-600">Plats disponibles</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {stats.weeklyViews}
              </div>
              <p className="text-sm text-gray-600">Vues cette semaine</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}