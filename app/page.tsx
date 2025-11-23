"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, MapPin, Clock, CheckCircle2 } from "lucide-react"

interface ParkingSpot {
  id: number
  spotCode: string
  isBusy: boolean
  userId: number | null
}

export default function Home() {
  const [spots, setSpots] = useState<ParkingSpot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await fetch("/api/parking")
        const data = await response.json()
        setSpots(data)
      } catch (error) {
        console.error("Failed to fetch parking spots:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSpots()
  }, [])

  const availableCount = spots.filter((spot) => !spot.isBusy).length
  const totalSpots = spots.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 flex items-center gap-3">
            <MapPin className="text-blue-400" size={40} />
            Parking Management
          </h1>
          <p className="text-slate-300 text-lg">Find and book available parking spots</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-200 flex items-center gap-2">
                <CheckCircle2 className="text-green-400" />
                Available Spots
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-400">
                {availableCount}/{totalSpots}
              </p>
              <p className="text-slate-400 text-sm mt-2">
                {Math.round((availableCount / totalSpots) * 100)}% available
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-200 flex items-center gap-2">
                <Clock className="text-blue-400" />
                Total Spots
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-400">{totalSpots}</p>
              <p className="text-slate-400 text-sm mt-2">Parking spots in system</p>
            </CardContent>
          </Card>
        </div>

        {/* Parking Spots Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="text-blue-400 animate-spin" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spots.map((spot) => (
              <Card
                key={spot.id}
                className={`border-2 transition-all ${
                  spot.isBusy ? "bg-slate-800 border-red-500" : "bg-slate-800 border-slate-700 hover:border-green-400"
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-slate-200">{spot.spotCode}</CardTitle>
                    <Badge className={spot.isBusy ? "bg-red-500" : "bg-green-500"}>
                      {spot.isBusy ? "Occupied" : "Available"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-sm mb-4">Spot ID: {spot.id}</p>
                  <Button
                    disabled={spot.isBusy}
                    className={`w-full ${spot.isBusy ? "bg-slate-600" : "bg-green-600 hover:bg-green-700"}`}
                  >
                    {spot.isBusy ? "Not Available" : "Book Now"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {spots.length === 0 && !loading && (
          <Card className="bg-slate-800 border-slate-700 text-center py-12">
            <CardContent>
              <p className="text-slate-400 text-lg">No parking spots available</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
