import { NextResponse } from 'next/server'
import { writeClient  } from '@/sanity/lib/write-client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's restaurant
    const user = await writeClient.fetch(
      `*[_type == "user" && email == $email][0]{
        restaurant->{_id}
      }`,
      { email: session.user.email }
    )

    if (!user?.restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }

    const restaurantId = user.restaurant._id

    // Fetch stats
    const [
      totalMenus,
      totalDishes,
      totalViews,
      weeklyViews,
      activeMenus,
      availableDishes,
      popularDishes,
      dishes
    ] = await Promise.all([
      writeClient.fetch(`count(*[_type == "menu" && restaurant._ref == $restaurantId])`, { restaurantId }),
      writeClient.fetch(`count(*[_type == "dish" && restaurant._ref == $restaurantId])`, { restaurantId }),
      writeClient.fetch(`count(*[_type == "view" && restaurant._ref == $restaurantId])`, { restaurantId }),
      writeClient.fetch(`count(*[_type == "view" && restaurant._ref == $restaurantId && viewedAt >= $weekStart])`, {
        restaurantId,
        weekStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }),
      writeClient.fetch(`count(*[_type == "menu" && restaurant._ref == $restaurantId && status == "active"])`, { restaurantId }),
      writeClient.fetch(`count(*[_type == "dish" && restaurant._ref == $restaurantId && isAvailable == true])`, { restaurantId }),
      writeClient.fetch(`count(*[_type == "dish" && restaurant._ref == $restaurantId && isPopular == true])`, { restaurantId }),
      writeClient.fetch(`*[_type == "dish" && restaurant._ref == $restaurantId && defined(price)]{price}`, { restaurantId })
    ])

    // Calculate average price
    const averagePrice = dishes.length > 0 
      ? dishes.reduce((sum: number, dish: any) => sum + dish.price, 0) / dishes.length 
      : 0

    // Fetch recent activity
    const recentActivity = await writeClient.fetch(`
      *[_type == "view" && restaurant._ref == $restaurantId] | order(viewedAt desc)[0..10]{
        _id,
        viewType,
        menu->{name},
        dish->{name},
        viewedAt
      }
    `, { restaurantId })

    const formattedActivity = recentActivity.map((activity: any) => ({
      _id: activity._id,
      type: activity.viewType,
      action: `Vue ${activity.viewType}`,
      itemName: activity[activity.viewType]?.name || 'Unknown',
      createdAt: activity.viewedAt
    }))

    return NextResponse.json({
      stats: {
        totalMenus,
        totalDishes,
        totalViews,
        weeklyViews,
        activeMenus,
        availableDishes,
        popularDishes,
        averagePrice
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