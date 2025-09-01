// components/Pricing.tsx
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

const pricingPlans = [
  {
    name: "Gratuit",
    price: "0",
    period: "Toujours",
    description: "Parfait pour commencer et tester la plateforme",
    features: [
      "1 restaurant",
      "Menu illimité", 
      "QR code personnalisé",
      "Support par email",
      "Statistiques de base",
      "Intégration WhatsApp basique",
      "Mises à jour automatiques"
    ],
    popular: false,
    cta: "Commencer gratuitement"
  },
  {
    name: "Standard",
    price: "15",
    period: "/mois",
    description: "Pour restaurants établis avec besoins avancés",
    features: [
      "3 restaurants",
      "Analytics avancées",
      "Photos haute qualité", 
      "Support prioritaire",
      "Intégrations WhatsApp complètes",
      "Thèmes personnalisés",
      "Multi-langues",
      "Export de données",
      "Notifications push"
    ],
    popular: true,
    cta: "Essayer 14 jours gratuit"
  },
  {
    name: "Pro",
    price: "35",
    period: "/mois", 
    description: "Pour chaînes de restaurants et entreprises",
    features: [
      "Restaurants illimités",
      "API complète",
      "Support téléphonique 24/7",
      "Formation personnalisée",
      "Multi-langues avancées",
      "Rapports personnalisés",
      "Intégrations paiements",
      "Gestion d'équipe avancée",
      "Priorité sur les nouvelles features",
      "Stockage illimité"
    ],
    popular: false,
    cta: "Contactez-nous"
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4">Tarifs</Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choisissez votre formule
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Des tarifs transparents adaptés à tous les types de restaurants. Tous les plans sont flexibles et sans engagement.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className={`relative border-2 ${plan.popular ? 'border-orange-500 shadow-2xl scale-105' : 'border-gray-200'} hover:shadow-lg transition-all duration-300`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
                    Le plus populaire
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}€</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="pt-6">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${plan.popular 
                      ? 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600' 
                      : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Additional pricing info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4 text-lg">
            Tous les plans incluent un essai gratuit de 14 jours • Aucune carte bancaire requise • Facturation annuelle avec 20% de réduction disponible
          </p>
          <div className="flex flex-wrap justify-center space-x-8 text-sm text-gray-500 gap-4">
            <span className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Support client inclus</span>
            </span>
            <span className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Mises à jour gratuites</span>
            </span>
            <span className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Annulation à tout moment</span>
            </span>
            <span className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Garantie satisfaction 30 jours</span>
            </span>
            <span className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Données sécurisées GDPR</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};