'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { urlFor } from '@/sanity/lib/image'

// Types
interface Restaurant {
  _id: string
  name: string
  slug: { current: string }
  description?: string
  logo?: any
  coverImage?: any
  whatsapp?: string
  adresse?: string
  instagram?: string
  facebook?: string
  tiktok?: string
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  fontFamily?: string
}

interface Dish {
  _id: string
  name: string
  slug: { current: string }
  description?: string
  price: number
  image?: any
  allergens?: string[]
  isPopular?: boolean
  category: {
    _id: string
    slug: { current: string }
  }
}

interface GroupedCategory {
  _id: string
  name: string
  slug: { current: string }
  description?: string
  order: number
  dishes: Dish[]
}

interface Props {
  restaurant: Restaurant
  groupedDishes: GroupedCategory[]
}

// Composant Hero Section
function HeroSection({ restaurant }: { restaurant: Restaurant }) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const coverImageUrl = restaurant.coverImage 
    ? urlFor(restaurant.coverImage).width(1200).height(600).url()
    : null
  
  const logoUrl = restaurant.logo 
    ? urlFor(restaurant.logo).width(120).height(120).url()
    : null

  const whatsappUrl = restaurant.whatsapp 
    ? `https://wa.me/${restaurant.whatsapp.replace(/[^0-9]/g, '')}`
    : null

  const mapsUrl = restaurant.adresse 
    ? `https://maps.google.com/?q=${encodeURIComponent(restaurant.adresse)}`
    : null

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background avec gradient organique */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br opacity-20 transition-all duration-1000 ${isLoaded ? 'scale-100' : 'scale-110'}`}
        style={{
          background: `linear-gradient(135deg, ${restaurant.primaryColor || '#FF6B6B'}, ${restaurant.secondaryColor || '#4ECDC4'}, ${restaurant.accentColor || '#45B7D1'})`
        }}
      />
      
      {/* Image de couverture */}
      {coverImageUrl && (
        <Image
          src={coverImageUrl}
          alt={`${restaurant.name} cover`}
          fill
          className={`object-cover opacity-40 transition-all duration-1000 ${isLoaded ? 'scale-100' : 'scale-110'}`}
          priority
        />
      )}
      
      {/* Formes organiques décoratives */}
      <div 
        className={`absolute top-10 right-10 w-32 h-32 rounded-full opacity-30 blur-xl animate-pulse transition-all duration-1000 ${isLoaded ? 'translate-x-0' : 'translate-x-10'}`}
        style={{ backgroundColor: restaurant.primaryColor || '#FF6B6B' }}
      />
      <div 
        className={`absolute bottom-20 left-10 w-24 h-24 rounded-full opacity-40 blur-lg animate-bounce transition-all duration-1000 ${isLoaded ? 'translate-x-0' : '-translate-x-10'}`}
        style={{ backgroundColor: restaurant.accentColor || '#45B7D1' }}
      />
      
      {/* Contenu principal */}
      <div className={`relative z-10 text-center px-6 max-w-2xl transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Logo avec animation bounce */}
        {logoUrl && (
          <div className="mb-6 animate-bounce">
            <div className="mx-auto w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden ring-4 ring-white shadow-2xl transform hover:scale-110 transition-transform">
              <Image
                src={logoUrl}
                alt={`${restaurant.name} logo`}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
        
        {/* Nom du restaurant */}
        <h1 
          className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg"
          style={{ fontFamily: restaurant.fontFamily || 'inherit' }}
        >
          {restaurant.name}
        </h1>
        
        {/* Description */}
        {restaurant.description && (
          <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
            {restaurant.description}
          </p>
        )}
        
        {/* Boutons d'action */}
        <div className="flex flex-wrap justify-center gap-4">
          {whatsappUrl && (
            <Link
              href={whatsappUrl}
              target="_blank"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              <span className="text-xl">💬</span>
              WhatsApp
            </Link>
          )}
          
          {mapsUrl && (
            <Link
              href={mapsUrl}
              target="_blank"
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              <span className="text-xl">📍</span>
              Localisation
            </Link>
          )}
        </div>
        
        {/* Réseaux sociaux */}
        <div className="flex justify-center gap-4 mt-6">
          {restaurant.instagram && (
            <Link
              href={`https://instagram.com/${restaurant.instagram}`}
              target="_blank"
              className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl hover:scale-110 transition-transform shadow-lg"
            >
              📷
            </Link>
          )}
          {restaurant.facebook && (
            <Link
              href={restaurant.facebook}
              target="_blank"
              className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl hover:scale-110 transition-transform shadow-lg"
            >
              📘
            </Link>
          )}
          {restaurant.tiktok && (
            <Link
              href={restaurant.tiktok}
              target="_blank"
              className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white text-xl hover:scale-110 transition-transform shadow-lg"
            >
              🎵
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

// Composant Navigation Sticky avec Scroll Spy
function StickyNavigation({ 
  groupedDishes, 
  restaurant 
}: { 
  groupedDishes: GroupedCategory[]
  restaurant: Restaurant 
}) {
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      const sections = groupedDishes.map(group => group.slug.current)
      
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Set initial active section

    return () => window.removeEventListener('scroll', handleScroll)
  }, [groupedDishes])

  const handleNavClick = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 120 // Account for sticky nav height
      const top = element.getBoundingClientRect().top + window.pageYOffset - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {groupedDishes.map((group, index) => (
            <button
              key={group._id}
              onClick={() => handleNavClick(group.slug.current)}
              className={`whitespace-nowrap px-4 py-2 rounded-full font-medium transition-all hover:scale-105 flex items-center gap-2 shadow-md ${
                activeSection === group.slug.current 
                  ? 'scale-105 shadow-lg' 
                  : 'hover:shadow-md'
              }`}
              style={{
                backgroundColor: activeSection === group.slug.current 
                  ? restaurant.primaryColor || '#FF6B6B'
                  : `${restaurant.primaryColor || '#FF6B6B'}20`,
                color: activeSection === group.slug.current 
                  ? 'white'
                  : restaurant.primaryColor || '#FF6B6B',
                border: `2px solid ${restaurant.primaryColor || '#FF6B6B'}${activeSection === group.slug.current ? '' : '40'}`
              }}
            >
              <span className="text-lg">{['🥗', '🍝', '🥩', '🍰', '☕'][index % 5]}</span>
              {group.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

// Composant Badge Allergène
function AllergenBadge({ allergen }: { allergen: string }) {
  const allergenEmojis: Record<string, string> = {
    gluten: '🌾',
    eggs: '🥚',
    milk: '🥛',
    nuts: '🥜',
    fish: '🐟',
    shellfish: '🦐',
    soy: '🌱',
    celery: '🥬',
    mustard: '🌭',
    sesame: '🍃',
    sulfites: '🧪',
    lupin: '🌿'
  }

  return (
    <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium hover:bg-orange-200 transition-colors">
      {allergenEmojis[allergen] || '⚠️'}
      {allergen}
    </span>
  )
}

// Composant Card Plat avec animations
function DishCard({ dish, primaryColor }: { dish: Dish; primaryColor?: string }) {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), Math.random() * 500)
    return () => clearTimeout(timer)
  }, [])

  const imageUrl = dish.image 
    ? urlFor(dish.image).width(300).height(200).url()
    : null

  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border-2 hover:border-opacity-70 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}
         style={{ borderColor: primaryColor || '#FF6B6B' }}>
      
      {/* Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={dish.name}
            fill
            className="object-cover hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl hover:scale-110 transition-transform">
            🍽️
          </div>
        )}
        
        {/* Badge populaire */}
        {dish.isPopular && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
            🔥 Populaire
          </div>
        )}
      </div>
      
      {/* Contenu */}
      <div className="p-4">
        {/* Nom et prix */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-800 leading-tight">
            {dish.name}
          </h3>
          <span 
            className="font-bold text-xl ml-2 whitespace-nowrap"
            style={{ color: primaryColor || '#FF6B6B' }}
          >
            {dish.price}€
          </span>
        </div>
        
        {/* Description */}
        {dish.description && (
          <p className="text-gray-600 text-sm mb-3 leading-relaxed">
            {dish.description}
          </p>
        )}
        
        {/* Allergènes */}
        {dish.allergens && dish.allergens.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {dish.allergens.map((allergen) => (
              <AllergenBadge key={allergen} allergen={allergen} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Composant principal Client
export default function RestaurantClient({ restaurant, groupedDishes }: Props) {
  const [showWhatsApp, setShowWhatsApp] = useState(false)

  useEffect(() => {
    // Show WhatsApp button after a delay
    const timer = setTimeout(() => setShowWhatsApp(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Variables CSS pour les couleurs personnalisées */}
      <style jsx>{`
        :root {
          --primary-color: ${restaurant.primaryColor || '#FF6B6B'};
          --secondary-color: ${restaurant.secondaryColor || '#4ECDC4'};
          --accent-color: ${restaurant.accentColor || '#45B7D1'};
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>

      {/* Hero Section */}
      <HeroSection restaurant={restaurant} />

      {/* Navigation Sticky */}
      <StickyNavigation groupedDishes={groupedDishes} restaurant={restaurant} />

      {/* Contenu principal */}
      <main className="max-w-6xl mx-auto px-4 py-8">
  {groupedDishes.length === 0 ? (
    <p className="text-center text-gray-500 text-lg mt-12">
      Aucun plat disponible pour le moment. 😔
    </p>
  ) : (
    groupedDishes.map((group) => (
      <section
        key={group._id}
        id={group.slug.current}
        className="mb-12 scroll-mt-20"
      >
        {/* Titre de catégorie */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-4 mb-4">
            <div 
              className="w-12 h-1 rounded-full transition-all duration-500 hover:w-16"
              style={{ backgroundColor: restaurant.secondaryColor || '#4ECDC4' }}
            />
            <h2 
              className="text-3xl md:text-4xl font-bold hover:scale-105 transition-transform cursor-default"
              style={{ color: restaurant.primaryColor || '#FF6B6B' }}
            >
              {group.name}
            </h2>
            <div 
              className="w-12 h-1 rounded-full transition-all duration-500 hover:w-16"
              style={{ backgroundColor: restaurant.secondaryColor || '#4ECDC4' }}
            />
          </div>

          {group.description && (
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {group.description}
            </p>
          )}
        </div>

        {/* Grille de plats ou message si vide */}
        {group.dishes.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            Aucun plat disponible dans cette catégorie. 😔
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {group.dishes.map((dish) => (
              <DishCard 
                key={dish._id} 
                dish={dish} 
                primaryColor={restaurant.primaryColor}
              />
            ))}
          </div>
        )}
      </section>
    ))
  )}
</main>


      {/* Bouton WhatsApp flottant avec animation d'entrée */}
      {restaurant.whatsapp && (
        <Link
          href={`https://wa.me/${restaurant.whatsapp.replace(/[^0-9]/g, '')}`}
          target="_blank"
          className={`fixed bottom-6 right-6 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg hover:scale-110 transition-all z-50 ${
            showWhatsApp ? 'animate-bounce opacity-100' : 'opacity-0 scale-0'
          }`}
        >
          💬
        </Link>
      )}

      {/* Footer */}
      <footer 
        className="mt-16 py-8 text-white"
        style={{ 
          background: `linear-gradient(135deg, ${restaurant.primaryColor || '#FF6B6B'}, ${restaurant.secondaryColor || '#4ECDC4'})` 
        }}
      >
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-xl font-bold mb-2 hover:scale-105 transition-transform cursor-default">
            {restaurant.name}
          </h3>
          
          {restaurant.adresse && (
            <p className="mb-4 flex items-center justify-center gap-2 hover:scale-105 transition-transform">
              <span>📍</span>
              {restaurant.adresse}
            </p>
          )}
          
          <div className="flex justify-center gap-4 mb-4">
            {restaurant.instagram && (
              <Link
                href={`https://instagram.com/${restaurant.instagram}`}
                target="_blank"
                className="hover:scale-125 transition-transform text-2xl bg-white/10 rounded-full w-12 h-12 flex items-center justify-center backdrop-blur-sm"
              >
                📷
              </Link>
            )}
            {restaurant.facebook && (
              <Link
                href={restaurant.facebook}
                target="_blank"
                className="hover:scale-125 transition-transform text-2xl bg-white/10 rounded-full w-12 h-12 flex items-center justify-center backdrop-blur-sm"
              >
                📘
              </Link>
            )}
            {restaurant.tiktok && (
              <Link
                href={restaurant.tiktok}
                target="_blank"
                className="hover:scale-125 transition-transform text-2xl bg-white/10 rounded-full w-12 h-12 flex items-center justify-center backdrop-blur-sm"
              >
                🎵
              </Link>
            )}
          </div>
          
          <p className="text-sm opacity-80 hover:opacity-100 transition-opacity">
            © 2025 {restaurant.name}. Menu numérique QR.
          </p>
        </div>
      </footer>
    </div>
  )
}