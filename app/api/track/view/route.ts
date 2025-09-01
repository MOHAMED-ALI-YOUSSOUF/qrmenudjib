// app/api/track/view/route.ts
import { NextResponse } from "next/server"
import { writeClient } from "@/sanity/lib/write-client"

export async function POST(req: Request) {
  try {
    const { restaurantId, dishId, device } = await req.json()

    if (!restaurantId) {
      return NextResponse.json({ error: "Missing restaurantId" }, { status: 400 })
    }

    await writeClient.create({
      _type: "view",
      restaurant: { _type: "reference", _ref: restaurantId },
      dish: dishId ? { _type: "reference", _ref: dishId } : undefined,
      viewedAt: new Date().toISOString(),
      device,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Track view error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
