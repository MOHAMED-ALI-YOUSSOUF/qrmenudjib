'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Palette, Upload, Eye, Save, Image as ImageIcon, Camera, Brush, Type, X } from 'lucide-react';
import Link from 'next/link';
import { urlFor } from '@/sanity/lib/image';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

// Define form schema with zod
const formSchema = z.object({
  name: z.string().min(1, 'Le nom du restaurant est requis'),
  description: z.string().optional(),
  whatsapp: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Numéro WhatsApp invalide').optional().or(z.literal('')),
  adresse: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  fontFamily: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  tiktok: z.string().optional(),
  coverImage: z
    .object({
      _type: z.literal('image').optional(),
      asset: z.object({ _type: z.literal('reference'), _ref: z.string() }).optional(),
    })
    .optional(),
  logo: z
    .object({
      _type: z.literal('image').optional(),
      asset: z.object({ _type: z.literal('reference'), _ref: z.string() }).optional(),
    })
    .optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function SettingsPage() {
  const { data: session } = useSession();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState<{coverImage: boolean, logo: boolean}>({
    coverImage: false,
    logo: false
  });



  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      whatsapp: '',
      adresse: '',
      primaryColor: '#2563eb',
      secondaryColor: '#10b981',
      accentColor: '#f59e0b',
      fontFamily: 'Inter',
      instagram: '',
      facebook: '',
      tiktok: '',
      coverImage: undefined,
      logo: undefined,
    },
  });

  const formData = watch(); // Watch form values for real-time preview

  // Color presets
  const colorPresets = [
    { name: 'Bleu océan', primary: '#2563eb', secondary: '#10b981', accent: '#f59e0b' },
    { name: 'Sunset', primary: '#dc2626', secondary: '#ea580c', accent: '#f59e0b' },
    { name: 'Forêt', primary: '#059669', secondary: '#0d9488', accent: '#84cc16' },
    { name: 'Violet', primary: '#7c3aed', secondary: '#a855f7', accent: '#ec4899' },
    { name: 'Élégant', primary: '#1f2937', secondary: '#6b7280', accent: '#d97706' },
    { name: 'Djibouti', primary: '#1e40af', secondary: '#059669', accent: '#dc2626' },
  ];

  // Font options
  const fontOptions = [
    { name: 'Inter', value: 'Inter', preview: 'AaBbCc' },
    { name: 'Roboto', value: 'Roboto', preview: 'AaBbCc' },
    { name: 'Open Sans', value: 'Open Sans', preview: 'AaBbCc' },
    { name: 'Poppins', value: 'Poppins', preview: 'AaBbCc' },
    { name: 'Montserrat', value: 'Montserrat', preview: 'AaBbCc' },
  ];

  // Fetch restaurant data
  useEffect(() => {
    const fetchRestaurant = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/restaurant');
          if (response.ok) {
            const data = await response.json();
            setRestaurant(data);
            reset({
              name: data.name || '',
              description: data.description || '',
              whatsapp: data.whatsapp || '',
              adresse: data.adresse || '',
              primaryColor: data.primaryColor || '#2563eb',
              secondaryColor: data.secondaryColor || '#10b981',
              accentColor: data.accentColor || '#f59e0b',
              fontFamily: data.fontFamily || 'Inter',
              instagram: data.instagram || '',
              facebook: data.facebook || '',
              tiktok: data.tiktok || '',
              coverImage: data.coverImage || undefined,
              logo: data.logo || undefined,
            });
          } else {
            toast.error('Erreur lors du chargement des données du restaurant');
          }
        } catch (error) {
          console.error('Error fetching restaurant:', error);
          toast.error('Erreur lors du chargement des données du restaurant');
        }
      }
    };
    fetchRestaurant();
  }, [session, reset]);

  // Handle color preset selection
  const handleColorPreset = (preset: typeof colorPresets[0]) => {
    reset({
      ...formData,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent,
    });
  };

  // Handle image upload
  // Handle image upload
  const handleImageUpload = async (field: 'coverImage' | 'logo', file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 5MB');
      return;
    }

    setUploading(prev => ({ ...prev, [field]: true }));

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const imageData = await response.json();
        setValue(field, imageData);
        toast.success(`${field === 'coverImage' ? 'Image de couverture' : 'Logo'} téléchargé avec succès`);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Erreur lors du téléchargement de l\'image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erreur lors du téléchargement de l\'image');
    } finally {
      setUploading(prev => ({ ...prev, [field]: false }));
    }
  };

  // Handle image removal
  // Handle image removal
  const handleRemoveImage = (field: 'coverImage' | 'logo') => {
    setValue(field, null);
    toast.success(`${field === 'coverImage' ? 'Image de couverture' : 'Logo'} supprimé`);
  };

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    if (!restaurant?._id) {
      toast.error('Restaurant non trouvé');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/restaurant', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setRestaurant(updatedData);
        toast.success('Paramètres sauvegardés avec succès !');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Erreur lors de la sauvegarde des paramètres');
      }
    } catch (error) {
      console.error('Error saving restaurant data:', error);
      toast.error('Erreur lors de la sauvegarde des paramètres');
    } finally {
      setIsLoading(false);
    }
  };

  // Get image URL
  const getImageUrl = (image: any) => {
    return image ? urlFor(image).url() : null;
  };
  // Handle file input change
  const handleFileChange = (field: 'coverImage' | 'logo', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(field, file);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Paramètres du restaurant</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Personnalisez l'apparence et les informations de votre restaurant
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Link href="/restaurant/demo">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Aperçu
            </Button>
          </Link>
          <Button onClick={handleSubmit(onSubmit)} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Type className="h-5 w-5 mr-2" />
                Informations du restaurant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom du restaurant</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="Le Palmier Doré"
                    aria-invalid={errors.name ? 'true' : 'false'}
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    {...register('whatsapp')}
                    placeholder="+253 21 35 40 50"
                    aria-invalid={errors.whatsapp ? 'true' : 'false'}
                  />
                  {errors.whatsapp && <p className="text-red-500 text-sm">{errors.whatsapp.message}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  rows={3}
                  placeholder="Décrivez votre restaurant..."
                />
              </div>
              <div>
                <Label htmlFor="adresse">Adresse</Label>
                <Input
                  id="adresse"
                  {...register('adresse')}
                  placeholder="Avenue Maréchal Joffre, Djibouti"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    {...register('instagram')}
                    placeholder="@nom_restaurant"
                  />
                </div>
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    {...register('facebook')}
                    placeholder="Nom de page"
                  />
                </div>
                <div>
                  <Label htmlFor="tiktok">TikTok</Label>
                  <Input
                    id="tiktok"
                    {...register('tiktok')}
                    placeholder="@nom_restaurant"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

           <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ImageIcon className="h-5 w-5 mr-2" />
            Images
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Image de couverture</Label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Recommandé : 1200x600 pixels</p>
            
            {getImageUrl(formData.coverImage) ? (
              <div className="space-y-3">
                <div className="relative h-40 w-full overflow-hidden rounded-lg border">
                  <Image
                    src={getImageUrl(formData.coverImage) || ''}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleRemoveImage('coverImage')}
                    disabled={uploading.coverImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Label
                  htmlFor="coverImageInput"
                  className="flex items-center justify-center p-3 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {uploading.coverImage ? (
                    <span className="text-sm">Téléchargement...</span>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      <span className="text-sm">Changer l'image de couverture</span>
                    </>
                  )}
                </Label>
                <input
                  id="coverImageInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange('coverImage', e)}
                  disabled={uploading.coverImage}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-3">Aucune image de couverture</p>
                <Label
                  htmlFor="coverImageInput"
                  className="flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {uploading.coverImage ? (
                    <span className="text-sm">Téléchargement...</span>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      <span className="text-sm">Choisir une image</span>
                    </>
                  )}
                </Label>
                <input
                  id="coverImageInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange('coverImage', e)}
                  disabled={uploading.coverImage}
                />
              </div>
            )}
          </div>

          <div>
            <Label>Logo du restaurant</Label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Recommandé : 200x200 pixels, format carré</p>
            
            {getImageUrl(formData.logo) ? (
              <div className="space-y-3">
                <div className="relative h-32 w-32 mx-auto overflow-hidden rounded-full border">
                  <Image
                    src={getImageUrl(formData.logo) || ''}
                    alt="Logo preview"
                    fill
                    className="object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-0 right-0"
                    onClick={() => handleRemoveImage('logo')}
                    disabled={uploading.logo}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <Label
                  htmlFor="logoInput"
                  className="flex items-center justify-center p-3 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {uploading.logo ? (
                    <span className="text-sm">Téléchargement...</span>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      <span className="text-sm">Changer le logo</span>
                    </>
                  )}
                </Label>
                <input
                  id="logoInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange('logo', e)}
                  disabled={uploading.logo}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                <Camera className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-3">Aucun logo</p>
                <Label
                  htmlFor="logoInput"
                  className="flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {uploading.logo ? (
                    <span className="text-sm">Téléchargement...</span>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      <span className="text-sm">Choisir un logo</span>
                    </>
                  )}
                </Label>
                <input
                  id="logoInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange('logo', e)}
                  disabled={uploading.logo}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Couleurs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Palettes prédéfinies</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                  {colorPresets.map((preset, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-3 flex flex-col items-center space-y-2"
                      onClick={() => handleColorPreset(preset)}
                      aria-label={`Select ${preset.name} color preset`}
                    >
                      <div className="flex space-x-1">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: preset.secondary }}
                        />
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: preset.accent }}
                        />
                      </div>
                      <span className="text-xs">{preset.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Couleur principale</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      id="primaryColor"
                      type="color"
                      {...register('primaryColor')}
                      className="w-10 h-10 border rounded cursor-pointer"
                      aria-label="Select primary color"
                    />
                    <Input {...register('primaryColor')} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondaryColor">Couleur secondaire</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      id="secondaryColor"
                      type="color"
                      {...register('secondaryColor')}
                      className="w-10 h-10 border rounded cursor-pointer"
                      aria-label="Select secondary color"
                    />
                    <Input {...register('secondaryColor')} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="accentColor">Couleur d'accent</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      id="accentColor"
                      type="color"
                      {...register('accentColor')}
                      className="w-10 h-10 border rounded cursor-pointer"
                      aria-label="Select accent color"
                    />
                    <Input {...register('accentColor')} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Type className="h-5 w-5 mr-2" />
                Typographie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label>Police d'écriture</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  {fontOptions.map((font, index) => (
                    <Button
                      key={index}
                      variant={formData.fontFamily === font.value ? 'default' : 'outline'}
                      className="h-auto p-3 flex items-center justify-between"
                      onClick={() => reset({ ...formData, fontFamily: font.value })}
                      aria-label={`Select ${font.name} font`}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{font.name}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{font.preview}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-1"
        >
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Aperçu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative h-32 overflow-hidden rounded-lg">
                  <img
                    src={getImageUrl(formData.coverImage) || '/placeholder.jpg'}
                    alt="Cover preview"
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="flex items-center space-x-2">
                      <img
                        src={getImageUrl(formData.logo) || '/placeholder-logo.png'}
                        alt="Logo preview"
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="text-white">
                        <h3 className="font-bold text-sm">{formData.name || 'Votre Restaurant'}</h3>
                        <p className="text-xs text-gray-200 truncate">{formData.adresse || 'Adresse'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Palette de couleurs</h4>
                  <div className="flex space-x-2">
                    <div
                      className="flex-1 h-8 rounded flex items-center justify-center text-white text-xs font-medium"
                      style={{ backgroundColor: formData.primaryColor }}
                    >
                      Principal
                    </div>
                    <div
                      className="flex-1 h-8 rounded flex items-center justify-center text-white text-xs font-medium"
                      style={{ backgroundColor: formData.secondaryColor }}
                    >
                      Secondaire
                    </div>
                    <div
                      className="flex-1 h-8 rounded flex items-center justify-center text-white text-xs font-medium"
                      style={{ backgroundColor: formData.accentColor }}
                    >
                      Accent
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Police</h4>
                  <div
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded text-sm"
                    style={{ fontFamily: formData.fontFamily }}
                  >
                    <p className="font-bold">Le Palmier Doré</p>
                    <p>Grilled Fish with Lemon</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">1,800 DJF</p>
                  </div>
                </div>
                <Link href="/restaurant/demo">
                  <Button className="w-full" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Voir l&apos;aperçu complet
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}