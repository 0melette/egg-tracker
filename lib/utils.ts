import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { NextRequest, NextResponse } from "next/server"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function validateApiKey(request: NextRequest) {
  const secretKey = request.headers.get("X-Secret-Key") || 
                   new URLSearchParams(request.url.split('?')[1] || '').get("secretKey") ||
                   '';
  
  const validKey = process.env.EGG_TRACKER_SECRET_KEY
  
  if (secretKey !== validKey) {
    return NextResponse.json(
      { error: "You don't have permission to modify eggs" },
      { status: 403 }
    )
  }
    return null
}
