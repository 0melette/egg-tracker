import { NextResponse } from "next/server"
import { getEggStats } from "@/lib/data-service"

export async function GET() {
  try {
    const stats = await getEggStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error in API route:", error)
    return NextResponse.json({ error: "Failed to fetch egg statistics" }, { status: 500 })
  }
}
