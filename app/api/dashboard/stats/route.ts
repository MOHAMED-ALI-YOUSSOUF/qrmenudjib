import { NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/write-client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Récupérer le restaurant de l'utilisateur
    const user = await writeClient.fetch(
      `*[_type == "user" && email == $email][0]{ restaurant->{_id} }`,
      { email: session.user.email }
    )

    if (!user?.restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }

    const restaurantId = user.restaurant._id

    // Récupérer stats
    const [totalDishes, totalViews, weeklyViews, availableDishes, totalCategories, activeCategories

    ] = await Promise.all([
      writeClient.fetch(`count(*[_type == "dish" && restaurant._ref == $restaurantId])`, { restaurantId }),
      writeClient.fetch(`count(*[_type == "view" && restaurant._ref == $restaurantId])`, { restaurantId }),
      writeClient.fetch(`count(*[_type == "view" && restaurant._ref == $restaurantId && viewedAt >= $weekStart])`, {
        restaurantId,
        weekStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }),
      writeClient.fetch(`count(*[_type == "dish" && restaurant._ref == $restaurantId && isAvailable == true])`, { restaurantId }),
      writeClient.fetch(`count(*[_type == "category" && restaurant._ref == $restaurantId])`, { restaurantId }),
      writeClient.fetch(`count(*[_type == "category" && restaurant._ref == $restaurantId && isActive == true])`, { restaurantId }),
    ])

    // Activité récente (plats et QR)
    // dashboard/stats.ts
        const recentActivity = await writeClient.fetch(`
          *[_type == "view" && restaurant._ref == $restaurantId] | order(_createdAt desc)[0..10]{
            _id,
            _type,
            _createdAt,
          }
        `, { restaurantId })

      const formattedActivity = recentActivity.map((activity: any) => ({
        _id: activity._id,
        type: 'view',
        action: 'a consulté votre menu',
        itemName: activity.itemName,
        createdAt: activity._createdAt
      }))


    return NextResponse.json({
      stats: {
        totalDishes,
        totalViews,
        weeklyViews,
        availableDishes,
        totalCategories,
        activeCategories,
      },
      recentActivity: formattedActivity
    })

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
