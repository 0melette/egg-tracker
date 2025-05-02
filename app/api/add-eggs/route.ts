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

    // Check if we should use Google Sheets
    const useSheets = process.env.USE_GOOGLE_SHEETS === "true"
    
    if (useSheets) {
      // Add eggs to Google Sheets
      await addEggsToSheets(date, eggs)
    } else {
      // Use local file system
      // Read current data
      const data = await readEggData()

      // Find if the date already exists
      const existingDayIndex = data.eggs.findIndex((day) => day.date === date)

      if (existingDayIndex !== -1) {
        // Update existing day
        data.eggs[existingDayIndex].eggs = [...data.eggs[existingDayIndex].eggs, ...eggs]
      } else {
        // Add new day
        data.eggs.push({
          date,
          eggs,
        })
      }

      // Sort the data by date (newest first)
      data.eggs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      // Write the updated data back to the file
      const dataFilePath = path.join(process.cwd(), "public", "data", "eggs.json")
      fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error adding eggs:", error)
    return NextResponse.json({ error: "Failed to add eggs" }, { status: 500 })
  }
}
