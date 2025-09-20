"use client";

import { useEffect, useState, useRef } from "react";
import { collection, onSnapshot, query, orderBy, limit, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AlertTriangle, MapPin, Clock, User, Phone, Map } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SOSAlert {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
  status: "active" | "responded" | "resolved";
  priority: "high" | "medium" | "low";
  message?: string;
  emergencyType: "medical" | "safety" | "lost" | "other";
}

export default function SOSListener() {
  const [alerts, setAlerts] = useState<SOSAlert[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [newAlertCount, setNewAlertCount] = useState(0);
  const [map, setMap] = useState<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Dummy SOS alerts with map locations
  const dummySOSAlerts: SOSAlert[] = [
    {
      id: "sos-1",
      userId: "user-1",
      userName: "Priyanshu Lohani",
      userPhone: "9368826185",
      location: {
        lat: 23.251202,
        lng: 77.524618,
        address: "Gwalior Fort, Gwalior, Madhya Pradesh"
      },
      timestamp: {
        seconds: Math.floor(Date.now() / 1000) - 300, // 5 minutes ago
        nanoseconds: 0
      },
      status: "active",
      priority: "high",
      message: "Lost near Gwalior Fort, need immediate assistance",
      emergencyType: "lost"
    },
    {
      id: "sos-2",
      userId: "user-2",
      userName: "Rahul Sharma",
      userPhone: "9876543210",
      location: {
        lat: 23.2518,
        lng: 77.5255,
        address: "Teli Ka Mandir, Gwalior, Madhya Pradesh"
      },
      timestamp: {
        seconds: Math.floor(Date.now() / 1000) - 900, // 15 minutes ago
        nanoseconds: 0
      },
      status: "responded",
      priority: "medium",
      message: "Medical emergency - chest pain",
      emergencyType: "medical"
    },
    {
      id: "sos-3",
      userId: "user-3",
      userName: "Priya Patel",
      userPhone: "9876543211",
      location: {
        lat: 23.2505,
        lng: 77.5238,
        address: "Sas Bahu Temple, Gwalior, Madhya Pradesh"
      },
      timestamp: {
        seconds: Math.floor(Date.now() / 1000) - 1800, // 30 minutes ago
        nanoseconds: 0
      },
      status: "resolved",
      priority: "low",
      message: "Harassment by local vendors",
      emergencyType: "safety"
    },
    {
      id: "sos-4",
      userId: "user-4",
      userName: "Amit Kumar",
      userPhone: "9876543212",
      location: {
        lat: 23.2522,
        lng: 77.5250,
        address: "Jai Vilas Palace, Gwalior, Madhya Pradesh"
      },
      timestamp: {
        seconds: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
        nanoseconds: 0
      },
      status: "active",
      priority: "high",
      message: "Theft - wallet and phone stolen",
      emergencyType: "safety"
    },
    {
      id: "sos-5",
      userId: "user-5",
      userName: "Sneha Singh",
      userPhone: "9876543213",
      location: {
        lat: 23.2515,
        lng: 77.5235,
        address: "Gurudwara Data Bandi Chhor, Gwalior, Madhya Pradesh"
      },
      timestamp: {
        seconds: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
        nanoseconds: 0
      },
      status: "responded",
      priority: "medium",
      message: "Lost in old city area",
      emergencyType: "lost"
    }
  ];

  useEffect(() => {
    // Use dummy data instead of Firebase for now
    setAlerts(dummySOSAlerts);
    setIsListening(true);
    
    // Check for new alerts
    if (dummySOSAlerts.length > 0) {
      const latestAlert = dummySOSAlerts[0];
      const alertTime = new Date(latestAlert.timestamp.seconds * 1000);
      const now = new Date();
      const timeDiff = now.getTime() - alertTime.getTime();
      
      // If alert is less than 5 minutes old, show notification
      if (timeDiff < 5 * 60 * 1000) {
        setNewAlertCount(prev => prev + 1);
        showSOSNotification(latestAlert);
      }
    }

    // Initialize map
    loadMap();
  }, []);

  const loadMap = async () => {
    try {
      // Load Mapbox GL JS dynamically
      const mapboxgl = (await import('mapbox-gl')).default
      
      // Set Mapbox access token
      const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
      if (!token) {
        console.warn("Mapbox token not found")
        return
      }
      
      mapboxgl.accessToken = token
      
      const mapInstance = new mapboxgl.Map({
        container: mapRef.current!,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [77.524618, 23.251202], // Gwalior coordinates
        zoom: 12
      })

      mapInstance.on('load', () => {
        setMap(mapInstance)
        addSOSMarkersToMap(dummySOSAlerts, mapInstance)
      })

      return mapInstance
    } catch (error) {
      console.error('Failed to load map:', error)
    }
  }

  const addSOSMarkersToMap = (alerts: SOSAlert[], mapInstance: any) => {
    if (!mapInstance) return

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.sos-map-marker')
    existingMarkers.forEach(marker => marker.remove())

    // Use dynamic import to get mapboxgl instance
    import('mapbox-gl').then(({ default: mapboxgl }) => {
      alerts.forEach(alert => {
        // Create marker element
        const el = document.createElement('div')
        el.className = 'sos-map-marker'
        el.style.width = '20px'
        el.style.height = '20px'
        el.style.borderRadius = '50%'
        el.style.background = alert.status === 'active' ? '#ef4444' : 
                             alert.status === 'responded' ? '#f59e0b' : '#10b981'
        el.style.border = '2px solid white'
        el.style.cursor = 'pointer'
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)'
        el.style.zIndex = '1000'

        // Create tooltip
        const tooltip = document.createElement('div')
        tooltip.className = 'sos-tooltip'
        tooltip.style.position = 'absolute'
        tooltip.style.background = 'white'
        tooltip.style.padding = '6px 10px'
        tooltip.style.borderRadius = '4px'
        tooltip.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'
        tooltip.style.border = '1px solid #e5e7eb'
        tooltip.style.fontSize = '11px'
        tooltip.style.whiteSpace = 'nowrap'
        tooltip.style.zIndex = '1001'
        tooltip.style.pointerEvents = 'none'
        tooltip.style.opacity = '0'
        tooltip.style.transition = 'opacity 0.2s ease'
        tooltip.style.transform = 'translate(-50%, -100%)'
        tooltip.style.marginTop = '-6px'

        tooltip.innerHTML = `
          <div style="font-weight: 600; color: #1f2937;">${alert.userName}</div>
          <div style="color: #6b7280;">${alert.emergencyType.toUpperCase()}</div>
          <div style="color: #6b7280;">${alert.priority.toUpperCase()}</div>
        `

        el.appendChild(tooltip)

        // Hover events
        el.addEventListener('mouseenter', () => {
          tooltip.style.opacity = '1'
        })

        el.addEventListener('mouseleave', () => {
          tooltip.style.opacity = '0'
        })

        // Add marker to map
        new mapboxgl.Marker(el)
          .setLngLat([alert.location.lng, alert.location.lat])
          .addTo(mapInstance)
      })
    })
  }

  // Original Firebase code (commented out for dummy data)
  /*
  const q = query(
    collection(db, "sos"),
    orderBy("timestamp", "desc"),
    limit(10) // listen for latest 10 SOS alerts
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const sosData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as SOSAlert[];
    
    setAlerts(sosData);
    setIsListening(true);
    
    // Check for new alerts
    if (sosData.length > 0) {
      const latestAlert = sosData[0];
      const alertTime = new Date(latestAlert.timestamp.seconds * 1000);
      const now = new Date();
      const timeDiff = now.getTime() - alertTime.getTime();
      
      // If alert is less than 5 minutes old, show notification
      if (timeDiff < 5 * 60 * 1000) {
        setNewAlertCount(prev => prev + 1);
        showSOSNotification(latestAlert);
      }
    }
  }, (error) => {
    console.error("Error listening to SOS alerts:", error);
    setIsListening(false);
  });

  return () => unsubscribe();
  */

  const showSOSNotification = (sosAlert: SOSAlert): void => {
    // Browser notification
    if (Notification.permission === "granted") {
      new Notification("🚨 SOS ALERT RECEIVED!", {
        body: `${sosAlert.userName} needs immediate assistance at ${sosAlert.location.address}`,
        icon: "/logo.png",
        tag: "sos-alert",
        requireInteraction: true,
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification("🚨 SOS ALERT RECEIVED!", {
            body: `${sosAlert.userName} needs immediate assistance at ${sosAlert.location.address}`,
            icon: "/logo.png",
            tag: "sos-alert",
            requireInteraction: true,
          });
        }
      });
    }

    // Browser alert as fallback
    alert(`🚨 SOS ALERT RECEIVED!\n\n${sosAlert.userName} needs immediate assistance!\nLocation: ${sosAlert.location.address}\nTime: ${new Date(sosAlert.timestamp.seconds * 1000).toLocaleString()}`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-orange-100 text-orange-800 border-orange-200";
      case "low": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-red-100 text-red-800";
      case "responded": return "bg-blue-100 text-blue-800";
      case "resolved": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getEmergencyTypeIcon = (type: string) => {
    switch (type) {
      case "medical": return "🏥";
      case "safety": return "🛡️";
      case "lost": return "🗺️";
      default: return "🚨";
    }
  };

  const formatTimeAgo = (timestamp: { seconds: number }) => {
    const now = new Date();
    const alertTime = new Date(timestamp.seconds * 1000);
    const diffInSeconds = Math.floor((now.getTime() - alertTime.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <h2 className="text-xl font-semibold">SOS Alert Monitor</h2>
          <Badge variant={isListening ? "default" : "secondary"}>
            {isListening ? "Listening" : "Disconnected"}
          </Badge>
        </div>
        {newAlertCount > 0 && (
          <Badge variant="destructive" className="animate-pulse">
            {newAlertCount} New Alert{newAlertCount > 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      {/* Connection Status */}
      {!isListening && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Unable to connect to SOS monitoring system. Please check your connection.
          </AlertDescription>
        </Alert>
      )}

      {/* Recent SOS Alerts */}
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No SOS alerts received</p>
                <p className="text-sm">System is monitoring for emergencies...</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          alerts.map((alert) => (
            <Card key={alert.id} className="border-l-4 border-l-red-500">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getEmergencyTypeIcon(alert.emergencyType)}</span>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {alert.userName}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(alert.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getPriorityColor(alert.priority)}>
                      {alert.priority.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(alert.status)}>
                      {alert.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Location */}
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-red-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{alert.location.address}</p>
                      <p className="text-xs text-muted-foreground">
                        Coordinates: {alert.location.lat.toFixed(4)}, {alert.location.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">{alert.userPhone}</span>
                  </div>

                  {/* Message */}
                  {alert.message && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-red-800">Emergency Message:</p>
                      <p className="text-sm text-red-700">{alert.message}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="destructive">
                      Respond Now
                    </Button>
                    <Button size="sm" variant="outline">
                      View on Map
                    </Button>
                    <Button size="sm" variant="outline">
                      Call Tourist
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* SOS Alert Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            SOS Alert Locations Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Interactive Map */}
          <div className="mb-4">
            <div 
              ref={mapRef} 
              className="w-full h-64 rounded-lg border"
              style={{ minHeight: '256px' }}
            />
          </div>
          
          {/* Alert List */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">Alert Details</h4>
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    alert.status === 'active' ? 'bg-red-500' : 
                    alert.status === 'responded' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <p className="font-medium">{alert.userName}</p>
                    <p className="text-sm text-muted-foreground">{alert.location.address}</p>
                    <p className="text-xs text-muted-foreground">
                      {alert.location.lat.toFixed(4)}, {alert.location.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={alert.priority === 'high' ? 'destructive' : alert.priority === 'medium' ? 'default' : 'secondary'}>
                    {alert.priority.toUpperCase()}
                  </Badge>
                  <Button size="sm" variant="outline">
                    <MapPin className="h-4 w-4 mr-1" />
                    View on Map
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer Info */}
      <div className="text-center text-xs text-muted-foreground">
        <p>Real-time SOS monitoring • Last updated: {new Date().toLocaleTimeString()}</p>
        <p>System automatically notifies emergency responders</p>
      </div>
    </div>
  );
}
