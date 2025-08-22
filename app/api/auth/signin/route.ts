import { NextRequest, NextResponse } from 'next/server';
import { client as sanityClient } from '@/sanity/lib/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Début de la connexion');

    // Vérifier les variables d'environnement
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      console.error('❌ NEXT_PUBLIC_SANITY_PROJECT_ID manquant');
      return NextResponse.json(
        { message: 'Configuration serveur incorrecte' },
        { status: 500 }
      );
    }

    if (!process.env.SANITY_API_TOKEN) {
      console.error('❌ SANITY_API_TOKEN manquant');
      return NextResponse.json(
        { message: 'Token d\'authentification manquant' },
        { status: 500 }
      );
    }

    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET manquant');
      return NextResponse.json(
        { message: 'Clé secrète JWT manquante' },
        { status: 500 }
      );
    }

    const { email, password } = await request.json();
    console.log('📝 Données reçues:', { email, password: '***' });

    // Validation des données
    if (!email?.trim()) {
      console.log('❌ Champs manquants');
      return NextResponse.json(
        { message: 'Email est requis' },
        { status: 400 }
      );
    }
    if (!password?.trim()) {
      console.log('❌ Champs manquants');
      return NextResponse.json(
        { message: ' mot de passe est requis' },
        { status: 400 }
      );
    }

    // Validation du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Format email invalide');
      return NextResponse.json(
        { message: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    console.log('✅ Validation des données OK');

    // Vérifier si l'utilisateur existe
    console.log('🔍 Vérification utilisateur existant...');
    const user = await sanityClient.fetch(
      `*[_type == "user" && email == $email][0] {
        _id,
        name,
        email,
        password,
        status,
        whatsapp,
        createdAt
      }`,
      { email: email.toLowerCase().trim() }
    );

    if (!user) {
      console.log('❌ Utilisateur non trouvé');
      return NextResponse.json(
        { message: 'Email n\'existe pas' },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    console.log('🔐 Vérification du mot de passe...');
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('❌ Mot de passe incorrect');
      return NextResponse.json(
        { message: 'Mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Vérifier le statut de l'utilisateur
    if (user.status !== 'active') {
      console.log('❌ Compte non actif:', user.status);
      return NextResponse.json(
        { message: 'Votre compte est en attente de validation ou désactivé' },
        { status: 403 }
      );
    }

    console.log('✅ Authentification réussie');

    // Générer un token JWT
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Token valide pendant 7 jours
    );

    console.log('🔑 Token JWT généré');

    // Réponse de succès
    const response = {
      message: 'Connexion réussie',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
      },
    };

    console.log('🎉 Connexion terminée avec succès');
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('💥 Erreur lors de la connexion:', error);

    // Log détaillé de l'erreur
    if (error instanceof Error) {
      console.error('Message d\'erreur:', error.message);
      console.error('Stack trace:', error.stack);

      // Erreurs spécifiques de Sanity
      if (error.message.includes('Unauthorized')) {
        return NextResponse.json(
          { message: 'Erreur d\'authentification avec la base de données' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        message: 'Erreur interne du serveur. Veuillez réessayer.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}