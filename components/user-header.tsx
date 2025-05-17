import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"

export function UserHeader() {
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        className="relative h-12 w-12 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        <Bell className="h-5 w-5 text-gray-700" />
        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
      </Button>

      <Button className="bg-teal-500 hover:bg-teal-600 text-white rounded-2xl px-6 py-3 transition-all duration-200 ease-in-out shadow-sm text-base font-medium">
        Mint Now
      </Button>

      <div className="flex items-center gap-3 bg-white p-2 pr-5 rounded-2xl border border-gray-200 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
          <span className="text-base font-bold text-white">JD</span>
        </div>
        <div>
          <div className="font-bold text-gray-800">John Deere</div>
          <div className="text-teal-600 text-sm">
            0x13...435b <span className="text-teal-700 font-medium">+10,000.56 BNB</span>
          </div>
        </div>
      </div>
    </div>
  )
}
