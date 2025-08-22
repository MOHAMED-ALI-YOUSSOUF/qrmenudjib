// api/dashboard/stats/route.ts
import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { format } from 'date-fns';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-11-15',
  useCdn: false,
});

export async function GET() {
  try {
    const restaurantId = 'your-restaurant-id'; // Remplacez par la logique pour obtenir l'ID du restaurant de l'utilisateur
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const dateOneWeekAgo = format(oneWeekAgo, 'yyyy-MM-dd');

    // Requêtes Sanity pour les statistiques
    const statsQuery = `
      {
        "totalMenus": count(*[_type == "menu" && restaurant._ref == "${restaurantId}"]),
        "activeMenus": count(*[_type == "menu" && restaurant._ref == "${restaurantId}" && status == "active"]),
        "totalDishes": count(*[_type == "dish" && restaurant._ref == "${restaurantId}"]),
        "availableDishes": count(*[_type == "dish" && restaurant._ref == "${restaurantId}" && isAvailable == true]),
        "popularDishes": count(*[_type == "dish" && restaurant._ref == "${restaurantId}" && isPopular == true]),
        "averagePrice": avg(*[_type == "dish" && restaurant._ref == "${restaurantId}"].price),
        "totalViews": count(*[_type == "view" && restaurant._ref == "${restaurantId}"]),
        "weeklyViews": count(*[_type == "view" && restaurant._ref == "${restaurantId}" && viewedAt >= "${dateOneWeekAgo}"]),
        "recentActivity": *[_type in ["dish", "menu", "view", "qr"] && restaurant._ref == "${restaurantId}"] | order(_createdAt desc) [0..9] {
          _id,
          "type": _type,
          "action": select(
            _type == "dish" => "Nouveau plat ajouté",
            _type == "menu" => "Nouveau menu créé",
            _type == "view" => "Menu visualisé",
            _type == "qr" => "QR code généré"
          ),
          "itemName": name,
          "createdAt": _createdAt,
        }
      }
    `;

    const data = await client.fetch(statsQuery);

    // Mappage des données pour correspondre à l'interface DashboardStats
    const stats = {
      totalMenus: data.totalMenus || 0,
      totalDishes: data.totalDishes || 0,
      totalViews: data.totalViews || 0,
      weeklyViews: data.weeklyViews || 0,
      activeMenus: data.activeMenus || 0,
      availableDishes: data.availableDishes || 0,
      popularDishes: data.popularDishes || 0,
      averagePrice: data.averagePrice || 0,
    };

    const recentActivity = data.recentActivity.map((activity: any) => ({
      _id: activity._id,
      type: activity.type,
      action: activity.action,
      itemName: activity.itemName,
      createdAt: activity.createdAt,
    }));

    return NextResponse.json({ stats, recentActivity });
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}