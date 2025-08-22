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

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  try {
    // ✅ await context.params avant de l'utiliser
    const params = await context.params;
    const { id } = params;

    const body = await req.json();
    const { name, description, categoryId, status } = body;

    const menuData: any = {
      name,
      slug: { current: slugify(name) },
      description: description || "",
      status,
      ...(categoryId && { category: { _type: "reference", _ref: categoryId } }),
    };

    const updatedMenu = await writeClient.patch(id).set(menuData).commit();
    return NextResponse.json({ success: true, menu: updatedMenu });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  try {
    const params = await context.params;
    const { id } = params;

    await writeClient.delete(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur suppression" }, { status: 500 });
  }
}
