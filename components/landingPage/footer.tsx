// components/Footer.tsx
import React from "react";
import { Badge } from "../ui/badge";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const iconLink =
  "w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main content */}
        <div className="flex flex-col items-center text-center">
          {/* Logo + Name */}
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center">
              <span className="text-xl font-bold">Q</span>
            </div>
            <span className="text-2xl font-bold">{APP_NAME}</span>
          </div>

          {/* Description */}
          <p className="text-gray-400 mb-6 ">
            La solution complète pour digitaliser vos menus et booster vos
            ventes. Conçu spécialement pour les restaurants à Djibouti. Nous aidons les restaurateurs à moderniser leur service
            tout en respectant les traditions locales.
          </p>

          {/* Links */}
          <div className="flex space-x-4">
            <a href="mailto:wizzimed@gmail.com" className={iconLink}>
              📧
            </a>
            <a href="tel:+25377196132" className={iconLink}>
              📱
            </a>
            <a href={`https://${APP_NAME}.rohaty.com`} className={iconLink}>
              🌐
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 {APP_NAME} – Tous droits réservés
          </p>

          <Badge className="mt-8 bg-orange-100 text-orange-800 hover:bg-orange-200">
            🇩🇯 Fièrement conçu à Djibouti par{" "}
            <a
              href="https://mohamed-ali-youssouf.com"
              className="underline hover:text-orange-600"
            >
              Mohamed Ali Youssouf
            </a>
          </Badge>
        </div>
      </div>
    </footer>
  );
};
