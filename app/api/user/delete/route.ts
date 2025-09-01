import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/write-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const userId = session.user.id;
    const restaurantId = session.user.restaurantId; // si l’utilisateur a un restaurant lié

    const transaction = writeClient.transaction();

    if (restaurantId) {
      // Supprimer catégories liées
      const categories = await writeClient.fetch(
        `*[_type == "category" && restaurant._ref == $restaurantId] { _id }`,
        { restaurantId }
      );
      categories.forEach((c: any) => transaction.delete(c._id));

      // Supprimer plats liés
      const dishes = await writeClient.fetch(
        `*[_type == "dish" && restaurant._ref == $restaurantId] { _id }`,
        { restaurantId }
      );
      dishes.forEach((d: any) => transaction.delete(d._id));

      // Supprimer le restaurant
      transaction.delete(restaurantId);
    }

    // Supprimer l’utilisateur
    transaction.delete(userId);

    await transaction.commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur DELETE /api/user/delete:", error);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
