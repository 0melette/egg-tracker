"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ChickenProfile {
  id: number;
  name: string;
  breed: string;
  funFact: string;
  image: string;
}

const chickens: ChickenProfile[] = [
  {
    id: 1,
    name: "Two Peck 1",
    breed: "ISA Brown",
    funFact: "Chilling",
    image: "/images/two-peck-chilling.png",
  },
  {
    id: 2,
    name: "Two Peck 2",
    breed: "ISA Brown",
    funFact: "Debugging",
    image: "/images/two-peck-coding.png",
  },
  {
    id: 3,
    name: "Two Peck 3",
    breed: "ISA Brown",
    funFact: "Two Peck Bath Water",
    image: "/images/two-peck-bath.png",
  },
];

function ChickenCard({ chicken }: { chicken: ChickenProfile }) {
  const [isFlipped, setIsFlipped] = useState(false);

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
          <div className="absolute inset-0 bg-gradient-to-b from-green-100 to-green-200 p-4 flex flex-col items-center justify-center">
            <h3 className="text-xl font-bold mb-1">{chicken.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{chicken.breed}</p>
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
          <div className="space-y-2 text-sm"></div>
          <div className="relative w-48 h-60 flex items-center justify-center mx-auto">
            <Image
              src={chicken.image || "/placeholder.svg"}
              alt={chicken.name}
              fill
              className="object-contain"
            />
          </div>
          <div className="mt-4 mx-auto w-[220px] p-3 bg-egg-gold rounded-lg text-center">
            <p className="text-sm italic text-egg-brown">"{chicken.funFact}"</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-green-300 z-10"></div>
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-green-400 z-20"></div>
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-green-500 z-30"></div>
        </div>
      </motion.div>
    </div>
  );
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
          <h2 className="text-2xl font-bold mb-4">the gang</h2>
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md">
            <p className="mb-4">I have 3 lovely chickens!!</p>
            <p>more to come 🫣?!</p>
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
  );
}
