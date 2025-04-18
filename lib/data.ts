export const eggData = [
  {
    date: "2023-10-02",
    eggs: [
      { weight: 67, color: "#fbe5ce" },
      { weight: 64, color: "#fbe5ce" },
      { weight: 54, color: "#fbe5ce" },
    ],
  },
  {
    date: "2023-10-01",
    eggs: [
      { weight: 67, color: "#fbe5ce" },
      { weight: 54, color: "#fbe5ce" },
    ],
  },
  {
    date: "2023-09-30",
    eggs: [
      { weight: 65, color: "#fbe5ce" },
      { weight: 62, color: "#fbe5ce" },
      { weight: 59, color: "#fbe5ce" },
    ],
  },
]

export const chickens = [
  { id: 1, name: "Henrietta", breed: "Rhode Island Red", avgEggWeight: 65 },
  { id: 2, name: "Gertrude", breed: "Plymouth Rock", avgEggWeight: 58 },
  { id: 3, name: "Mabel", breed: "Leghorn", avgEggWeight: 62 },
]

export const getEggStats = () => {
  let totalEggs = 0
  let totalWeight = 0

  eggData.forEach((day) => {
    totalEggs += day.eggs.length
    day.eggs.forEach((egg) => {
      totalWeight += egg.weight
    })
  })

  const avgWeight = totalWeight / totalEggs

  // Calculate eggs per day
  const eggsPerDay = eggData.map((day) => ({
    date: day.date,
    count: day.eggs.length,
  }))

  // Calculate weight distribution
  const weightRanges = {
    small: 0, // < 55g
    medium: 0, // 55-65g
    large: 0, // > 65g
  }

  eggData.forEach((day) => {
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
  }
}
