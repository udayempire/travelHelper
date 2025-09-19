"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Plus, Search, AlertTriangle, CheckCircle, Clock } from "lucide-react"

interface Alert {
  id: string
  title: string
  description?: string
  status: 'ACTIVE' | 'RESOLVED' | 'ONGOING'
  tourist?: {
    id: string
    name: string
    phone?: string
  }
  createdBy: {
    id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export default function AlertsPage(): JSX.Element {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const { toast } = useToast()

  const [newAlert, setNewAlert] = useState({
    title: "",
    description: "",
    touristId: "",
    status: "ACTIVE" as const
  })

  const [editAlert, setEditAlert] = useState({
    title: "",
    description: "",
    status: "ACTIVE" as const
  })

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/alerts')
      if (!response.ok) throw new Error('Failed to fetch alerts')
      const data = await response.json()
      setAlerts(data.alerts || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch alerts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const createAlert = async () => {
    try {
      const response = await fetch('/api/admin/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newAlert,
          createdById: "current-user-id" // TODO: Get from auth context
        })
      })
      
      if (!response.ok) throw new Error('Failed to create alert')
      
      toast({ title: "Success", description: "Alert created successfully" })
      setIsCreateOpen(false)
      setNewAlert({ title: "", description: "", touristId: "", status: "ACTIVE" })
      fetchAlerts()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create alert",
        variant: "destructive",
      })
    }
  }

  const updateAlert = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/alerts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editAlert)
      })
      
      if (!response.ok) throw new Error('Failed to update alert')
      
      toast({ title: "Success", description: "Alert updated successfully" })
      setIsEditOpen(false)
      setSelectedAlert(null)
      fetchAlerts()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update alert",
        variant: "destructive",
      })
    }
  }

  const deleteAlert = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/alerts/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete alert')
      
      toast({ title: "Success", description: "Alert deleted successfully" })
      fetchAlerts()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete alert",
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'RESOLVED': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'ONGOING': return <Clock className="h-4 w-4 text-yellow-500" />
      default: return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'destructive'
      case 'RESOLVED': return 'default'
      case 'ONGOING': return 'secondary'
      default: return 'outline'
    }
  }

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Alerts Management</h1>
          <p className="text-muted-foreground">Manage security alerts and tourist issues</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Alert
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Alert</DialogTitle>
              <DialogDescription>
                Create a new security alert or tourist issue
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={newAlert.title}
                  onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
                  placeholder="Alert title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newAlert.description}
                  onChange={(e) => setNewAlert({ ...newAlert, description: e.target.value })}
                  placeholder="Alert description"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={newAlert.status} onValueChange={(value: any) => setNewAlert({ ...newAlert, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="ONGOING">Ongoing</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={createAlert} className="w-full">
                Create Alert
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="ONGOING">Ongoing</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading alerts...</div>
      ) : (
        <div className="grid gap-4">
          {filteredAlerts.map((alert) => (
            <Card key={alert.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(alert.status)}
                    <CardTitle className="text-lg">{alert.title}</CardTitle>
                    <Badge variant={getStatusColor(alert.status) as any}>
                      {alert.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedAlert(alert)
                        setEditAlert({
                          title: alert.title,
                          description: alert.description || "",
                          status: alert.status
                        })
                        setIsEditOpen(true)
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteAlert(alert.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Created by {alert.createdBy.name} • {new Date(alert.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {alert.description && (
                  <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                )}
                {alert.tourist && (
                  <div className="text-sm">
                    <strong>Related Tourist:</strong> {alert.tourist.name} ({alert.tourist.phone})
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Alert</DialogTitle>
            <DialogDescription>
              Update alert details and status
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={editAlert.title}
                onChange={(e) => setEditAlert({ ...editAlert, title: e.target.value })}
                placeholder="Alert title"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={editAlert.description}
                onChange={(e) => setEditAlert({ ...editAlert, description: e.target.value })}
                placeholder="Alert description"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={editAlert.status} onValueChange={(value: any) => setEditAlert({ ...editAlert, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="ONGOING">Ongoing</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => selectedAlert && updateAlert(selectedAlert.id)} className="w-full">
              Update Alert
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
