import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/write-client";
import { nanoid } from "nanoid";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Vérifier si l'utilisateur existe
    const user = await writeClient.fetch(
      `*[_type == "user" && email == $email][0] { _id, email, name }`,
      { email }
    );

    if (!user) {
      return NextResponse.json({ error: "Aucun compte trouvé avec cet email." }, { status: 404 });
    }

    // Supprimer les anciens tokens
    const oldTokens = await writeClient.fetch(
      `*[_type == "passwordResetToken" && user._ref == $userId] { _id }`,
      { userId: user._id }
    );
    for (const token of oldTokens) {
      await writeClient.delete(token._id);
    }

    // Générer un token de réinitialisation
    const resetToken = nanoid(32);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // Expire dans 1 heure

    // Stocker le token dans Sanity
    await writeClient.create({
      _type: "passwordResetToken",
      user: {
        _type: "reference",
        _ref: user._id,
      },
      token: resetToken,
      expiresAt,
    });

    // Envoyer un email avec le lien de réinitialisation
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;
    const emailResponse = await resend.emails.send({
      from: "no-reply@rohaty.com",
      to: email,
      subject: "Réinitialisation de votre mot de passe",
      html: `
        <p>Bonjour ${user.name},</p>
        <p>Vous avez demandé une réinitialisation de mot de passe. Cliquez sur le lien ci-dessous pour continuer :</p>
        <p><a href="${resetLink}">Réinitialiser mon mot de passe</a></p>
        <p>Ce lien expirera dans 1 heure.</p>
        <p>Si vous n'avez pas fait cette demande, ignorez cet email.</p>
      `,
    });
    console.log("Email envoyé :", emailResponse);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la demande de réinitialisation :", error);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}