import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import fs from "fs";
import path from "path";

export async function generateMetadata() {
  return {
    title: "Dev Notes | TwoPeck's Eggs",
  };
}

const DevNotesPage: FC = async () => {
  const notesPath = path.join(process.cwd(), "dev-notes.md");
  const fileContent = fs.readFileSync(notesPath, "utf8");

  const lines = fileContent.split("\n").filter((line) => line.trim() !== "");

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-egg-sky py-8">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="TwoPeck's Eggs Logo"
              width={150}
              height={150}
              className="object-contain"
            />
            <h1 className="text-4xl text-egg-cream">TwoPeck's Eggs</h1>
          </div>
          <Button asChild className="bg-green-500 hover:bg-green-600">
            <Link href="/">home</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 bg-egg-gold">
        <div className="mb-6">
          <h2 className="text-2xl font-medium mb-4">Dev Notes</h2>

          <div className="bg-egg-cream p-6 rounded-lg shadow">
            <pre className="whitespace-pre-wrap text-sm font-mono text-egg-brown">
              <code>{fileContent}</code>
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DevNotesPage;
