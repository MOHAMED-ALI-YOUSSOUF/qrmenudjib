// components/Features.tsx
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Smartphone, TrendingUp, Edit3, BarChart3, Building2, MessageSquare, Headphones, Globe, CreditCard, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: QrCode,
    title: "QR Code instantané",
    description: "Générez votre QR code personnalisé en quelques secondes et affichez-le partout dans votre restaurant. Personnalisez les couleurs et ajoutez votre logo.",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Smartphone,
    title: "100% Mobile Responsive",
    description: "Vos menus s'adaptent parfaitement à tous les écrans : téléphone, tablette et ordinateur. Support pour iOS, Android et web.",
    color: "from-blue-500 to-purple-500"
  },
  {
    icon: TrendingUp,
    title: "Boostez vos ventes +30%",
    description: "Interface intuitive qui incite vos clients à commander plus et à découvrir tous vos plats. Ajoutez des upsells intelligents et des recommandations.",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Edit3,
    title: "Gestion facile des menus",
    description: "Ajoutez, modifiez ou supprimez vos plats en temps réel avec notre interface simple et intuitive. Support pour photos, allergènes et variantes.",
    color: "from-purple-500 to-pink-500"
  },
  
  {
    icon: Zap,
    title: "Mises à jour instantanées",
    description: "Modifiez votre menu et voyez les changements en temps réel sur tous les appareils des clients.",
    color: "from-yellow-500 to-amber-500"
  },
  
  {
    icon: MessageSquare,
    title: "Intégration WhatsApp",
    description: "Connectez facilement vos menus avec WhatsApp pour permettre aux clients de vous contacter directement. Notifications instantanées.",
    color: "from-green-500 to-teal-500"
  },
  {
    icon: Headphones,
    title: "Support et configuration",
    description: "Notre équipe locale à Djibouti vous accompagne dans la configuration et vous forme à l'utilisation. Support multicanal: chat, email, téléphone.",
    color: "from-indigo-500 to-purple-500"
  },
  // Added more features for more content

];

export const Features = () => {
  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 dark:bg-gray-800 dark:text-gray-200">Fonctionnalités</Badge>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Fonctionnalités SaaS complètes
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Tout ce dont vous avez besoin pour digitaliser votre restaurant et booster vos ventes
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 ">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-0 bg-white dark:bg-gray-800 dark:border-gray-700"
            >
              <CardHeader>
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl dark:text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
