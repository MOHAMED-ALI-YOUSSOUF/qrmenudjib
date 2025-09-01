'use client'

import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: number | string
  subValue: string
  icon: LucideIcon
  iconColor: string
  bgColor: string
}

export default function StatsCard({ title, value, subValue, icon: Icon, iconColor, bgColor }: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
            {subValue}
          </p>
        </div>
        <div className={`h-12 w-12 ${bgColor} rounded-lg flex items-center justify-center`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  )
}