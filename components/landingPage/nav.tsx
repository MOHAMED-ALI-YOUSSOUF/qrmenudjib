// components/Nav.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">Q</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              QRMenu.dj
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-orange-500 transition-colors font-medium">
              Fonctionnalités
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-orange-500 transition-colors font-medium">
              Tarifs
            </a>
            <a href="#testimonials" className="text-gray-600 hover:text-orange-500 transition-colors font-medium">
              Témoignages
            </a>
            <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
              Connexion
            </Button>
            <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
              Essayer gratuitement
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t border-gray-200 bg-white"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-gray-600 hover:text-orange-500">
                Fonctionnalités
              </a>
              <a href="#pricing" className="block px-3 py-2 text-gray-600 hover:text-orange-500">
                Tarifs
              </a>
              <a href="#testimonials" className="block px-3 py-2 text-gray-600 hover:text-orange-500">
                Témoignages
              </a>
              <div className="px-3 py-2 space-y-2">
                <Button variant="outline" className="w-full">Connexion</Button>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500">
                  Essayer gratuitement
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};