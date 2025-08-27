// api/upload-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeClient as sanityClient } from '@/sanity/lib/write-client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Vérifier la session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer les données du formulaire
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Le fichier ne doit pas dépasser 5MB' }, { status: 400 });
    }

    // Convertir le fichier en buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Uploader l'image vers Sanity
    const asset = await sanityClient.assets.upload('image', buffer, {
      filename: file.name,
    });

    return NextResponse.json({
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    return NextResponse.json(
      { error: 'Erreur lors du téléchargement de l\'image' },
      { status: 500 }
    );
  }
}