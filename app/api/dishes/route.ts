import { writeClient } from "@/sanity/lib/write-client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { nanoid } from "nanoid";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "Utilisateur non authentifié" },
      { status: 401 }
    );
  }

  try {
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

    const restaurantId = user.restaurant._id;

    const dishes = await writeClient.fetch(
      `*[_type == "dish" && restaurant._ref == $restaurantId] | order(createdAt desc) {
        _id,
        name,
        slug,
        description,
        price,
        menu->{_id, name},
        category->{_id, name},
        image,
        allergens,
        isAvailable,
        isPopular,
        createdAt,
        updatedAt
      }`,
      { restaurantId }
    );

    return NextResponse.json({ success: true, dishes }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur GET /api/dishes:", errorMessage);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "Utilisateur non authentifié" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { name, description, price, menuId, categoryId, allergens, isAvailable, isPopular } = body;

    if (!name || !categoryId || !price) {
      return NextResponse.json(
        { error: "Le nom, la catégorie et le prix sont requis" },
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

    const restaurantId = user.restaurant._id;

    const dishData: any = {
      _type: "dish",
      name,
      slug: { current: slugify(name) },
      description: description || "",
      price: parseFloat(price),
      restaurant: { _type: "reference", _ref: restaurantId },
      category: { _type: "reference", _ref: categoryId },
      ...(menuId && { menu: { _type: "reference", _ref: menuId } }),
      allergens: allergens || [],
      isAvailable: isAvailable ?? true,
      isPopular: isPopular ?? false,
    };

    const createdDish = await writeClient.create(dishData);

    return NextResponse.json({ success: true, dish: createdDish }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur POST /api/dishes:", errorMessage);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}