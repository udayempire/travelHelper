"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Users, AlertTriangle, Activity, MapPin, TrendingUp, Clock } from "lucide-react"

interface TouristStats {
  total: number
  active: number
  byLocation: Array<{ location: string; count: number }>
}

interface AlertStats {
  active: number
  resolved: number
  ongoing: number
}

interface UsageLog {
  id: string
  action: string
  metadata?: any
  user?: {
    id: string
    name: string
    email: string
  }
  createdAt: string
}

export default function AnalyticsPage(): JSX.Element {
  const [touristStats, setTouristStats] = useState<TouristStats | null>(null)
  const [alertStats, setAlertStats] = useState<AlertStats | null>(null)
  const [usageLogs, setUsageLogs] = useState<UsageLog[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchAllStats()
  }, [])

  const fetchAllStats = async () => {
    try {
      setLoading(true)
      
      // Fetch tourist stats
      const touristsResponse = await fetch('/api/admin/stats/tourists')
      if (touristsResponse.ok) {
        const touristsData = await touristsResponse.json()
        setTouristStats(touristsData)
      }

      // Fetch alert stats
      const alertsResponse = await fetch('/api/admin/stats/alerts')
      if (alertsResponse.ok) {
        const alertsData = await alertsResponse.json()
        setAlertStats(alertsData)
      }

      // Fetch usage logs
      const usageResponse = await fetch('/api/admin/stats/usage')
      if (usageResponse.ok) {
        const usageData = await usageResponse.json()
        setUsageLogs(usageData.logs || [])
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login': return <Activity className="h-4 w-4 text-green-500" />
      case 'logout': return <Activity className="h-4 w-4 text-red-500" />
      case 'create': return <TrendingUp className="h-4 w-4 text-blue-500" />
      case 'update': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'delete': return <AlertTriangle className="h-4 w-4 text-red-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">Loading analytics...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">System statistics and usage analytics</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tourists">Tourists</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="usage">Usage Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tourists</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{touristStats?.total || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Active: {touristStats?.active || 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{alertStats?.active || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Resolved: {alertStats?.resolved || 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ongoing Issues</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{alertStats?.ongoing || 0}</div>
                <p className="text-xs text-muted-foreground">
                  In progress
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{usageLogs.length}</div>
                <p className="text-xs text-muted-foreground">
                  System actions
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tourists" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tourist Statistics</CardTitle>
              <CardDescription>Distribution and activity of registered tourists</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Total Registration</h4>
                  <div className="text-3xl font-bold">{touristStats?.total || 0}</div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Active Tourists</h4>
                  <div className="text-3xl font-bold">{touristStats?.active || 0}</div>
                </div>
              </div>
              
              {touristStats?.byLocation && touristStats.byLocation.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">By Location</h4>
                  <div className="space-y-2">
                    {touristStats.byLocation.map((location, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{location.location}</span>
                        </div>
                        <Badge variant="secondary">{location.count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alert Statistics</CardTitle>
              <CardDescription>Current status of security alerts and issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-500">{alertStats?.active || 0}</div>
                  <p className="text-sm text-muted-foreground">Active Alerts</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-500">{alertStats?.ongoing || 0}</div>
                  <p className="text-sm text-muted-foreground">Ongoing Issues</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500">{alertStats?.resolved || 0}</div>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Usage Logs</CardTitle>
              <CardDescription>Recent system activity and user actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usageLogs.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No usage logs available</p>
                ) : (
                  <div className="space-y-3">
                    {usageLogs.slice(0, 20).map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getActionIcon(log.action)}
                          <div>
                            <p className="font-medium">{log.action}</p>
                            {log.user && (
                              <p className="text-sm text-muted-foreground">
                                by {log.user.name} ({log.user.email})
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(log.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
