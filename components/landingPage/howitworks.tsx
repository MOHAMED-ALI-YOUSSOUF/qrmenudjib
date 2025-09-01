// components/HowItWorks.tsx
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const steps = [
  {
    number: "1",
    title: "Créez votre compte",
    description: "Inscription gratuite en 2 minutes avec votre email. Aucune carte bancaire requise. Vérification par SMS pour plus de sécurité.",
    icon: "⚡"
  },
  {
    number: "2", 
    title: "Ajoutez vos plats",
    description: "Importez votre menu existant ou créez-le facilement avec photos, prix, descriptions, allergènes et options de personnalisation.",
    icon: "📝"
  },
  {
    number: "3",
    title: "Générez votre QR",
    description: "Votre QR code unique est généré automatiquement. Imprimez-le, personnalisez-le et placez-le sur vos tables ou menus physiques.",
    icon: "📱"
  },
  {
    number: "4",
    title: "Suivez en temps réel",
    description: "Consultez vos statistiques, optimisez votre menu selon les préférences de vos clients et recevez des alertes en temps réel.",
    icon: "📊"
  },
  
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4">Simplicité</Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            6 étapes simples pour digitaliser votre restaurant et transformer votre business.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-lg">
                  <span className="text-white text-2xl font-bold">{step.number}</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-sm">{step.icon}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Process flow visualization */}
        <div className="mt-16 hidden lg:block">
          <div className="relative">
            <motion.div 
              className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 transform -translate-y-1/2"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1.5 }}
              viewport={{ once: true }}
            ></motion.div>
            <div className="relative grid grid-cols-6 gap-8">
              {steps.map((_, index) => (
                <motion.div 
                  key={index}
                  className="flex justify-center"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full shadow-md"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};