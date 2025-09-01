'use client'

import { Eye, UtensilsCrossed, BookOpen, QrCode, Plus, Clock, Calendar } from 'lucide-react'

interface RecentActivity {
  _id: string
  type: 'dish' | 'menu' | 'view' | 'qr'
  action: string
  createdAt: string
}

interface RecentActivityListProps {
  activities: RecentActivity[]
  loading: boolean
}

export default function RecentActivityList({ activities, loading }: RecentActivityListProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'dish': return <UtensilsCrossed className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      case 'view': return <Eye className="h-4 w-4 text-green-600 dark:text-green-400" />
      case 'menu': return <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
      case 'qr': return <QrCode className="h-4 w-4 text-orange-600 dark:text-orange-400" />
      default: return <Plus className="h-4 w-4 text-gray-600 dark:text-gray-300" />
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Activité Récente</h2>
        <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-300" />
      </div>

      {loading ? (
        <div className="text-center py-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">Chargement...</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-6">
          <Clock className="h-8 w-8 text-gray-300 dark:text-gray-500 mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Aucune activité récente</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity._id} className="flex items-start space-x-3">
              <div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-white">
                  Client {activity.action}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {new Date(activity.createdAt).toLocaleDateString('fr-FR', {
                    weekday: 'short',
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Clock className="h-3 w-3 mr-1" />
                {new Date(activity.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}