"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, limit, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AlertTriangle, MapPin, Clock, User, Phone } from "lucide-react";
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

  useEffect(() => {
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
  }, []);

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

      {/* Footer Info */}
      <div className="text-center text-xs text-muted-foreground">
        <p>Real-time SOS monitoring • Last updated: {new Date().toLocaleTimeString()}</p>
        <p>System automatically notifies emergency responders</p>
      </div>
    </div>
  );
}
