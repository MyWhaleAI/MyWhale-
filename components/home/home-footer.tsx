import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Twitter, MessageSquare, Github } from "lucide-react"

export function HomeFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-white"
                >
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"></path>
                  <path d="M4.93 4.93c4.68-4.68 12.47-4.68 17.14 0"></path>
                  <path d="M19.07 19.07c-4.68 4.68-12.47 4.68-17.14 0"></path>
                  <path d="M12 12v.01"></path>
                  <path d="M12 16v.01"></path>
                  <path d="M12 8v.01"></path>
                  <path d="M16 12h.01"></path>
                  <path d="M8 12h.01"></path>
                </svg>
              </div>
              <span className="text-lg font-bold text-white">MyWhale</span>
            </div>
            <p className="text-gray-400 text-sm mb-6 max-w-md">
              Track the smartest wallets on Solana. Get AI-powered insights on whale movements and stay ahead of the
              market.
            </p>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-9 w-9 bg-gray-800 hover:bg-gray-700 text-gray-300"
              >
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-9 w-9 bg-gray-800 hover:bg-gray-700 text-gray-300"
              >
                <MessageSquare className="h-4 w-4" />
                <span className="sr-only">Discord</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-9 w-9 bg-gray-800 hover:bg-gray-700 text-gray-300"
              >
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-gray-400 hover:text-white transition-colors">
                  API
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Subscribe</h3>
            <p className="text-gray-400 text-sm mb-4">Get weekly updates on whale movements and market insights.</p>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Your email"
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 rounded-lg focus:border-teal-500"
                />
              </div>
              <Button className="bg-teal-500 hover:bg-teal-600 text-white shrink-0">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} MyWhale. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
