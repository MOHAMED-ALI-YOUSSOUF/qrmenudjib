import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/write-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  // Vérifier que l'utilisateur est bien connecté et qu'il consulte son propre compte
  if (!session || !session.user || session.user.id !== params.id) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const userData = await writeClient.fetch(
      `*[_type == "user" && _id == $id][0] { name, email }`,
      { id: params.id }
    );

    if (!userData) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé." },
        { status: 404 }
      );
    }

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Erreur GET /api/user/[id]:", error);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
