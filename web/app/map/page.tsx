"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { MapPin, Search, Users, AlertTriangle, Maximize2, Minimize2, Filter, Layers } from "lucide-react"

interface TouristLocation {
  id: string
  name: string
  lat: number
  lng: number
  status: 'active' | 'expired' | 'pending'
  lastSeen: string
  phone?: string
  aadhaar: string
}

export default function MapPage(): JSX.Element {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [tourists, setTourists] = useState<TouristLocation[]>([])
  const [selectedTourist, setSelectedTourist] = useState<TouristLocation | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [mapError, setMapError] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState("current")
  const { toast } = useToast()

  // Location options for the selector
  const locationOptions = [
    { value: "current", label: "Current Location", center: [77.524618, 23.251202] },
    { value: "delhi", label: "Delhi", center: [77.2090, 28.6139] },
    { value: "mumbai", label: "Mumbai", center: [72.8777, 19.0760] },
    { value: "bangalore", label: "Bangalore", center: [77.5946, 12.9716] },
    { value: "kolkata", label: "Kolkata", center: [88.3639, 22.5726] },
    { value: "chennai", label: "Chennai", center: [80.2707, 13.0827] },
    { value: "hyderabad", label: "Hyderabad", center: [78.4867, 17.3850] },
    { value: "pune", label: "Pune", center: [73.8567, 18.5204] },
    { value: "ahmedabad", label: "Ahmedabad", center: [72.5714, 23.0225] },
    { value: "jaipur", label: "Jaipur", center: [75.7873, 26.9124] }
  ]

  useEffect(() => {
    loadMap()
    fetchTouristLocations()
  }, [])

  const loadMap = async () => {
    try {
      // Load Mapbox GL JS dynamically
      const mapboxgl = (await import('mapbox-gl')).default
      
      // Set Mapbox access token
      const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
      if (!token) {
        setMapError(true)
        toast({
          title: "Mapbox Token Required",
          description: "Please set NEXT_PUBLIC_MAPBOX_TOKEN in your environment variables.",
          variant: "destructive",
        })
        return
      }
      
      mapboxgl.accessToken = token
      
      const mapInstance = new mapboxgl.Map({
        container: mapRef.current!,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [77.524618, 23.251202], // Updated coordinates
        zoom: 18
      })

      mapInstance.on('load', () => {
        setMap(mapInstance)
      })

      return mapInstance
    } catch (error) {
      console.error('Failed to load map:', error)
      setMapError(true)
      toast({
        title: "Map Error",
        description: "Failed to load the map. Please check your internet connection and Mapbox token.",
        variant: "destructive",
      })
    }
  }

  const fetchTouristLocations = async () => {
    try {
      // Simulate API call - replace with actual API
      await new Promise((r) => setTimeout(r, 1000))
      
      // Dummy data for now - tourists positioned within green zones
      const dummyTourists: TouristLocation[] = [
        {
          id: "tourist-1",
          name: "Rahul Sharma",
          lat: 23.2519,
          lng: 77.5256,
          status: 'active',
          lastSeen: new Date().toISOString(),
          phone: "+91 98765 43210",
          aadhaar: "123456789012"
        },
        {
          id: "tourist-2",
          name: "Priya Patel",
          lat: 23.2517,
          lng: 77.5254,
          status: 'active',
          lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          phone: "+91 98765 43211",
          aadhaar: "123456789013"
        },
        {
          id: "tourist-3",
          name: "Amit Kumar",
          lat: 23.2506,
          lng: 77.5239,
          status: 'active',
          lastSeen: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          phone: "+91 98765 43212",
          aadhaar: "123456789014"
        },
        {
          id: "tourist-4",
          name: "Sneha Singh",
          lat: 23.2523,
          lng: 77.5251,
          status: 'active',
          lastSeen: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          phone: "+91 98765 43213",
          aadhaar: "123456789015"
        },
        {
          id: "tourist-5",
          name: "Vikram Gupta",
          lat: 23.2504,
          lng: 77.5237,
          status: 'active',
          lastSeen: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          phone: "+91 98765 43214",
          aadhaar: "123456789016"
        },
        {
          id: "tourist-6",
          name: "Anita Verma",
          lat: 23.2516,
          lng: 77.5236,
          status: 'active',
          lastSeen: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          phone: "+91 98765 43215",
          aadhaar: "123456789017"
        },
        {
          id: "tourist-7",
          name: "Rajesh Tiwari",
          lat: 23.2521,
          lng: 77.5249,
          status: 'active',
          lastSeen: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
          phone: "+91 98765 43216",
          aadhaar: "123456789018"
        },
        {
          id: "tourist-8",
          name: "Meera Joshi",
          lat: 23.2514,
          lng: 77.5234,
          status: 'active',
          lastSeen: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          phone: "+91 98765 43217",
          aadhaar: "123456789019"
        },
        {
          id: "tourist-9",
          name: "Suresh Yadav",
          lat: 23.2524,
          lng: 77.5252,
          status: 'active',
          lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          phone: "+91 98765 43218",
          aadhaar: "123456789020"
        },
        {
          id: "tourist-10",
          name: "Kavita Singh",
          lat: 23.2507,
          lng: 77.5240,
          status: 'active',
          lastSeen: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
          phone: "+91 98765 43219",
          aadhaar: "123456789021"
        },
        {
          id: "tourist-11",
          name: "Ravi Kumar",
          lat: 23.2518,
          lng: 77.5253,
          status: 'active',
          lastSeen: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
          phone: "+91 98765 43220",
          aadhaar: "123456789022"
        },
        {
          id: "tourist-12",
          name: "Pooja Sharma",
          lat: 23.2520,
          lng: 77.5248,
          status: 'active',
          lastSeen: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
          phone: "+91 98765 43221",
          aadhaar: "123456789023"
        }
      ]

      setTourists(dummyTourists)
      addMarkersToMap(dummyTourists)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch tourist locations",
        variant: "destructive",
      })
    }
  }

  const addMarkersToMap = (touristData: TouristLocation[]) => {
    if (!map) return

    // Clear existing markers and circles
    const existingMarkers = document.querySelectorAll('.mapboxgl-marker')
    existingMarkers.forEach(marker => marker.remove())

    // Use dynamic import to get mapboxgl instance instead of relying on window
    import('mapbox-gl').then(({ default: mapboxgl }) => {
      // Add all individual markers first
      touristData.forEach(tourist => {
        // Create green tourist marker
        const el = document.createElement('div')
        el.className = 'tourist-marker'
        el.style.width = '20px'
        el.style.height = '20px'
        el.style.borderRadius = '50%'
        el.style.background = '#10b981' // Green color for tourists
        el.style.border = '2px solid white'
        el.style.cursor = 'pointer'
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)'
        el.style.zIndex = '1000'

        // Create hover tooltip
        const tooltip = document.createElement('div')
        tooltip.className = 'tourist-tooltip'
        tooltip.style.position = 'absolute'
        tooltip.style.background = 'white'
        tooltip.style.padding = '8px 12px'
        tooltip.style.borderRadius = '6px'
        tooltip.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
        tooltip.style.border = '1px solid #e5e7eb'
        tooltip.style.fontSize = '12px'
        tooltip.style.whiteSpace = 'nowrap'
        tooltip.style.zIndex = '1001'
        tooltip.style.pointerEvents = 'none'
        tooltip.style.opacity = '0'
        tooltip.style.transition = 'opacity 0.2s ease'
        tooltip.style.transform = 'translate(-50%, -100%)'
        tooltip.style.marginTop = '-8px'

        // Tooltip content
        tooltip.innerHTML = `
          <div style="font-weight: 600; color: #1f2937; margin-bottom: 4px;">${tourist.name}</div>
          <div style="color: #6b7280; margin-bottom: 2px;">📱 ${tourist.phone}</div>
          <div style="color: #6b7280; margin-bottom: 2px;">🆔 ${tourist.aadhaar}</div>
          <div style="color: #6b7280; margin-bottom: 2px;">📍 Last seen: ${new Date(tourist.lastSeen).toLocaleString()}</div>
          <div style="color: #6b7280;">Status: <span style="color: ${tourist.status === 'active' ? '#10b981' : tourist.status === 'expired' ? '#ef4444' : '#f59e0b'}">${tourist.status.toUpperCase()}</span></div>
        `

        // Add tooltip to marker
        el.appendChild(tooltip)

        // Hover events
        el.addEventListener('mouseenter', () => {
          tooltip.style.opacity = '1'
        })

        el.addEventListener('mouseleave', () => {
          tooltip.style.opacity = '0'
        })

        el.addEventListener('click', () => {
          setSelectedTourist(tourist)
          map.flyTo({
            center: [tourist.lng, tourist.lat],
            zoom: 15
          })
        })

        // Add the green tourist marker
        new mapboxgl.Marker(el)
          .setLngLat([tourist.lng, tourist.lat])
          .addTo(map)
      })

      // Add red circular zones (restricted areas)
      const redZones = [
        { lat: 23.251202, lng: 77.524618, radius: 150 },
        { lat: 23.2525, lng: 77.5255, radius: 120 },
        { lat: 23.2500, lng: 77.5235, radius: 100 }
      ]

      redZones.forEach((zone, index) => {
        const redZoneEl = document.createElement('div')
        redZoneEl.className = 'red-zone'
        redZoneEl.style.width = `${zone.radius}px`
        redZoneEl.style.height = `${zone.radius}px`
        redZoneEl.style.borderRadius = '50%'
        redZoneEl.style.background = 'rgba(239, 68, 68, 0.2)' // Semi-transparent red
        redZoneEl.style.border = '3px solid rgba(239, 68, 68, 0.6)'
        redZoneEl.style.position = 'absolute'
        redZoneEl.style.transform = 'translate(-50%, -50%)'
        redZoneEl.style.pointerEvents = 'none'
        redZoneEl.style.zIndex = '996'

        new mapboxgl.Marker(redZoneEl)
          .setLngLat([zone.lng, zone.lat])
          .addTo(map)
      })

      // Add green zones (safe areas)
      const greenZones = [
        { lat: 23.2518, lng: 77.5255, radius: 200 },
        { lat: 23.2505, lng: 77.5238, radius: 180 },
        { lat: 23.2522, lng: 77.5250, radius: 160 },
        { lat: 23.2515, lng: 77.5235, radius: 140 }
      ]

      greenZones.forEach((zone, index) => {
        const greenZoneEl = document.createElement('div')
        greenZoneEl.className = 'green-zone'
        greenZoneEl.style.width = `${zone.radius}px`
        greenZoneEl.style.height = `${zone.radius}px`
        greenZoneEl.style.borderRadius = '50%'
        greenZoneEl.style.background = 'rgba(16, 185, 129, 0.15)' // Semi-transparent green
        greenZoneEl.style.border = '3px solid rgba(16, 185, 129, 0.4)'
        greenZoneEl.style.position = 'absolute'
        greenZoneEl.style.transform = 'translate(-50%, -50%)'
        greenZoneEl.style.pointerEvents = 'none'
        greenZoneEl.style.zIndex = '995'

        new mapboxgl.Marker(greenZoneEl)
          .setLngLat([zone.lng, zone.lat])
          .addTo(map)
      })

      // Add red heatmap points (smaller, clustered in red zones)
      const heatmapPoints = [
        { lat: 23.251202, lng: 77.524618 },
        { lat: 23.251205, lng: 77.524620 },
        { lat: 23.251200, lng: 77.524615 },
        { lat: 23.2525, lng: 77.5255 },
        { lat: 23.2500, lng: 77.5235 },
        { lat: 23.2502, lng: 77.5238 }
      ]

      heatmapPoints.forEach((point, index) => {
        const heatmapEl = document.createElement('div')
        heatmapEl.className = 'heatmap-marker'
        heatmapEl.style.width = '12px'
        heatmapEl.style.height = '12px'
        heatmapEl.style.borderRadius = '50%'
        heatmapEl.style.background = '#ef4444' // Red color for heatmap
        heatmapEl.style.border = '1px solid white'
        heatmapEl.style.boxShadow = '0 1px 3px rgba(0,0,0,0.3)'
        heatmapEl.style.zIndex = '998'
        heatmapEl.style.pointerEvents = 'none'

        new mapboxgl.Marker(heatmapEl)
          .setLngLat([point.lng, point.lat])
          .addTo(map)
      })
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981'
      case 'expired': return '#ef4444'
      case 'pending': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'expired': return 'destructive'
      case 'pending': return 'secondary'
      default: return 'outline'
    }
  }

  const handleLocationChange = (locationValue: string) => {
    setSelectedLocation(locationValue)
    const location = locationOptions.find(opt => opt.value === locationValue)
    if (location && map) {
      map.flyTo({
        center: location.center,
        zoom: 10,
        duration: 2000
      })
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen()
      } else if ((document.documentElement as any).webkitRequestFullscreen) {
        (document.documentElement as any).webkitRequestFullscreen()
      } else if ((document.documentElement as any).msRequestFullscreen) {
        (document.documentElement as any).msRequestFullscreen()
      }
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen()
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen()
      }
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F11') {
        event.preventDefault()
        toggleFullscreen()
      } else if (event.key === 'Escape' && isFullscreen) {
        toggleFullscreen()
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFullscreen])

  const filteredTourists = tourists.filter(tourist => {
    const matchesSearch = tourist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tourist.phone?.includes(searchTerm) ||
                         tourist.aadhaar.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || tourist.status === statusFilter
    return matchesSearch && matchesStatus
  })

  useEffect(() => {
    if (map && tourists.length > 0) {
      addMarkersToMap(filteredTourists)
    }
  }, [map, tourists, filteredTourists])

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      <div className={`flex ${isFullscreen ? 'h-full' : 'h-screen'}`}>
        {/* Map Container */}
        <div className={`flex-1 relative ${isFullscreen ? '' : 'mr-80'}`}>
          {/* Map Controls */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="bg-white/95 backdrop-blur-sm shadow-lg border-2 hover:bg-white"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              <span className="ml-1 text-xs font-medium">
                {isFullscreen ? "Exit" : "Fullscreen"}
              </span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white/95 backdrop-blur-sm shadow-lg border-2 hover:bg-white"
              title="Toggle Filters"
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Select value={selectedLocation} onValueChange={handleLocationChange}>
              <SelectTrigger className="w-40 bg-white/95 backdrop-blur-sm shadow-lg border-2">
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent>
                {locationOptions.map((location) => (
                  <SelectItem key={location.value} value={location.value}>
                    {location.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Overlay */}
          <div className="absolute top-4 right-4 z-10 w-80">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search tourists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/90 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Map */}
          <div ref={mapRef} className="w-full h-full">
            {mapError && (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center p-8">
                  <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Map Unavailable</h3>
                  <p className="text-gray-500 mb-4">
                    Mapbox token is required to display the interactive map.
                  </p>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>To enable the map:</p>
                    <p>1. Get a free Mapbox token from <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">mapbox.com</a></p>
                    <p>2. Set NEXT_PUBLIC_MAPBOX_TOKEN in your .env.local file</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tourist Info Popup */}
          {selectedTourist && (
            <div className="absolute bottom-4 left-4 z-10 w-80">
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{selectedTourist.name}</CardTitle>
                    <Badge variant={getStatusBadgeColor(selectedTourist.status) as any}>
                      {selectedTourist.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    Last seen: {new Date(selectedTourist.lastSeen).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>Lat: {selectedTourist.lat.toFixed(4)}, Lng: {selectedTourist.lng.toFixed(4)}</span>
                    </div>
                    {selectedTourist.phone && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedTourist.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono">{selectedTourist.aadhaar}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Sidebar */}
        {!isFullscreen && (
          <div className="w-80 border-l bg-background overflow-y-auto">
            <div className="p-4 space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Tourist Locations</h2>
                <p className="text-sm text-muted-foreground">
                  Real-time tracking of tourist positions
                </p>
              </div>

              {/* Filters */}
              {showFilters && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Filters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="expired">Expired</option>
                    </select>
                  </CardContent>
                </Card>
              )}

              {/* Tourist List */}
              <div className="space-y-2">
                {filteredTourists.map((tourist) => (
                  <Card 
                    key={tourist.id} 
                    className={`cursor-pointer transition-colors ${
                      selectedTourist?.id === tourist.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedTourist(tourist)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{tourist.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {tourist.phone || 'No phone'}
                          </p>
                        </div>
                        <Badge variant={getStatusBadgeColor(tourist.status) as any}>
                          {tourist.status}
                        </Badge>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Last seen: {new Date(tourist.lastSeen).toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredTourists.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No tourists found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
