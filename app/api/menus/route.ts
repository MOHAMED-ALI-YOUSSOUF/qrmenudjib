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

    const menus = await writeClient.fetch(
      `*[_type == "menu" && restaurant._ref == $restaurantId] | order(createdAt desc) {
        _id,
        name,
        slug,
        description,
        image,
        status,
        isDefault,
        createdAt,
        updatedAt,
        category->{name, _id},
        "dishCount": count(*[_type == "dish" && menu._ref == ^._id]),
        "views": count(*[_type == "view" && menu._ref == ^._id])
      }`,
      { restaurantId }
    );

    return NextResponse.json({ success: true, menus }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur GET /api/menus:", errorMessage);
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
    const { name, description, categoryId, image, status = "draft" } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Le nom du menu est requis" },
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

    const menuData: any = {
      _type: "menu",
      name,
      slug: { current: slugify(name) },
      description: description || "",
      restaurant: { _type: "reference", _ref: restaurantId },
      status,
      ...(categoryId && { category: { _type: "reference", _ref: categoryId } }),
      ...(image && { image }),
    };

    const createdMenu = await writeClient.create(menuData);

    return NextResponse.json({ success: true, menu: createdMenu }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur POST /api/menus:", errorMessage);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "Utilisateur non authentifié" },
      { status: 401 }
    );
  }

  try {
    const menuId = req.nextUrl.pathname.split('/').pop();
    if (!menuId) {
      return NextResponse.json(
        { success: false, error: "ID du menu requis" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, description, categoryId, status } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Le nom du menu est requis" },
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

    const menuData: any = {
      name,
      slug: { current: slugify(name) },
      description: description || "",
      status,
      ...(categoryId && { category: { _type: "reference", _ref: categoryId } }),
    };

    const updatedMenu = await writeClient
      .patch(menuId)
      .set(menuData)
      .commit();

    return NextResponse.json({ success: true, menu: updatedMenu }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur PATCH /api/menus:", errorMessage);
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
    const menuId = req.nextUrl.pathname.split('/').pop();
    if (!menuId) {
      return NextResponse.json(
        { success: false, error: "ID du menu requis" },
        { status: 400 }
      );
    }

    await writeClient.delete(menuId);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur DELETE /api/menus:", errorMessage);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}