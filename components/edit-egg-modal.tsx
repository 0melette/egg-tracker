"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EggOval } from "@/components/egg-oval"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

interface EditEggModalProps {
  isOpen: boolean
  onClose: () => void
  date: string
  eggIndex?: number
  initialWeight?: number
  initialSpeckled?: boolean
  onDelete?: () => void
  initialRowIndex?: number  // Added for Google Sheets
}

export function EditEggModal({
  isOpen,
  onClose,
  date,
  eggIndex,
  initialWeight = 60,
  initialSpeckled = false,
  onDelete,
  initialRowIndex,
}: EditEggModalProps) {
  const router = useRouter()
  const [weight, setWeight] = useState(initialWeight)
  const [weightInput, setWeightInput] = useState(initialWeight.toString())
  const [isSpeckled, setIsSpeckled] = useState(initialSpeckled)
  const [submitting, setSubmitting] = useState(false)
  const isNewEgg = eggIndex === undefined

  const eggColor = "#f0e0c8" // Darker egg color

  useEffect(() => {
    if (isOpen) {
      setWeight(initialWeight)
      setWeightInput(initialWeight.toString())
      setIsSpeckled(initialSpeckled)
    }
  }, [isOpen, initialWeight, initialSpeckled])

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeightInput(e.target.value)
  }

  const applyWeightValue = () => {
    const value = weightInput === "" ? 60 : Number.parseInt(weightInput)
    if (!isNaN(value)) {
      // No clamping - allow any value
      setWeight(value)
      setWeightInput(value.toString())
    } else {
      setWeightInput(weight.toString())
    }
  }

  const toggleSpeckled = () => {
    setIsSpeckled(!isSpeckled)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    applyWeightValue()
    setSubmitting(true)

    try {      
      const egg = {
        weight,
        color: eggColor,
        speckled: isSpeckled === true,
      }
      
      console.log('Created egg object:', egg);

      // API endpoint and method depend on whether we're adding or editing
      const endpoint = isNewEgg ? "/api/add-eggs" : "/api/update-egg"
      const body = isNewEgg 
        ? { date, eggs: [egg] } 
        : { date, eggIndex, egg, rowIndex: initialRowIndex }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${isNewEgg ? "add" : "update"} egg`)
      }

      onClose()
      router.refresh()
    } catch (error) {
      console.error(`Error ${isNewEgg ? "adding" : "updating"} egg:`, error)
      alert(`Failed to ${isNewEgg ? "add" : "update"} egg. Please try again.`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (isNewEgg || !onDelete) return

    setSubmitting(true)
    try {
      const response = await fetch("/api/delete-egg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date, eggIndex, rowIndex: initialRowIndex }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete egg")
      }

      onDelete()
      onClose()
      router.refresh()
    } catch (error) {
      console.error("Error deleting egg:", error)
      alert("Failed to delete egg. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{isNewEgg ? "Add New Egg" : "Edit Egg"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="bg-egg-cream p-6 rounded-lg mb-4">
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-center w-full mb-4">
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

                <div className="bg-white p-3 rounded-md inline-block mx-4">
                  <div className="w-[180px] h-[220px] relative flex items-center justify-center">
                    <EggOval 
                      weight={weight} 
                      color={eggColor} 
                      speckled={isSpeckled === true} 
                      className="scale-150"
                      key={`edit-egg-${date}-${eggIndex || 'new'}`}
                    />
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

              <div className="text-center mb-2">
                <div className="font-bold flex items-center justify-center gap-1 mb-3">
                  <Input
                    type="text"
                    value={weightInput}
                    onChange={handleWeightChange}
                    onBlur={applyWeightValue}
                    className="w-20 text-center font-bold bg-white"
                  />
                  <span className="text-xl">g</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            {!isNewEgg && (
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={submitting}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            )}

            <Button type="submit" className="flex-1 bg-black hover:bg-gray-800" disabled={submitting}>
              {submitting ? "Saving..." : isNewEgg ? "Add Egg" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
