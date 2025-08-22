import { writeClient } from "@/sanity/lib/write-client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "Utilisateur non authentifié" },
      { status: 401 }
    );
  }

  try {
    // Récupérer l'utilisateur et son restaurant
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

    // Calculer les statistiques
    const stats = await Promise.all([
      // Total et menus actifs
      writeClient.fetch(
        `{
          "totalMenus": count(*[_type == "menu" && restaurant._ref == $restaurantId]),
          "activeMenus": count(*[_type == "menu" && restaurant._ref == $restaurantId && status == "active"])
        }`,
        { restaurantId }
      ),

      // Total plats et disponibles
      writeClient.fetch(
        `{
          "totalDishes": count(*[_type == "dish" && restaurant._ref == $restaurantId]),
          "availableDishes": count(*[_type == "dish" && restaurant._ref == $restaurantId && isAvailable == true]),
          "popularDishes": count(*[_type == "dish" && restaurant._ref == $restaurantId && isPopular == true]),
          "averagePrice": math::avg(*[_type == "dish" && restaurant._ref == $restaurantId].price)
        }`,
        { restaurantId }
      ),

      // Vues totales et cette semaine
      writeClient.fetch(
        `{
          "totalViews": count(*[_type == "view" && restaurant._ref == $restaurantId]),
          "weeklyViews": count(*[_type == "view" && restaurant._ref == $restaurantId && viewedAt > now() - 60*60*24*7])
        }`,
        { restaurantId }
      ),
    ]);

    const dashboardStats = {
      totalMenus: stats[0].totalMenus || 0,
      activeMenus: stats[0].activeMenus || 0,
      totalDishes: stats[1].totalDishes || 0,
      availableDishes: stats[1].availableDishes || 0,
      popularDishes: stats[1].popularDishes || 0,
      averagePrice: stats[1].averagePrice || 0,
      totalViews: stats[2].totalViews || 0,
      weeklyViews: stats[2].weeklyViews || 0,
    };

    // Activité récente
    const recentActivity = await writeClient.fetch(
      `*[
        _type in ["dish", "menu", "view"] && 
        restaurant._ref == $restaurantId
      ] | order(createdAt desc, _createdAt desc, viewedAt desc)[0...10] {
        _id,
        _type,
        name,
        createdAt,
        _createdAt,
        viewedAt,
        "itemName": coalesce(name, "Action inconnue"),
        "action": select(
          _type == "dish" => "Nouveau plat ajouté",
          _type == "menu" => "Nouveau menu créé",
          _type == "view" => "Menu consulté",
          "Action effectuée"
        ),
        "type": select(
          _type == "dish" => "dish",
          _type == "menu" => "menu",
          _type == "view" => "view",
          "unknown"
        ),
        "createdAt": coalesce(createdAt, _createdAt, viewedAt, now())
      }`,
      { restaurantId }
    );

    return NextResponse.json(
      { 
        success: true, 
        stats: dashboardStats,
        recentActivity: recentActivity || []
      }, 
      { status: 200 }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur GET /api/dashboard/stats:", errorMessage);
    return NextResponse.json(
      { success: false, error: errorMessage }, 
      { status: 500 }
    );
  }
}