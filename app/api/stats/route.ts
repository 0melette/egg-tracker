import { NextResponse } from "next/server"
import { getEggStats } from "@/lib/data-service"
import { getEggStatsFromSheets } from "@/lib/sheets-service"

export async function GET() {
  try {
    // Check if we should use Google Sheets
    const useSheets = process.env.USE_GOOGLE_SHEETS === "true"
    
    // Get stats from appropriate source
    const stats = useSheets 
      ? await getEggStatsFromSheets()
      : await getEggStats()
      
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error in API route:", error)
    return NextResponse.json({ error: "Failed to fetch egg statistics" }, { status: 500 })
  }
}
