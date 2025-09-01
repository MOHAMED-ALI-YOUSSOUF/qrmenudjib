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
    const dishId = req.nextUrl.pathname.split('/').pop();
    if (!dishId) {
      return NextResponse.json(
        { success: false, error: "ID du plat requis" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, description, price, image, categoryId,  isAvailable, isPopular } = body;

    if (!name || !categoryId || !price) {
      return NextResponse.json(
        { success: false, error: "Le nom, la catégorie et le prix sont requis" },
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

    const dishData: any = {
      name,
      slug: { current: slugify(name) },
      description: description || "",
      price: parseFloat(price),
      category: { _type: "reference", _ref: categoryId },
      image,
      isAvailable: isAvailable ?? true,
      isPopular: isPopular ?? false,
    };

    const updatedDish = await writeClient
      .patch(dishId)
      .set(dishData)
      .commit();

    return NextResponse.json({ success: true, dish: updatedDish }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur PATCH /api/dishes/[id]:", errorMessage);
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
    const dishId = req.nextUrl.pathname.split('/').pop();
    if (!dishId) {
      return NextResponse.json(
        { success: false, error: "ID du plat requis" },
        { status: 400 }
      );
    }

    await writeClient.delete(dishId);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur DELETE /api/dishes/[id]:", errorMessage);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}