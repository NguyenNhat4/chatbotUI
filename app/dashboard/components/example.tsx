"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Filter } from "lucide-react"

export default function SearchInterface() {
  const [deepResearch, setDeepResearch] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* Main search input */}
          <div className="mb-8">
            <textarea
              placeholder="What do you want to know?"
              className="w-full h-16 text-lg px-6 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none border-0"
            />
          </div>

          {/* Bottom section with Deep Research toggle and filter icon */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Switch
                id="deep-research"
                checked={deepResearch}
                onCheckedChange={setDeepResearch}
                className="data-[state=checked]:bg-blue-600"
              />
              <Label htmlFor="deep-research" className="text-gray-600 font-medium cursor-pointer">
                Deep Research
              </Label>
            </div>

            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
