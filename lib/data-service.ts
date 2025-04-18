import fs from "fs"
import path from "path"
import { sub, format } from "date-fns"

// Define types for our data
export interface Egg {
  weight: number
  color: string
  speckled?: boolean
}

export interface DayData {
  date: string
  eggs: Egg[]
}

export interface EggData {
  eggs: DayData[]
}

// Path to our JSON file
const dataFilePath = path.join(process.cwd(), "public", "data", "eggs.json")

// Function to read the JSON file
export async function readEggData(): Promise<EggData> {
  try {
    // Check if the file exists
    if (!fs.existsSync(dataFilePath)) {
      // If not, create it with default data
      const defaultData: EggData = {
        eggs: generateDefaultData(),
      }
      fs.writeFileSync(dataFilePath, JSON.stringify(defaultData, null, 2))
      return defaultData
    }

    // Read the file
    const data = fs.readFileSync(dataFilePath, "utf8")
    return JSON.parse(data) as EggData
  } catch (error) {
    console.error("Error reading egg data:", error)
    // Return default data if there's an error
    return { eggs: generateDefaultData() }
  }
}

// Function to get the last N days of data
export async function getLastNDays(n = 7): Promise<DayData[]> {
  const data = await readEggData()

  // Sort the data by date (newest first)
  const sortedData = [...data.eggs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Return the last N days or all days if less than N
  return sortedData.slice(0, n)
}

// Function to generate default data for the last 7 days
function generateDefaultData(): DayData[] {
  const days: DayData[] = []
  const eggColor = "#f0e0c8" // Darker egg color

  for (let i = 0; i < 7; i++) {
    const date = sub(new Date(), { days: i })
    const formattedDate = format(date, "yyyy-MM-dd")

    // Generate random number of eggs (0-4)
    const eggCount = Math.floor(Math.random() * 5)
    const eggs: Egg[] = []

    for (let j = 0; j < eggCount; j++) {
      // Generate random weight between 30-80g
      const weight = Math.floor(Math.random() * 50) + 30
      // Randomly decide if egg is speckled
      const speckled = Math.random() > 0.7
      eggs.push({
        weight,
        color: eggColor, // Darker egg color
        speckled,
      })
    }

    days.push({
      date: formattedDate,
      eggs,
    })
  }

  return days
}

// Function to get statistics for analytics
export async function getEggStats() {
  const data = await readEggData()
  let totalEggs = 0
  let totalWeight = 0
  let speckledCount = 0

  data.eggs.forEach((day) => {
    totalEggs += day.eggs.length
    day.eggs.forEach((egg) => {
      totalWeight += egg.weight
      if (egg.speckled) {
        speckledCount++
      }
    })
  })

  const avgWeight = totalEggs > 0 ? totalWeight / totalEggs : 0

  // Calculate eggs per day
  const eggsPerDay = data.eggs.map((day) => ({
    date: day.date,
    count: day.eggs.length,
  }))

  // Calculate weight distribution
  const weightRanges = {
    small: 0, // < 55g
    medium: 0, // 55-65g
    large: 0, // > 65g
  }

  data.eggs.forEach((day) => {
    day.eggs.forEach((egg) => {
      if (egg.weight < 55) weightRanges.small++
      else if (egg.weight <= 65) weightRanges.medium++
      else weightRanges.large++
    })
  })

  return {
    totalEggs,
    avgWeight: avgWeight.toFixed(1),
    eggsPerDay,
    weightRanges,
    speckledCount,
    plainCount: totalEggs - speckledCount,
  }
}
