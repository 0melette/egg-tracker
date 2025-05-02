import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { NextRequest, NextResponse } from "next/server"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSecretKey(): string {
  return prompt("what's the secret password 🤭?") || '';
}

export function validateApiKey(request: NextRequest) {
  const secretKey = request.headers.get("X-Secret-Key") || 
                   new URLSearchParams(request.url.split('?')[1] || '').get("secretKey") ||
                   '';
  
  const validKey = process.env.EGG_TRACKER_SECRET_KEY
  
  // Using constant-time comparison to prevent timing attacks
  if (!secretKey || !validKey || !timingSafeEqual(secretKey, validKey)) {
    return NextResponse.json(
      { error: "You don't have permission to modify eggs" },
      { status: 403 }
    )
  }
  return null
}

// Constant-time string comparison to prevent timing attacks
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // If lengths are different, return false but still do the comparison
    // to prevent timing differences
    let result = 0;
    const maxLength = Math.max(a.length, b.length);
    for (let i = 0; i < maxLength; i++) {
      result |= (i < a.length ? a.charCodeAt(i) : 0) ^ (i < b.length ? b.charCodeAt(i) : 0);
    }
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
