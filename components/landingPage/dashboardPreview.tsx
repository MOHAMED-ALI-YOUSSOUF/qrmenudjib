// components/DashboardPreview.tsx
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

export const DashboardPreview = () => {
  return (
    <section id="dashboard" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4">Interface</Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Dashboard complet et intuitif
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Gérez tout votre restaurant depuis une interface moderne et puissante. Visualisez vos données en temps réel et prenez des décisions éclairées.
          </p>
        </motion.div>

        {/* Enhanced Dashboard mockup with more sections */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="shadow-2xl overflow-hidden border-0">
            <div className="bg-gray-800 p-4 flex items-center space-x-3">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-white text-sm font-mono">dashboard.qrmenu.dj</span>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-white to-gray-50">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Dashboard Restaurant Palmier</h3>
                  <p className="text-gray-600">Vue d'ensemble de votre activité - Mise à jour en temps réel</p>
                </div>
                <div className="flex space-x-3">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                    🟢 En ligne
                  </Badge>
                  <Button className="bg-gradient-to-r from-orange-500 to-yellow-500">
                    + Nouveau plat
                  </Button>
                </div>
              </div>

              {/* Enhanced Stats cards with more metrics */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-gray-900">156</div>
                    <div className="text-gray-600">Vues aujourd'hui</div>
                    <div className="text-green-600 text-sm font-medium">+12% vs hier</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-gray-900">23</div>
                    <div className="text-gray-600">Plats consultés</div>
                    <div className="text-blue-600 text-sm font-medium">Top: Thieboudienne</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-gray-900">4.8★</div>
                    <div className="text-gray-600">Note moyenne</div>
                    <div className="text-yellow-600 text-sm font-medium">89 avis clients</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-gray-900">67</div>
                    <div className="text-gray-600">QR scannés</div>
                    <div className="text-orange-600 text-sm font-medium">Pic à 14h</div>
                  </CardContent>
                </Card>
                {/* Added more stats */}
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-gray-900">45%</div>
                    <div className="text-gray-600">Taux de conversion</div>
                    <div className="text-purple-600 text-sm font-medium">De vues à commandes</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-gray-900">12min</div>
                    <div className="text-gray-600">Temps moyen par client</div>
                    <div className="text-indigo-600 text-sm font-medium">-5% vs semaine dernière</div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent activity with more entries */}
              <Card className="border-0 shadow-sm mb-8">
                <CardHeader>
                  <CardTitle className="text-lg">Activité récente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="flex-1">Client a consulté "Thieboudienne aux légumes"</span>
                      <span className="text-sm text-gray-500">Il y a 2 min</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="flex-1">Nouveau scan QR depuis table 5</span>
                      <span className="text-sm text-gray-500">Il y a 5 min</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span className="flex-1">Menu "Boissons" mis à jour</span>
                      <span className="text-sm text-gray-500">Il y a 1h</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="flex-1">Nouveau feedback: 5 étoiles sur dessert</span>
                      <span className="text-sm text-gray-500">Il y a 2h</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="flex-1">Pic d'activité détecté</span>
                      <span className="text-sm text-gray-500">Il y a 3h</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* New graph section */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Graphique des ventes hebdomadaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                    [Placeholder pour graphique interactif - Remplacez par une vraie bibliothèque comme Recharts]
                  </div>
                </CardContent>
              </Card>

              {/* Annotation */}
              <div className="mt-8 text-center">
                <Badge variant="outline" className="text-gray-500 border-gray-300">
                  💡 Interface réelle du dashboard QRMenu.dj - Remplacez par vos vraies captures d'écran ou intégrez des images réelles
                </Badge>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};