"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, AlertTriangle, Shield, TrendingUp, Clock, MapPin } from "lucide-react"
import { useEffect, useState } from "react"

interface StatCardProps {
  title: string
  value: string | number
  subtitle: string
  icon: React.ElementType
  trend?: "up" | "down" | "stable"
  trendValue?: string
  color?: "emerald" | "red" | "blue" | "orange"
}

function StatCard({ title, value, subtitle, icon: Icon, trend, trendValue, color = "emerald" }: StatCardProps) {
  const colorClasses = {
    emerald: "text-emerald-600 bg-emerald-50",
    red: "text-red-600 bg-red-50",
    blue: "text-blue-600 bg-blue-50",
    orange: "text-orange-600 bg-orange-50",
  }

  const trendColors = {
    up: "text-emerald-600",
    down: "text-red-600",
    stable: "text-gray-600",
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-muted-foreground">{subtitle}</p>
          {trend && trendValue && (
            <div className={`flex items-center text-xs ${trendColors[trend]}`}>
              <TrendingUp className={`h-3 w-3 mr-1 ${trend === "down" ? "rotate-180" : ""}`} />
              {trendValue}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function StatsCards() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [stats, setStats] = useState({
    tourists: 1204,
    alerts: 12,
    safetyScore: 98.5,
    responseTime: 4.2,
    activeZones: 8,
    resolved: 156,
  })

  // Simulate real-time updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())

      // Simulate minor fluctuations in stats
      setStats((prev) => ({
        ...prev,
        tourists: prev.tourists + Math.floor(Math.random() * 3) - 1,
        alerts: Math.max(0, prev.alerts + Math.floor(Math.random() * 3) - 1),
        safetyScore: Math.min(100, Math.max(95, prev.safetyScore + (Math.random() - 0.5) * 0.1)),
        responseTime: Math.max(2, prev.responseTime + (Math.random() - 0.5) * 0.2),
      }))
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())

      // Simulate minor fluctuations in stats
      
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="space-y-4">
      {/* Real-time indicator */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Real-time Stats</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">Live • {currentTime.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Tourists Online"
          value={stats.tourists.toLocaleString()}
          subtitle="Active Digital IDs"
          icon={Users}
          trend="up"
          trendValue="+2.3%"
          color="emerald"
        />

        <StatCard
          title="Active Alerts"
          value={stats.alerts}
          subtitle="Pending Response"
          icon={AlertTriangle}
          trend="down"
          trendValue="-8.1%"
          color="red"
        />

        <StatCard
          title="Safety Score"
          value={`${stats.safetyScore.toFixed(1)}%`}
          subtitle="Overall Security"
          icon={Shield}
          trend="up"
          trendValue="+0.5%"
          color="emerald"
        />

        <StatCard
          title="Avg Response"
          value={`${stats.responseTime.toFixed(1)}m`}
          subtitle="Emergency Response"
          icon={Clock}
          trend="down"
          trendValue="-12%"
          color="blue"
        />

        <StatCard
          title="Active Zones"
          value={stats.activeZones}
          subtitle="Monitored Areas"
          icon={MapPin}
          trend="stable"
          trendValue="0%"
          color="blue"
        />

        <StatCard
          title="Resolved Today"
          value={stats.resolved}
          subtitle="Incidents Closed"
          icon={Shield}
          trend="up"
          trendValue="+15%"
          color="emerald"
        />
      </div>

      {/* Additional Status Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">System Status</p>
                <p className="text-xs text-muted-foreground">All systems operational</p>
              </div>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                Online
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Database Sync</p>
                <p className="text-xs text-muted-foreground">Last sync: 2 min ago</p>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Synced
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">AI Monitoring</p>
                <p className="text-xs text-muted-foreground">Anomaly detection active</p>
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
