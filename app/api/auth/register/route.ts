import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { writeClient } from '@/sanity/lib/write-client'
import { sendEmail } from "@/lib/email";


export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Début de l\'inscription')
    
    // Vérifier les variables d'environnement
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      console.error('❌ NEXT_PUBLIC_SANITY_PROJECT_ID manquant')
      return NextResponse.json(
        { message: 'Configuration serveur incorrecte' },
        { status: 500 }
      )
    }

    if (!process.env.SANITY_API_TOKEN) {
      console.error('❌ SANITY_API_TOKEN manquant')
      return NextResponse.json(
        { message: 'Token d\'authentification manquant' },
        { status: 500 }
      )
    }

    const body = await request.json()
    console.log('📝 Données reçues:', { ...body, password: '***' })

    const { name, email, password, whatsapp, restaurantName } = body

    // Validation des données
    if (!name || !email || !password || !whatsapp || !restaurantName) {
      console.log('❌ Champs manquants')
      return NextResponse.json(
        { message: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    // Validation du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log('❌ Format email invalide')
      return NextResponse.json(
        { message: 'Format d\'email invalide' },
        { status: 400 }
      )
    }

  // Validation du mot de passe (costaud)
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;


      if (!passwordRegex.test(password)) {
        console.log('❌ Mot de passe trop faible')
        return NextResponse.json(
          {
            message:
              'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre ',
          },
          { status: 400 }
        )
      }


    // Validation du numéro WhatsApp
    const whatsappRegex = /^\+?[1-9]\d{1,14}$/
    if (!whatsappRegex.test(whatsapp)) {
      console.log('❌ Numéro WhatsApp invalide')
      return NextResponse.json(
        { message: 'Numéro WhatsApp invalide' },
        { status: 400 }
      )
    }

    console.log('✅ Validation des données OK')

    // Vérifier si l'utilisateur existe déjà
    console.log('🔍 Vérification utilisateur existant...')
    const existingUser = await writeClient.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email }
    )

    if (existingUser) {
      console.log('❌ Utilisateur existe déjà')
      return NextResponse.json(
        { message: 'Un compte avec cet email existe déjà' },
        { status: 409 }
      )
    }


    // Générer un slug "propre"
const baseSlug = restaurantName
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "") // Supprimer accents
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

// Vérifier si un restaurant utilise déjà ce slug
let slug = baseSlug;


    // Vérifier si le restaurant existe déjà
    console.log('🔍 Vérification restaurant existant...')
    const existingRestaurant = await writeClient.fetch(
      `*[_type == "restaurant" && name == $restaurantName][0]`,
      { restaurantName }
    )

    if (existingRestaurant) {
      const randomSuffix = Math.floor(10 + Math.random() * 90); // ex: 23
      slug = `${baseSlug}-${randomSuffix}`;
    }

    console.log('✅ Vérifications d\'unicité OK')

    // Hasher le mot de passe
    console.log('🔐 Hashage du mot de passe...')
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    

    // Créer l'utilisateur
    console.log('👤 Création de l\'utilisateur...')
    const newUser = await writeClient.create({
      _type: 'user',
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      whatsapp: whatsapp.trim(),
      status: 'pending',
      createdAt: new Date().toISOString()
    })

    console.log('✅ Utilisateur créé:', newUser._id)

    // Créer le restaurant associé
    console.log('🏪 Création du restaurant...')
    const newRestaurant = await writeClient.create({
      _type: 'restaurant',
      name: restaurantName.trim(),
      slug: {
        _type: 'slug',
        current: slug
      },
      owner: {
        _type: 'reference',
        _ref: newUser._id
      },
      description: `Restaurant ${restaurantName.trim()}`,
      whatsapp: whatsapp.trim(),
      // Couleurs par défaut
      primaryColor: '#f97316', // orange-500
      secondaryColor: '#ea580c', // orange-600
      accentColor: '#dc2626', // red-600
      fontFamily: 'Inter, sans-serif',
      status: 'pending',
      pendingReason: 'Nouveau restaurant en attente de validation',
      createdAt: new Date().toISOString()
    })

    console.log('✅ Restaurant créé:', newRestaurant._id)

    // Patch user pour ajouter le restaurant
    await writeClient.patch(newUser._id)
    .set({
      restaurant: { _type: 'reference', _ref: newRestaurant._id }
    })
    .commit()

    // Réponse de succès
    const response = {
      message: 'Compte créé avec succès. Votre restaurant est en attente de validation.',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        status: newUser.status
      },
      restaurant: {
        id: newRestaurant._id,
        name: newRestaurant.name,
        status: newRestaurant.status
      }
    }

    // Email au restaurateur
    await sendEmail(
      email,
      "Votre inscription sur QRMenu",
      `
      <h2>Bienvenue ${name} 👋</h2>
      <p>Votre restaurant <strong>${restaurantName}</strong> a bien été enregistré.</p>
      <p>Il est actuellement <b>en attente de validation</b>.</p>
      <p>Vous recevrez un email dès qu'il sera activé ✅.</p>
      `
    );

    // Email pour toi (admin)
    await sendEmail(
      "admin@qrmenu.rohaty.com",
      "📥 Nouvelle inscription restaurant",
      `
      <h2>Nouveau restaurateur inscrit</h2>
      <p>Nom: ${name}</p>
      <p>Email: ${email}</p>
      <p>Restaurant: ${restaurantName}</p>
      <p>Status: pending</p>
      `
    );

    console.log('🎉 Inscription terminée avec succès')
    return NextResponse.json(response, { status: 201 })

  } catch (error) {
    console.error('💥 Erreur lors de l\'inscription:', error)
    
    // Log détaillé de l'erreur
    if (error instanceof Error) {
      console.error('Message d\'erreur:', error.message)
      console.error('Stack trace:', error.stack)
      
      // Erreurs spécifiques de Sanity
      if (error.message.includes('Unauthorized')) {
        return NextResponse.json(
          { message: 'Erreur d\'authentification avec la base de données' },
          { status: 500 }
        )
      }
      
      if (error.message.includes('duplicate') || error.message.includes('unique')) {
        return NextResponse.json(
          { message: 'Un compte ou restaurant avec ces informations existe déjà' },
          { status: 409 }
        )
      }

      if (error.message.includes('validation')) {
        return NextResponse.json(
          { message: 'Données invalides. Vérifiez vos informations.' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { 
        message: 'Erreur interne du serveur. Veuillez réessayer.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

// Fonction utilitaire pour générer un slug unique (optionnelle)
async function generateUniqueSlug(baseName: string): Promise<string> {
  const baseSlug = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  let slug = baseSlug
  let counter = 1

  // Vérifier l'unicité du slug
  while (true) {
    const existing = await client.fetch(
      `*[_type == "restaurant" && slug.current == $slug][0]`,
      { slug }
    )

    if (!existing) {
      break
    }

    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}

// Fonction pour envoyer un email de bienvenue (à implémenter selon vos besoins)
async function sendWelcomeEmail(email: string, name: string) {
  // Implémentation avec votre service d'email (SendGrid, Resend, etc.)
  console.log(`Email de bienvenue à envoyer à ${email}`)
}

// Fonction pour notifier les administrateurs (à implémenter selon vos besoins)
async function notifyAdmins(user: any, restaurant: any) {
  // Implémentation pour notifier les admins d'un nouveau restaurant en attente
  console.log(`Nouveau restaurant en attente: ${restaurant.name} par ${user.name}`)
}