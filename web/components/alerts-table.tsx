"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, Heart, Shield, Phone, Search, ExternalLink, Clock, MapPin } from "lucide-react"

interface Alert {
  id: string
  digitalId: string
  type:
    | "high-risk-entry"
    | "medical-assistance"
    | "theft-report"
    | "sos-alert"
    | "information-request"
    | "route-deviation"
    | "panic-button"
  time: string
  location: string
  status: "pending" | "resolved" | "in-progress" | "escalated"
  priority: "low" | "medium" | "high" | "critical"
  description: string
  responseTime?: string
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    digitalId: "IND789012",
    type: "high-risk-entry",
    time: "10:05 AM",
    location: "Jaipur, RJ",
    status: "pending",
    priority: "high",
    description: "Tourist entered restricted border area",
    responseTime: "2m",
  },
  {
    id: "2",
    digitalId: "IND123456",
    type: "medical-assistance",
    time: "11:30 AM",
    location: "Goa, GA",
    status: "resolved",
    priority: "medium",
    description: "Medical emergency at beach resort",
    responseTime: "8m",
  },
  {
    id: "3",
    digitalId: "IND345678",
    type: "theft-report",
    time: "12:45 PM",
    location: "New Delhi, DL",
    status: "in-progress",
    priority: "medium",
    description: "Reported theft of personal belongings",
    responseTime: "15m",
  },
  {
    id: "4",
    digitalId: "IND901234",
    type: "sos-alert",
    time: "02:15 PM",
    location: "Mumbai, MH",
    status: "pending",
    priority: "critical",
    description: "Emergency SOS button activated",
    responseTime: "1m",
  },
  {
    id: "5",
    digitalId: "IND567890",
    type: "information-request",
    time: "03:30 PM",
    location: "Kochi, KL",
    status: "resolved",
    priority: "low",
    description: "Request for local emergency contacts",
    responseTime: "5m",
  },
  {
    id: "6",
    digitalId: "IND246810",
    type: "route-deviation",
    time: "04:20 PM",
    location: "Bangalore, KA",
    status: "escalated",
    priority: "high",
    description: "Significant deviation from planned route",
    responseTime: "12m",
  },
  {
    id: "7",
    digitalId: "IND135792",
    type: "panic-button",
    time: "05:45 PM",
    location: "Chennai, TN",
    status: "in-progress",
    priority: "critical",
    description: "Panic button pressed - distress signal",
    responseTime: "3m",
  },
]

const alertTypeConfig = {
  "high-risk-entry": { icon: AlertTriangle, color: "bg-red-100 text-red-800", label: "High-Risk Entry" },
  "medical-assistance": { icon: Heart, color: "bg-orange-100 text-orange-800", label: "Medical Assistance" },
  "theft-report": { icon: Shield, color: "bg-yellow-100 text-yellow-800", label: "Theft Report" },
  "sos-alert": { icon: Phone, color: "bg-red-100 text-red-800", label: "SOS Alert" },
  "information-request": { icon: Phone, color: "bg-blue-100 text-blue-800", label: "Information Request" },
  "route-deviation": { icon: MapPin, color: "bg-purple-100 text-purple-800", label: "Route Deviation" },
  "panic-button": { icon: AlertTriangle, color: "bg-red-100 text-red-800", label: "Panic Button" },
}

const statusConfig = {
  pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
  resolved: { color: "bg-emerald-100 text-emerald-800", label: "Resolved" },
  "in-progress": { color: "bg-blue-100 text-blue-800", label: "In Progress" },
  escalated: { color: "bg-red-100 text-red-800", label: "Escalated" },
}

const priorityConfig = {
  low: { color: "bg-gray-100 text-gray-800", label: "Low" },
  medium: { color: "bg-yellow-100 text-yellow-800", label: "Medium" },
  high: { color: "bg-orange-100 text-orange-800", label: "High" },
  critical: { color: "bg-red-100 text-red-800", label: "Critical" },
}

export function AlertsTable() {
  const [alerts, setAlerts] = useState(mockAlerts)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.digitalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter
    const matchesPriority = priorityFilter === "all" || alert.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleStatusUpdate = (alertId: string, newStatus: Alert["status"]) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, status: newStatus } : alert)))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Alerts</CardTitle>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by Digital ID, location, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="escalated">Escalated</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Digital ID</TableHead>
                <TableHead>Alert Type</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Response Time</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.map((alert) => {
                const alertType = alertTypeConfig[alert.type]
                const AlertIcon = alertType.icon

                return (
                  <TableRow key={alert.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded ${priorityConfig[alert.priority].color}`}>
                          <AlertIcon className="h-3 w-3" />
                        </div>
                        {alert.digitalId}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={alertType.color}>
                        {alertType.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {alert.time}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {alert.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={priorityConfig[alert.priority].color}>
                        {priorityConfig[alert.priority].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={alert.status}
                        onValueChange={(value) => handleStatusUpdate(alert.id, value as Alert["status"])}
                      >
                        <SelectTrigger className="w-32">
                          <Badge variant="secondary" className={statusConfig[alert.status].color}>
                            {statusConfig[alert.status].label}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="escalated">Escalated</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{alert.responseTime}</span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        {filteredAlerts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No alerts found matching your criteria.</div>
        )}
      </CardContent>
    </Card>
  )
}
