import { writeClient } from "@/sanity/lib/write-client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "Utilisateur non authentifié" },
      { status: 401 }
    );
  }

  try {
    const categoryId = req.nextUrl.pathname.split('/').pop();
    if (!categoryId) {
      return NextResponse.json(
        { success: false, error: "ID de la catégorie requis" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Le nom de la catégorie est requis" },
        { status: 400 }
      );
    }

    const user = await writeClient.fetch(
      `*[_type == "user" && email == $email][0] {
        _id,
        restaurant->{_id}
      }`,
      { email: session.user.email }
    );

    if (!user || !user.restaurant?._id) {
      return NextResponse.json(
        { success: false, error: "Aucun restaurant associé à l'utilisateur" },
        { status: 400 }
      );
    }

    const categoryData: any = {
      name,
      slug: { current: slugify(name) },
      description: description || "",
      image: body.image || null,  
      order: body.order || 0,  
      isActive: body.isActive !== undefined ? body.isActive : true,
    };

    const updatedCategory = await writeClient
      .patch(categoryId)
      .set(categoryData)
      .commit();

    return NextResponse.json({ success: true, category: updatedCategory }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur PATCH /api/categories/[id]:", errorMessage);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "Utilisateur non authentifié" },
      { status: 401 }
    );
  }

  try {
    const categoryId = req.nextUrl.pathname.split('/').pop();
    if (!categoryId) {
      return NextResponse.json(
        { success: false, error: "ID de la catégorie requis" },
        { status: 400 }
      );
    }

    await writeClient.delete(categoryId);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur DELETE /api/categories/[id]:", errorMessage);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}