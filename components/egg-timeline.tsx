"use client"

import { useState, useEffect } from "react"
import { format, subDays } from "date-fns"
import Image from "next/image"
import { EggOval } from "@/components/egg-oval"
import { EditEggModal } from "@/components/edit-egg-modal"
import type { DayData, Egg } from "@/lib/data-service"

export function EggTimeline() {
  const [recentDays, setRecentDays] = useState<DayData[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedEggIndex, setSelectedEggIndex] = useState<number | undefined>(undefined)
  const [selectedEgg, setSelectedEgg] = useState<Egg | undefined>(undefined)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/eggs?days=7&refresh=${refreshKey}`)
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }
        const data = await response.json()
        setRecentDays(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error fetching egg data:", error)
        setRecentDays([]) // Ensure we always have an array
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [refreshKey])

  if (loading) {
    return <div className="p-8 text-center">Loading egg data...</div>
  }

  // Generate the last 7 days if we don't have enough data
  const ensureLastSevenDays = () => {
    // Create a safe copy of recentDays, ensuring it's an array
    const days: DayData[] = Array.isArray(recentDays) ? [...recentDays] : []
    
    // Create a map for quick date lookup
    const dateMap = new Map(days.map((day) => [day.date, day]))

    // Get today's date
    const today = new Date()

    // Check the last 7 days
    for (let i = 0; i < 7; i++) {
      const date = format(subDays(today, i), "yyyy-MM-dd")
      if (!dateMap.has(date)) {
        days.push({
          date,
          eggs: [],
        })
      }
    }

    // Sort by date (newest first)
    return days.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 7)
  }

  const lastSevenDays = ensureLastSevenDays()

  const openAddEggModal = (date: string) => {
    setSelectedDate(date)
    setSelectedEggIndex(undefined)
    setSelectedEgg(undefined)
    setIsModalOpen(true)
  }

  const openEditEggModal = (date: string, eggIndex: number, egg: Egg) => {
    setSelectedDate(date)
    setSelectedEggIndex(eggIndex)
    setSelectedEgg(egg)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setRefreshKey((prev) => prev + 1) // Refresh data
  }

  const handleEggDeleted = () => {
    // Additional actions if needed when an egg is deleted
  }

  return (
    <>
      <div className="space-y-4">
        {lastSevenDays.map((day) => (
          <div key={day.date} className="rounded-lg overflow-hidden">
            <div className="bg-egg-blue py-2 px-4">
              <span className="font-medium text-egg-cream ">{format(new Date(day.date), "EEEE do MMMM")}</span>
            </div>
            <div
              className="bg-egg-cream p-4 relative min-h-[120px] cursor-pointer"
              onClick={() => openAddEggModal(day.date)}
            >
              {day.eggs.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {day.eggs.map((egg, index) => (
                    <div
                      key={index}
                      className="text-center cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        openEditEggModal(day.date, index, egg)
                      }}
                    >
                      <div className="bg-white p-3 rounded-md inline-block">
                        <div className="w-[100px] h-[130px] relative flex items-center justify-center">
                          <EggOval weight={egg.weight} color={egg.color} speckled={egg.speckled} seed={egg.seed} />
                        </div>
                      </div>
                      <div className="mt-1 font-bold">{egg.weight}g</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[130px]">
                  <p className="text-gray-500 italic">No eggs recorded for this day</p>
                </div>
              )}

              {/* Only show chicken if there are eggs */}
              {day.eggs.length > 0 && (
                <div className="absolute right-4 bottom-4" onClick={(e) => e.stopPropagation()}>
                  <Image src="/images/chicken.png" alt="Chicken" width={120} height={100} className="object-contain" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <EditEggModal
        isOpen={isModalOpen}
        onClose={closeModal}
        date={selectedDate}
        eggIndex={selectedEggIndex}
        initialWeight={selectedEgg?.weight}
        initialSpeckled={selectedEgg?.speckled}
        initialSeed={selectedEgg?.seed}
        initialRowIndex={selectedEgg?.rowIndex}
        onDelete={handleEggDeleted}
      />
    </>
  )
}
