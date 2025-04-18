"use client"

import { useId } from "react"

interface EggOvalProps {
  weight: number
  color?: string
  speckled?: boolean
  className?: string
  onClick?: () => void
}

export function EggOval({ weight, color = "#f0e0c8", speckled = false, className = "", onClick }: EggOvalProps) {
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

  // Generate random speckles
  const generateSpeckles = () => {
    if (!speckled) return null

    const speckles = []
    // Generate 30-50 random speckles
    const speckleCount = Math.floor(Math.random() * 20) + 30

    for (let i = 0; i < speckleCount; i++) {
      // Random position within the egg
      const left = Math.random() * 100
      const top = Math.random() * 100

      // Random size (tiny)
      const size = Math.random() * 1.5 + 0.5

      // Random opacity
      const opacity = Math.random() * 0.2 + 0.05

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
            backgroundColor: "rgba(139, 69, 19, 0.7)",
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
