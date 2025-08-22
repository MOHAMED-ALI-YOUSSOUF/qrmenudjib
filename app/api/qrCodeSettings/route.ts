import { NextRequest, NextResponse } from 'next/server';
import { writeClient as sanityClient } from '@/sanity/lib/write-client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    // Vérifier la session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer les paramètres QR Code pour l'utilisateur
    const query = `*[_type == "qrCodeSettings" && restaurant->owner->email == $email][0] {
      _id,
      url,
      size,
      logoSize,
      backgroundColor,
      foregroundColor,
      logo
    }`;
    
    const qrCodeSettings = await sanityClient.fetch(query, { email: session.user.email });

    if (!qrCodeSettings) {
      return NextResponse.json({ error: 'Paramètres QR non trouvés' }, { status: 404 });
    }

    return NextResponse.json(qrCodeSettings);
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres QR:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des paramètres QR' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Vérifier la session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer les données de la requête
    const data = await request.json();
    const { url, size, logoSize, backgroundColor, foregroundColor, logo } = data;

    // Récupérer l'ID du restaurant de l'utilisateur
    const restaurantQuery = `*[_type == "restaurant" && owner->email == $email][0]._id`;
    const restaurantId = await sanityClient.fetch(restaurantQuery, { email: session.user.email });

    if (!restaurantId) {
      return NextResponse.json({ error: 'Restaurant non trouvé' }, { status: 404 });
    }

    // Vérifier si des paramètres existent déjà
    const existingSettingsQuery = `*[_type == "qrCodeSettings" && restaurant._ref == $restaurantId][0]._id`;
    const existingSettingsId = await sanityClient.fetch(existingSettingsQuery, { restaurantId });

    let result;
    if (existingSettingsId) {
      // Mettre à jour les paramètres existants
      result = await sanityClient
        .patch(existingSettingsId)
        .set({
          url,
          size,
          logoSize,
          backgroundColor,
          foregroundColor,
          logo: logo === 'null' ? null : logo,
          updatedAt: new Date().toISOString(),
        })
        .commit();
    } else {
      // Créer de nouveaux paramètres
      result = await sanityClient.create({
        _type: 'qrCodeSettings',
        restaurant: {
          _type: 'reference',
          _ref: restaurantId,
        },
        url,
        size,
        logoSize,
        backgroundColor,
        foregroundColor,
        logo: logo === 'null' ? null : logo,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des paramètres QR:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde des paramètres QR' },
      { status: 500 }
    );
  }
}