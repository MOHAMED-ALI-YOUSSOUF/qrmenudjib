"use client";

import { Card, CardContent } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";

const testimonials = [
  {
    name: "Ahmed Hassan",
    restaurant: "Restaurant Palmier",
    text: "Depuis QRMenu, nos ventes ont augmenté de 35%. Les clients adorent la simplicité et nous gagnons un temps précieux.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Fatima Ali",
    restaurant: "Café des Épices",
    text: "Interface parfaite et support client exceptionnel. Nos clients nous complimentent sur notre modernité !",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Omar Moussa",
    restaurant: "La Terrasse Djiboutienne",
    text: "Configuration en 5 minutes, résultats immédiats. Je recommande QRMenu à tous les restaurateurs de Djibouti.",
    avatar: "https://randomuser.me/api/portraits/men/56.jpg",
  },
  {
    name: "Aisha Mohamed",
    restaurant: "Le Gourmet Oriental",
    text: "Excellente intégration avec WhatsApp. Nos commandes ont doublé en un mois.",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    name: "Yusuf Ibrahim",
    restaurant: "Saveurs d'Afrique",
    text: "Parfait pour gérer plusieurs emplacements. Les mises à jour en temps réel nous sauvent la vie.",
    avatar: "https://randomuser.me/api/portraits/men/77.jpg",
  },
];

export  function Testimonials() {
  return (
    <div className="w-full overflow-hidden relative bg-white dark:bg-gray-900 py-10">
    {/* Titre et sous-titre */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Témoignages de nos clients
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Découvrez comment {APP_NAME} a transformé les restaurants à Djibouti et facilite la vie des restaurateurs.
        </p>
      </div>

      <div className="flex gap-6 animate-slide hover:pause">
        {[...testimonials, ...testimonials].map((t, i) => (
          <Card
            key={i}
            className="min-w-[250px] max-w-xs flex-shrink-0 shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <CardContent className="p-6 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {t.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    {t.restaurant}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-200">{t.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <style jsx>{`
        .animate-slide {
          display: flex;
          animation: slide 30s linear infinite;
        }
        .hover\\:pause:hover {
          animation-play-state: paused;
        }
        @keyframes slide {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
