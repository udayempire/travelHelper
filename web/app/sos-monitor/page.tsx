import { Suspense } from "react";
import SOSListener from "@/components/sos-listener";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Shield, Phone, MapPin } from "lucide-react";

export default function SOSMonitorPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SOS Emergency Monitor</h1>
          <p className="text-gray-600 mt-1">Real-time emergency alert monitoring system</p>
        </div>
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-6 w-6" />
          <span className="font-semibold">LIVE MONITORING</span>
        </div>
      </div>

      {/* Emergency Contacts Card */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <Shield className="h-5 w-5" />
            Emergency Response Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-red-600" />
              <div>
                <p className="font-medium">Police Emergency</p>
                <p className="text-sm text-red-700">100</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-red-600" />
              <div>
                <p className="font-medium">Medical Emergency</p>
                <p className="text-sm text-red-700">108</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-red-600" />
              <div>
                <p className="font-medium">Tourist Helpline</p>
                <p className="text-sm text-red-700">+91-11-1363</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SOS Listener Component */}
      <Suspense fallback={
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-2"></div>
              <p className="text-muted-foreground">Loading SOS monitoring system...</p>
            </div>
          </CardContent>
        </Card>
      }>
        <SOSListener />
      </Suspense>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            How SOS Monitoring Works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">For Tourists:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Tap SOS button in mobile app</li>
                <li>• Your location is automatically shared</li>
                <li>• Emergency responders are notified instantly</li>
                <li>• Stay calm and wait for assistance</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">For Responders:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Real-time alerts appear instantly</li>
                <li>• Location and contact details provided</li>
                <li>• Priority levels indicate urgency</li>
                <li>• Direct communication with tourist</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
