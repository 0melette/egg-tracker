"use client"

import { useId, useMemo } from "react"

// Simple string-to-integer hash (FNV-1a)
function xfnv1a(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// Mulberry32 PRNG, returns a function that yields deterministic pseudorandom [0,1)
function mulberry32(seed: number): () => number {
  let a = seed
  return function() {
    a |= 0
    a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface EggOvalProps {
  weight: number
  color?: string
  speckled?: boolean
  seed?: number
  className?: string
  onClick?: () => void
}

export function EggOval({ weight, color = "#f0e0c8", speckled = false, seed = 0, className = "", onClick }: EggOvalProps) {
  const id = useId()

  // Calculate size based on weight (0-100g range)
  const minWeight = 0
  const maxWeight = 100
  const normalizedWeight = Math.min(Math.max(weight, minWeight), maxWeight)
  const sizePercent = ((normalizedWeight - minWeight) / (maxWeight - minWeight)) * 100

  // Base size + additional size based on weight
  const baseWidth = 50
  const baseHeight = 70
  const maxAdditionalWidth = 50
  const maxAdditionalHeight = 60

  const width = baseWidth + (maxAdditionalWidth * sizePercent) / 100
  const height = baseHeight + (maxAdditionalHeight * sizePercent) / 100

  // Derive a seed from weight and color so each egg's speckles are stable, or use explicit seed if provided
  const rand = useMemo(() => {
    const actualSeed = seed && seed > 0 ? seed : xfnv1a(`${weight}-${color}`)
    return mulberry32(actualSeed)
  }, [weight, color, seed])

  // Generate random speckles
  const generateSpeckles = () => {
    if (!speckled) return null

    const speckles = []
    // Generate 30-50 random speckles
    const speckleCount = Math.floor(rand() * 20) + 30

    for (let i = 0; i < speckleCount; i++) {
      // Random position within the egg
      const left = rand() * 100
      const top = rand() * 100

      // Increased size for better visibility
      const size = rand() * 2.5 + 1.0

      // Increased opacity for better visibility
      const opacity = rand() * 0.5 + 0.3

      speckles.push(
        <div
          key={`${id}-speckle-${i}`}
          style={{
            position: "absolute",
            left: `${left}%`,
            top: `${top}%`,
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: "50%",
            backgroundColor: "rgba(139, 69, 19, 0.9)",
            opacity,
          }}
        />,
      )
    }

    return speckles
  }

  return (
    <div
      className={`relative flex items-center justify-center ${className} ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <div
        className="rounded-full relative overflow-hidden"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: color, // Darker egg color
          borderRadius: "50%",
          transform: "rotate(0deg)",
          boxShadow: "inset 0 -10px 20px rgba(0,0,0,0.1)",
        }}
      >
        {speckled && generateSpeckles()}
      </div>
    </div>
  )
}
