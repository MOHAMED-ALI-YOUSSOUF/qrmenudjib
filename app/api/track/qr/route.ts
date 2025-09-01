// app/api/track/qr/route.ts
import { NextResponse } from "next/server"
import { writeClient } from "@/sanity/lib/write-client"

export async function POST(req: Request) {
  try {
    const { restaurantId, device } = await req.json()

    if (!restaurantId) {
      return NextResponse.json({ error: "Missing restaurantId" }, { status: 400 })
    }

    await writeClient.create({
      _type: "qrScan",
      restaurant: { _type: "reference", _ref: restaurantId },
      scannedAt: new Date().toISOString(),
      device,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Track QR error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
