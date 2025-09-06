import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/write-client";
import { sendEmail } from "@/lib/email";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "ID et statut requis" }, { status: 400 });
    }

    // Récupérer le restaurant avec son owner
    const restaurant = await writeClient.fetch(
      `*[_type == "restaurant" && _id == $id][0]{
        _id,
        name,
        status,
        owner->{
          name,
          email
        }
      }`,
      { id }
    );

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant introuvable" }, { status: 404 });
    }

    // Mettre à jour le statut
    const updated = await writeClient
      .patch(id)
      .set({ status })
      .commit();

    // Si le statut devient "active", envoyer un email au restaurateur
    if (status === "active" && restaurant.owner?.email) {
      await sendEmail(
        restaurant.owner.email,
        "✅ Votre restaurant est validé",
        `
          <h2>Félicitations ${restaurant.owner.name} 🎉</h2>
          <p>Votre restaurant <strong>${restaurant.name}</strong> est maintenant <b>actif</b>.</p>
          <p>Vous pouvez vous connecter à votre dashboard et commencer à gérer votre menu :</p>
          <a href="https://${APP_LINK}/auth/signin" style="color:#f97316;font-weight:bold;">
            Se connecter
          </a>
        `
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("💥 Erreur update restaurant status:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
