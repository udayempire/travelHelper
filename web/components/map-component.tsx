"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Shield, Navigation, Activity } from "lucide-react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

// Mock data for tourist locations and risk zones with real coordinates - Northeast India Focus
const touristLocations = [
  // Assam
  { id: 1, lat: 26.1445, lng: 91.7362, name: "Guwahati", tourists: 190, type: "safe", area: "Kamakhya Temple" },
  { id: 2, lat: 26.65, lng: 93.36, name: "Kaziranga", tourists: 155, type: "safe", area: "National Park" },
  { id: 3, lat: 26.1833, lng: 91.7333, name: "Dispur", tourists: 45, type: "safe", area: "Assam Secretariat" },
  { id: 4, lat: 26.75, lng: 92.8333, name: "Tezpur", tourists: 35, type: "safe", area: "Agnigarh Hill" },
  { id: 5, lat: 26.9667, lng: 94.6167, name: "Jorhat", tourists: 28, type: "safe", area: "Tocklai Tea Research" },
  { id: 6, lat: 26.8, lng: 93.4333, name: "Nagaon", tourists: 22, type: "safe", area: "Kaliabhomora Bridge" },
  
  // Meghalaya
  { id: 7, lat: 25.57, lng: 91.88, name: "Shillong", tourists: 110, type: "safe", area: "Umiam Lake" },
  { id: 8, lat: 25.3, lng: 91.5833, name: "Cherrapunji", tourists: 65, type: "safe", area: "Nohkalikai Falls" },
  { id: 9, lat: 25.5167, lng: 91.2667, name: "Mawsynram", tourists: 25, type: "safe", area: "Wettest Place on Earth" },
  { id: 10, lat: 25.4667, lng: 91.8833, name: "Dawki", tourists: 40, type: "safe", area: "Crystal Clear River" },
  
  // Arunachal Pradesh
  { id: 11, lat: 27.585, lng: 91.85, name: "Tawang", tourists: 85, type: "safe", area: "Tawang Monastery" },
  { id: 12, lat: 28.2167, lng: 94.6667, name: "Bomdila", tourists: 35, type: "safe", area: "Bomdila Monastery" },
  { id: 13, lat: 28.0667, lng: 95.3333, name: "Ziro", tourists: 30, type: "safe", area: "Ziro Music Festival" },
  { id: 14, lat: 28.2167, lng: 96.25, name: "Pasighat", tourists: 25, type: "safe", area: "Daying Ering Wildlife" },
  { id: 15, lat: 27.5833, lng: 96.1667, name: "Roing", tourists: 20, type: "safe", area: "Mehao Wildlife Sanctuary" },
  
  // Sikkim
  { id: 16, lat: 27.33, lng: 88.61, name: "Gangtok", tourists: 130, type: "safe", area: "Tsomgo Lake" },
  { id: 17, lat: 27.3667, lng: 88.2167, name: "Pelling", tourists: 45, type: "safe", area: "Kanchenjunga View" },
  { id: 18, lat: 27.4333, lng: 88.1333, name: "Ravangla", tourists: 30, type: "safe", area: "Buddha Park" },
  { id: 19, lat: 27.7, lng: 88.6333, name: "Lachung", tourists: 35, type: "safe", area: "Yumthang Valley" },
  { id: 20, lat: 27.75, lng: 88.7, name: "Lachen", tourists: 25, type: "safe", area: "Gurudongmar Lake" },
  
  // Nagaland
  { id: 21, lat: 25.6669, lng: 94.1062, name: "Kohima", tourists: 60, type: "safe", area: "War Cemetery" },
  { id: 22, lat: 25.9167, lng: 93.7333, name: "Dimapur", tourists: 40, type: "safe", area: "Kachari Ruins" },
  { id: 23, lat: 26.1, lng: 94.5333, name: "Mokokchung", tourists: 25, type: "safe", area: "Ao Village" },
  { id: 24, lat: 26.3167, lng: 94.5167, name: "Wokha", tourists: 20, type: "safe", area: "Doyang River" },
  
  // Manipur
  { id: 25, lat: 24.817, lng: 93.935, name: "Imphal", tourists: 55, type: "safe", area: "Kangla Fort" },
  { id: 26, lat: 24.58, lng: 93.84, name: "Loktak Lake", tourists: 75, type: "safe", area: "Floating National Park" },
  { id: 27, lat: 24.8, lng: 93.95, name: "Thoubal", tourists: 15, type: "safe", area: "Thoubal River" },
  { id: 28, lat: 24.5, lng: 94.0167, name: "Bishnupur", tourists: 18, type: "safe", area: "Vishnu Temple" },
  
  // Mizoram
  { id: 29, lat: 23.7271, lng: 92.7176, name: "Aizawl", tourists: 45, type: "safe", area: "Durtlang Hills" },
  { id: 30, lat: 23.3167, lng: 92.7167, name: "Lunglei", tourists: 20, type: "safe", area: "Khawnglung Wildlife" },
  { id: 31, lat: 23.7333, lng: 92.7167, name: "Champhai", tourists: 15, type: "safe", area: "Rih Dil Lake" },
  
  // Tripura
  { id: 32, lat: 23.8315, lng: 91.2862, name: "Agartala", tourists: 35, type: "safe", area: "Ujjayanta Palace" },
  { id: 33, lat: 23.5167, lng: 91.4833, name: "Udaipur", tourists: 25, type: "safe", area: "Tripura Sundari Temple" },
  { id: 34, lat: 24.1333, lng: 91.7, name: "Dharmanagar", tourists: 18, type: "safe", area: "Unakoti Rock Cut" },
];

const riskZones = [
  // Assam Risk Zones
  { id: 1, lat: 26.148, lng: 91.78, name: "Dispur Market", risk: "medium", incidents: 1, reason: "Crowded market area" },
  { id: 2, lat: 26.5, lng: 93.3, name: "Kopili Fault Zone", risk: "high", incidents: 5, reason: "High seismic activity" },
  { id: 3, lat: 26.2, lng: 91.8, name: "Guwahati Railway Station", risk: "medium", incidents: 2, reason: "Pickpocketing incidents" },
  
  // Meghalaya Risk Zones
  { id: 4, lat: 25.56, lng: 91.89, name: "Shillong Bypass", risk: "medium", incidents: 1, reason: "Prone to landslides" },
  { id: 5, lat: 25.3, lng: 91.6, name: "Cherrapunji Roads", risk: "high", incidents: 3, reason: "Slippery roads during monsoon" },
  
  // Manipur Risk Zones
  { id: 6, lat: 24.817, lng: 93.935, name: "Imphal Central", risk: "high", incidents: 2, reason: "Traffic and theft reports" },
  { id: 7, lat: 24.6, lng: 93.8, name: "Loktak Lake Area", risk: "medium", incidents: 1, reason: "Isolated tourist spots" },
  
  // Nagaland Risk Zones
  { id: 8, lat: 25.7, lng: 94.1, name: "Kohima Hills", risk: "medium", incidents: 1, reason: "Remote trekking areas" },
  { id: 9, lat: 25.9, lng: 93.7, name: "Dimapur Industrial", risk: "low", incidents: 1, reason: "Industrial area safety" },
  
  // Arunachal Pradesh Risk Zones
  { id: 10, lat: 27.6, lng: 91.9, name: "Tawang Border", risk: "high", incidents: 4, reason: "Restricted border area" },
  { id: 11, lat: 28.2, lng: 94.7, name: "Bomdila Pass", risk: "medium", incidents: 2, reason: "High altitude risks" },
  
  // Sikkim Risk Zones
  { id: 12, lat: 27.4, lng: 88.6, name: "Gangtok Traffic", risk: "low", incidents: 1, reason: "Traffic congestion" },
  { id: 13, lat: 27.7, lng: 88.6, name: "Lachung Valley", risk: "medium", incidents: 1, reason: "Weather-dependent access" },
];

// Heat map data for activity intensity visualization
const heatMapData = [
  // Sikkim - High activity (red zone)
  { lat: 27.33, lng: 88.61, intensity: 0.9, region: "Gangtok" },
  { lat: 27.3667, lng: 88.2167, intensity: 0.8, region: "Pelling" },
  { lat: 27.4333, lng: 88.1333, intensity: 0.7, region: "Ravangla" },
  { lat: 27.7, lng: 88.6333, intensity: 0.6, region: "Lachung" },
  { lat: 27.75, lng: 88.7, intensity: 0.5, region: "Lachen" },
  
  // Assam - Medium activity (orange zone)
  { lat: 26.1445, lng: 91.7362, intensity: 0.7, region: "Guwahati" },
  { lat: 26.65, lng: 93.36, intensity: 0.6, region: "Kaziranga" },
  { lat: 26.1833, lng: 91.7333, intensity: 0.4, region: "Dispur" },
  { lat: 26.75, lng: 92.8333, intensity: 0.3, region: "Tezpur" },
  
  // Meghalaya - Medium activity (orange zone)
  { lat: 25.57, lng: 91.88, intensity: 0.6, region: "Shillong" },
  { lat: 25.3, lng: 91.5833, intensity: 0.5, region: "Cherrapunji" },
  { lat: 25.5167, lng: 91.2667, intensity: 0.3, region: "Mawsynram" },
  
  // Arunachal Pradesh - Low activity (yellow zone)
  { lat: 27.585, lng: 91.85, intensity: 0.4, region: "Tawang" },
  { lat: 28.2167, lng: 94.6667, intensity: 0.3, region: "Bomdila" },
  { lat: 28.0667, lng: 95.3333, intensity: 0.2, region: "Ziro" },
  
  // Nagaland - Low activity (yellow zone)
  { lat: 25.6669, lng: 94.1062, intensity: 0.3, region: "Kohima" },
  { lat: 25.9167, lng: 93.7333, intensity: 0.2, region: "Dimapur" },
  
  // Manipur - Medium activity (orange zone)
  { lat: 24.817, lng: 93.935, intensity: 0.5, region: "Imphal" },
  { lat: 24.58, lng: 93.84, intensity: 0.4, region: "Loktak Lake" },
  
  // Mizoram - Low activity (yellow zone)
  { lat: 23.7271, lng: 92.7176, intensity: 0.3, region: "Aizawl" },
  { lat: 23.3167, lng: 92.7167, intensity: 0.2, region: "Lunglei" },
  
  // Tripura - Low activity (yellow zone)
  { lat: 23.8315, lng: 91.2862, intensity: 0.3, region: "Agartala" },
  { lat: 23.5167, lng: 91.4833, intensity: 0.2, region: "Udaipur" },
];

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ""

export function MapComponent() {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [showHeatMap, setShowHeatMap] = useState(true)
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
        center: [93.5, 26.0], // Centered on Northeast India
        zoom: 6,
      })

      mapInstanceRef.current = map

      map.on("load", () => {
        addMarkers(map)
        addHeatMapLayer(map)
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

  const addHeatMapLayer = (map: mapboxgl.Map) => {
    // Add heat map data source
    map.addSource('heatmap', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: heatMapData.map(point => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [point.lng, point.lat]
          },
          properties: {
            intensity: point.intensity,
            region: point.region
          }
        }))
      }
    })

    // Add heat map layer
    map.addLayer({
      id: 'heatmap',
      type: 'heatmap',
      source: 'heatmap',
      maxzoom: 15,
      paint: {
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', 'intensity'],
          0, 0,
          1, 1
        ],
        'heatmap-intensity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 1,
          15, 3
        ],
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(33, 102, 172, 0)',
          0.1, 'rgb(103, 169, 207)',
          0.3, 'rgb(209, 229, 240)',
          0.5, 'rgb(253, 219, 199)',
          0.7, 'rgb(239, 138, 98)',
          1, 'rgb(178, 24, 43)'
        ],
        'heatmap-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 2,
          15, 20
        ],
        'heatmap-opacity': showHeatMap ? 0.8 : 0
      }
    })

    // Add heat map points layer for better visibility
    map.addLayer({
      id: 'heatmap-points',
      type: 'circle',
      source: 'heatmap',
      minzoom: 14,
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['get', 'intensity'],
          0, 5,
          1, 15
        ],
        'circle-color': [
          'interpolate',
          ['linear'],
          ['get', 'intensity'],
          0, '#22c55e',
          0.3, '#f59e0b',
          0.6, '#f97316',
          1, '#ef4444'
        ],
        'circle-opacity': showHeatMap ? 0.7 : 0,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff'
      }
    })
  }

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
      center: [93.5, 26.0],
      zoom: 6,
      essential: true,
    })
  }

  const toggleHeatMap = () => {
    setShowHeatMap(!showHeatMap)
  }

  // Update heat map visibility when showHeatMap changes
  useEffect(() => {
    if (mapInstanceRef.current && mapLoaded) {
      const map = mapInstanceRef.current
      if (map.getLayer('heatmap')) {
        map.setPaintProperty('heatmap', 'heatmap-opacity', showHeatMap ? 0.8 : 0)
        map.setPaintProperty('heatmap-points', 'circle-opacity', showHeatMap ? 0.7 : 0)
      }
    }
  }, [showHeatMap, mapLoaded])

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
          <Button
            variant={showHeatMap ? "default" : "outline"}
            size="sm"
            onClick={toggleHeatMap}
            className="w-10 h-10 p-0 bg-white/95 hover:bg-white shadow-lg"
            title="Toggle Heat Map"
          >
            <Activity className="h-4 w-4" />
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
        
        {showHeatMap && (
          <div className="mt-4 pt-4 border-t">
            <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Activity Heat Map
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-600">High Activity (Sikkim)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-gray-600">Medium Activity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600">Low Activity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Minimal Activity</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}