import { NextResponse } from "next/server"
import { getLastNDays } from "@/lib/data-service"
import { getLastNDaysFromSheets } from "@/lib/sheets-service"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const daysParam = url.searchParams.get("days")
    const days = daysParam ? Number.parseInt(daysParam, 10) : 5
    
    // Always use Google Sheets
    let data: any[];
    try {
      data = await getLastNDaysFromSheets(days)
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
