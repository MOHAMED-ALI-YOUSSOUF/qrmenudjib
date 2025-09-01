'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Palette, Upload, Eye, Save, Image as ImageIcon, X } from 'lucide-react'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { Skeleton } from '@/components/ui/skeleton'
import imageCompression from 'browser-image-compression'

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
})

type FormData = z.infer<typeof formSchema>

export default function SettingsPage() {
  const { data: session } = useSession()
  const [restaurant, setRestaurant] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [uploading, setUploading] = useState<{ coverImage: boolean; logo: boolean }>({
    coverImage: false,
    logo: false,
  })

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
  })

  const formData = watch()

  // Color presets
  const colorPresets = [
    { name: 'Orange Tropical', primary: '#f59e0b', secondary: '#10b981', accent: '#facc15' },
    { name: 'Sunset Brillant', primary: '#fb7185', secondary: '#f97316', accent: '#fde68a' },
    { name: 'Océan Émeraude', primary: '#22d3ee', secondary: '#14b8a6', accent: '#fcd34d' },
    { name: 'Violet Dynamique', primary: '#a78bfa', secondary: '#f472b6', accent: '#fef08a' },
    { name: 'Citron Vert', primary: '#84cc16', secondary: '#16a34a', accent: '#facc15' },
    { name: 'Corail Lumineux', primary: '#f87171', secondary: '#fbbf24', accent: '#22d3ee' },
  ]

  // Font options
  const fontOptions = [
    { name: 'Inter', value: 'Inter', preview: 'AaBbCc' },
    { name: 'Roboto', value: 'Roboto', preview: 'AaBbCc' },
    { name: 'Open Sans', value: 'Open Sans', preview: 'AaBbCc' },
    { name: 'Poppins', value: 'Poppins', preview: 'AaBbCc' },
    { name: 'Montserrat', value: 'Montserrat', preview: 'AaBbCc' },
  ]

  // Fetch restaurant data
  useEffect(() => {
    const fetchRestaurant = async () => {
      if (session?.user?.email) {
        try {
          setIsLoading(true)
          const response = await fetch('/api/restaurant')
          if (response.ok) {
            const data = await response.json()
            setRestaurant(data)
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
            })
          } else {
            toast.error('Erreur lors du chargement des données du restaurant')
          }
        } catch (error) {
          console.error('Erreur chargement restaurant:', error)
          toast.error('Erreur lors du chargement des données du restaurant')
        } finally {
          setIsLoading(false)
        }
      }
    }
    fetchRestaurant()
  }, [session, reset])

  // Handle color preset selection
  const handleColorPreset = (preset: typeof colorPresets[0]) => {
    setValue('primaryColor', preset.primary, { shouldValidate: true, shouldDirty: true })
    setValue('secondaryColor', preset.secondary, { shouldValidate: true, shouldDirty: true })
    setValue('accentColor', preset.accent, { shouldValidate: true, shouldDirty: true })
  }

  // Handle image upload
  const handleImageUpload = async (field: 'coverImage' | 'logo', file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 5MB')
      return
    }

    try {
      setUploading((prev) => ({ ...prev, [field]: true }))
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: field === 'coverImage' ? 1200 : 200,
        useWebWorker: true,
      })

      const formData = new FormData()
      formData.append('file', compressedFile)

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const imageData = await response.json()
        setValue(field, imageData)
        toast.success(`${field === 'coverImage' ? 'Image de couverture' : 'Logo'} téléchargé avec succès`)
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Erreur lors du téléchargement de l\'image')
      }
    } catch (error) {
      console.error('Erreur téléchargement image:', error)
      toast.error('Erreur lors du téléchargement de l\'image')
    } finally {
      setUploading((prev) => ({ ...prev, [field]: false }))
    }
  }

  // Handle image removal
  const handleRemoveImage = (field: 'coverImage' | 'logo') => {
    setValue(field, undefined)
    toast.success(`${field === 'coverImage' ? 'Image de couverture' : 'Logo'} supprimé`)
  }

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    if (!restaurant?._id) {
      toast.error('Restaurant non trouvé')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/restaurant', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const updatedData = await response.json()
        setRestaurant(updatedData)
        toast.success('Paramètres sauvegardés avec succès !')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Erreur lors de la sauvegarde des paramètres')
      }
    } catch (error) {
      console.error('Erreur sauvegarde paramètres:', error)
      toast.error('Erreur lors de la sauvegarde des paramètres')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle file input change
  const handleFileChange = (field: 'coverImage' | 'logo', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(field, file)
    }
  }

  if (isLoading && !restaurant) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-80 w-full rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Paramètres du restaurant</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Personnalisez l&apos;apparence et les informations de votre restaurant
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Link href={`/${restaurant?.slug.current || ''}`}>
            <Button
              variant="outline"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Eye className="h-4 w-4 mr-2" />
              Aperçu
            </Button>
          </Link>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading || uploading.coverImage || uploading.logo}
            className="bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
          >
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
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900 dark:text-white">
                <ImageIcon className="h-5 w-5 mr-2" />
                Informations du restaurant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-gray-900 dark:text-white">Nom du restaurant</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="Le Palmier Doré"
                    className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                    aria-invalid={errors.name ? 'true' : 'false'}
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="whatsapp" className="text-gray-900 dark:text-white">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    {...register('whatsapp')}
                    placeholder="+253 21 35 40 50"
                    className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                    aria-invalid={errors.whatsapp ? 'true' : 'false'}
                  />
                  {errors.whatsapp && <p className="text-red-500 text-sm">{errors.whatsapp.message}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="description" className="text-gray-900 dark:text-white">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  rows={3}
                  placeholder="Décrivez votre restaurant..."
                  className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="adresse" className="text-gray-900 dark:text-white">Adresse</Label>
                <Input
                  id="adresse"
                  {...register('adresse')}
                  placeholder="Avenue Maréchal Joffre, Djibouti"
                  className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="instagram" className="text-gray-900 dark:text-white">Instagram</Label>
                  <Input
                    id="instagram"
                    {...register('instagram')}
                    placeholder="@nom_restaurant"
                    className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="facebook" className="text-gray-900 dark:text-white">Facebook</Label>
                  <Input
                    id="facebook"
                    {...register('facebook')}
                    placeholder="Nom de page"
                    className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="tiktok" className="text-gray-900 dark:text-white">TikTok</Label>
                  <Input
                    id="tiktok"
                    {...register('tiktok')}
                    placeholder="@nom_restaurant"
                    className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900 dark:text-white">
                <ImageIcon className="h-5 w-5 mr-2" />
                Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-gray-900 dark:text-white">Image de couverture</Label>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Recommandé : 1200x600 pixels</p>
                {formData.coverImage ? (
                  <div className="space-y-3">
                    <div className="relative h-40 w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600">
                      {uploading.coverImage ? (
                        <span className="animate-spin h-full flex justify-center items-center text-4xl">⏳</span>
                      ) : (
                        <div>
                          <Image
                            src={urlFor(formData.coverImage).url()}
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
                      )}
                    </div>
                    <Label
                      htmlFor="coverImageInput"
                      className="flex items-center justify-center p-3 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-900 dark:text-white"
                    >
                      {uploading.coverImage ? (
                        <span className="text-sm">Téléchargement...</span>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          <span className="text-sm">Changer l&apos;image de couverture</span>
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
                    <ImageIcon className="h-10 w-10 text-gray-400 dark:text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Aucune image de couverture</p>
                    <Label
                      htmlFor="coverImageInput"
                      className="flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm text-gray-900 dark:text-white"
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
                <Label className="text-gray-900 dark:text-white">Logo du restaurant</Label>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Recommandé : 200x200 pixels, format carré</p>
                {formData.logo ? (
                  <div className="space-y-3">
                    <div className="relative h-32 w-32 mx-auto overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-600">
                      {uploading.logo ? (
                        <span className="animate-spin h-full flex justify-center items-center text-4xl">⏳</span>
                      ) : (
                        <div>
                          <Image
                            src={urlFor(formData.logo).url()}
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
                      )}
                    </div>
                    <Label
                      htmlFor="logoInput"
                      className="flex items-center justify-center p-3 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-900 dark:text-white"
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
                    <ImageIcon className="h-10 w-10 text-gray-400 dark:text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Aucun logo</p>
                    <Label
                      htmlFor="logoInput"
                      className="flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm text-gray-900 dark:text-white"
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

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900 dark:text-white">
                <Palette className="h-5 w-5 mr-2" />
                Couleurs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-gray-900 dark:text-white">Palettes prédéfinies</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                  {colorPresets.map((preset, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-3 flex flex-col items-center space-y-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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
                  <Label htmlFor="primaryColor" className="text-gray-900 dark:text-white">Couleur principale</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      id="primaryColor"
                      type="color"
                      {...register('primaryColor')}
                      className="w-10 h-10 border border-gray-200 dark:border-gray-600 rounded cursor-pointer"
                      aria-label="Select primary color"
                    />
                    <Input
                      {...register('primaryColor')}
                      className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondaryColor" className="text-gray-900 dark:text-white">Couleur secondaire</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      id="secondaryColor"
                      type="color"
                      {...register('secondaryColor')}
                      className="w-10 h-10 border border-gray-200 dark:border-gray-600 rounded cursor-pointer"
                      aria-label="Select secondary color"
                    />
                    <Input
                      {...register('secondaryColor')}
                      className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="accentColor" className="text-gray-900 dark:text-white">Couleur d&apos;accent</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      id="accentColor"
                      type="color"
                      {...register('accentColor')}
                      className="w-10 h-10 border border-gray-200 dark:border-gray-600 rounded cursor-pointer"
                      aria-label="Select accent color"
                    />
                    <Input
                      {...register('accentColor')}
                      className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900 dark:text-white">
                <Palette className="h-5 w-5 mr-2" />
                Typographie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label className="text-gray-900 dark:text-white">Police d&apos;écriture</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  {fontOptions.map((font, index) => (
                    <Button
                      key={index}
                      variant={formData.fontFamily === font.value ? 'default' : 'outline'}
                      className={`h-auto p-3 flex items-center justify-between bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        formData.fontFamily === font.value ? 'bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700' : ''
                      }`}
                      onClick={() => setValue('fontFamily', font.value, { shouldValidate: true, shouldDirty: true })}
                      aria-label={`Select ${font.name} font`}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{font.name}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">{font.preview}</span>
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
          <Card className="sticky top-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Aperçu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative h-32 overflow-hidden rounded-lg">
                  <Image
                    src={formData.coverImage ? urlFor(formData.coverImage).url() : '/placeholder.jpg'}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="flex items-center space-x-2">
                      <Image
                        src={formData.logo ? urlFor(formData.logo).url() : '/placeholder-logo.png'}
                        width={40}
                        height={40}
                        alt="Logo preview"
                        className="w-8 h-8 rounded-2xl object-cover border border-white"
                      />
                      <div className="text-white">
                        <h3 className="font-bold text-sm">{formData.name || 'Votre Restaurant'}</h3>
                        <p className="text-xs text-gray-200 truncate">{formData.adresse || 'Adresse'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Palette de couleurs</h4>
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
                  <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Police</h4>
                  <div
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm"
                    style={{ fontFamily: formData.fontFamily }}
                  >
                    <p className="font-bold text-gray-900 dark:text-white">Le Palmier Doré</p>
                    <p className="text-gray-900 dark:text-white">Grilled Fish with Lemon</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">1,800 DJF</p>
                  </div>
                </div>
                <Link href={`/${restaurant?.slug.current || ''}`}>
                  <Button
                    className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    variant="outline"
                  >
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
  )
}