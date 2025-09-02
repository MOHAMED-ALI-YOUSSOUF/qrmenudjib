"use client";
import React, { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Check } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    number: "1",
    title: "Créez votre compte",
    description:
      "Inscription gratuite en 2 minutes avec votre email. Aucune carte bancaire requise. Vérification par email pour plus de sécurité.",
    icon: "⚡",
    color: "from-blue-500 to-blue-600",
  },
  {
    number: "2",
    title: "Ajoutez vos plats",
    description:
      "Créez vos menus facilement avec photos, prix, descriptions, categories et options de personnalisation.",
    icon: "📝",
    color: "from-green-500 to-green-600",
  },
  {
    number: "3",
    title: "Générez votre QR",
    description:
      "Votre QR code unique est généré automatiquement. Imprimez-le, personnalisez-le et placez-le sur vos tables ou menus physiques.",
    icon: "📱",
    color: "from-purple-500 to-purple-600",
  },
  {
    number: "4",
    title: "Suivez en temps réel",
    description:
      "Consultez vos statistiques, optimisez votre menu selon les préférences de vos clients et recevez des alertes en temps réel.",
    icon: "📊",
    color: "from-orange-500 to-orange-600",
  },
];

export const HowItWorks = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set<number>());
 const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  // Scroll sync mobile
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    stepRefs.current.forEach((el, idx) => {
      if (!el) return
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setCurrentStep(idx)
            setCompletedSteps(
              (prev) => new Set([...prev, ...Array.from({ length: idx + 1 }, (_, i) => i)])
            )
          }
        },
        { threshold: 0.5 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => {
      observers.forEach((obs) => obs.disconnect())
    }
  }, [])

  // Auto progression
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          const newStep = (prev + 1) % steps.length;
          if (newStep === 0) {
            setCompletedSteps(new Set([0, 1, 2, 3]));
          }
          return newStep;
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
    setCompletedSteps(
      (prev) => new Set([...prev, ...Array.from({ length: index + 1 }, (_, i) => i)])
    );
  };

  const togglePlayback = () => setIsPlaying(!isPlaying);

  const resetProgress = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setCompletedSteps(new Set());
  };

  const goToNextStep = () => {
    setCurrentStep((prev) => {
      const next = Math.min(prev + 1, steps.length - 1);
      setCompletedSteps((prevCompleted) => new Set([...prevCompleted, next]));
      return next;
    });
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <section
      id="how-it-works"
      className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white border-0">
            Simplicité
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            4 étapes simples pour digitaliser votre restaurant et transformer
            votre business.
          </p>

          {/* Contrôles */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              onClick={togglePlayback}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 mr-2" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {isPlaying ? "Pause" : "Démarrer la démo"}
            </Button>
            <Button
              onClick={resetProgress}
              variant="outline"
              className="border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-gray-800"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Recommencer
            </Button>
          </div>
        </div>

        {/* Barre de progression globale */}
        <div className="sticky top-15 mb-12 z-50 dark:from-gray-900 dark:to-gray-950">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Progression
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-orange-500 to-yellow-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Étapes interactives */}
        <div className="grid  md:grid-cols-2 lg:grid-cols-4 gap-32 sm:gap-8 mb-12">
          {steps.map((step, index) => (
            <div
              key={index}
              ref={(el) => (stepRefs.current[index] = el)}
              onClick={() => handleStepClick(index)}
              className={`
                text-center group cursor-pointer p-6 rounded-xl border-2 transition-all duration-500 transform hover:scale-105
                ${
                  index === currentStep
                    ? "border-orange-500 bg-orange-50 dark:bg-gray-800 shadow-lg scale-105"
                    : completedSteps.has(index)
                    ? "border-green-500 bg-green-50 dark:bg-green-900/30"
                    : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 hover:border-orange-300"
                }
              `}
            >
              <div className="relative mb-6">
                <div
                  className={`
                    w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all duration-500 shadow-lg
                    ${
                      index === currentStep
                        ? `bg-gradient-to-r ${step.color} animate-pulse`
                        : completedSteps.has(index)
                        ? "bg-gradient-to-r from-green-500 to-green-600"
                        : "bg-gradient-to-r from-gray-400 to-gray-500"
                    }
                  `}
                >
                  {completedSteps.has(index) ? (
                    <Check className="text-white w-8 h-8" />
                  ) : (
                    <span className="text-white text-2xl font-bold">
                      {step.number}
                    </span>
                  )}
                </div>
                <div
                  className={`
                    absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-300
                    ${
                      index === currentStep
                        ? "bg-yellow-400 animate-bounce"
                        : completedSteps.has(index)
                        ? "bg-green-400"
                        : "bg-gray-300 dark:bg-gray-600"
                    }
                  `}
                >
                  <span className="text-sm">{step.icon}</span>
                </div>
              </div>

              <h3
                className={`
                text-xl font-bold mb-3 transition-colors duration-300
                ${
                  index === currentStep
                    ? "text-orange-600"
                    : completedSteps.has(index)
                    ? "text-green-600"
                    : "text-gray-900 dark:text-white"
                }
              `}
              >
                {step.title}
              </h3>

              <p
                className={`
                leading-relaxed transition-colors duration-300
                ${
                  index === currentStep
                    ? "text-gray-700 dark:text-gray-300"
                    : "text-gray-600 dark:text-gray-400"
                }
              `}
              >
                {step.description}
              </p>

              {/* Barre de progression individuelle */}
              <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`
                    h-full transition-all duration-1000 ease-out
                    ${
                      index <= currentStep
                        ? `bg-gradient-to-r ${step.color} w-full`
                        : "w-0"
                    }
                  `}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action dynamique */}
        <div className="text-center mt-16">
          <div
            className={`
            p-8 rounded-2xl transition-all duration-500
            ${
              currentStep === steps.length - 1
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                : "bg-white dark:bg-gray-900 border-2 border-orange-200 dark:border-gray-700"
            }
          `}
          >
            <h3
              className={`
              text-2xl font-bold mb-4
              ${currentStep === steps.length - 1 ? "text-white" : "text-gray-900 dark:text-white"}
            `}
            >
              {currentStep === steps.length - 1
                ? "🎉 Félicitations ! Prêt à commencer ?"
                : `Étape ${currentStep + 1}: ${steps[currentStep].title}`}
            </h3>

            {currentStep === steps.length - 1 ? (
              <Button
                size="lg"
                asChild
                className="bg-white text-green-600 hover:bg-gray-100"
              >
                <Link href="/auth/signup">Commencer maintenant</Link>
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={goToNextStep}
                className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
              >
                Passer à la suite
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
