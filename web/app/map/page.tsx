"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  const { toast } = useToast()

  useEffect(() => {
    loadMap()
    fetchTouristLocations()
  }, [])

  const loadMap = async () => {
    try {
      // Load Mapbox GL JS dynamically
      const mapboxgl = (await import('mapbox-gl')).default
      
      // Set Mapbox access token
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
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
        center: [77.2090, 28.6139], // Delhi coordinates
        zoom: 10
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
      
      // Dummy data for now
      const dummyTourists: TouristLocation[] = [
        {
          id: "tourist-1",
          name: "John Doe",
          lat: 28.6139,
          lng: 77.2090,
          status: 'active',
          lastSeen: new Date().toISOString(),
          phone: "+91 98765 43210",
          aadhaar: "123456789012"
        },
        {
          id: "tourist-2",
          name: "Jane Smith",
          lat: 28.6141,
          lng: 77.2092,
          status: 'active',
          lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          phone: "+91 98765 43211",
          aadhaar: "123456789013"
        },
        {
          id: "tourist-3",
          name: "Bob Johnson",
          lat: 28.6143,
          lng: 77.2094,
          status: 'expired',
          lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          phone: "+91 98765 43212",
          aadhaar: "123456789014"
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

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.mapboxgl-marker')
    existingMarkers.forEach(marker => marker.remove())

    touristData.forEach(tourist => {
      const el = document.createElement('div')
      el.className = 'tourist-marker'
      el.style.width = '20px'
      el.style.height = '20px'
      el.style.borderRadius = '50%'
      el.style.background = getStatusColor(tourist.status)
      el.style.border = '2px solid white'
      el.style.cursor = 'pointer'
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)'

      el.addEventListener('click', () => {
        setSelectedTourist(tourist)
        map.flyTo({
          center: [tourist.lng, tourist.lat],
          zoom: 15
        })
      })

      new (window as any).mapboxgl.Marker(el)
        .setLngLat([tourist.lng, tourist.lat])
        .addTo(map)
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
