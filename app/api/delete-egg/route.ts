import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { readEggData } from "@/lib/data-service"
import { deleteEggFromSheets } from "@/lib/sheets-service"

export async function POST(request: Request) {
  try {
    const { date, eggIndex, rowIndex } = await request.json()

    // Validate input
    if (!date || eggIndex === undefined) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 })
    }

    // Check if we should use Google Sheets
    const useSheets = process.env.USE_GOOGLE_SHEETS === "true"
    
    if (useSheets) {
      // For Google Sheets, we need the rowIndex in the sheet
      if (rowIndex === undefined) {
        return NextResponse.json({ error: "Missing rowIndex for Sheets delete" }, { status: 400 })
      }
      
      // Delete the egg from Google Sheets
      await deleteEggFromSheets(rowIndex)
    } else {
      // Use local file system
      // Read current data
      const data = await readEggData()

      // Find the day
      const dayIndex = data.eggs.findIndex((day) => day.date === date)
      if (dayIndex === -1 || !data.eggs[dayIndex].eggs[eggIndex]) {
        return NextResponse.json({ error: "Egg not found" }, { status: 404 })
      }

      // Remove the egg
      data.eggs[dayIndex].eggs.splice(eggIndex, 1)

      // If no eggs left for this day, you might want to remove the day entry
      if (data.eggs[dayIndex].eggs.length === 0) {
        // Uncomment if you want to remove empty days
        // data.eggs.splice(dayIndex, 1);
      }

      // Write the updated data back to the file
      const dataFilePath = path.join(process.cwd(), "public", "data", "eggs.json")
      fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting egg:", error)
    return NextResponse.json({ error: "Failed to delete egg" }, { status: 500 })
  }
}
