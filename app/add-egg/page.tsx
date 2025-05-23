"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { EggOval } from "@/components/egg-oval"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { format } from "date-fns"

export default function AddEgg() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dateParam = searchParams.get("date") || format(new Date(), "yyyy-MM-dd")
  const formattedDate = format(new Date(dateParam), "EEEE do MMMM")

  const [eggCount, setEggCount] = useState(1)
  const [currentEgg, setCurrentEgg] = useState(1)
  const [eggWeights, setEggWeights] = useState<number[]>([60])
  const [isSpeckled, setIsSpeckled] = useState<boolean[]>([false])
  const [seeds, setSeeds] = useState<number[]>([0])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // Initialize egg weights array with default values when count changes
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
    
    // Initialize isSpeckled array
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
    
    // Initialize seeds array
    setSeeds((prev) => {
      const newSeeds = [...prev]
      // Add more seed values if needed
      while (newSeeds.length < eggCount) {
        newSeeds.push(0)
      }
      // Remove extra values if count decreased
      while (newSeeds.length > eggCount) {
        newSeeds.pop()
      }
      return newSeeds
    })
    
    // Reset current egg index if it's out of bounds
    setCurrentEgg((prev) => Math.min(prev, eggCount))
  }, [eggCount])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Prepare the egg data
      const eggs = eggWeights.map((weight, index) => {
        // Generate a random seed for speckled eggs
        const seed = isSpeckled[index] ? (seeds[index] || Math.floor(Math.random() * 1000000) + 1) : 0;
        
        return {
          weight,
          color: isSpeckled[index] ? "#f0d6a3" : "#fbe5ce", // Different color for speckled eggs
          speckled: isSpeckled[index],
          seed: seed
        }
      })

      // Send the data to the API
      const response = await fetch("/api/add-eggs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: dateParam,
          eggs,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save eggs")
      }

      // Redirect to home on success
      router.push("/")
    } catch (error) {
      console.error("Error saving eggs:", error)
      alert("Failed to save eggs. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Button variant="outline" asChild className="mb-4">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>

      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-2">Enter an Egg</h1>
        <p className="text-gray-500 mb-6">Adding eggs for {formattedDate}</p>

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
                onChange={(e) => setEggCount(Number.parseInt(e.target.value))}
                className="w-20 mx-auto text-center text-xl bg-white"
              />
            </div>

            {eggCount > 0 && (
              <div className="flex items-center justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (currentEgg > 1) {
                      setCurrentEgg(prev => prev - 1);
                    } else {
                      // Toggle speckled status
                      setIsSpeckled(prev => {
                        const newSpeckled = [...prev];
                        newSpeckled[currentEgg - 1] = !newSpeckled[currentEgg - 1];
                        
                        // Update seed if needed
                        if (newSpeckled[currentEgg - 1] && seeds[currentEgg - 1] === 0) {
                          setSeeds(prev => {
                            const newSeeds = [...prev];
                            newSeeds[currentEgg - 1] = Math.floor(Math.random() * 1000000) + 1;
                            return newSeeds;
                          });
                        } else if (!newSpeckled[currentEgg - 1]) {
                          setSeeds(prev => {
                            const newSeeds = [...prev];
                            newSeeds[currentEgg - 1] = 0;
                            return newSeeds;
                          });
                        }
                        
                        return newSpeckled;
                      });
                    }
                  }}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>

                <div className="mx-4 text-center">
                  <div className="bg-white p-3 rounded-md inline-block mb-2">
                    <div className="w-[150px] h-[200px] relative flex items-center justify-center">
                      <EggOval 
                        weight={eggWeights[currentEgg - 1]} 
                        color={isSpeckled[currentEgg - 1] ? "#f0d6a3" : "#fbe5ce"}
                        speckled={isSpeckled[currentEgg - 1]}
                        seed={seeds[currentEgg - 1]}
                        className="scale-150" 
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-center mb-2 text-xs text-gray-500">
                      Click arrows to toggle speckled
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <EggOval weight={40} className="scale-50" />
                      <div className="font-bold">{eggWeights[currentEgg - 1]}g</div>
                      <EggOval weight={80} className="scale-75" />
                    </div>
                    <Slider
                      value={[eggWeights[currentEgg - 1]]}
                      min={40}
                      max={80}
                      step={1}
                      onValueChange={(value) => {
                        setEggWeights((prev) => {
                          const newWeights = [...prev]
                          newWeights[currentEgg - 1] = value[0]
                          return newWeights
                        })
                      }}
                      className="w-[200px]"
                    />
                    {eggCount > 1 && (
                      <div className="flex justify-between mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentEgg((prev) => Math.max(1, prev - 1))}
                          disabled={currentEgg === 1}
                        >
                          Previous Egg
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentEgg((prev) => Math.min(eggCount, prev + 1))}
                          disabled={currentEgg === eggCount}
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
                  onClick={() => {
                    if (currentEgg < eggCount) {
                      setCurrentEgg(prev => prev + 1);
                    } else {
                      // Toggle speckled status
                      setIsSpeckled(prev => {
                        const newSpeckled = [...prev];
                        newSpeckled[currentEgg - 1] = !newSpeckled[currentEgg - 1];
                        
                        // Update seed if needed
                        if (newSpeckled[currentEgg - 1] && seeds[currentEgg - 1] === 0) {
                          setSeeds(prev => {
                            const newSeeds = [...prev];
                            newSeeds[currentEgg - 1] = Math.floor(Math.random() * 1000000) + 1;
                            return newSeeds;
                          });
                        } else if (!newSpeckled[currentEgg - 1]) {
                          setSeeds(prev => {
                            const newSeeds = [...prev];
                            newSeeds[currentEgg - 1] = 0;
                            return newSeeds;
                          });
                        }
                        
                        return newSpeckled;
                      });
                    }
                  }}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </div>
            )}
          </div>

          <div className="text-center">
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Saving..." : "Save Egg Collection"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
