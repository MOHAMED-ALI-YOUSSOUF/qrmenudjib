'use client'

import Link from 'next/link'
import { CheckCircle, Clock, Mail, ArrowRight } from 'lucide-react'

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Compte créé avec succès !
            </h1>
            <p className="text-gray-600">
              Votre restaurant a été enregistré et est en attente de validation.
            </p>
          </div>

          {/* Status Cards */}
          <div className="space-y-4 mb-8">
            {/* User Status */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-green-800">Compte utilisateur</p>
                  <p className="text-sm text-green-600">Créé avec succès</p>
                </div>
              </div>
            </div>

            {/* Restaurant Status */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-orange-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-orange-800">Restaurant</p>
                  <p className="text-sm text-orange-600">En attente de validation</p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
              <div className="text-left">
                <p className="font-medium text-blue-800 mb-2">Prochaines étapes</p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Notre équipe va examiner votre demande</li>
                  <li>• Vous recevrez un email de confirmation</li>
                  <li>• La validation prend généralement 0-24 heures</li>
                  <li>• Vous pourrez alors accéder à votre dashboard</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              href="/auth/signin"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all inline-flex items-center justify-center group"
            >
              Aller à la connexion
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <div className="text-center">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-800 text-sm inline-flex items-center"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Des questions ? Contactez-nous à{' '}
              <a href="mailto:support@votresite.com" className="text-orange-600 hover:text-orange-700">
                support@votresite.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}