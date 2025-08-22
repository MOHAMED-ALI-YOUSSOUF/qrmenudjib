'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, Store } from 'lucide-react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    whatsapp: '',
    restaurantName: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)
  const [phone, setPhone] = useState("");
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (step === 1) {
    const password = formData.password.trim();
    const confirmPassword = formData.confirmPassword.trim();

    // Vérification correspondance des mots de passe
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    // Vérification complexité du mot de passe
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre"
      );
      return;
    }

    // Vérification numéro WhatsApp
   

    // const trimmedPhone = phone.replace(/\s+/g, ''); // supprimer les espaces
    if (!phone ) {
      setError('Veuillez entrer un numéro WhatsApp valide');
      return;
    }

    // Mettre à jour formData avec les valeurs correctes
    setFormData((prev) => ({
      ...prev,
      password,
      confirmPassword,
      whatsapp: phone,
    }));

    setError('');
    setStep(2);
    return;
  }

  // Soumission finale
  setIsLoading(true);
  setError('');
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Erreur lors de l'inscription");
    router.push('/auth/confirmation');
  } catch (error: any) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const goBack = () => {
    setStep(1)
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🍽️</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {step === 1 ? 'Créer un compte' : 'Votre restaurant'}
            </h2>
            <p className="mt-2 text-gray-600">
              {step === 1 
                ? 'Commencez votre aventure culinaire'
                : 'Quelques informations sur votre établissement'}
            </p>
            <div className="flex items-center justify-center mt-4 space-x-2">
              <div className={`h-2 w-2 rounded-full ${step >= 1 ? 'bg-orange-500' : 'bg-gray-300'}`} />
              <div className={`h-1 w-8 ${step >= 2 ? 'bg-orange-500' : 'bg-gray-300'}`} />
              <div className={`h-2 w-2 rounded-full ${step >= 2 ? 'bg-orange-500' : 'bg-gray-300'}`} />
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <>
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Votre nom complet"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro WhatsApp
                  </label>
                  <PhoneInput
                    country={"dj"} // code pour Djibouti
                    value={phone}
                    onChange={(value) => setPhone(value)}
                    countryCodeEditable={false}
                    inputClass="!w-full !h-12 !text-base !pl-12 !rounded-xl"
                    buttonClass="!rounded-l-xl"
                    specialLabel=""
                    masks={{ dj: ".. .. .. .." }} // Format Djibouti : 77 10 08 46
                    placeholder="+253 77 19 61 32"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format valide : +253 77 XX XX XX
                  </p>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Au moins 8 caractères"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Confirmer votre mot de passe"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                {/* Restaurant Name */}
                <div>
                  <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du restaurant
                  </label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="restaurantName"
                      name="restaurantName"
                      type="text"
                      required
                      value={formData.restaurantName}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Le nom de votre restaurant"
                    />
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-orange-700 text-sm">
                    <strong>Information :</strong> Votre compte sera créé avec le statut &quot;En attente&quot;. 
                    Vous recevrez une notification dès que votre restaurant sera validé et activé.
                  </p>
                </div>
              </>
            )}

            <div className="flex space-x-4">
              {step === 2 && (
                <button
                  type="button"
                  onClick={goBack}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200"
                >
                  Retour
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className={`${step === 2 ? 'flex-1' : 'w-full'} bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Création...
                  </div>
                ) : step === 1 ? (
                  'Continuer'
                ) : (
                  'Créer mon compte'
                )}
              </button>
            </div>
          </form>

          {step === 1 && (
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Déjà un compte ?{' '}
                <Link href="/auth/signin" className="text-orange-600 hover:text-orange-700 font-medium">
                  Se connecter
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
