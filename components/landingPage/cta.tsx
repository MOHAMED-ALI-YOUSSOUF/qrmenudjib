// components/FinalCTA.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { APP_NAME } from '@/lib/constants';

export const FinalCTA = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-orange-500 to-yellow-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl lg:text-5xl font-bold text-white mb-6"
        >
          Prêt à digitaliser votre restaurant ?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto"
        >
          Rejoignez les restaurateurs qui ont déjà boosté leurs ventes avec {APP_NAME}. Transformez votre business dès aujourd&apos;hui !
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button 
            size="lg"
            className="bg-white text-orange-500 hover:bg-gray-100 text-lg px-8 py-6 font-semibold"
          >
            Commencer Gratuitement
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="border-white bg-amber-600 text-white hover:bg-white hover:text-orange-500 text-lg px-8 py-6"
          >
            Voir une démo
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-8 text-orange-100"
        >
          <p className="text-lg">
            ✓ Configuration rapide • ✓ Sans carte • ✓ Support local à Djibouti • ✓ Essai gratuit 14 jours • ✓ Formation incluse
          </p>
        </motion.div>
      </div>
    </section>
  );
};