import Link from "next/link"
import Image from "next/image"
import { EggTimeline } from "@/components/egg-timeline"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-egg-sky py-8">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="TwoPeck's Eggs Logo" width={150} height={150} className="object-contain" />
            <h1 className="text-4xl text-egg-cream">TwoPeck's Eggs</h1>
          </div>
          <div className="flex gap-2">
            <Button asChild className="bg-green-500 hover:bg-green-600">
              <Link href="/about">meet the makers</Link>
            </Button>
            <Button asChild className="bg-purple-500 hover:bg-purple-600">
              <Link href="/dev-notes">dev notes</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 bg-egg-gold">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-medium">Recent Egg Collection</h2>
          <Button asChild className="bg-orange-400 hover:bg-orange-500">
            <Link href="/analytics">view analytics</Link>
          </Button>
        </div>

        <EggTimeline />
      </main>
    </div>
  )
}
