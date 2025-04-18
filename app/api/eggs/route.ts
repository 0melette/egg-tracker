import { NextResponse } from "next/server"
import { getLastNDays } from "@/lib/data-service"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const daysParam = url.searchParams.get("days")
    const days = daysParam ? Number.parseInt(daysParam, 10) : 5

    const data = await getLastNDays(days)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in API route:", error)
    return NextResponse.json({ error: "Failed to fetch egg data" }, { status: 500 })
  }
}
