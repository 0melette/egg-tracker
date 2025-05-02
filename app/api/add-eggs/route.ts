import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { readEggData } from "@/lib/data-service"
import { addEggsToSheets } from "@/lib/sheets-service"

export async function POST(request: Request) {
  try {
    const { date, eggs } = await request.json()

    // Validate input
    if (!date || !Array.isArray(eggs) || eggs.length === 0) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 })
    }

    // Always use Google Sheets
    await addEggsToSheets(date, eggs)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error adding eggs:", error)
    return NextResponse.json({ error: "Failed to add eggs" }, { status: 500 })
  }
}
