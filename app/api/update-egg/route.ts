import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { readEggData } from "@/lib/data-service"
import { updateEggInSheets } from "@/lib/sheets-service"
import { validateApiKey } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const validationError = validateApiKey(request)
    if (validationError) {
      return validationError
    }
    
    const { date, eggIndex, egg, rowIndex } = await request.json()

    console.log("Update egg API received:", {egg });
    
    // Validate input
    if (!date || eggIndex === undefined || !egg) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 })
    }

    // Always use Google Sheets
    
    // For Google Sheets, we need the rowIndex in the sheet
    if (rowIndex === undefined) {
      return NextResponse.json({ error: "Missing rowIndex for Sheets update" }, { status: 400 })
    }
    if (typeof rowIndex !== "number" || !Number.isInteger(rowIndex) || rowIndex <= 0) {
      return NextResponse.json({ error: "Invalid rowIndex. It must be a positive integer." }, { status: 400 })
    }
    
    // Update the egg in Google Sheets
    await updateEggInSheets(rowIndex, egg)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating egg:", error)
    return NextResponse.json({ error: "Failed to update egg" }, { status: 500 })
  }
}
