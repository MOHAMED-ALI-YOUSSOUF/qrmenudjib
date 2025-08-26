'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search, ChevronLeft, ChevronRight, MapPin,
  Instagram, Facebook, MessageCircle, ArrowUp, Phone
} from 'lucide-react';
import { urlFor } from '@/sanity/lib/image';

interface Dish {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: any;
}

interface Category {
  _id: string;
  name: string;
  slug: any;
  image?: any;
  dishes: Dish[];
}

interface Restaurant {
  _id: string;
  name: string;
  slug: any;
  logo?: any;
  coverImage?: any;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  phone?: string;
  adresse?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  categories: Category[];
}

interface RestaurantPageProps {
  restaurant: Restaurant;
}

/** --- Dish Card --- */
const DishCard: React.FC<{ dish: Dish; color: string }> = ({ dish, color }) => (
  <div className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition">
    <div className="relative h-48 md:h-56">
      {dish.image ? (
        <Image
          src={urlFor(dish.image).url()}
          alt={dish.name}
          fill
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white text-4xl" style={{ backgroundColor: color + '60' }}>
          🍽️
        </div>
      )}
    </div>
    <div className="p-4 md:p-6 flex flex-col sm:flex-row items-center gap-3">
      <h4 className="flex-1 text-lg md:text-xl text-gray-800 font-medium truncate">
        {dish.name}
      </h4>
      <div className="text-sm md:text-base font-bold text-white rounded-xl py-2 px-4 shrink-0" style={{ backgroundColor: color }}>
        {dish.price} fdj
      </div>
    </div>
  </div>
);

/** --- Category Header --- */
const CategoryHeader: React.FC<{ category: Category; color: string }> = ({ category, color }) => (
  <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm">
    <div className="sm:w-16 w-12 sm:h-16 h-12 rounded-2xl overflow-hidden shadow-sm bg-gray-100 flex-shrink-0">
      {category.image ? (
        <Image
          src={urlFor(category.image).url()}
          alt={category.name}
          width={100}
          height={100}
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white text-xl" style={{ backgroundColor: color }}>
          🍽️
        </div>
      )}
    </div>
    <div className="flex-1 flex justify-between items-center">
      <h3 className="sm:text-2xl font-bold text-gray-800">{category.name}</h3>
      <span className="text-sm md:text-base text-white px-3 py-1 rounded-full" style={{ backgroundColor: color }}>
        {category.dishes.length} plats
      </span>
    </div>
  </div>
);

/** --- MAIN PAGE --- */
export const RestaurantPage: React.FC<RestaurantPageProps> = ({ restaurant }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(restaurant.categories[0]?._id || '');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const categoryScrollerRef = useRef<HTMLDivElement | null>(null);
  const isScrolling = useRef(false);

  const colors = useMemo(() => ({
    primary: restaurant.primaryColor || '#f97316',
    secondary: restaurant.secondaryColor || '#1e3a8a',
    accent: restaurant.accentColor || '#fbbf24'
  }), [restaurant]);

  const filteredCategories = useMemo(() => {
    return restaurant.categories
      .map(category => ({
        ...category,
        dishes: category.dishes.filter(dish =>
          dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dish.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }))
      .filter(category => category.dishes.length > 0);
  }, [searchTerm, restaurant.categories]);

  /** Scroll synchronisation */
  const scrollToCategoryInBar = (categoryId: string) => {
    const element = categoryRefs.current[categoryId];
    const scroller = categoryScrollerRef.current;
    if (element && scroller) {
      const elementLeft = element.offsetLeft;
      const elementWidth = element.offsetWidth;
      const scrollerWidth = scroller.offsetWidth;
      scroller.scrollTo({
        left: elementLeft - scrollerWidth / 2 + elementWidth / 2,
        behavior: 'smooth',
      });
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const element = document.querySelector(`[data-category-id="${categoryId}"]`);
    if (element) {
      isScrolling.current = true;
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => { isScrolling.current = false; }, 1000);
    }
  };

  /** Observer pour détecter la catégorie visible */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const observer = new IntersectionObserver((entries) => {
      if (isScrolling.current) return;
      const visible = entries.find(e => e.isIntersecting && e.intersectionRatio > 0.5);
      if (visible) {
        const id = visible.target.getAttribute('data-category-id');
        if (id) {
          setSelectedCategory(id);
          scrollToCategoryInBar(id);
        }
      }
    }, { threshold: 0.5 });

    filteredCategories.forEach(cat => {
      const el = document.querySelector(`[data-category-id="${cat._id}"]`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [filteredCategories]);

  /** Défilement horizontal catégories */
  const scrollCategories = (dir: 'left' | 'right') => {
    if (categoryScrollerRef.current) {
      const scrollAmount = categoryScrollerRef.current.offsetWidth / 2;
      categoryScrollerRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen sm:container mx-auto" style={{ fontFamily: restaurant.fontFamily || 'system-ui' }}>

      {/* Header avec image de couverture et logo */}
      <div className="relative h-[60vh] bg-black overflow-hidden">

        {/* Image de couverture */}
        {restaurant.coverImage && (
          <div className="h-[60%] relative w-full">
            <Image
              src={urlFor(restaurant.coverImage).url()}
              alt={restaurant.name}
              fill
              className="object-cover object-center w-full"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          </div>
        )}

        {/* Contenu principal */}
        <div className="absolute inset-0 flex flex-col">
          <div className="flex-1" /> {/* espace réservé pour l’image */}

          {/* Card en bas avec glass effect */}
          <div className="relative z-50 px-5 pb-8">
            <div className="rounded-3xl bg-purple/40 backdrop-blur-xs border border-white/10 p-5 md:p-8 shadow-2xl">

              {/* Logo + Nom */}
              <div className="flex items-center gap-4 mb-6">
                {restaurant.logo && (
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden bg-white shadow-lg flex-shrink-0">
                    <Image
                      src={urlFor(restaurant.logo).url()}
                      alt={`${restaurant.name} logo`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}

                <div className="flex-1">
                  <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                    {restaurant.name}
                  </h1>
                  <div className="w-14 h-1 bg-red-500 rounded mt-1" />
                </div>
              </div>

              {/* Adresse */}
              {restaurant.adresse && (
                <div className="flex items-center gap-2 mb-6 text-sm text-white/80">
                  <MapPin className="w-4 h-4 text-red-400" />
                  <span>{restaurant.adresse}</span>
                </div>
              )}

              {/* Actions principales */}
              <div className="space-y-3 mb-6">
                {restaurant.whatsapp && (
                  <Link
                    href={`https://wa.me/${restaurant.whatsapp}`}
                    target="_blank"
                    className="flex items-center justify-center gap-3 w-full py-3 rounded-xl font-medium text-white bg-green-500 hover:bg-green-600 active:scale-95 transition"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Contacter sur WhatsApp
                  </Link>
                )}

                {restaurant.phone && (
                  <Link
                    href={`tel:${restaurant.phone}`}
                    className="flex items-center justify-center gap-3 w-full py-3 rounded-xl font-medium text-white hover:opacity-90 active:scale-95 transition"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Phone className="w-5 h-5" />
                    Appeler maintenant
                  </Link>
                )}
              </div>

              {/* Réseaux sociaux */}
              <div className="flex justify-center gap-4">
                {restaurant.facebook && (
                  <Link
                    href={restaurant.facebook}
                    target="_blank"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-blue-500 hover:text-white text-blue-400 transition"
                  >
                    <Facebook className="w-5 h-5" />
                  </Link>
                )}

                {restaurant.instagram && (
                  <Link
                    href={restaurant.instagram}
                    target="_blank"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-pink-500 hover:text-white text-pink-400 transition"
                  >
                    <Instagram className="w-5 h-5" />
                  </Link>
                )}

                {restaurant.tiktok && (
                  <Link
                    href={restaurant.tiktok}
                    target="_blank"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-gray-800 hover:text-white text-white transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      className="w-5 h-5 fill-white"
                    >
                      <path d="M448,209.9c-58.6,13.5-123.8,5.5-172.3-22.6V319.4c0,105.4-85.4,190.9-190.9,190.9S-106.1,424.8-106.1,319.4s85.4-190.9,190.9-190.9c10.5,0,20.8,0.9,30.8,2.6v94.3c-9.9-4.3-20.9-6.7-32.4-6.7c-43.8,0-79.4,35.6-79.4,79.4s35.6,79.4,79.4,79.4s79.4-35.6,79.4-79.4V0h111.6C271.9,60.8,319.4,108.3,380.2,108.3V209.9z" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* 🔎 Barre recherche */}
      <div className="bg-white border-b px-6 py-4">
        <div className="relative max-w-lg mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher dans le menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:bg-white transition"
            style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
          />
        </div>
      </div>

      {/* 🟠 Barre catégories */}
      <div className="sticky top-0 z-40 bg-white shadow-md">
        <div className="flex items-center justify-between px-4 pt-2">
          <h2 className="text-base md:text-xl font-bold">Catégories</h2>
          <div className="flex gap-2">
            <button onClick={() => scrollCategories('left')} className="p-2 rounded-full bg-gray-50 hover:bg-gray-100">
              <ChevronLeft className="w-3 h-3" />
            </button>
            <button onClick={() => scrollCategories('right')} className="p-2 rounded-full bg-gray-50 hover:bg-gray-100">
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
        <div ref={categoryScrollerRef} className="flex gap-6 overflow-x-auto p-4 scrollbar-hide  ">
          {restaurant.categories.map(cat => (
            <button
              key={cat._id}
              onClick={() => handleCategoryClick(cat._id)}
              ref={el => categoryRefs.current[cat._id] = el}
              className={`flex flex-col items-center min-w-[100px] md:min-w-[120px] rounded-lg p-2 transition 
                ${
                selectedCategory === cat._id ? 'bg-orange-100 shadow-md scale-105' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              style={{
          backgroundColor: selectedCategory === cat._id ? colors.primary + "20" : "#f3f4f6", // bg dynamique
          boxShadow: selectedCategory === cat._id ? `0 2px 8px ${colors.primary}40` : undefined,
          transform: selectedCategory === cat._id ? "scale(1.05)" : "scale(1)",
        }}
            >
              <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full overflow-hidden mb-2 shadow-md">
                {cat.image ? (
                 <Image src={urlFor(cat.image).url()} alt={cat.name} width={100} height={100} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white" style={{ backgroundColor: colors.primary }}>
                    🍽️
                  </div>
                )}
              </div>
              <span className={`text-xs md:text-sm font-semibold ${selectedCategory === cat._id ? 'text-orange-600' : 'text-gray-700'}`}
               >
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 🥘 Plats */}
      <div className="px-2 py-6 space-y-12">
        {filteredCategories.map(cat => (
          <div key={cat._id} data-category-id={cat._id} className="space-y-6">
            <CategoryHeader category={cat} color={colors.primary} />
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cat.dishes.map(dish => (
                <DishCard key={dish._id} dish={dish} color={colors.primary} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 🔝 Remonter en haut */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 text-white p-3 rounded-full shadow-2xl hover:scale-110 transition"
        style={{ backgroundColor: colors.secondary }}
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </div>
  );
};
