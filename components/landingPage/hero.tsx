// components/Hero.tsx
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, Smartphone, TrendingUp, ArrowRight, Headphones } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { APP_NAME } from '@/lib/constants';
import QRGenerator from '../shared/qr-generator';

export const Hero = () => {
  return (
    <section id="hero" className="relative py-5 pb-16 overflow-hidden">
      {/* Enhanced Background elements with more blobs */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-48 h-48 bg-orange-200 rounded-full opacity-30 blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        ></motion.div>
        <motion.div
          className="absolute top-40 right-20 w-64 h-64 bg-yellow-200 rounded-full opacity-20 blur-3xl"
          animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        ></motion.div>
        <motion.div
          className="absolute bottom-40 left-1/4 w-56 h-56 bg-orange-100 rounded-full opacity-25 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.35, 0.25] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        ></motion.div>
        <motion.div
          className="absolute bottom-10 right-40 w-72 h-72 bg-yellow-100 rounded-full opacity-15 blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        ></motion.div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <Badge className="inline-flex items-center space-x-2 bg-orange-500 text-white hover:bg-orange-600">
              <span>🚀</span>
              <span>Nouveau à Djibouti</span>
            </Badge>

            {/* Main headline */}
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Digitalisez vos menus avec{' '}
              <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                {APP_NAME}
              </span>
            </h1>

            {/* Enhanced Subtitle with more content */}
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
              Vos clients scannent, consultent et commandent en toute simplicité. Tout est en ligne, rapide et sécurisé. 
              Réduisez les coûts d&apos;impression, mettez à jour votre menu en temps réel.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/sign-up">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-lg px-8 py-6"
                >
                  Essayer Gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white text-lg px-8 py-6"
                >
                  Voir une démo
                </Button>
              </Link>
            </div>

            {/* Enhanced Stats with icons */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center flex flex-col items-center">
                <TrendingUp className="w-8 h-8 text-orange-500 mb-2" />
                <div className="text-3xl font-bold text-gray-900">+30%</div>
                <div className="text-gray-600">Ventes en plus</div>
              </div>
              <div className="text-center flex flex-col items-center">
                <Smartphone className="w-8 h-8 text-orange-500 mb-2" />
                <div className="text-3xl font-bold text-gray-900">2min</div>
                <div className="text-gray-600">Configuration</div>
              </div>
              <div className="text-center flex flex-col items-center">
                <Headphones className="w-8 h-8 text-orange-500 mb-2" />
                <div className="text-3xl font-bold text-gray-900">24/7</div>
                <div className="text-gray-600">Support local</div>
              </div>
            </div>
          </motion.div>

          {/* Right column - Hero image/mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Phone mockup with more details */}
              <Card className="bg-gray-900 border-gray-800 p-2 shadow-2xl ">
                <div className="bg-white rounded-xl overflow-hidden">
                  <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                       <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                        <QrCode className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-bold text-lg">Restaurant Démo</h3>
                      <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                        <QrCode className="w-8 h-8 text-white" />
                      </div>
                      
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 text-center">
                      Scannez  pour découvrir le menu
                    </p>
                     <QRGenerator
                      value={`https://${APP_NAME}.rohaty.com/demo`}
                      size={160}
                      className="mb-4"
                      logoUrl="/demo.png"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium underline underline-offset-2 lowercase text-center">
                      https://{APP_NAME}/demo
                    </p>
                    
                    {/* Menu categories with more items */}
                    <div className="space-y-3">
                      <Card className="p-3 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <span className="text-orange-600">🍽️</span>
                          </div>
                          <div>
                            <h4 className="font-semibold">Plats Principaux</h4>
                            <p className="text-sm text-gray-600">12 plats disponibles, dont spécialités djiboutiennes</p>
                          </div>
                      </div>
                        </Card>
                      <Card className="p-3 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <span className="text-yellow-600">🥤</span>
                          </div>
                          <div>
                            <h4 className="font-semibold">Boissons</h4>
                            <p className="text-sm text-gray-600">15 boissons fraîches et locales</p>
                          </div>
                        </div>
                      </Card>
                      <Card className="p-3 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <span className="text-orange-600">🍰</span>
                          </div>
                          <div>
                            <h4 className="font-semibold">Desserts</h4>
                            <p className="text-sm text-gray-600">8 desserts traditionnels</p>
                          </div>
                        </div>
                      </Card>
                      <Card className="p-3 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-green-600">🥗</span>
                          </div>
                          <div>
                            <h4 className="font-semibold">Entrées</h4>
                            <p className="text-sm text-gray-600">6 options légères</p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </Card>

              {/* More floating elements */}
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
                className="absolute top-20 left- -10 w-14 h-14 bg-orange-400 rounded-full flex items-center justify-center shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <QrCode className="w-7 h-7 text-white" />
              </motion.div>
               {/* <div className="absolute -bottom-12 -right-12">
                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 backdrop:blur dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-xs border border-gray-200 dark:border-gray-700">
                  <CardContent className="text-center">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      Restaurant Démo
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                      Scannez pour découvrir notre menu
                    </p>
                    <QRGenerator
                      value={`https://${APP_NAME}.rohaty.com/demo`}
                      size={160}
                      className="mb-4"
                      logoUrl="/demo.png"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium underline underline-offset-2 lowercase ">
                      https://{APP_NAME}/demo
                    </p>
                  </CardContent>
                </Card>
              </div> */}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};