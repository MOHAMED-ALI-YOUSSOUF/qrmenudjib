

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { urlFor } from '@/sanity/lib/image';

// Types
interface Restaurant {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
  logo?: any;
  coverImage?: any;
  whatsapp?: string;
  adresse?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
}

interface Dish {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
  price: number;
  image?: any;
  allergens?: string[];
  isPopular?: boolean;
  category: {
    _id: string;
    slug: { current: string };
  };
}

interface GroupedCategory {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
  order: number;
  dishes: Dish[];
}

interface Props {
  restaurant: Restaurant;
  groupedDishes: GroupedCategory[];
}

// Hero Section Component
function HeroSection({ restaurant }: { restaurant: Restaurant }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const coverImageUrl = restaurant.coverImage
    ? urlFor(restaurant.coverImage).width(1200).height(600).url()
    : null;

  const logoUrl = restaurant.logo
    ? urlFor(restaurant.logo).width(120).height(120).url()
    : null;

  const whatsappUrl = restaurant.whatsapp
    ? `https://wa.me/${restaurant.whatsapp.replace(/[^0-9]/g, '')}`
    : null;

  const mapsUrl = restaurant.adresse
    ? `https://maps.google.com/?q=${encodeURIComponent(restaurant.adresse)}`
    : null;

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Organic gradient background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br opacity-30 transition-all duration-1000 ${
          isLoaded ? 'scale-100' : 'scale-110'
        }`}
        style={{
          background: `radial-gradient(circle at 30% 30%, ${restaurant.primaryColor || '#FF6B6B'}80, transparent 70%), radial-gradient(circle at 70% 70%, ${restaurant.secondaryColor || '#4ECDC4'}80, transparent 70%)`,
        }}
      />

      {/* Cover image */}
      {coverImageUrl && (
        <Image
          src={coverImageUrl}
          alt={`${restaurant.name} cover`}
          fill
          className={`object-cover opacity-50 transition-all duration-1000 ${
            isLoaded ? 'scale-100' : 'scale-110'
          }`}
          priority
        />
      )}

      {/* Decorative organic shapes */}
      <div
        className={`absolute top-20 right-20 w-40 h-40 rounded-[2rem] opacity-20 blur-2xl animate-pulse transition-all duration-1000 ${
          isLoaded ? 'translate-x-0' : 'translate-x-10'
        }`}
        style={{ backgroundColor: restaurant.primaryColor || '#FF6B6B' }}
      />
      <div
        className={`absolute bottom-20 left-20 w-32 h-32 rounded-[2rem] opacity-30 blur-xl animate-bounce delay-300 transition-all duration-1000 ${
          isLoaded ? 'translate-x-0' : '-translate-x-10'
        }`}
        style={{ backgroundColor: restaurant.accentColor || '#45B7D1' }}
      />

      {/* Main content */}
      <div
        className={`relative z-10 text-center px-6 max-w-3xl transition-all duration-1000 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Logo with bounce animation */}
        {logoUrl && (
          <div className="mb-8 animate-bounce">
            <div className="mx-auto w-28 h-28 md:w-36 md:h-36 rounded-[2rem] overflow-hidden ring-4 ring-white/80 shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <Image
                src={logoUrl}
                alt={`${restaurant.name} logo`}
                width={144}
                height={144}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Restaurant name */}
        <h1
          className="text-5xl md:text-7xl font-extrabold mb-6 text-white drop-shadow-xl tracking-tight"
          style={{ fontFamily: restaurant.fontFamily || 'inherit' }}
        >
          {restaurant.name}
        </h1>

        {/* Description */}
        {restaurant.description && (
          <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed font-medium">
            {restaurant.description}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap justify-center gap-6">
          {whatsappUrl && (
            <Link
              href={whatsappUrl}
              target="_blank"
              className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-[1rem] font-semibold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="text-2xl">💬</span>
              Contactez-nous
            </Link>
          )}
          {mapsUrl && (
            <Link
              href={mapsUrl}
              target="_blank"
              className="flex items-center gap-3 bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-[1rem] font-semibold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="text-2xl">📍</span>
              Voir la carte
            </Link>
          )}
        </div>

        {/* Social media links */}
        <div className="flex justify-center gap-6 mt-8">
          {restaurant.instagram && (
            <Link
              href={`https://instagram.com/${restaurant.instagram.replace(/^@/, '')}`}
              target="_blank"
              className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-[1rem] flex items-center justify-center text-white text-2xl hover:scale-110 transition-transform duration-300 shadow-lg"
            >
              📷
            </Link>
          )}
          {restaurant.facebook && (
            <Link
              href={restaurant.facebook}
              target="_blank"
              className="w-14 h-14 bg-blue-600 rounded-[1rem] flex items-center justify-center text-white text-2xl hover:scale-110 transition-transform duration-300 shadow-lg"
            >
              📘
            </Link>
          )}
          {restaurant.tiktok && (
            <Link
              href={restaurant.tiktok}
              target="_blank"
              className="w-14 h-14 bg-black rounded-[1rem] flex items-center justify-center text-white text-2xl hover:scale-110 transition-transform duration-300 shadow-lg"
            >
              🎵
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// Sticky Navigation with Scroll Spy
function StickyNavigation({
  groupedDishes,
  restaurant,
}: {
  groupedDishes: GroupedCategory[];
  restaurant: Restaurant;
}) {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = groupedDishes.map((group) => group.slug.current);

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Set initial active section
    return () => window.removeEventListener('scroll', handleScroll);
  }, [groupedDishes]);

  const handleNavClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 120; // Account for sticky nav height
      const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <nav
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm"
      style={{ fontFamily: restaurant.fontFamily || 'inherit' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {groupedDishes.map((group, index) => (
            <button
              key={group._id}
              onClick={() => handleNavClick(group.slug.current)}
              className={`whitespace-nowrap px-6 py-3 rounded-[1rem] font-semibold text-base transition-all hover:scale-105 flex items-center gap-3 shadow-sm ${
                activeSection === group.slug.current
                  ? 'scale-105 shadow-md'
                  : 'hover:shadow-md'
              }`}
              style={{
                backgroundColor:
                  activeSection === group.slug.current
                    ? restaurant.primaryColor || '#FF6B6B'
                    : `${restaurant.primaryColor || '#FF6B6B'}20`,
                color:
                  activeSection === group.slug.current
                    ? 'white'
                    : restaurant.primaryColor || '#FF6B6B',
                border: `2px solid ${
                  restaurant.primaryColor || '#FF6B6B'
                }${activeSection === group.slug.current ? '' : '40'}`,
              }}
            >
              <span className="text-xl">{['🥗', '🍝', '🥩', '🍰', '☕'][index % 5]}</span>
              {group.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

// Allergen Badge Component
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
    lupin: '🌿',
  };

  return (
    <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-orange-200 transition-colors">
      {allergenEmojis[allergen.toLowerCase()] || '⚠️'}
      {allergen}
    </span>
  );
}

// Dish Card Component with animations
function DishCard({ dish, primaryColor }: { dish: Dish; primaryColor?: string }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), Math.random() * 300);
    return () => clearTimeout(timer);
  }, []);

  const imageUrl = dish.image
    ? urlFor(dish.image).width(400).height(250).url()
    : null;

  return (
    <div
      className={`bg-white rounded-[1.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-2 hover:border-opacity-80 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ borderColor: primaryColor || '#FF6B6B' }}
    >
      {/* Image */}
      <div className="relative h-56 bg-gray-50 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={dish.name}
            fill
            className="object-cover hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-7xl bg-gradient-to-br from-gray-100 to-gray-200">
            🍽️
          </div>
        )}
        {/* Popular badge */}
        {dish.isPopular && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1.5 rounded-[1rem] text-sm font-bold animate-pulse">
            🔥 Populaire
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Name and price */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-xl text-gray-800 leading-tight">
            {dish.name}
          </h3>
          <span
            className="font-bold text-2xl ml-3 whitespace-nowrap"
            style={{ color: primaryColor || '#FF6B6B' }}
          >
            {dish.price.toFixed(2)}€
          </span>
        </div>

        {/* Description */}
        {dish.description && (
          <p className="text-gray-600 text-base mb-4 leading-relaxed">
            {dish.description}
          </p>
        )}

        {/* Allergens */}
        {dish.allergens && dish.allergens.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {dish.allergens.map((allergen) => (
              <AllergenBadge key={allergen} allergen={allergen} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Main Client Component
export default function RestaurantClient({ restaurant, groupedDishes }: Props) {
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowWhatsApp(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {/* CSS Variables for custom colors */}
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
          animation: fadeInUp 0.8s ease-out;
        }
      `}</style>

      {/* Hero Section */}
      <HeroSection restaurant={restaurant} />

      {/* Sticky Navigation */}
      <StickyNavigation groupedDishes={groupedDishes} restaurant={restaurant} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {groupedDishes.length === 0 ? (
          <p className="text-center text-gray-500 text-xl mt-12 animate-fade-in-up">
            Aucun plat disponible pour le moment. 😔
          </p>
        ) : (
          groupedDishes.map((group) => (
            <section
              key={group._id}
              id={group.slug.current}
              className="mb-16 scroll-mt-24"
            >
              {/* Category title */}
              <div className="text-center mb-10 animate-fade-in-up">
                <div className="inline-flex items-center gap-6 mb-6">
                  <div
                    className="w-16 h-1 rounded-full transition-all duration-500 hover:w-24"
                    style={{ backgroundColor: restaurant.secondaryColor || '#4ECDC4' }}
                  />
                  <h2
                    className="text-4xl md:text-5xl font-extrabold hover:scale-105 transition-transform cursor-default"
                    style={{ color: restaurant.primaryColor || '#FF6B6B' }}
                  >
                    {group.name}
                  </h2>
                  <div
                    className="w-16 h-1 rounded-full transition-all duration-500 hover:w-24"
                    style={{ backgroundColor: restaurant.secondaryColor || '#4ECDC4' }}
                  />
                </div>

                {group.description && (
                  <p
                    className="text-gray-600 text-lg max-w-3xl mx-auto"
                    style={{ fontFamily: restaurant.fontFamily || 'inherit' }}
                  >
                    {group.description}
                  </p>
                )}
              </div>

              {/* Dish grid or empty message */}
              {group.dishes.length === 0 ? (
                <p className="text-center text-gray-500 text-lg animate-fade-in-up">
                  Aucun plat disponible dans cette catégorie. 😔
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      {/* Floating WhatsApp Button */}
      {restaurant.whatsapp && (
        <Link
          href={`https://wa.me/${restaurant.whatsapp.replace(/[^0-9]/g, '')}`}
          target="_blank"
          className={`fixed bottom-8 right-8 w-16 h-16 bg-green-500 hover:bg-green-600 rounded-[1rem] flex items-center justify-center text-white text-3xl shadow-xl hover:scale-110 transition-all z-50 ${
            showWhatsApp ? 'animate-bounce opacity-100' : 'opacity-0 scale-0'
          }`}
        >
          💬
        </Link>
      )}

      {/* Footer */}
      <footer
        className="mt-20 py-12 text-white"
        style={{
          background: `linear-gradient(135deg, ${restaurant.primaryColor || '#FF6B6B'}, ${restaurant.secondaryColor || '#4ECDC4'})`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3
            className="text-2xl font-bold mb-4 hover:scale-105 transition-transform cursor-default"
            style={{ fontFamily: restaurant.fontFamily || 'inherit' }}
          >
            {restaurant.name}
          </h3>

          {restaurant.adresse && (
            <p className="mb-6 flex items-center justify-center gap-3 hover:scale-105 transition-transform text-lg">
              <span>📍</span>
              {restaurant.adresse}
            </p>
          )}

          <div className="flex justify-center gap-6 mb-6">
            {restaurant.instagram && (
              <Link
                href={`https://instagram.com/${restaurant.instagram.replace(/^@/, '')}`}
                target="_blank"
                className="w-12 h-12 bg-white/10 rounded-[1rem] flex items-center justify-center text-2xl hover:scale-125 transition-transform backdrop-blur-sm"
              >
                📷
              </Link>
            )}
            {restaurant.facebook && (
              <Link
                href={restaurant.facebook}
                target="_blank"
                className="w-12 h-12 bg-white/10 rounded-[1rem] flex items-center justify-center text-2xl hover:scale-125 transition-transform backdrop-blur-sm"
              >
                📘
              </Link>
            )}
            {restaurant.tiktok && (
              <Link
                href={restaurant.tiktok}
                target="_blank"
                className="w-12 h-12 bg-white/10 rounded-[1rem] flex items-center justify-center text-2xl hover:scale-125 transition-transform backdrop-blur-sm"
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
  );
}
