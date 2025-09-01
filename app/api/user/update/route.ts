import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/write-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const { name, email, password, oldPassword } = await req.json();

    // Vérifier ancien mot de passe si un nouveau est demandé
    if (password) {
      if (!oldPassword) {
        return NextResponse.json(
          { error: "L'ancien mot de passe est requis." },
          { status: 400 }
        );
      }

      const user = await writeClient.fetch(
        `*[_type == "user" && _id == $id][0] { password }`,
        { id: session.user.id }
      );

      if (!user) {
        return NextResponse.json(
          { error: "Utilisateur non trouvé." },
          { status: 404 }
        );
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Ancien mot de passe incorrect." },
          { status: 400 }
        );
      }
    }

    const updateData: { name?: string; email?: string; password?: string } = {
      name,
      email,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await writeClient.patch(session.user.id).set(updateData).commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur PATCH /api/user/update:", error);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
