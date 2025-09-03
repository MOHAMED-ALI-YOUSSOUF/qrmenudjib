// components/Hero.tsx
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { QrCode, Smartphone, TrendingUp, ArrowRight, Headphones } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { APP_LINK, APP_NAME } from '@/lib/constants';
import QRGenerator from './qr-generator'

export const Hero = () => {
  return (
    <section id="hero" className="relative py-5 pb-16 overflow-hidden bg-white dark:bg-gray-900 transition-colors">
      {/* Background blobs */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-48 h-48 bg-orange-200 dark:bg-orange-900 rounded-full opacity-30 blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-64 h-64 bg-yellow-200 dark:bg-yellow-900 rounded-full opacity-20 blur-3xl"
          animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute bottom-40 left-1/4 w-56 h-56 bg-orange-100 dark:bg-orange-800 rounded-full opacity-25 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.35, 0.25] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute bottom-10 right-40 w-72 h-72 bg-yellow-100 dark:bg-yellow-800 rounded-full opacity-15 blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <Badge className="inline-flex items-center space-x-2 bg-orange-500 text-white hover:bg-orange-600">
              <span>🚀</span>
              <span>Nouveau à Djibouti</span>
            </Badge>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white">
              Digitalisez vos menus avec{" "}
              <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                {APP_NAME}
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
              Vos clients scannent, consultent et commandent en toute simplicité. Tout est en ligne, rapide et sécurisé. 
              Réduisez les coûts d&apos;impression, mettez à jour votre menu en temps réel.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/signup">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-lg px-8 py-6 cursor-pointer"
                >
                  Essayer Gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white text-lg px-8 py-6 cursor-pointer dark:border-orange-400 dark:text-orange-400 dark:hover:bg-orange-500 dark:hover:text-white"
                >
                  Voir une démo
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center flex flex-col items-center">
                <TrendingUp className="w-8 h-8 text-orange-500 mb-2" />
                <div className="text-3xl font-bold text-gray-900 dark:text-white">+30%</div>
                <div className="text-gray-600 dark:text-gray-400">Ventes en plus</div>
              </div>
              <div className="text-center flex flex-col items-center">
                <Smartphone className="w-8 h-8 text-orange-500 mb-2" />
                <div className="text-3xl font-bold text-gray-900 dark:text-white">2min</div>
                <div className="text-gray-600 dark:text-gray-400">Configuration</div>
              </div>
              <div className="text-center flex flex-col items-center">
                <Headphones className="w-8 h-8 text-orange-500 mb-2" />
                <div className="text-3xl font-bold text-gray-900 dark:text-white">24/7</div>
                <div className="text-gray-600 dark:text-gray-400">Support local</div>
              </div>
            </div>
          </motion.div>

          {/* Right column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <Card className="bg-gray-900 border-gray-800 p-2 shadow-2xl dark:bg-gray-800 dark:border-gray-700">
              <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden transition-colors">
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-800 dark:to-gray-700 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                      <QrCode className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Restaurant Démo</h3>
                    <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                      <QrCode className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 text-center">
                    Scannez pour découvrir le menu
                  </p>
                  <QRGenerator
                    value={`https://${APP_LINK}/demo`}
                    size={160}
                    className="mb-4"
                    logoUrl="/demo.png"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium underline underline-offset-2 lowercase text-center">
                    https://{APP_NAME}/demo
                  </p>

                  {/* Menu categories */}
                  <div className="space-y-3">
                    <Card className="p-3 shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                          <span className="text-orange-600 dark:text-orange-300">🍽️</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Plats Principaux</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">12 plats disponibles, dont spécialités djiboutiennes</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-3 shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                          <span className="text-yellow-600 dark:text-yellow-300">🥤</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Boissons</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">15 boissons fraîches et locales</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-3 shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                          <span className="text-orange-600 dark:text-orange-300">🍰</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Desserts</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">8 desserts traditionnels</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-3 shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                          <span className="text-green-600 dark:text-green-300">🥗</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Entrées</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">6 options légères</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </Card>

            {/* Floating elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Smartphone className="w-8 h-8 text-white" />
            </motion.div>
            <motion.div
              className="absolute -bottom-4 -left-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <TrendingUp className="w-6 h-6 text-white" />
            </motion.div>
            <motion.div
              className="absolute top-20 -left-10 w-14 h-14 bg-orange-400 rounded-full flex items-center justify-center shadow-lg"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <QrCode className="w-7 h-7 text-white" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
