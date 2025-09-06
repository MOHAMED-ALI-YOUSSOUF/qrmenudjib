import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;

export async function POST(req: Request) {
  try {
    // Vérifier le secret
    const incomingSecret = req.headers.get('sanity-webhook-secret');
    if (incomingSecret !== SANITY_WEBHOOK_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    const body = await req.json();
    // Sanity envoie les documents modifiés dans body.documents
    const restaurants = body.documents;

    for (const restaurant of restaurants) {
      const previousStatus = restaurant._previous?.status; // Si Sanity fournit l'ancien état
      const currentStatus = restaurant.status;
      const ownerEmail = restaurant.ownerEmail; // Projection depuis GROQ
      const ownerName = restaurant.ownerName;
      const restaurantName = restaurant.name;

      // Vérifier transition pending -> active
      if (previousStatus === 'pending' && currentStatus === 'active') {
        // Envoi de l'email au restaurateur
        await sendEmail(
          ownerEmail,
          'Votre restaurant est activé sur QRMenu ✅',
          `
          <h2>Félicitations ${ownerName} 👋</h2>
          <p>Votre restaurant <strong>${restaurantName}</strong> est maintenant <b>activé</b> !</p>
          <p>Vous pouvez vous connecter et commencer à utiliser votre dashboard.</p>
          <a href="https://qrmenu.rohaty.com/auth/signin">Se connecter</a>
          `
        );
        console.log(`✅ Email envoyé à ${ownerEmail} pour ${restaurantName}`);
      }
    }

    return NextResponse.json({ message: 'Webhook processed' }, { status: 200 });
  } catch (error) {
    console.error('💥 Erreur webhook restaurant-status:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
