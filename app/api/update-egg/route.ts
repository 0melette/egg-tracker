import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { readEggData } from "@/lib/data-service"

export async function POST(request: Request) {
  try {
    const { date, eggIndex, egg } = await request.json()

    // Validate input
    if (!date || eggIndex === undefined || !egg) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 })
    }

    // Read current data
    const data = await readEggData()

    // Find the day
    const dayIndex = data.eggs.findIndex((day) => day.date === date)
    if (dayIndex === -1 || !data.eggs[dayIndex].eggs[eggIndex]) {
      return NextResponse.json({ error: "Egg not found" }, { status: 404 })
    }

    // Update the egg
    data.eggs[dayIndex].eggs[eggIndex] = egg

    // Write the updated data back to the file
    const dataFilePath = path.join(process.cwd(), "public", "data", "eggs.json")
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating egg:", error)
    return NextResponse.json({ error: "Failed to update egg" }, { status: 500 })
  }
}
