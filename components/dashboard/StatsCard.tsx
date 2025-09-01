'use client'

import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: number
  icon: LucideIcon
  iconColor: string
  bgColor: string
}

export default function StatsCard({ title, value, icon: Icon, iconColor, bgColor }: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={`h-10 w-10 ${bgColor} rounded-lg flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  )
}