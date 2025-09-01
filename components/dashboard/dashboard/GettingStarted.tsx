'use client'

import Link from 'next/link'

export default function GettingStarted() {
  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900 dark:to-red-900 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Commencez par créer votre premier menu !
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Ajoutez vos plats, organisez-les en catégories et générez un QR code pour vos clients.
          </p>
          <div className="flex space-x-3">
            <Link
              href="/dashboard/plats"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors"
            >
              Ajouter un Plat
            </Link>
            <Link
              href="/dashboard/categories"
              className="bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-lg border border-orange-200 dark:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-800 transition-colors"
            >
              Créer un Categorie
            </Link>
          </div>
        </div>
        <div className="text-4xl">🚀</div>
      </div>
    </div>
  )
}