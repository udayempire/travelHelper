"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Shield, Navigation } from "lucide-react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

// Mock data for tourist locations and risk zones with real coordinates
const touristLocations = [
  { id: 1, lat: 27.585, lng: 91.85, name: "Tawang", tourists: 85, type: "safe", area: "Tawang Monastery" },
  { id: 2, lat: 25.57, lng: 91.88, name: "Shillong", tourists: 110, type: "safe", area: "Umiam Lake" },
  { id: 3, lat: 26.65, lng: 93.36, name: "Kaziranga", tourists: 155, type: "safe", area: "National Park" },
  { id: 4, lat: 27.33, lng: 88.61, name: "Gangtok", tourists: 130, type: "safe", area: "Tsomgo Lake" },
  { id: 5, lat: 24.58, lng: 93.84, name: "Loktak Lake", tourists: 75, type: "safe", area: "Floating National Park" },
  { id: 6, lat: 25.6669, lng: 94.1062, name: "Kohima", tourists: 60, type: "safe", area: "War Cemetery" },
  { id: 7, lat: 26.1445, lng: 91.7362, name: "Guwahati", tourists: 190, type: "safe", area: "Kamakhya Temple" },
];

const riskZones = [
  { id: 1, lat: 26.148, lng: 91.78, name: "Dispur", risk: "medium", incidents: 1, reason: "Crowded market area" },
  { id: 2, lat: 24.817, lng: 93.935, name: "Imphal Central", risk: "high", incidents: 2, reason: "Traffic and theft reports" },
  { id: 3, lat: 26.5, lng: 93.3, name: "Kopili Fault Zone", risk: "high", incidents: 5, reason: "High seismic activity" },
  { id: 4, lat: 25.56, lng: 91.89, name: "Shillong Bypass", risk: "medium", incidents: 1, reason: "Prone to landslides" },
];

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ""

export function MapComponent() {
  const [mapLoaded, setMapLoaded] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])

  useEffect(() => {
    // Return early if the map is already initialized
    if (mapInstanceRef.current) return

    // Ensure the container element is available before initializing the map
    if (mapRef.current) {
      const map = new mapboxgl.Map({
        container: mapRef.current as HTMLDivElement,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [91.7362, 26.1445], // Corrected coordinates for Guwahati
        zoom: 10,
      })

      mapInstanceRef.current = map

      map.on("load", () => {
        addMarkers(map)
        setMapLoaded(true)
      })

      // Clean up map instance on unmount
      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove()
          mapInstanceRef.current = null
        }
      }
    }
  }, [])

  const addMarkers = (map: mapboxgl.Map) => {
    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    // Add tourist location markers
    touristLocations.forEach((location) => {
      const el = document.createElement("div")
      el.className = "mapbox-tourist-marker"
      el.style.backgroundColor = "#10b981"
      el.style.width = "12px"
      el.style.height = "12px"
      el.style.borderRadius = "50%"
      el.style.border = "2px solid white"
      el.style.boxShadow = "0 0 5px rgba(0,0,0,0.3)"

      const popupContent = `
        <div class="p-2">
          <h3 class="font-semibold text-sm mb-1">${location.name}</h3>
          <p class="text-xs text-gray-600 mb-2">${location.area}</p>
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs">👥 ${location.tourists} tourists</span>
          </div>
          <span class="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Safe Zone</span>
        </div>
      `

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent)

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([location.lng, location.lat])
        .setPopup(popup)
        .addTo(map)

      markersRef.current.push(marker)
    })

    // Add risk zone markers
    riskZones.forEach((zone) => {
      const el = document.createElement("div")
      el.className = "mapbox-risk-marker"
      el.style.width = "0"
      el.style.height = "0"
      el.style.border = "2px solid white"
      el.style.boxShadow = "0 0 5px rgba(0,0,0,0.3)"

      const triangleColor = zone.risk === "high" ? "#ef4444" : "#f97316"
      el.style.borderLeft = "6px solid transparent"
      el.style.borderRight = "6px solid transparent"
      el.style.borderBottom = `8px solid ${triangleColor}`

      const popupContent = `
        <div class="p-2">
          <h3 class="font-semibold text-sm mb-1">${zone.name}</h3>
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs">⚠️ ${zone.incidents} incidents</span>
          </div>
          <p class="text-xs text-gray-600 mb-2">${zone.reason}</p>
          <span class="inline-block px-2 py-1 ${zone.risk === "high" ? "bg-red-100 text-red-800" : "bg-orange-100 text-orange-800"} text-xs rounded">
            ${zone.risk === "high" ? "High Risk" : "Medium Risk"}
          </span>
        </div>
      `

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent)

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([zone.lng, zone.lat])
        .setPopup(popup)
        .addTo(map)

      markersRef.current.push(marker)
    })
  }

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn()
  }

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut()
  }

  const handleRecenter = () => {
    mapInstanceRef.current?.flyTo({
      center: [78.9629, 20.5937],
      zoom: 4,
      essential: true,
    })
  }

  return (
    <div className="relative">
      {/* Map Container */}
      <div className="relative h-96 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-lg overflow-hidden border">
        <div ref={mapRef} className="w-full h-full" />

        {/* Loading overlay */}
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <div className="flex items-center gap-2 text-emerald-600">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
              <span className="text-sm font-medium">Loading Interactive Map...</span>
            </div>
          </div>
        )}

        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            className="w-10 h-10 p-0 bg-white/95 hover:bg-white shadow-lg"
            title="Zoom In"
          >
            <span className="text-lg font-bold">+</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            className="w-10 h-10 p-0 bg-white/95 hover:bg-white shadow-lg"
            title="Zoom Out"
          >
            <span className="text-lg font-bold">−</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRecenter}
            className="w-10 h-10 p-0 bg-white/95 hover:bg-white shadow-lg"
            title="Recenter Map"
          >
            <Navigation className="h-4 w-4" />
          </Button>
        </div>

        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 border">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-emerald-700">Live Tracking</span>
            </div>
            <div className="text-xs text-gray-500">
              {touristLocations.reduce((sum, loc) => sum + loc.tourists, 0)} tourists monitored
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white rounded-lg border p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Map Legend
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full border border-white shadow-sm"></div>
            <span className="text-gray-600">Tourist Clusters</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-red-500"></div>
            <span className="text-gray-600">High Risk Zones</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-orange-500"></div>
            <span className="text-gray-600">Medium Risk Zones</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span className="text-gray-600">Safe Areas</span>
          </div>
        </div>
      </div>
    </div>
  )
}