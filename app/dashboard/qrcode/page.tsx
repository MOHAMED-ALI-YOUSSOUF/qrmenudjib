'use client';

import { useState, useEffect } from 'react';
import { client as sanityClient } from '@/sanity/lib/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Copy, Share2, Settings, Upload, X, Save, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { urlFor } from '@/sanity/lib/image';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface Restaurant {
  _id: string;
  slug: {
    current: string;
  };
  name: string;
}

interface QRCodeSettings {
  _id?: string;
  url: string;
  size: number;
  logoSize: number;
  backgroundColor: string;
  foregroundColor: string;
  logo: any;
}

export default function QRCodePage() {
  const { data: session } = useSession();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [qrData, setQrData] = useState<QRCodeSettings>({
    url: '',
    size: 256,
    logoSize: 50,
    backgroundColor: '#ffffff',
    foregroundColor: '#000000',
    logo: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch restaurant data and QR code settings
  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.email) {
        try {
          // Fetch restaurant data
          const restaurantQuery = `*[_type == "restaurant" && owner->email == $email][0] {
            _id,
            name,
            slug
          }`;
          const restaurantData = await sanityClient.fetch(restaurantQuery, { 
            email: session.user.email 
          });
          
          if (restaurantData) {
            setRestaurant(restaurantData);
            
            // Set default URL based on restaurant slug
            const defaultUrl = `https://qrmenu.dj/${restaurantData.slug.current}`;
            
            // Try to fetch existing QR code settings
            try {
              const response = await fetch('/api/qrCodeSettings');
              if (response.ok) {
                const settings = await response.json();
                setQrData({
                  url: settings.url || defaultUrl,
                  size: settings.size || 256,
                  logoSize: settings.logoSize || 50,
                  backgroundColor: settings.backgroundColor || '#ffffff',
                  foregroundColor: settings.foregroundColor || '#000000',
                  logo: settings.logo || null,
                });
              } else {
                // Use default URL if no settings found
                setQrData(prev => ({
                  ...prev,
                  url: defaultUrl,
                }));
              }
            } catch (error) {
              console.error('Error fetching QR code settings:', error);
              setQrData(prev => ({
                ...prev,
                url: defaultUrl,
              }));
            }
          }
        } catch (error) {
          console.error('Error fetching restaurant data:', error);
          toast.error('Erreur lors du chargement des données');
        }
      }
    };
    
    fetchData();
  }, [session]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Lien copié dans le presse-papiers');
  };

  const downloadQR = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (!canvas) return;
    
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `qr-menu-${restaurant?.slug.current || 'menu'}.png`;
    link.href = url;
    link.click();
    toast.success('QR Code téléchargé');
  };

  const shareQR = () => {
    if (navigator.share) {
      navigator.share({
        title: restaurant?.name || 'Mon Menu QR',
        text: 'Découvrez notre menu via QR Code',
        url: qrData.url,
      });
    } else {
      copyToClipboard(qrData.url);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 2MB');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const imageData = await response.json();
        setQrData(prev => ({ ...prev, logo: imageData }));
        toast.success('Logo téléchargé avec succès');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Erreur lors du téléchargement du logo');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Erreur lors du téléchargement du logo');
    }
  };

  const handleRemoveImage = () => {
    setQrData(prev => ({ ...prev, logo: null }));
    toast.success('Logo supprimé');
  };

  const handleSave = async () => {
    if (!restaurant?._id) {
      toast.error('Restaurant non trouvé');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/qrCodeSettings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(qrData),
      });

      if (response.ok) {
        const result = await response.json();
        setQrData(prev => ({ ...prev, _id: result._id }));
        toast.success('Paramètres QR sauvegardés avec succès');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Error saving QR code settings:', error);
      toast.error('Erreur lors de la sauvegarde des paramètres QR');
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">Générateur QR Code</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Créez et personnalisez votre QR Code pour votre menu
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Aperçu du QR Code</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <QRCodeCanvas
                  id="qr-code"
                  value={qrData.url}
                  size={qrData.size}
                  bgColor={qrData.backgroundColor}
                  fgColor={qrData.foregroundColor}
                  includeMargin={true}
                  imageSettings={
                    qrData.logo
                      ? {
                          src: urlFor(qrData.logo).url() || '',
                          height: qrData.logoSize,
                          width: qrData.logoSize,
                          excavate: true,
                          
                        }
                      : undefined
                  }
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={downloadQR} className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Télécharger
                </Button>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(qrData.url)}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 w-4" />
                  Copier le lien
                </Button>
                <Button
                  variant="outline"
                  onClick={shareQR}
                  className="flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Partager
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Personnalisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="url" className="flex items-center gap-2">
                  URL du menu
                  <Lock className="w-4 h-4 text-muted-foreground" />
                </Label>
                <div className="relative">
                  <Input
                    id="url"
                    value={qrData.url}
                    readOnly
                    className="pr-10 bg-muted"
                    placeholder="Chargement..."
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => copyToClipboard(qrData.url)}
                    title="Copier l'URL"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Cette URL est basée sur le slug de votre restaurant et ne peut pas être modifiée.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo (optionnel)</Label>
                {qrData.logo ? (
                  <div className="space-y-3">
                    <div className="relative h-32 w-32 mx-auto overflow-hidden rounded-lg border">
                      <Image
                        src={urlFor(qrData.logo).url() || ''}
                        alt="Logo preview"
                        fill
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <Label
                      htmlFor="logoInput"
                      className="flex items-center justify-center p-3 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      <span className="text-sm">Changer le logo</span>
                    </Label>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-3">Aucun logo</p>
                    <Label
                      htmlFor="logoInput"
                      className="flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      <span className="text-sm">Choisir un logo</span>
                    </Label>
                  </div>
                )}
                <input
                  id="logoInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Taille ({qrData.size}px)</Label>
                <Input
                  id="size"
                  type="range"
                  min="128"
                  max="512"
                  value={qrData.size}
                  onChange={(e) => setQrData({ ...qrData, size: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logoSize">Taille du logo ({qrData.logoSize}px)</Label>
                <Input
                  id="logoSize"
                  type="range"
                  min="20"
                  max="100"
                  value={qrData.logoSize}
                  onChange={(e) => setQrData({ ...qrData, logoSize: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bg-color">Couleur de fond</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="bg-color"
                      type="color"
                      value={qrData.backgroundColor}
                      onChange={(e) => setQrData({ ...qrData, backgroundColor: e.target.value })}
                      className="w-10 h-10 p-1"
                    />
                    <Input
                      value={qrData.backgroundColor}
                      onChange={(e) => setQrData({ ...qrData, backgroundColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fg-color">Couleur du code</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="fg-color"
                      type="color"
                      value={qrData.foregroundColor}
                      onChange={(e) => setQrData({ ...qrData, foregroundColor: e.target.value })}
                      className="w-10 h-10 p-1"
                    />
                    <Input
                      value={qrData.foregroundColor}
                      onChange={(e) => setQrData({ ...qrData, foregroundColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSave} disabled={isSaving} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}
              </Button>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-semibold mb-2">💡 Conseils</h3>
                <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                  <li>• Utilisez un contraste élevé pour une meilleure lisibilité</li>
                  <li>• Testez votre QR Code avant l&opos;impression</li>
                  <li>• Taille recommandée : 256px minimum</li>
                  <li>• Ajoutez un logo centré pour une touche personnalisée</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>Modèles prédéfinis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Classique', bg: '#ffffff', fg: '#000000' },
                { name: 'Bleu', bg: '#f0f9ff', fg: '#1e40af' },
                { name: 'Vert', bg: '#f0fdf4', fg: '#166534' },
                { name: 'Rouge', bg: '#fef2f2', fg: '#dc2626' },
                { name: 'Violet', bg: '#faf5ff', fg: '#7c3aed' },
                { name: 'Sombre', bg: '#1f2937', fg: '#ffffff' },
              ].map((template) => (
                <Button
                  key={template.name}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() =>
                    setQrData({
                      ...qrData,
                      backgroundColor: template.bg,
                      foregroundColor: template.fg,
                    })
                  }
                >
                  <div
                    className="w-16 h-16 rounded border-2 flex items-center justify-center text-xs font-medium"
                    style={{ 
                      backgroundColor: template.bg, 
                      color: template.fg, 
                      borderColor: template.fg 
                    }}
                  >
                    QR
                  </div>
                  <span className="text-sm">{template.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}