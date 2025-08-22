import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/write-client";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token et mot de passe requis." }, { status: 400 });
    }

    // Vérifier le token
    const resetToken = await writeClient.fetch(
      `*[_type == "passwordResetToken" && token == $token][0] {
        _id,
        user-> { _id, _type },
        expiresAt
      }`,
      { token }
    );

    if (!resetToken) {
      return NextResponse.json({ error: "Token invalide ou introuvable." }, { status: 400 });
    }

    const now = new Date();
    const expiresAt = new Date(resetToken.expiresAt);
    if (now > expiresAt) {
      return NextResponse.json({ error: "Le token a expiré." }, { status: 400 });
    }

    // Hacher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Mettre à jour le mot de passe de l'utilisateur
    await writeClient
      .patch(resetToken.user._id)
      .set({ password: hashedPassword })
      .commit();

    // Supprimer le token utilisé
    await writeClient.delete(resetToken._id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe :", error);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}