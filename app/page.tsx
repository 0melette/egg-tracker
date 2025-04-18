import Link from "next/link"
import Image from "next/image"
import { EggTimeline } from "@/components/egg-timeline"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="TwoPeck's Eggs Logo" width={60} height={60} className="object-contain" />
            <h1 className="text-3xl font-medium">TwoPeck's Eggs</h1>
          </div>
          <Button asChild className="bg-orange-400 hover:bg-orange-500">
            <Link href="/about">meet the makers</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 bg-gray-50">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-medium">Recent Egg Collection</h2>
          <Button asChild variant="outline">
            <Link href="/analytics">View Analytics</Link>
          </Button>
        </div>

        <EggTimeline />
      </main>
    </div>
  )
}
