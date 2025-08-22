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

    const categories = await writeClient.fetch(
      `*[_type == "category" && restaurant._ref == $restaurantId] | order(createdAt desc) {
        _id,
        name,
        slug,
        description,
        createdAt,
        updatedAt,
        "dishCount": count(*[_type == "dish" && category._ref == ^._id])
      }`,
      { restaurantId }
    );

    return NextResponse.json({ success: true, categories }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur GET /api/categories:", errorMessage);
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
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Le nom de la catégorie est requis" },
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

    const categoryData: any = {
      _type: "category",
      name,
      slug: { current: slugify(name) },
      description: description || "",
      restaurant: { _type: "reference", _ref: restaurantId },
    };

    const createdCategory = await writeClient.create(categoryData);

    return NextResponse.json({ success: true, category: createdCategory }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur POST /api/categories:", errorMessage);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}