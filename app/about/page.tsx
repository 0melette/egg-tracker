"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface ChickenProfile {
  id: number
  name: string
  breed: string
  age: string
  favoriteFood: string
  personality: string
  funFact: string
  eggColor: string
  avgEggWeight: number
  eggsPerWeek: number
  image: string
}

const chickens: ChickenProfile[] = [
  {
    id: 1,
    name: "Henrietta",
    breed: "Rhode Island Red",
    age: "2 years",
    favoriteFood: "Mealworms",
    personality: "Bossy but lovable",
    funFact: "Can recognize her own name",
    eggColor: "Brown",
    avgEggWeight: 65,
    eggsPerWeek: 5,
    image: "/images/chicken1.png",
  },
  {
    id: 2,
    name: "Gertrude",
    breed: "Plymouth Rock",
    age: "3 years",
    favoriteFood: "Sunflower seeds",
    personality: "Curious and friendly",
    funFact: "Loves to be held and petted",
    eggColor: "Light brown",
    avgEggWeight: 58,
    eggsPerWeek: 4,
    image: "/images/chicken2.png",
  },
  {
    id: 3,
    name: "Mabel",
    breed: "Leghorn",
    age: "1.5 years",
    favoriteFood: "Corn",
    personality: "Energetic and vocal",
    funFact: "First to greet visitors at the coop",
    eggColor: "White",
    avgEggWeight: 62,
    eggsPerWeek: 6,
    image: "/images/chicken3.png",
  },
]

function ChickenCard({ chicken }: { chicken: ChickenProfile }) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className="w-full max-w-xs mx-auto perspective">
      <motion.div
        className="relative w-full h-[400px] preserve-3d cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of card */}
        <div
          className="absolute w-full h-full backface-hidden rounded-xl overflow-hidden border-4 border-yellow-200 bg-gradient-to-b from-sky-100 to-green-100"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="h-1/2 bg-sky-200 flex items-center justify-center p-4">
            <div className="relative w-32 h-32">
              <Image src={chicken.image || "/placeholder.svg"} alt={chicken.name} fill className="object-contain" />
            </div>
          </div>
          <div className="h-1/2 bg-gradient-to-b from-green-100 to-green-200 p-4 flex flex-col items-center justify-center">
            <h3 className="text-xl font-bold mb-1">{chicken.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{chicken.breed}</p>
            <div className="w-full bg-yellow-100 rounded-lg p-3 text-center">
              <p className="text-sm font-medium">Click to meet {chicken.name}!</p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-green-300 z-10"></div>
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-green-400 z-20"></div>
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-green-500 z-30"></div>
        </div>

        {/* Back of card */}
        <div
          className="absolute w-full h-full backface-hidden rounded-xl overflow-hidden border-4 border-yellow-200 bg-gradient-to-b from-orange-50 to-yellow-100 p-4"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <h3 className="text-xl font-bold text-center mb-3">{chicken.name}</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Age:</span>
              <span>{chicken.age}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Favorite Food:</span>
              <span>{chicken.favoriteFood}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Personality:</span>
              <span>{chicken.personality}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Egg Color:</span>
              <span>{chicken.eggColor}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Avg Egg Weight:</span>
              <span>{chicken.avgEggWeight}g</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Eggs Per Week:</span>
              <span>{chicken.eggsPerWeek}</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
            <p className="text-sm italic">"{chicken.funFact}"</p>
          </div>
          <div className="mt-4 text-center text-xs text-gray-500">Click to flip back</div>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-green-300 z-10"></div>
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-green-400 z-20"></div>
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-green-500 z-30"></div>
        </div>
      </motion.div>
    </div>
  )
}

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-100 to-green-100">
      <div className="container mx-auto px-4 py-6 flex-grow">
        <Button variant="outline" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Meet the Makers</h1>
          <p className="text-gray-600">The feathered friends behind our eggs</p>
        </div>

        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-yellow-200 rounded-full opacity-30"></div>
            <div className="absolute top-20 right-10 w-16 h-16 bg-yellow-300 rounded-full opacity-20"></div>
            <div className="absolute bottom-10 left-1/4 w-24 h-24 bg-green-200 rounded-full opacity-40"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {chickens.map((chicken) => (
              <ChickenCard key={chicken.id} chicken={chicken} />
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Our Coop</h2>
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md">
            <p className="mb-4">
              Our chickens live in a spacious, custom-built coop with plenty of room to roam and explore. They enjoy
              organic feed, fresh vegetables, and lots of sunshine.
            </p>
            <p>
              Each of our feathered friends has their own personality and egg-laying style, contributing to the variety
              of eggs you see in our collection.
            </p>
          </div>
        </div>
      </div>

      {/* Grass at the bottom */}
      <div className="w-full mt-auto">
        <div className="h-16 bg-green-400 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-green-500"></div>
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-green-600"></div>
        </div>
      </div>
    </div>
  )
}
