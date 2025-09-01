import { NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/write-client'

export async function POST(req: Request) {
  try {
    const { restaurantId, dishId } = await req.json()

    if (!restaurantId) {
      return NextResponse.json({ error: 'restaurantId is required' }, { status: 400 })
    }

    await writeClient.create({
      _type: 'view',
      restaurant: { _ref: restaurantId },
      dish: dishId ? { _ref: dishId } : undefined,
      viewedAt: new Date().toISOString()
    })

    return NextResponse.json({ message: 'View recorded' })
  } catch (error) {
    console.error('Error recording view:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
