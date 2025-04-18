import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const chickenId = searchParams.get("id") || "1"

  // Generate a placeholder SVG for chicken images
  const colors = {
    "1": { body: "#B25D25", comb: "#D62828" },
    "2": { body: "#6C757D", comb: "#D62828" },
    "3": { body: "#F8F9FA", comb: "#D62828" },
  }

  const color = colors[chickenId as keyof typeof colors] || colors["1"]

  const svg = `
    <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <!-- Body -->
      <ellipse cx="100" cy="120" rx="60" ry="50" fill="${color.body}" />
      
      <!-- Head -->
      <circle cx="160" cy="80" r="30" fill="${color.body}" />
      
      <!-- Comb -->
      <path d="M160 50 L170 60 L180 50 L190 60 L180 70 L170 65 L160 70 L150 60 Z" fill="${color.comb}" />
      
      <!-- Beak -->
      <path d="M190 80 L210 85 L190 90 Z" fill="#FFC107" />
      
      <!-- Eye -->
      <circle cx="175" cy="75" r="5" fill="black" />
      
      <!-- Feet -->
      <path d="M80 170 L70 190 L90 190 Z" fill="#FFC107" />
      <path d="M120 170 L110 190 L130 190 Z" fill="#FFC107" />
    </svg>
  `

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
    },
  })
}
