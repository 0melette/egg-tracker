import { NextResponse } from "next/server"
import { getLastNDays } from "@/lib/data-service"
import { getLastNDaysFromSheets } from "@/lib/sheets-service"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const daysParam = url.searchParams.get("days")
    const days = daysParam ? Number.parseInt(daysParam, 10) : 5
    
    // Check if we should use Google Sheets
    const useSheets = process.env.USE_GOOGLE_SHEETS === "true"
    
    // Get data from appropriate source
    let data;
    try {
      data = useSheets 
        ? await getLastNDaysFromSheets(days)
        : await getLastNDays(days)
    } catch (dataError) {
      console.error("Error fetching data:", dataError)
      data = [] // Return empty array rather than failing
    }
      
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in API route:", error)
    return NextResponse.json([], { status: 200 }) // Return empty array instead of error
  }
}
