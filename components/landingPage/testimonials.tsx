// components/Testimonials.tsx
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { APP_NAME } from '@/lib/constants';

const testimonials = [
  {
    name: "Ahmed Hassan",
    restaurant: "Restaurant Palmier",
    image: "/api/placeholder/64/64",
    rating: 5,
    text: "Depuis QRMenu.dj, nos ventes ont augmenté de 35%. Les clients adorent la simplicité et nous gagnons un temps précieux. Le support local est exceptionnel!"
  },
  {
    name: "Fatima Ali", 
    restaurant: "Café des Épices",
    image: "/api/placeholder/64/64",
    rating: 5,
    text: "Interface parfaite et support client exceptionnel. Nos clients nous complimentent sur notre modernité ! Idéal pour notre clientèle internationale."
  },
  {
    name: "Omar Moussa",
    restaurant: "La Terrasse Djiboutienne", 
    image: "/api/placeholder/64/64",
    rating: 5,
    text: "Configuration en 5 minutes, résultats immédiats. Je recommande QRMenu.dj à tous les restaurateurs de Djibouti. Les analytics ont changé notre approche."
  },
  // Added more testimonials for more content
  {
    name: "Aisha Mohamed",
    restaurant: "Le Gourmet Oriental",
    image: "/api/placeholder/64/64",
    rating: 4.5,
    text: "Excellente intégration avec WhatsApp. Nos commandes ont doublé en un mois. Petit bémol sur l'apprentissage initial, mais le support a été rapide."
  },
  {
    name: "Yusuf Ibrahim",
    restaurant: "Saveurs d'Afrique",
    image: "/api/placeholder/64/64",
    rating: 5,
    text: "Parfait pour gérer plusieurs emplacements. Les mises à jour en temps réel nous sauvent la vie pendant les rushs."
  },
  {
    name: "Sara Khalid",
    restaurant: "Café Nomade",
    image: "/api/placeholder/64/64",
    rating: 5,
    text: "Les fonctionnalités multi-langues sont un game-changer pour Djibouti. Nos touristes apprécient vraiment!"
  },
];

export const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4">Témoignages</Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ce que disent nos clients
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez comment {APP_NAME} transforme l'expérience de nos restaurateurs partenaires à Djibouti et au-delà.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6">
                  {/* Rating stars */}
                  <div className="flex items-center mb-4">
                    {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                    {testimonial.rating % 1 !== 0 && (
                      <Star className="w-5 h-5 text-yellow-400 fill-current" style={{ clipPath: 'inset(0 50% 0 0)' }} />
                    )}
                  </div>
                  
                  {/* Testimonial text */}
                  <blockquote className="text-gray-700 mb-6 leading-relaxed italic">
                    "{testimonial.text}"
                  </blockquote>
                  
                  {/* Customer info */}
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.restaurant}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};