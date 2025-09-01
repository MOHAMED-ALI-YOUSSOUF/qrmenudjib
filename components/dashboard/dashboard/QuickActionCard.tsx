'use client'

import Link from 'next/link'
import { LucideIcon, ArrowUpRight } from 'lucide-react'

interface QuickActionCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
  color: string
}

export default function QuickActionCard({ title, description, icon: Icon, href, color }: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className="group p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-orange-300 dark:hover:border-orange-500 hover:shadow-md transition-all duration-200"
    >
      <div className={`h-10 w-10 ${color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h3 className="font-medium text-gray-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
      <ArrowUpRight className="h-4 w-4 text-gray-400 dark:text-gray-300 mt-2 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors" />
    </Link>
  )
}