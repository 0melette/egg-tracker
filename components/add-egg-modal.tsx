"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { EggOval } from "@/components/egg-oval"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

interface AddEggModalProps {
  isOpen: boolean
  onClose: () => void
  date: string
}

export function AddEggModal({ isOpen, onClose, date }: AddEggModalProps) {
  const router = useRouter()
  const formattedDate = format(new Date(date), "EEEE do MMMM")

  const [eggCount, setEggCount] = useState(1)
  const [currentEgg, setCurrentEgg] = useState(1)
  const [eggWeights, setEggWeights] = useState<number[]>([60])
  const [isSpeckled, setIsSpeckled] = useState<boolean[]>([false])
  const [submitting, setSubmitting] = useState(false)
  const [weightInput, setWeightInput] = useState<string>("60")

  useEffect(() => {
    // Reset state when modal opens
    if (isOpen) {
      setEggCount(1)
      setCurrentEgg(1)
      setEggWeights([60])
      setIsSpeckled([false])
      setWeightInput("60")
    }
  }, [isOpen])

  useEffect(() => {
    // Initialize egg weights and speckled arrays with default values when count changes
    setEggWeights((prev) => {
      const newWeights = [...prev]
      // Add more weights if needed
      while (newWeights.length < eggCount) {
        newWeights.push(60)
      }
      // Remove extra weights if count decreased
      while (newWeights.length > eggCount) {
        newWeights.pop()
      }
      return newWeights
    })

    setIsSpeckled((prev) => {
      const newSpeckled = [...prev]
      // Add more speckled values if needed
      while (newSpeckled.length < eggCount) {
        newSpeckled.push(false)
      }
      // Remove extra values if count decreased
      while (newSpeckled.length > eggCount) {
        newSpeckled.pop()
      }
      return newSpeckled
    })

    // Reset current egg index if it's out of bounds
    setCurrentEgg((prev) => Math.min(prev, eggCount))
  }, [eggCount])

  // Update weightInput when currentEgg changes
  useEffect(() => {
    setWeightInput(eggWeights[currentEgg - 1].toString())
  }, [currentEgg, eggWeights])

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow any input without validation
    setWeightInput(e.target.value)
  }

  const applyWeightValue = () => {
    // Only apply the value when focus is lost or form is submitted
    const value = weightInput === "" ? 60 : Number.parseInt(weightInput)
    if (!isNaN(value)) {
      // Clamp between 40-80 only when applying the value
      const clampedValue = Math.min(Math.max(value, 40), 80)
      setEggWeights((prev) => {
        const newWeights = [...prev]
        newWeights[currentEgg - 1] = clampedValue
        return newWeights
      })
      setWeightInput(clampedValue.toString())
    } else {
      // If invalid, reset to current weight
      setWeightInput(eggWeights[currentEgg - 1].toString())
    }
  }

  const handleSliderChange = (value: number[]) => {
    setEggWeights((prev) => {
      const newWeights = [...prev]
      newWeights[currentEgg - 1] = value[0]
      return newWeights
    })
    setWeightInput(value[0].toString())
  }

  const toggleSpeckled = () => {
    setIsSpeckled((prev) => {
      const newSpeckled = [...prev]
      newSpeckled[currentEgg - 1] = !newSpeckled[currentEgg - 1]
      return newSpeckled
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Apply any pending weight value
    applyWeightValue()

    setSubmitting(true)

    try {
      // Prepare the egg data
      const eggs = eggWeights.map((weight, index) => ({
        weight,
        color: isSpeckled[index] ? "#f0d6a3" : "#fbe5ce", // Slightly darker for speckled eggs
        speckled: isSpeckled[index],
      }))

      // Send the data to the API
      const response = await fetch("/api/add-eggs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          eggs,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save eggs")
      }

      // Close modal and refresh data
      onClose()
      router.refresh()
    } catch (error) {
      console.error("Error saving eggs:", error)
      alert("Failed to save eggs. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Enter an Egg</DialogTitle>
          <DialogDescription>Adding eggs for {formattedDate}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="bg-egg-cream p-6 rounded-lg mb-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl mb-4">how many eggs today?</h2>
              {eggCount > 1 && (
                <div className="text-sm font-medium mb-2">
                  Egg {currentEgg} of {eggCount}
                </div>
              )}
              <Input
                type="number"
                min="1"
                max="20"
                value={eggCount}
                onChange={(e) => setEggCount(Number.parseInt(e.target.value) || 1)}
                className="w-20 mx-auto text-center text-xl bg-white"
              />
            </div>

            {eggCount > 0 && (
              <div className="flex items-center justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={toggleSpeckled}
                  className="hover:bg-transparent"
                >
                  <ChevronLeft className="h-8 w-8" />
                  <span className="sr-only">Toggle speckled</span>
                </Button>

                <div className="mx-4 text-center">
                  <div className="bg-white p-3 rounded-md inline-block mb-4">
                    <div className="w-[180px] h-[220px] relative flex items-center justify-center">
                      <EggOval
                        weight={eggWeights[currentEgg - 1]}
                        color={isSpeckled[currentEgg - 1] ? "#f0d6a3" : "#fbe5ce"}
                        speckled={isSpeckled[currentEgg - 1]}
                        className="scale-150"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <EggOval weight={40} className="scale-50" />
                      <div className="font-bold flex items-center gap-1">
                        <span className="text-2xl">{eggWeights[currentEgg - 1]}</span>
                        <span className="text-xl">g</span>
                      </div>
                      <EggOval weight={80} className="scale-75" />
                    </div>

                    <div className="mb-4">
                      <Slider
                        value={[eggWeights[currentEgg - 1]]}
                        min={40}
                        max={80}
                        step={1}
                        onValueChange={handleSliderChange}
                        className="w-[220px]"
                      />
                    </div>

                    <div className="flex justify-center mb-4">
                      <Input
                        type="text"
                        value={weightInput}
                        onChange={handleWeightChange}
                        onBlur={applyWeightValue}
                        className="w-20 text-center font-bold bg-white"
                      />
                    </div>

                    {eggCount > 1 && (
                      <div className="flex justify-between mt-4 gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentEgg((prev) => Math.max(1, prev - 1))}
                          disabled={currentEgg === 1}
                          className="bg-white hover:bg-gray-100"
                        >
                          Previous Egg
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentEgg((prev) => Math.min(eggCount, prev + 1))}
                          disabled={currentEgg === eggCount}
                          className="bg-white hover:bg-gray-100"
                        >
                          Next Egg
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={toggleSpeckled}
                  className="hover:bg-transparent"
                >
                  <ChevronRight className="h-8 w-8" />
                  <span className="sr-only">Toggle speckled</span>
                </Button>
              </div>
            )}
          </div>

          <div className="text-center">
            <Button type="submit" className="w-full bg-black hover:bg-gray-800" disabled={submitting}>
              {submitting ? "Saving..." : "Save Egg Collection"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
