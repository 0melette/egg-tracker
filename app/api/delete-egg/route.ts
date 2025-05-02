import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { readEggData } from "@/lib/data-service"
import { deleteEggFromSheets } from "@/lib/sheets-service"
import { validateApiKey } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const validationError = validateApiKey(request)
    if (validationError) {
      return validationError
    }
    
    const { date, eggIndex, rowIndex } = await request.json()

    // Validate input
    if (!date || eggIndex === undefined) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 })
    }

    // Always use Google Sheets
    
    // For Google Sheets, we need the rowIndex in the sheet
    if (rowIndex === undefined) {
      return NextResponse.json({ error: "Missing rowIndex for Sheets delete" }, { status: 400 })
    }
    
    // Delete the egg from Google Sheets
    await deleteEggFromSheets(rowIndex)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting egg:", error)
    return NextResponse.json({ error: "Failed to delete egg" }, { status: 500 })
  }
}
