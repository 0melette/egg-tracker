import { NextResponse } from "next/server"
import { getEggStats } from "@/lib/data-service"
import { getEggStatsFromSheets } from "@/lib/sheets-service"

export async function GET() {
  try {
    // Always use Google Sheets
    const stats = await getEggStatsFromSheets()
      
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error in API route:", error)
    return NextResponse.json({ error: "Failed to fetch egg statistics" }, { status: 500 })
  }
}
