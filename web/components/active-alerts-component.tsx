"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertTriangle,
  MapPin,
  Clock,
  User,
  Phone,
  Shield,
  Search,
  Eye,
  MessageSquare,
  CheckCircle,
} from "lucide-react"

interface Alert {
  id: string
  digitalId: string
  type: "panic" | "medical" | "theft" | "harassment" | "lost" | "restricted_area"
  severity: "critical" | "high" | "medium" | "low"
  status: "active" | "responding" | "resolved"
  timestamp: string
  location: {
    address: string
    coordinates: { lat: number; lng: number }
  }
  tourist: {
    name: string
    nationality: string
    phone: string
    safetyScore: number
  }
  description: string
  responders: string[]
  estimatedResponse: string
}

const mockAlerts: Alert[] = [
  {
    id: "ALT001",
    digitalId: "IND789012",
    type: "panic",
    severity: "critical",
    status: "active",
    timestamp: "2024-12-09T14:30:00Z",
    location: {
      address: "Kamakhya Temple, Guwahati, Assam",
      coordinates: { lat: 26.1674, lng: 91.7086 },
    },
    tourist: {
      name: "Sarah Johnson",
      nationality: "USA",
      phone: "+1-555-0123",
      safetyScore: 85,
    },
    description: "Tourist activated panic button near Kamakhya Temple main entrance",
    responders: ["Unit-Assam-01", "Medical-Team-Guwahati-03"],
    estimatedResponse: "3 minutes",
  },
  {
    id: "ALT002",
    digitalId: "IND234567",
    type: "medical",
    severity: "high",
    status: "responding",
    timestamp: "2024-12-09T14:15:00Z",
    location: {
      address: "Shillong Peak, Meghalaya",
      coordinates: { lat: 25.5788, lng: 91.8832 },
    },
    tourist: {
      name: "Hans Mueller",
      nationality: "Germany",
      phone: "+49-123-456789",
      safetyScore: 92,
    },
    description: "Medical assistance requested - tourist feeling unwell at Shillong Peak",
    responders: ["Medical-Team-Meghalaya-02"],
    estimatedResponse: "5 minutes",
  },
  {
    id: "ALT003",
    digitalId: "IND345678",
    type: "theft",
    severity: "medium",
    status: "active",
    timestamp: "2024-12-09T13:45:00Z",
    location: {
      address: "Kaziranga National Park, Assam",
      coordinates: { lat: 26.5775, lng: 93.1711 },
    },
    tourist: {
      name: "Maria Rodriguez",
      nationality: "Spain",
      phone: "+34-600-123456",
      safetyScore: 78,
    },
    description: "Reported theft of personal belongings at safari area",
    responders: ["Police-Unit-Kaziranga-01"],
    estimatedResponse: "8 minutes",
  },
  {
    id: "ALT004",
    digitalId: "IND456789",
    type: "restricted_area",
    severity: "medium",
    status: "active",
    timestamp: "2024-12-09T13:20:00Z",
    location: {
      address: "India-China Border Zone, Tawang, Arunachal Pradesh",
      coordinates: { lat: 27.5744, lng: 91.9246 },
    },
    tourist: {
      name: "John Smith",
      nationality: "UK",
      phone: "+44-7700-900123",
      safetyScore: 65,
    },
    description: "Tourist entered restricted border area - immediate evacuation needed",
    responders: ["Security-Team-Tawang-01"],
    estimatedResponse: "12 minutes",
  },
  {
    id: "ALT005",
    digitalId: "IND567890",
    type: "harassment",
    severity: "high",
    status: "responding",
    timestamp: "2024-12-09T12:55:00Z",
    location: {
      address: "Loktak Lake, Manipur",
      coordinates: { lat: 24.4994, lng: 93.7830 },
    },
    tourist: {
      name: "Emma Wilson",
      nationality: "Australia",
      phone: "+61-400-123456",
      safetyScore: 88,
    },
    description: "Tourist reported harassment near local boating area",
    responders: ["Police-Unit-Manipur-03", "Tourist-Help-02"],
    estimatedResponse: "6 minutes",
  },
]

const alertTypeColors = {
  panic: "bg-red-100 text-red-800 border-red-200",
  medical: "bg-orange-100 text-orange-800 border-orange-200",
  theft: "bg-yellow-100 text-yellow-800 border-yellow-200",
  harassment: "bg-purple-100 text-purple-800 border-purple-200",
  lost: "bg-blue-100 text-blue-800 border-blue-200",
  restricted_area: "bg-red-100 text-red-800 border-red-200",
}

const severityColors = {
  critical: "bg-red-500 text-white",
  high: "bg-orange-500 text-white",
  medium: "bg-yellow-500 text-white",
  low: "bg-green-500 text-white",
}

const statusColors = {
  active: "bg-red-100 text-red-800",
  responding: "bg-yellow-100 text-yellow-800",
  resolved: "bg-green-100 text-green-800",
}

export default function ActiveAlertsComponent() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterSeverity, setFilterSeverity] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.digitalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.tourist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.location.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || alert.type === filterType
    const matchesSeverity = filterSeverity === "all" || alert.severity === filterSeverity
    const matchesStatus = filterStatus === "all" || alert.status === filterStatus

    return matchesSearch && matchesType && matchesSeverity && matchesStatus
  })

  const handleResolveAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, status: "resolved" as const } : alert)))
  }

  const handleDispatchResponse = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === alertId ? { ...alert, status: "responding" as const } : alert)),
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Active Alerts</h1>
          <p className="text-gray-600 mt-1">Real-time monitoring of tourist safety alerts</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <MessageSquare className="w-4 h-4 mr-2" />
            Broadcast Alert
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Active</p>
                <p className="text-2xl font-bold text-red-600">{alerts.filter((a) => a.status === "active").length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Responding</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {alerts.filter((a) => a.status === "responding").length}
                </p>
              </div>
              <Shield className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical</p>
                <p className="text-2xl font-bold text-red-600">
                  {alerts.filter((a) => a.severity === "critical").length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Response</p>
                <p className="text-2xl font-bold text-emerald-600">4.2 min</p>
              </div>
              <Clock className="w-8 h-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by Digital ID, Name, or Location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Alert Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="panic">Panic</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="theft">Theft</SelectItem>
                <SelectItem value="harassment">Harassment</SelectItem>
                <SelectItem value="restricted_area">Restricted Area</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="responding">Responding</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <Card key={alert.id} className="border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Alert Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className={`${alertTypeColors[alert.type]} font-medium`}>
                      {alert.type.replace("_", " ").toUpperCase()}
                    </Badge>
                    <Badge className={severityColors[alert.severity]}>{alert.severity.toUpperCase()}</Badge>
                    <Badge className={statusColors[alert.status]}>{alert.status.toUpperCase()}</Badge>
                    <span className="text-sm text-gray-500">Alert ID: {alert.id}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{alert.tourist.name}</span>
                        <span className="text-sm text-gray-500">({alert.tourist.nationality})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{alert.tourist.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">Safety Score: {alert.tourist.safetyScore}%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{alert.location.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{new Date(alert.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">ETA: {alert.estimatedResponse}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">{alert.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium text-gray-600">Responders:</span>
                    {alert.responders.map((responder, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {responder}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 min-w-[200px]">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  {alert.status === "active" && (
                    <Button size="sm" variant="outline" onClick={() => handleDispatchResponse(alert.id)}>
                      <Shield className="w-4 h-4 mr-2" />
                      Dispatch Response
                    </Button>
                  )}
                  {alert.status !== "resolved" && (
                    <Button size="sm" variant="outline" onClick={() => handleResolveAlert(alert.id)}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Resolved
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Tourist
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
            <p className="text-gray-500">No alerts match your current filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
